import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { getCitasAuxiliar } from '../services/api';

export default function VistaAgenda({ onViewCliente }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fechaHoy] = useState(() => new Date());
  const fechaISO = [
    fechaHoy.getFullYear(),
    String(fechaHoy.getMonth() + 1).padStart(2, '0'),
    String(fechaHoy.getDate()).padStart(2, '0'),
  ].join('-');
  const fechaLegible = fechaHoy.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    let active = true;
    getCitasAuxiliar({ fecha: fechaISO })
      .then(({ data }) => {
        if (active) setCitas(data);
      })
      .catch((requestError) => {
        console.error('Error cargando las citas:', requestError);
        if (active) {
          setError(requestError.response?.data?.error || 'No fue posible cargar las citas.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fechaISO]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header de Fecha */}
      <div className="bg-[#F9F6F0] border border-[#EFECE6] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-[#C5A059] tracking-widest uppercase">Agenda en curso</span>
          <h2 className="font-serif text-2xl font-bold text-[#2E2A27] mt-0.5 capitalize">{fechaLegible}</h2>
          <p className="text-xs text-[#8C857B] mt-1">Barranquilla • Sede Principal</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-[#EFECE6] text-xs font-bold text-[#2E2A27] shadow-sm">
          {citas.length} citas totales
        </div>
      </div>

      {/* Mapeo dinámico de Citas desde la API o Estado */}
      <div className="space-y-4">
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {loading ? (
          <div className="text-center py-10 text-[#8C857B]">Cargando citas del día...</div>
        ) : citas.length === 0 && !error ? (
          <div className="text-center py-10 text-[#8C857B]">No hay citas registradas para hoy.</div>
        ) : (
          citas.map((cita) => (
            <AppointmentCard 
              key={cita.id}
              citaData={cita}
              onAction={() => onViewCliente(cita)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AppointmentCard({ citaData, onAction }) {
  const { time, duration, title, status, client, visits, cabina } = citaData;
  const statusStyle = status?.toLowerCase() === 'finalizado'
    ? 'bg-[#E8F5E9] text-[#2E7D32]'
    : status?.toLowerCase() === 'en proceso'
      ? 'bg-[#E3F2FD] text-[#1565C0]'
      : 'bg-[#FFF8E1] text-[#8A6D1D]';

  return (
    <div className="bg-[#F9F6F0] hover:bg-white border border-[#EFECE6] hover:border-[#C5A059]/40 rounded-2xl p-6 transition-all shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div className="flex items-start gap-5">
        <div className="px-3.5 py-2.5 bg-white rounded-xl border border-[#EFECE6] text-center shadow-sm min-w-[90px]">
          <span className="text-xs font-bold text-[#2E2A27] block">{time}</span>
          <span className="text-[10px] text-[#8C857B]">{duration}</span>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-serif text-lg font-bold text-[#2E2A27]">{title}</h4>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusStyle || 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
              {status}
            </span>
          </div>
          <p className="text-sm font-semibold text-[#2E2A27]">{client}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C857B] mt-1.5">
            {visits && <span>{visits}</span>}
            {cabina && <span className="font-medium text-[#2E2A27]">{cabina}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-[#EFECE6]">
        <button 
          onClick={onAction}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#2E2A27] bg-white border border-[#EFECE6] hover:bg-[#FDFBF7] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>Ver cliente</span>
          <ChevronRight size={14} />
        </button>
        <button 
          onClick={onAction}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#2E2A27] bg-[#EFECE6] hover:bg-[#C5A059] hover:text-white transition-all shadow-sm cursor-pointer"
        >
          Ver historial
        </button>
      </div>
    </div>
  );
}