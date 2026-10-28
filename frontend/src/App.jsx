import { Suspense, lazy } from 'react';
import AdminApp from './AdminApp.jsx';
import Login from './components/Login.jsx';
import RegistroCliente from './components/RegistroCliente.jsx';
import { useState } from 'react';

const ClienteApp = lazy(() => import('./ClienteApp.tsx'));

export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem('meyer_user') || 'null'); } catch { return null; } });
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const isClientPortal = currentPath === '/cliente';
  if (currentPath === '/registro-cliente') return <RegistroCliente />;

  if (!isClientPortal) return user ? <AdminApp user={user} onLogout={() => { sessionStorage.removeItem('meyer_token'); sessionStorage.removeItem('meyer_user'); setUser(null); }} /> : <Login onLogin={setUser} />;

  return (
    <Suspense fallback={<div style={{ padding: 32, color: '#4a3b32' }}>Cargando Meyer Spa…</div>}>
      <ClienteApp />
    </Suspense>
  );
}
