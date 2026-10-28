import { useEffect, useState } from 'react';
import { Plus, Trash2, SlidersHorizontal, Info } from 'lucide-react';
import API from '../services/api';

const MODULOS = [
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'citas', label: 'Citas' },
  { id: 'procedimientos', label: 'Procedimientos' },
];
const TIPOS = [
  { id: 'texto', label: 'Texto' }, { id: 'numero', label: 'Número' },
  { id: 'fecha', label: 'Fecha' }, { id: 'lista', label: 'Lista desplegable' },
  { id: 'casilla', label: 'Casilla de verificación' }, { id: 'correo', label: 'Correo electrónico' },
  { id: 'telefono', label: 'Teléfono' },
];

export default function CamposPersonalizados() {
  const [modulo, setModulo] = useState('usuarios');
  const [campos, setCampos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [etiqueta, setEtiqueta] = useState('');
  const [tipo, setTipo] = useState('texto');
  const [opcionesTexto, setOpcionesTexto] = useState('');
  const [obligatorio, setObligatorio] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  async function cargar() {
    setCargando(true); setError('');
    try { const { data } = await API.get('/campos-personalizados', { params: { modulo } }); setCampos(data); }
    catch (e) { setError(e.response?.data?.error || 'No se pudieron cargar los campos. Verifica la sesión y Flask.'); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, [modulo]);

  async function crear(e) {
    e.preventDefault(); setError(''); setAviso('');
    const nombreSeguro = nombre.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const opciones = opcionesTexto.split('\n').map(x => x.trim()).filter(Boolean);
    try {
      await API.post('/campos-personalizados', { modulo, nombre: nombreSeguro, etiqueta: etiqueta.trim(), tipo, opciones: tipo === 'lista' ? opciones : [], obligatorio });
      setNombre(''); setEtiqueta(''); setTipo('texto'); setOpcionesTexto(''); setObligatorio(false);
      setAviso('Campo guardado en MySQL.'); await cargar();
    } catch (e) { setError(e.response?.data?.error || 'No se pudo guardar el campo.'); }
  }
  async function cambiar(campo, cambios) {
    try { const { data } = await API.patch(`/campos-personalizados/${campo.id}`, cambios); setCampos(actuales => actuales.map(c => c.id === data.id ? data : c)); }
    catch (e) { setError(e.response?.data?.error || 'No se pudo actualizar el campo.'); }
  }
  async function eliminar(campo) {
    if (!window.confirm(`¿Eliminar el campo “${campo.etiqueta}”?`)) return;
    try { await API.delete(`/campos-personalizados/${campo.id}`); setCampos(actuales => actuales.filter(c => c.id !== campo.id)); setAviso('Campo eliminado.'); }
    catch (e) { setError(e.response?.data?.error || 'No se pudo eliminar el campo.'); }
  }

  return <section className="space-y-6">
    <div><div className="flex items-center gap-2 text-[#C5A059] text-xs uppercase tracking-[0.2em] font-bold"><SlidersHorizontal size={16}/> Configuración de formularios</div><h1 className="font-serif text-3xl sm:text-4xl font-bold mt-2">Campos personalizados</h1><p className="text-sm text-[#8C857B] mt-2 max-w-2xl">Define qué campos adicionales necesitas en usuarios, citas y procedimientos. La configuración se guarda en MySQL.</p></div>
    <div className="rounded-2xl border border-[#E9E2D6] bg-[#FBF6EB] p-4 flex gap-3 text-sm text-[#625544]"><Info size={19} className="shrink-0 mt-0.5"/><p>Usa un nombre interno sin espacios, por ejemplo <strong>tipo_piel</strong>, y una etiqueta visible, como <strong>Tipo de piel</strong>. Los campos configurados aquí quedan registrados para conectarlos a los formularios de captura de cada módulo.</p></div>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {aviso && <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{aviso}</div>}
    <div className="flex flex-wrap gap-2">{MODULOS.map(m => <button key={m.id} onClick={() => {setModulo(m.id);setAviso('');}} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${modulo===m.id?'bg-[#2E2A27] text-white':'bg-white border border-[#EFECE6] text-[#625544]'}`}>{m.label}</button>)}</div>
    <form onSubmit={crear} className="rounded-2xl border border-[#EFECE6] bg-white p-5 sm:p-6 space-y-4">
      <h2 className="font-serif text-xl font-bold">Añadir campo a {MODULOS.find(m=>m.id===modulo)?.label.toLowerCase()}</h2>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Nombre interno<input required maxLength={80} value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="ej. tipo_piel" className="mt-1 w-full rounded-lg border border-[#E5DED2] p-3 font-normal" /></label><label className="text-sm font-medium">Etiqueta visible<input required maxLength={120} value={etiqueta} onChange={e=>setEtiqueta(e.target.value)} placeholder="ej. Tipo de piel" className="mt-1 w-full rounded-lg border border-[#E5DED2] p-3 font-normal" /></label><label className="text-sm font-medium">Tipo de campo<select value={tipo} onChange={e=>setTipo(e.target.value)} className="mt-1 w-full rounded-lg border border-[#E5DED2] p-3 bg-white">{TIPOS.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select></label>{tipo==='lista' && <label className="text-sm font-medium sm:col-span-2">Opciones (una por línea)<textarea required value={opcionesTexto} onChange={e=>setOpcionesTexto(e.target.value)} placeholder={'Opción 1\nOpción 2\nOpción 3'} rows={3} className="mt-1 w-full rounded-lg border border-[#E5DED2] p-3 font-normal" /></label>}</div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={obligatorio} onChange={e=>setObligatorio(e.target.checked)} className="accent-[#C5A059]"/> Campo obligatorio</label>
      <button className="inline-flex items-center gap-2 rounded-xl bg-[#2E2A27] text-white px-4 py-3 text-sm font-semibold"><Plus size={16}/> Guardar campo</button>
    </form>
    <div className="rounded-2xl border border-[#EFECE6] bg-white overflow-hidden"><div className="p-5 border-b border-[#EFECE6]"><h2 className="font-serif text-xl font-bold">Campos configurados</h2><p className="text-sm text-[#8C857B] mt-1">{campos.length} campo(s) en este módulo</p></div>{cargando ? <p className="p-5 text-sm text-[#8C857B]">Cargando…</p> : campos.length===0 ? <p className="p-6 text-sm text-[#8C857B]">Todavía no has añadido campos para este módulo.</p> : <div className="divide-y divide-[#F1EEE8]">{campos.map(c=><div key={c.id} className="p-4 sm:p-5 flex flex-wrap items-center gap-3"><div className="flex-1 min-w-[180px]"><p className="font-semibold text-sm">{c.etiqueta} {c.obligatorio&&<span className="text-red-600">*</span>}</p><p className="text-xs text-[#8C857B] mt-1">{c.nombre} · {TIPOS.find(t=>t.id===c.tipo)?.label || c.tipo}{c.tipo==='lista'&&c.opciones?.length ? ` · ${c.opciones.join(', ')}`:''}</p></div><label className="text-xs flex items-center gap-2"><input type="checkbox" checked={c.obligatorio} onChange={e=>cambiar(c,{obligatorio:e.target.checked})} className="accent-[#C5A059]"/> Obligatorio</label><label className="text-xs flex items-center gap-2"><input type="checkbox" checked={c.activo} onChange={e=>cambiar(c,{activo:e.target.checked})} className="accent-[#C5A059]"/> Activo</label><button onClick={()=>eliminar(c)} aria-label={`Eliminar ${c.etiqueta}`} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"><Trash2 size={16}/></button></div>)}</div>}</div>
  </section>;
}
