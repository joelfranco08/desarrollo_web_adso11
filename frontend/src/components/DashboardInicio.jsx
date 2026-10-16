import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, CheckCircle2, CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { getDashboardSummary } from '../services/api';

export default function DashboardInicio({ onViewAgenda }) {
  const [metrics, setMetrics] = useState({
    citasAgendadas: 5,
    enProceso: 2,
    finalizados: 1,
    fechaActual: 'Miércoles, 23 de Septiembre de 2026',
    sede: 'Barranquilla • Sede Principal'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Petición real al backend Flask
    setLoading(true);
    getDashboardSummary()
      .then((res) => {
        if (res.data) setMetrics(res.data);
      })
      .catch((err) => {
        console.warn('API no disponible aun, usando datos locales:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div>
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
          PANEL DE CONTROL
        </span>
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#2E2A27] mt-1">
          ¡Hola, Auxiliar!
        </h2>
        <p className="text-[#8C857B] text-sm mt-1">
          Aquí tienes el resumen operativo de hoy para la atención en cabinas.
        </p>
      </div>

      {/* Grid de Métricas con Variables Reales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          number={loading ? '...' : metrics.citasAgendadas} 
          label="CITAS AGENDADAS HOY" 
          icon={<Clock className="text-[#C5A059]" size={22} />} 
        />
        <MetricCard 
          number={loading ? '...' : metrics.enProceso} 
          label="EN ESTE MOMENTO" 
          icon={<RefreshCw className="text-[#1565C0]" size={22} />} 
          accent="border-blue-100 bg-blue-50/30"
        />
        <MetricCard 
          number={loading ? '...' : metrics.finalizados} 
          label="PROCEDIMIENTOS FINALIZADOS" 
          icon={<CheckCircle2 className="text-emerald-600" size={22} />} 
          accent="border-emerald-100 bg-emerald-50/30"
        />
      </div>

      {/* Card Inferior Agenda Diaria */}
      <div className="bg-[#F9F6F0] border border-[#EFECE6] rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-white rounded-2xl text-[#C5A059] shadow-sm">
            <CalendarDays size={26} />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#8C857B] tracking-wider uppercase">Agenda Diaria</span>
            <h4 className="font-serif text-xl font-bold text-[#2E2A27] mt-0.5">{metrics.fechaActual}</h4>
            <p className="text-xs text-[#8C857B] flex items-center gap-1 mt-1">
              <MapPin size={14} className="text-[#C5A059]" /> {metrics.sede}
            </p>
          </div>
        </div>
        <button 
          onClick={onViewAgenda}
          className="bg-[#2E2A27] hover:bg-[#3D332A] text-[#FDFBF7] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>VER TODAS</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function MetricCard({ number, label, icon, accent = "border-[#EFECE6] bg-[#F9F6F0]" }) {
  return (
    <div className={`border ${accent} rounded-2xl p-6 flex items-center justify-between shadow-sm`}>
      <div>
        <span className="text-[11px] font-bold text-[#8C857B] uppercase tracking-wider block">{label}</span>
        <h3 className="font-serif text-4xl font-bold text-[#2E2A27] mt-2">{number}</h3>
      </div>
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        {icon}
      </div>
    </div>
  );
}