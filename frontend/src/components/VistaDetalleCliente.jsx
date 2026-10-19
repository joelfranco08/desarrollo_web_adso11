import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  getCliente,
  getCitasAuxiliar,
  getClientes,
  updateProcedimiento,
} from '../services/api';

export default function VistaDetalleCliente({ clienteSeleccionado, onDataChanged }) {
  const [activeTab, setActiveTab] = useState('datos');
  const [cliente, setCliente] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [procedimientos, setProcedimientos] = useState(
    () => clienteSeleccionado?.procedimientos || []
  );
  const [loading, setLoading] = useState(true);
  const [savingProcedure, setSavingProcedure] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let active = true;
    if (clienteSeleccionado?.clienteId) {
      getCliente(clienteSeleccionado.clienteId)
        .then(({ data }) => {
          if (active) setCliente(data);
        })
        .catch((requestError) => {
          console.error('Error cargando el cliente:', requestError);
          if (active) {
            setError(requestError.response?.data?.error || 'No fue posible cargar el cliente.');
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      getClientes()
        .then(({ data }) => {
          if (active) setClientes(data);
        })
        .catch((requestError) => {
          console.error('Error cargando los clientes:', requestError);
          if (active) {
            setError(requestError.response?.data?.error || 'No fue posible cargar los clientes.');
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [clienteSeleccionado]);

  const seleccionarCliente = async (id) => {
    setLoading(true);
    setError('');
    setFeedback('');
    try {
      const { data } = await getCliente(id);
      setCliente(data);
      const { data: citas } = await getCitasAuxiliar({ id_cliente: id });
      setProcedimientos(citas.flatMap((cita) => cita.procedimientos || []));
    } catch (requestError) {
      console.error('Error cargando el cliente:', requestError);
      setError(requestError.response?.data?.error || 'No fue posible cargar el cliente.');
    } finally {
      setLoading(false);
    }
  };

  const actualizarProcedimiento = async () => {
    const procedimiento = procedimientos.find(
      (item) => item.estado?.toLowerCase() !== 'finalizado'
    );
    if (!procedimiento) return;

    const nuevoEstado = procedimiento.estado?.toLowerCase() === 'en proceso'
      ? 'Finalizado'
      : 'En proceso';
    setSavingProcedure(true);
    setError('');
    setFeedback('');
    try {
      const { data } = await updateProcedimiento(procedimiento.id, { estado: nuevoEstado });
      setProcedimientos((current) => current.map((item) => (
        item.id === data.id ? data : item
      )));
      setFeedback(`Procedimiento actualizado: ${data.estado}.`);
      await onDataChanged?.();
    } catch (requestError) {
      console.error('Error actualizando el procedimiento:', requestError);
      setError(requestError.response?.data?.error || 'No fue posible actualizar el procedimiento.');
    } finally {
      setSavingProcedure(false);
    }
  };

  const fechaCita = clienteSeleccionado?.fecha
    ? clienteSeleccionado.fecha.split('-').reverse().join('/')
    : '—';
  const procedimientoActivo = procedimientos.find(
    (item) => item.estado?.toLowerCase() !== 'finalizado'
  );

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {feedback && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {feedback}
        </p>
      )}

      {!clienteSeleccionado && !cliente && !loading && (
        <section className="rounded-2xl border border-[#EFECE6] bg-[#F9F6F0] p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#2E2A27]">Clientes</h2>
          {clientes.length === 0 ? (
            <p className="mt-4 text-sm text-[#8C857B]">No hay clientes registrados.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#EFECE6]">
              {clientes.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#2E2A27]">{item.nombre}</p>
                    <p className="text-xs text-[#8C857B]">{item.cedula}</p>
                  </div>
                  <button
                    onClick={() => seleccionarCliente(item.id)}
                    className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#2E2A27] shadow-sm"
                  >
                    Ver cliente
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {loading && <p className="py-8 text-center text-sm text-[#8C857B]">Cargando información...</p>}

      {cliente && !loading && (
      <>
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

      {activeTab === 'datos' && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Dinámico Read-only */}
        <div className="lg:col-span-2 bg-[#F9F6F0] border border-[#EFECE6] rounded-2xl p-6 lg:p-8 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#2E2A27] mb-2">Información del Cliente</h3>
          
          <ReadOnlyInput label="NOMBRE COMPLETO" value={cliente.nombre} />
          <ReadOnlyInput label="CÉDULA" value={cliente.cedula} />
          <ReadOnlyInput label="TELÉFONO" value={cliente.telefono} />
          <ReadOnlyInput label="CORREO ELECTRÓNICO" value={cliente.correo} />
          <ReadOnlyInput label="FECHA DE NACIMIENTO" value={cliente.fechaNacimiento} />
          <ReadOnlyInput label="NOTAS MÉDICAS / ALERGIAS" value={cliente.alergiasNotasMedicas} />
        </div>

        {/* Resumen dinámico del Procedimiento */}
        <div className="bg-[#F9F6F0] border border-[#EFECE6] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E2A27] mb-4">Resumen de Procedimiento</h3>
            
            <div className="space-y-3 text-xs">
              <SummaryRow label="Cliente" value={cliente.nombre} />
              <SummaryRow label="Servicio" value={clienteSeleccionado?.title} />
              <SummaryRow label="Fecha" value={fechaCita} />
              <SummaryRow label="Hora" value={clienteSeleccionado?.time} />
              <SummaryRow label="Cabina" value={clienteSeleccionado?.cabina} />
              <SummaryRow label="Estado" value={clienteSeleccionado?.status} />
            </div>
          </div>

          {procedimientoActivo ? (
            <button
              onClick={actualizarProcedimiento}
              disabled={savingProcedure}
              className="w-full bg-[#2E2A27] hover:bg-[#3D332A] disabled:opacity-60 text-[#FDFBF7] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {savingProcedure
                  ? 'ACTUALIZANDO...'
                  : procedimientoActivo.estado?.toLowerCase() === 'en proceso'
                    ? 'FINALIZAR PROCEDIMIENTO'
                    : 'INICIAR PROCEDIMIENTO'}
              </span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <p className="text-xs text-[#8C857B]">
              {procedimientos.length === 0
                ? 'Esta cita aún no tiene procedimientos registrados.'
                : 'Todos los procedimientos están finalizados.'}
            </p>
          )}
        </div>
      </div>
      }
      </>
      )}

      {cliente && !loading && activeTab === 'historial' && (
        <section className="rounded-2xl border border-[#EFECE6] bg-[#F9F6F0] p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-[#2E2A27]">Historial de procedimientos</h3>
          {procedimientos.length === 0 ? (
            <p className="mt-4 text-sm text-[#8C857B]">No hay procedimientos asociados a esta cita.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {procedimientos.map((item) => (
                <li key={item.id} className="rounded-xl border border-[#EFECE6] bg-white p-4">
                  <p className="text-sm font-semibold text-[#2E2A27]">{item.descripcion || 'Procedimiento'}</p>
                  <p className="mt-1 text-xs text-[#8C857B]">Estado: {item.estado || 'Sin estado'}</p>
                  {item.observaciones && (
                    <p className="mt-2 text-sm text-[#8C857B]">{item.observaciones}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

function ReadOnlyInput({ label, value }) {
  const displayValue = value || '—';
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C857B] block mb-1">{label}</label>
      <div className="w-full bg-white border-0 px-4 py-3 rounded-xl text-sm font-semibold text-[#2E2A27] shadow-sm">
        {displayValue}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#EFECE6]">
      <span className="text-[#8C857B]">{label}</span>
      <span className="font-bold text-[#2E2A27] text-right">{value || '—'}</span>
    </div>
  );
}