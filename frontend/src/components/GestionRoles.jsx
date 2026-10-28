import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Plus, Users, Check, LockKeyhole, Info, Save, Trash2 } from 'lucide-react';
import API from '../services/api';

export default function GestionRoles() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoDescripcion, setNuevoDescripcion] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const seleccionado = roles.find((r) => r.id === selectedId) || roles[0];
  const grupos = useMemo(() => permisos.reduce((acc, p) => { (acc[p.modulo] ||= []).push(p); return acc; }, {}), [permisos]);

  async function cargar() {
    setCargando(true); setError('');
    try {
      const [r, p] = await Promise.all([API.get('/roles'), API.get('/permisos')]);
      setRoles(r.data); setPermisos(p.data);
      setSelectedId((id) => r.data.some((x) => x.id === id) ? id : r.data[0]?.id ?? null);
    } catch (e) { setError(e.response?.data?.error || 'No se pudieron cargar los roles. Comprueba tu sesión y la conexión con Flask.'); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, []);

  function cambiarPermiso(codigo, checked) {
    if (!seleccionado || seleccionado.nombre === 'administrador') return;
    setRoles((actuales) => actuales.map((r) => r.id !== seleccionado.id ? r : ({ ...r, permisos: checked ? [...new Set([...r.permisos, codigo])] : r.permisos.filter((p) => p !== codigo) })));
    setAviso('Cambios pendientes. Pulsa “Guardar permisos” para almacenarlos en MySQL.');
  }
  async function guardar() {
    if (!seleccionado) return;
    setGuardando(true); setError(''); setAviso('');
    try { const { data } = await API.patch(`/roles/${seleccionado.id}`, { permisos: seleccionado.permisos }); setRoles((rs) => rs.map((r) => r.id === data.id ? data : r)); setAviso('Permisos guardados correctamente en MySQL.'); }
    catch (e) { setError(e.response?.data?.error || 'No se pudieron guardar los permisos.'); }
    finally { setGuardando(false); }
  }
  async function crearRol(e) {
    e.preventDefault(); setError(''); setAviso('');
    try { const { data } = await API.post('/roles', { nombre: nuevoNombre.trim(), descripcion: nuevoDescripcion.trim(), permisos: [] }); setRoles((rs) => [...rs, data]); setSelectedId(data.id); setNuevoNombre(''); setNuevoDescripcion(''); setMostrarFormulario(false); setAviso('Rol creado y guardado en MySQL. Ahora puedes asignarle permisos.'); }
    catch (err) { setError(err.response?.data?.error || 'No se pudo crear el rol.'); }
  }
  async function eliminarRol() {
    if (!seleccionado || seleccionado.sistema || !window.confirm(`¿Eliminar el rol “${seleccionado.nombre}”?`)) return;
    try { await API.delete(`/roles/${seleccionado.id}`); setAviso('Rol eliminado.'); await cargar(); }
    catch (e) { setError(e.response?.data?.error || 'No se pudo eliminar el rol.'); }
  }

  if (cargando) return <div className="p-8 text-sm text-[#8C857B]">Cargando roles y permisos desde el servidor…</div>;
  return <section className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-[#C5A059] text-xs uppercase tracking-[0.2em] font-bold"><ShieldCheck size={16}/> Seguridad y acceso</div><h1 className="font-serif text-3xl sm:text-4xl font-bold mt-2">Roles y privilegios</h1><p className="text-sm text-[#8C857B] mt-2 max-w-2xl">Los cambios se guardan en MySQL y Flask valida los permisos de cada petición.</p></div><button onClick={() => setMostrarFormulario(v=>!v)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E2A27] text-white px-4 py-3 text-sm font-semibold"><Plus size={17}/> Nuevo rol</button></div>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="rounded-2xl border border-[#E9E2D6] bg-[#FBF6EB] p-4 flex gap-3 text-sm text-[#625544]"><Info size={19} className="shrink-0 mt-0.5"/><p><strong>Control de acceso activo:</strong> el rol administrador conserva todos los permisos. Los demás roles solo pueden operar en los módulos autorizados.</p></div>
    {mostrarFormulario && <form onSubmit={crearRol} className="rounded-2xl border border-[#EFECE6] bg-white p-5 grid gap-3 sm:grid-cols-3"><label className="text-sm">Nombre del rol<input required value={nuevoNombre} onChange={e=>setNuevoNombre(e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" /></label><label className="text-sm">Descripción<input value={nuevoDescripcion} onChange={e=>setNuevoDescripcion(e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" /></label><button className="self-end rounded-lg bg-[#C5A059] p-2.5 font-semibold text-white">Crear y guardar</button></form>}
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5"><aside className="rounded-2xl border border-[#EFECE6] bg-white p-3 h-fit"><div className="px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#8C857B] font-bold">Roles disponibles · {roles.length}</div><div className="space-y-1">{roles.map((r)=><button key={r.id} onClick={()=>{setSelectedId(r.id);setAviso('');setError('');}} className={`w-full rounded-xl px-3 py-3 text-left flex items-start gap-3 ${selectedId===r.id?'bg-[#F9F6F0] ring-1 ring-[#E8D9B9]':'hover:bg-[#FAF8F4]'}`}><span className={`rounded-lg p-2 ${selectedId===r.id?'bg-[#2E2A27] text-white':'bg-[#F3F0EA] text-[#8C857B]'}`}><Users size={17}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{r.nombre}</span><span className="block text-xs text-[#8C857B] mt-1">{r.descripcion}</span><span className="block text-[11px] text-[#A17D3B] mt-2">{r.permisos.length} permisos</span></span></button>)}</div></aside>
    {seleccionado && <div className="rounded-2xl border border-[#EFECE6] bg-white overflow-hidden"><div className="p-5 sm:p-6 border-b border-[#EFECE6] flex items-start justify-between gap-3"><div><div className="text-xs text-[#8C857B]">Configurando permisos para</div><h2 className="font-serif text-2xl font-bold mt-1">{seleccionado.nombre}</h2><p className="text-sm text-[#8C857B] mt-1">{seleccionado.descripcion}</p></div>{seleccionado.nombre==='administrador'?<span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#F9F0D9] text-[#8A672A] px-3 py-1.5 text-xs font-bold"><LockKeyhole size={13}/> Acceso total</span>:<div className="flex gap-2">{!seleccionado.sistema && <button onClick={eliminarRol} title="Eliminar rol" className="rounded-lg border p-2 text-red-600"><Trash2 size={16}/></button>}<button onClick={guardar} disabled={guardando} className="inline-flex items-center gap-2 rounded-lg bg-[#2E2A27] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"><Save size={15}/>{guardando?'Guardando…':'Guardar permisos'}</button></div>}</div><div className="p-5 sm:p-6 space-y-6">{Object.entries(grupos).map(([grupo, lista])=><div key={grupo}><h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#A17D3B] mb-3">{grupo}</h3><div className="divide-y divide-[#F1EEE8]">{lista.map(p=>{const checked=seleccionado.permisos.includes(p.codigo);return <label key={p.codigo} className="py-3 flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={checked} disabled={seleccionado.nombre==='administrador'} onChange={e=>cambiarPermiso(p.codigo,e.target.checked)} className="h-4 w-4 accent-[#C5A059] disabled:opacity-70"/><span className="flex-1"><span className="block text-sm font-semibold">{p.descripcion}</span><span className="block text-xs text-[#A19A8F] mt-1">{p.codigo}</span></span>{checked&&<Check size={16} className="text-[#A17D3B]"/>}</label>})}</div></div>)}</div>{aviso&&<div role="status" className="border-t border-[#EFECE6] bg-[#FBF6EB] px-5 py-3 text-xs text-[#625544]">{aviso}</div>}</div>}</div>
  </section>;
}
