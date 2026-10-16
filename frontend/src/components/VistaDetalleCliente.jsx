import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function VistaDetalleCliente({ clienteSeleccionado }) {
  const [activeTab, setActiveTab] = useState('datos');

  // Si viene cliente por props desde la agenda se asigna, o usa defaults
  const cliente = clienteSeleccionado || {
    nombre: "Valeria Sotomayor",
    cedula: "1.045.892.331",
    telefono: "+57 301 442 8990",
    correo: "valeria.sotomayor@email.com",
    fechaNacimiento: "14 de Mayo, 1998",
    servicio: "Limpieza facial profunda",
    fecha: "23 Sept, 2026",
    hora: "09:00 AM",
    cabina: "Cabina 1",
    auxiliar: "María López"
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Switcher Tab */}
      <div className="flex bg-[#F9F6F0] p-1.5 rounded-2xl border border-[#EFECE6] w-fit">
        <button 
          onClick={() => setActiveTab('datos')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'datos' ? 'bg-white text-[#2E2A27] shadow-sm' : 'text-[#8C857B] hover:text-[#2E2A27]'
          }`}
        >
          Datos personales
        </button>
        <button 
          onClick={() => setActiveTab('historial')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'historial' ? 'bg-white text-[#2E2A27] shadow-sm' : 'text-[#8C857B] hover:text-[#2E2A27]'
          }`}
        >
          Historial
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Dinámico Read-only */}
        <div className="lg:col-span-2 bg-[#F9F6F0] border border-[#EFECE6] rounded-2xl p-6 lg:p-8 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#2E2A27] mb-2">Información del Cliente</h3>
          
          <ReadOnlyInput label="NOMBRE COMPLETO" value={cliente.nombre || cliente.client} />
          <ReadOnlyInput label="CÉDULA" value={cliente.cedula || '1.045.892.331'} />
          <ReadOnlyInput label="TELÉFONO" value={cliente.telefono || '+57 301 442 8990'} />
          <ReadOnlyInput label="CORREO ELECTRÓNICO" value={cliente.correo || 'cliente@email.com'} />
          <ReadOnlyInput label="FECHA DE NACIMIENTO" value={cliente.fechaNacimiento || '14 de Mayo, 1998'} />
        </div>

        {/* Resumen dinámico del Procedimiento */}
        <div className="bg-[#F9F6F0] border border-[#EFECE6] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E2A27] mb-4">Resumen de Procedimiento</h3>
            
            <div className="space-y-3 text-xs">
              <SummaryRow label="Cliente" value={cliente.nombre || cliente.client} />
              <SummaryRow label="Servicio" value={cliente.servicio || cliente.title} />
              <SummaryRow label="Fecha" value={cliente.fecha || "23 Sept, 2026"} />
              <SummaryRow label="Hora" value={cliente.hora || cliente.time} />
              <SummaryRow label="Cabina" value={cliente.cabina || "Cabina 1"} />
              <SummaryRow label="Auxiliar" value={cliente.auxiliar || "María López"} />
            </div>
          </div>

          <button className="w-full bg-[#2E2A27] hover:bg-[#3D332A] text-[#FDFBF7] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
            <span>CONTINUAR PROCEDIMIENTO</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyInput({ label, value }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C857B] block mb-1">{label}</label>
      <div className="w-full bg-white border-0 px-4 py-3 rounded-xl text-sm font-semibold text-[#2E2A27] shadow-sm">
        {value}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#EFECE6]">
      <span className="text-[#8C857B]">{label}</span>
      <span className="font-bold text-[#2E2A27] text-right">{value}</span>
    </div>
  );
}