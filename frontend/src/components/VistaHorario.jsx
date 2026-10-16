import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Sparkles } from 'lucide-react';
import { getHorarioAuxiliar } from '../services/api';

const DIAS_HORARIO_INICIAL = [
  { day: "Lun", date: "21", shift: "Turno mañana 07:00 -> 15:00 - Cabina 1 & 2", active: true },
  { day: "Mar", date: "22", shift: "Turno tarde 13:00 -> 21:00 - Cabina 3", active: true },
  { day: "Mié", date: "23", shift: "Turno mañana 07:00 -> 15:00 - Cabina 1", active: true, highlight: true },
  { day: "Jue", date: "24", shift: "Turno mañana 07:00 -> 15:00 - Cabina 2", active: true },
  { day: "Vie", date: "25", shift: "Turno tarde 13:00 -> 21:00 - Cabina 1 & 3", active: true },
  { day: "Sáb", date: "26", shift: "Turno especial 08:00 -> 16:00 - Cabina 2", active: true },
  { day: "Dom", date: "27", shift: "Día de descanso", rest: true }
];

export default function VistaHorario() {
  const [schedule, setSchedule] = useState(DIAS_HORARIO_INICIAL);
  const [summary, setSummary] = useState({ diasLaborales: "6", horasTotales: "44", diaDescanso: "Dom" });

  useEffect(() => {
    getHorarioAuxiliar()
      .then((res) => {
        if (res.data) {
          if (res.data.dias) setSchedule(res.data.dias);
          if (res.data.resumen) setSummary(res.data.resumen);
        }
      })
      .catch((err) => console.warn('Usando esquema de horario local:', err));
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
          {schedule.map((item, idx) => (
            <DayRow 
              key={idx}
              day={item.day}
              date={item.date}
              shift={item.shift}
              highlight={item.highlight}
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