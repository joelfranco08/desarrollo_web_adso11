import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Sparkles } from 'lucide-react';
import { getHorarioAuxiliar } from '../services/api';

export default function VistaHorario() {
  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState({ diasLaborales: "—", horasTotales: "—", diaDescanso: "—" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todayISO] = useState(() => {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');
  });

  useEffect(() => {
    let active = true;
    getHorarioAuxiliar()
      .then(({ data }) => {
        if (active) {
          setSchedule(data.dias || []);
          setSummary(data.resumen || { diasLaborales: "0", horasTotales: "0", diaDescanso: "—" });
        }
      })
      .catch((requestError) => {
        console.error('Error cargando el horario:', requestError);
        if (active) {
          setError(requestError.response?.data?.error || 'No fue posible cargar el horario.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryCard number={summary.diasLaborales} label="DÍAS LABORALES" icon={<CalendarDays className="text-[#C5A059]" size={22} />} />
        <SummaryCard number={summary.horasTotales} label="HORAS TOTALES" icon={<Clock className="text-[#C5A059]" size={22} />} />
        <SummaryCard number={summary.diaDescanso} label="DÍA DE DESCANSO" icon={<Sparkles className="text-[#C5A059]" size={22} />} />
      </div>

      {/* Timeline y Calendario Dinámico */}
      <div className="bg-[#F9F6F0] border border-[#EFECE6] rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
        <h3 className="font-serif text-xl font-bold text-[#2E2A27]">Mi horario</h3>

        <div className="space-y-4">
          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {loading ? (
            <p className="py-8 text-center text-sm text-[#8C857B]">Cargando horario...</p>
          ) : schedule.length === 0 && !error ? (
            <p className="py-8 text-center text-sm text-[#8C857B]">No hay horarios registrados para esta semana.</p>
          ) : schedule.map((item) => (
            <DayRow 
              key={item.id}
              day={item.day}
              date={item.date}
              shift={item.shift}
              highlight={item.fecha === todayISO}
              rest={item.rest}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ number, label, icon }) {
  return (
    <div className="bg-[#F9F6F0] border border-[#EFECE6] rounded-2xl p-6 flex items-center justify-between shadow-sm">
      <div>
        <span className="text-[10px] font-bold text-[#8C857B] uppercase tracking-wider block">{label}</span>
        <h3 className="font-serif text-3xl font-bold text-[#2E2A27] mt-1">{number}</h3>
      </div>
      <div className="p-3.5 bg-white rounded-2xl shadow-sm">
        {icon}
      </div>
    </div>
  );
}

function DayRow({ day, date, shift, highlight, rest }) {
  return (
    <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
      highlight ? 'bg-white border-[#C5A059] shadow-sm' : 'bg-white/60 border-[#EFECE6]'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-serif font-bold ${
          highlight ? 'bg-[#C5A059] text-white' : 'bg-[#F9F6F0] text-[#2E2A27]'
        }`}>
          <span className="text-[9px] uppercase">{day}</span>
          <span className="text-sm leading-none">{date}</span>
        </div>
        <div>
          <h4 className="font-bold text-sm text-[#2E2A27]">{shift}</h4>
        </div>
      </div>

      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
        rest ? 'bg-slate-200 text-slate-600' : 'bg-[#E8F5E9] text-[#2E7D32]'
      }`}>
        {rest ? 'Descanso' : 'Asignado'}
      </span>
    </div>
  );
}