import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';
export default function RegistroCliente() {
  const [form, setForm] = useState({ nombres: '', apellidos: '', cedula: '', correo: '', telefono: '', password: '', confirmar: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden.');
    if (form.password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/clientes/registro`, {
        nombres: form.nombres, apellidos: form.apellidos, cedula: form.cedula,
        correo: form.correo, telefono: form.telefono, password: form.password
      });
      sessionStorage.setItem('meyer_token', data.token);
      sessionStorage.setItem('meyer_user', JSON.stringify(data.usuario));
      window.location.href = '/cliente';
    } catch (err) { setError(err.response?.data?.error || 'No se pudo crear la cuenta. Verifica que el servidor esté encendido.'); }
    finally { setLoading(false); }
  }
  const field = (name, label, type = 'text', required = true) => <label className="register-field">{label}<input name={name} type={type} value={form[name]} onChange={update} required={required} autoComplete={name === 'password' || name === 'confirmar' ? 'new-password' : 'on'} /></label>;
  return <main className="register-page"><section className="register-card"><a className="register-brand" href="/">MEYER <span>SPA</span></a><p className="register-kicker">TU MOMENTO DE BIENESTAR</p><h1>Crea tu cuenta</h1><p className="register-subtitle">Regístrate para acceder a tu espacio personal de Meyer Spa.</p>
    <form onSubmit={submit} className="register-form">
      <div className="register-grid">{field('nombres','Nombres')}{field('apellidos','Apellidos')}{field('cedula','Documento de identidad')}{field('telefono','Teléfono','tel',false)}{field('correo','Correo electrónico','email')}{field('password','Contraseña','password')}{field('confirmar','Confirmar contraseña','password')}</div>
      {error && <p className="register-error" role="alert">{error}</p>}
      <button className="register-submit" disabled={loading}>{loading ? 'Creando cuenta…' : 'Crear cuenta'}</button>
    </form><p className="register-login">¿Ya tienes cuenta? <a href="/cliente">Ir al portal de cliente</a></p><p className="register-admin">¿Eres parte del equipo? <a href="/">Acceso administrativo</a></p>
  </section></main>;
}
