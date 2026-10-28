import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Users, 
  Sparkles, 
  Clock, 
  LogOut, 
  Bell,
  ShieldCheck,
  SlidersHorizontal,
  UserCog
} from 'lucide-react';

import DashboardInicio from './components/DashboardInicio';
import VistaAgenda from './components/VistaAgenda';
import VistaDetalleCliente from './components/VistaDetalleCliente';
import VistaHorario from './components/VistaHorario';
import { getDashboardSummary } from './services/api';
import GestionRoles from './components/GestionRoles.jsx';
import CamposPersonalizados from './components/CamposPersonalizados.jsx';
import GestionUsuarios from './components/GestionUsuarios.jsx';

export default function App({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('inicio');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Estado para guardar los datos reales del dashboard que vienen de Flask
  const [dashboardData, setDashboardData] = useState({
    citasAgendadas: null,
    enProceso: null,
    finalizados: null,
    fechaActual: '',
    sede: ''
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  const loadDashboardSummary = useCallback(async () => {
    try {
      const { data } = await getDashboardSummary();
      setDashboardData(data);
    } catch (error) {
      console.error('Error cargando el resumen del dashboard:', error);
      setDashboardError(
        error.response?.data?.error || 'No fue posible cargar el resumen del dashboard.'
      );
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getDashboardSummary()
      .then(({ data }) => {
        if (active) setDashboardData(data);
      })
      .catch((error) => {
        console.error('Error cargando el resumen del dashboard:', error);
        if (active) {
          setDashboardError(
            error.response?.data?.error || 'No fue posible cargar el resumen del dashboard.'
          );
        }
      })
      .finally(() => {
        if (active) setDashboardLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSeleccionarCliente = (dataCita) => {
    setClienteSeleccionado(dataCita);
    setActiveTab('procedimientos');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2E2A27] font-sans flex antialiased">
      <aside className="w-68 bg-[#F9F6F0] border-r border-[#EFECE6] flex flex-col justify-between p-6 fixed h-full z-20 hidden md:flex">
        <div>
          <div className="mb-8 px-2">
            <h1 className="font-serif text-2xl font-bold tracking-wider text-[#2E2A27]">
              MEYER <span className="text-[#C5A059] font-normal">SPA</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C857B] mt-1 font-semibold">
              {dashboardData.sede || 'MEYER SPA'}
            </p>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-[#EFECE6] flex items-center gap-3 mb-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#2E2A27] text-[#FDFBF7] font-serif font-bold flex items-center justify-center text-sm">
              A
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-[#2E2A27] truncate">{user?.nombre || 'Usuario'}</h4>
              <span className="text-xs text-[#8C857B] block">{user?.rol || 'Usuario'}</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Inicio" active={activeTab === 'inicio'} onClick={() => setActiveTab('inicio')} />
            <SidebarItem icon={<CalendarIcon size={18} />} label="Agenda" active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} />
            <SidebarItem icon={<Users size={18} />} label="Clientes" active={activeTab === 'clientes'} onClick={() => setActiveTab('clientes')} />
            <SidebarItem icon={<Sparkles size={18} />} label="Procedimientos" active={activeTab === 'procedimientos'} onClick={() => setActiveTab('procedimientos')} />
            <SidebarItem icon={<Clock size={18} />} label="Horario" active={activeTab === 'horario'} onClick={() => setActiveTab('horario')} />
            {user?.permisos?.includes('roles.gestionar') && <SidebarItem icon={<ShieldCheck size={18} />} label="Roles y privilegios" active={activeTab === 'roles'} onClick={() => setActiveTab('roles')} />}
            {user?.permisos?.includes('roles.gestionar') && <SidebarItem icon={<UserCog size={18} />} label="Usuarios" active={activeTab === 'usuarios'} onClick={() => setActiveTab('usuarios')} />}
            {user?.permisos?.includes('configuracion.gestionar') && <SidebarItem icon={<SlidersHorizontal size={18} />} label="Campos personalizados" active={activeTab === 'campos'} onClick={() => setActiveTab('campos')} />}
          </nav>
        </div>

        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8C857B] hover:text-[#2E2A27] hover:bg-white/60 transition-all text-sm font-medium cursor-pointer">
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <div className="flex-1 md:pl-68 flex flex-col min-w-0">
        <header className="h-20 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EFECE6] px-6 lg:px-10 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-[#8C857B]">
            <span>Administrador</span>
            <span>/</span>
            <span className="capitalize font-semibold text-[#2E2A27]">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs italic font-serif text-[#C5A059]">
              {dashboardData.fechaActual || (dashboardLoading ? 'Cargando resumen...' : '—')}
            </span>
            <button className="relative p-2.5 rounded-full bg-[#F9F6F0] text-[#2E2A27] border border-[#EFECE6] hover:bg-[#EFECE6] transition-all cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#C5A059] rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#2E2A27] text-white flex items-center justify-center font-serif text-xs font-bold md:hidden">
              A
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'inicio' && (
            <DashboardInicio
              summary={dashboardData}
              loading={dashboardLoading}
              error={dashboardError}
              onViewAgenda={() => setActiveTab('agenda')}
            />
          )}
          {activeTab === 'agenda' && <VistaAgenda onViewCliente={handleSeleccionarCliente} />}
          {(activeTab === 'clientes' || activeTab === 'procedimientos') && (
            <VistaDetalleCliente
              key={`${activeTab}-${clienteSeleccionado?.id || 'lista'}`}
              clienteSeleccionado={clienteSeleccionado}
              onDataChanged={loadDashboardSummary}
            />
          )}
          {activeTab === 'horario' && <VistaHorario />}
          {activeTab === 'roles' && user?.permisos?.includes('roles.gestionar') && <GestionRoles />}
          {activeTab === 'usuarios' && user?.permisos?.includes('roles.gestionar') && <GestionUsuarios />}
          {activeTab === 'campos' && user?.permisos?.includes('configuracion.gestionar') && <CamposPersonalizados />}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all relative cursor-pointer ${
        active 
          ? 'bg-[#F9F6F0] text-[#2E2A27] shadow-sm font-bold border-l-4 border-[#C5A059]' 
          : 'text-[#8C857B] hover:text-[#2E2A27] hover:bg-white/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? 'text-[#C5A059]' : 'text-[#8C857B]'}>{icon}</span>
        <span>{label}</span>
      </div>
    </button>
  );
}