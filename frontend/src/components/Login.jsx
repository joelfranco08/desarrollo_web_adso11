import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Login({ onLogin }) {
  const [needsSetup, setNeedsSetup] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => { API.get('/auth/bootstrap-status').then(({data}) => setNeedsSetup(data.needsSetup)).catch(() => setError('No se pudo conectar con Flask. Comprueba que el backend esté iniciado.')); }, []);
  async function submit(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const endpoint = needsSetup ? '/auth/bootstrap' : '/auth/login';
      const payload = needsSetup ? { nombre, correo, password } : { correo, password };
      const { data } = await API.post(endpoint, payload);
      sessionStorage.setItem('meyer_token', data.token);
      sessionStorage.setItem('meyer_user', JSON.stringify(data.usuario));
      onLogin(data.usuario);
    } catch (err) { setError(err.response?.data?.error || 'No fue posible iniciar sesión.'); }
    finally { setLoading(false); }
  }
  return <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-5 text-[#2E2A27]"><form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-[#EFECE6] bg-white p-8 shadow-sm space-y-5"><div><p className="text-xs tracking-[.25em] text-[#C5A059] font-bold">BIENESTAR Y CUIDADO</p><h1 className="font-serif text-3xl font-bold mt-2">MEYER <span className="text-[#C5A059] font-normal">SPA</span></h1><p className="text-sm text-[#8C857B] mt-2">{needsSetup ? 'Configuración inicial del administrador' : 'Ingresa al panel administrativo'}</p></div>{needsSetup && <label className="block text-sm">Nombre completo<input required value={nombre} onChange={e=>setNombre(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>}<label className="block text-sm">Correo electrónico<input required type="email" value={correo} onChange={e=>setCorreo(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block text-sm">Contraseña<input required minLength={needsSetup ? 12 : 1} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3" />{needsSetup && <span className="text-xs text-[#8C857B]">Usa al menos 12 caracteres. Esta cuenta será el administrador inicial.</span>}</label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-[#2E2A27] text-white p-3 font-semibold disabled:opacity-60">{loading ? 'Procesando…' : needsSetup ? 'Crear administrador' : 'Iniciar sesión'}</button></form></main>;
}
