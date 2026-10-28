import { useRef, useState } from "react";
import "./cliente.css";
import type { FormEvent, PointerEvent, ReactNode } from "react";

type Page = "inicio" | "citas" | "promociones" | "procedimientos" | "comunidad" | "perfil" | "notificaciones";
type IconName = "home" | "calendar" | "tag" | "history" | "users" | "user" | "bell" | "logout" | "arrow" | "chevron" | "check" | "clock" | "sparkle" | "heart" | "message" | "send" | "plus" | "close" | "shield" | "file" | "pen" | "menu" | "sun" | "location" | "gift" | "more" | "sort";

const photos = {
  hero: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=85",
  facial: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1000&q=85",
  massage: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1000&q=85",
  wellness: "https://images.unsplash.com/photo-1693004927824-f2623bbedc8b?w=1000&q=85",
};

function Icon({ name, size = 20, strokeWidth = 1.8, className = "" }: { name: IconName; size?: number; strokeWidth?: number; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-8h6v8"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/><path d="m9 15 2 2 4-4"/></>,
    tag: <><path d="M20 13 13 20a2 2 0 0 1-2.8 0L3 12.8V4a1 1 0 0 1 1-1h8.8L20 10.2a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2H3ZM17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2h-3"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9ZM10 21h4"/></>,
    logout: <><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M15 16l4-4-4-4M19 12H9"/></>,
    arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    sparkle: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 18l.7 2.3L22 21l-2.3.7L19 24l-.7-2.3L16 21l2.3-.7L19 18Z"/></>,
    heart: <path d="M20.8 8.6c0 4.1-8.8 10.2-8.8 10.2S3.2 12.7 3.2 8.6a4.6 4.6 0 0 1 8.8-1.9 4.6 4.6 0 0 1 8.8 1.9Z"/>,
    message: <path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 20l.9-4.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 20 11.5Z"/>,
    send: <><path d="m21 3-8 18-3-7-7-3 18-8ZM10 14 21 3"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    file: <><path d="M6 2h8l5 5v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM14 2v5h5M8 12h8M8 16h8"/></>,
    pen: <><path d="m15 5 4 4M4 20l4.5-.8L20 7.7a2 2 0 0 0-3-3L5.5 16.2 4 20Z"/></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    gift: <><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M2 9h20M12 9v12M12 9S5 8 5 5.5A2.5 2.5 0 0 1 7.5 3C10 3 12 9 12 9ZM12 9s7-1 7-3.5A2.5 2.5 0 0 0 16.5 3C14 3 12 9 12 9Z"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    sort: <path d="M4 7h16M7 12h10M10 17h4"/>,
  };
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const navigation: { label: string; page: Page; icon: IconName }[] = [
  { label: "Inicio", page: "inicio", icon: "home" },
  { label: "Mi horario", page: "citas", icon: "calendar" },
  { label: "Promociones", page: "promociones", icon: "tag" },
  { label: "Procedimientos", page: "procedimientos", icon: "history" },
  { label: "Comunidad", page: "comunidad", icon: "users" },
];

const promotions = [
  { id: 1, category: "CUIDADO FACIAL", title: "Una piel que se siente como nueva", offer: "20% OFF", description: "Limpieza facial profunda", image: photos.facial, price: "$96.000", oldPrice: "$120.000", includes: ["Diagnóstico personalizado de piel", "Limpieza y exfoliación profunda", "Mascarilla hidratante", "Protección y recomendaciones finales"] },
  { id: 2, category: "BIENESTAR", title: "Un momento solo para ti", offer: "PRECIO ESPECIAL", description: "Paquete relajación", image: photos.massage, price: "$120.000", oldPrice: "$150.000", includes: ["Masaje relajante de cuerpo completo", "Aromaterapia personalizada", "Ritual de piedras calientes", "Infusión de cortesía"] },
  { id: 3, category: "RITUAL DE BELLEZA", title: "Renueva tu energía", offer: "15% OFF", description: "Ritual de autocuidado", image: photos.wellness, price: "$144.500", oldPrice: "$170.000", includes: ["Valoración de bienestar", "Tratamiento facial revitalizante", "Masaje de cuello y hombros", "Guía de autocuidado en casa"] },
];

type Post = { id: number; author: string; initials: string; time: string; text: string; image?: string; likes: number; comments: string[]; liked: boolean; color: string };
const initialPosts: Post[] = [
  { id: 1, author: "Valentina M.", initials: "VM", time: "Hace 2 horas", text: "Hoy me regalé una pausa en Meyer Spa y salí sintiéndome renovada. A veces, cuidarnos es la mejor manera de seguir adelante. ¿Cuál es su ritual favorito de autocuidado?", image: photos.massage, likes: 24, comments: ["¡Qué lindo recordatorio!"] , liked: false, color: "peach" },
  { id: 2, author: "Sofía R.", initials: "SR", time: "Ayer", text: "Una semana de constancia con mi rutina de cuidado facial y ya noto la diferencia. Los pequeños pasos también cuentan.", image: photos.wellness, likes: 18, comments: [], liked: false, color: "lavender" },
];

function SignaturePad({ label, onChange }: { label: string; onChange: (signed: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  function position(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * (event.currentTarget.width / rect.width), y: (event.clientY - rect.top) * (event.currentTarget.height / rect.height) };
  }
  function start(event: PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    const point = position(event);
    ctx.strokeStyle = "#4a3b32";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    drawing.current = true;
  }
  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const point = position(event);
    const ctx = event.currentTarget.getContext("2d");
    ctx?.lineTo(point.x, point.y);
    ctx?.stroke();
    onChange(true);
  }
  return <div className="signature-field"><div className="signature-heading"><span>{label}</span><button type="button" className="text-link" onClick={() => { canvasRef.current?.getContext("2d")?.clearRect(0, 0, 600, 150); onChange(false); }}>Borrar</button></div><canvas ref={canvasRef} width={600} height={150} onPointerDown={start} onPointerMove={move} onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }} aria-label={`Firma de ${label}`} /><small>Firma aquí con el mouse o con el dedo</small></div>;
}

export default function App() {
  const [page, setPage] = useState<Page>("inicio");
  const [detail, setDetail] = useState<"appointment" | "procedure" | number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileLanding, setMobileLanding] = useState(true);
  const [name, setName] = useState("Ana Rodríguez");
  const [email, setEmail] = useState("ana.rodriguez@email.com");
  const [phone, setPhone] = useState("+57 300 123 4567");
  const [editingProfile, setEditingProfile] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [clientSigned, setClientSigned] = useState(false);
  const [assistantSigned, setAssistantSigned] = useState(false);
  const [procedureConfirmed, setProcedureConfirmed] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Tu cita está confirmada", text: "Te esperamos el 25 de septiembre a las 2:00 PM para tu limpieza facial.", time: "Hace 1 hora", read: false, icon: "calendar" as IconName },
    { id: 2, title: "Un regalo para ti", text: "Disfruta de 20% de descuento en tu próxima limpieza facial.", time: "Ayer", read: false, icon: "gift" as IconName },
    { id: 3, title: "Tu bienestar nos importa", text: "Descubre las recomendaciones para cuidar tu piel después de tu visita.", time: "Hace 3 días", read: true, icon: "sparkle" as IconName },
  ]);
  const [toast, setToast] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [openComment, setOpenComment] = useState<number | null>(null);
  const [sortNewest, setSortNewest] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
  const firstName = name.trim().split(" ")[0] || "Ana";
  const unread = notifications.filter(n => !n.read).length;

  function navigate(next: Page) { setPage(next); setDetail(null); setMobileMenu(false); setMobileLanding(false); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 4000); }
  function requestPromotion(title: string) {
    setNotifications(current => [{ id: Date.now(), title: "Solicitud recibida", text: `Recibimos tu solicitud para ${title}. Pronto nos pondremos en contacto contigo.`, time: "Ahora", read: false, icon: "gift" }, ...current]);
    setDetail(null); notify("¡Solicitud enviada! Pronto nos pondremos en contacto contigo.");
  }
  function publish(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    setPosts(current => [{ id: Date.now(), author: name, initials: firstName.slice(0, 1).toUpperCase() + (name.split(" ")[1]?.[0] || "R"), time: "Ahora", text: draft.trim(), likes: 0, comments: [], liked: false, color: "gold" }, ...current]);
    setDraft(""); notify("Tu publicación ya es parte de la comunidad.");
  }
  function addComment(id: number) {
    const text = commentDrafts[id]?.trim(); if (!text) return;
    setPosts(current => current.map(post => post.id === id ? { ...post, comments: [...post.comments, text] } : post));
    setCommentDrafts(current => ({ ...current, [id]: "" }));
  }

  const appointmentStatus = cancelled ? "Cancelada" : "Confirmada";
  const progressStep = cancelled ? 0 : procedureConfirmed ? 5 : authorized && clientSigned ? 3 : 2;
  const steps = ["Reserva realizada", "Cliente registrado", "Autorización firmada", "Procedimiento en proceso", "Finalizado"];

  function pageIntro(eyebrow: string, title: string, subtitle: string) {
    return <div className="page-intro"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div></div>;
  }

  function timeline(compact = false) {
    if (cancelled) return <p className="section-description">Esta reserva fue cancelada. No hay un proceso activo en este momento.</p>;
    return <div className={compact ? "timeline compact" : "timeline"}>{steps.map((step, index) => <div className={`timeline-step ${index < progressStep ? "complete" : ""} ${index === progressStep ? "current" : ""}`} key={step}><div className="timeline-node">{index < progressStep ? <Icon name="check" size={15} strokeWidth={2.5} /> : <span>{index + 1}</span>}</div><div className="timeline-copy"><strong>{step}</strong>{!compact && <small>{["Tu cita fue agendada con éxito", "Tus datos están listos", authorized && clientSigned ? "Consentimiento registrado" : "Pendiente de firma", "Estamos cuidando de ti", "Tu experiencia está completa"][index]}</small>}</div></div>)}</div>;
  }

  function appointmentCard() {
    return <div className="appointment-card"><div className="appointment-date"><span>SEP</span><strong>25</strong><small>JUEVES</small></div><div className="appointment-information"><div className="appointment-topline"><span className="pill"><span className="pill-dot" />{appointmentStatus}</span><span className="muted tiny">Próxima cita</span></div><h3>Limpieza facial profunda</h3><div className="appointment-meta"><span><Icon name="clock" size={16} />2:00 PM – 3:30 PM</span><span><Icon name="user" size={16} />María López</span></div></div><button className="round-arrow" onClick={() => setDetail("appointment")} aria-label="Ver detalles de la cita"><Icon name="arrow" size={19} /></button></div>;
  }

  function renderHome() {
    return <>
      <div className="home-intro"><div><div className="eyebrow">TU ESPACIO DE BIENESTAR</div><h1>¡Bienvenida, {firstName}!</h1><p>Qué bueno tenerte de vuelta. Tu momento de bienestar comienza aquí.</p></div><div className="date-label"><Icon name="sun" size={18} /> Un buen día para cuidarte</div></div>
      <section className="hero"><div className="hero-content"><span className="hero-kicker"><span className="hero-kicker-line" /> MEYER SPA · TU REFUGIO</span><h2>El arte de sentirte <em>bien contigo.</em></h2><p>Pequeños momentos de cuidado que hacen una gran diferencia. Estamos aquí para acompañarte en cada paso.</p><button className="button button-gold" onClick={() => navigate("citas")}>Explorar mis citas <Icon name="arrow" size={17} /></button></div><div className="hero-image" role="img" aria-label="Ambiente relajante de spa con flores y productos de cuidado" /></section>
      <div className="section-heading quick-heading"><div><div className="eyebrow">TODO EN UN LUGAR</div><h2>Tu espacio, a tu ritmo</h2></div><span className="subtle">Lo que necesitas, a un clic de distancia.</span></div>
      <div className="quick-grid">
        <button className="quick-card" onClick={() => navigate("citas")}><span className="quick-icon"><Icon name="calendar" size={22} /></span><span className="quick-content"><span className="quick-label">PRÓXIMA CITA</span><strong>{cancelled ? "Sin cita activa" : "25 de septiembre"}</strong><small>{cancelled ? "Explora tus próximas opciones" : "Limpieza facial · 2:00 PM"}</small></span><Icon name="arrow" size={18} className="quick-arrow" /></button>
        <button className="quick-card" onClick={() => navigate("promociones")}><span className="quick-icon"><Icon name="gift" size={22} /></span><span className="quick-content"><span className="quick-label">PARA TI</span><strong>20% de descuento</strong><small>En tu próxima limpieza facial</small></span><Icon name="arrow" size={18} className="quick-arrow" /></button>
        <button className="quick-card" onClick={() => navigate("procedimientos")}><span className="quick-icon"><Icon name="history" size={22} /></span><span className="quick-content"><span className="quick-label">TU HISTORIAL</span><strong>Tu camino de cuidado</strong><small>Revisa tus procedimientos</small></span><Icon name="arrow" size={18} className="quick-arrow" /></button>
      </div>
      <div className="home-lower"><section className="surface process-card"><div className="section-heading"><div><div className="eyebrow">CADA PASO CUENTA</div><h2>Estado de tu proceso</h2></div><span className="pill pale">{cancelled ? "Sin proceso activo" : "En seguimiento"}</span></div><p className="section-description">Acompañamos tu experiencia de principio a fin.</p><div className="mini-progress"><div className="mini-progress-line"><span style={{ width: `${Math.max(0, (progressStep - 1) / 4 * 100)}%` }} /></div>{["Reserva", "En proceso", "Finalizado"].map((label, index) => { const done = !cancelled && (index === 0 || (index === 1 && progressStep > 2) || (index === 2 && progressStep === 5)); return <div className={`mini-step ${done ? "done" : ""}`} key={label}><span className="mini-dot">{done ? <Icon name="check" size={13} strokeWidth={2.5} /> : index + 1}</span><span>{label}</span></div>; })}</div><div className="process-bottom"><span><Icon name="sparkle" size={17} /> {cancelled ? "Puedes agendar una nueva cita cuando quieras." : "Tu bienestar está en buenas manos."}</span><button className="text-action" onClick={() => navigate("procedimientos")}>Ver detalles <Icon name="arrow" size={16} /></button></div></section><section className="surface next-card"><div className="eyebrow">EN TU AGENDA</div><h2>{cancelled ? "Tu agenda" : "Tu próxima visita"}</h2>{cancelled ? <p className="empty-appointment">No tienes citas activas por ahora. Explora nuestras experiencias y encuentra tu próximo momento de bienestar.</p> : appointmentCard()}<button className="text-action" onClick={() => navigate(cancelled ? "promociones" : "citas")}>{cancelled ? "Explorar experiencias" : "Ver mi horario"} <Icon name="arrow" size={16} /></button></section></div>
      <div className="community-banner"><div className="community-banner-mark"><Icon name="users" size={24} /></div><div><strong>El bienestar se disfruta más en comunidad.</strong><p>Comparte, inspírate y conecta con personas como tú.</p></div><button onClick={() => navigate("comunidad")}>Explorar comunidad <Icon name="arrow" size={17} /></button></div>
    </>;
  }

  function renderAppointments() {
    return <>{pageIntro("TU TIEMPO ES VALIOSO", "Mi horario", "Tus momentos de autocuidado, organizados en un solo lugar.")}<div className="content-narrow"><div className="section-heading section-spaced"><div><div className="eyebrow">EN TU AGENDA</div><h2>{cancelled ? "Cita cancelada" : "Próxima cita"}</h2></div></div><div className="surface appointment-detail-card"><div className="appointment-detail-top"><span className="pill"><span className="pill-dot" />{appointmentStatus}</span><span className="muted">Reserva #MS-2025-0925</span></div><div className="appointment-detail-main"><div className="large-date"><span>SEPTIEMBRE</span><strong>25</strong><small>JUEVES · 2025</small></div><div className="appointment-detail-text"><span className="eyebrow">TU MOMENTO MEYER</span><h2>Limpieza facial profunda</h2><p>{cancelled ? "Esta reserva fue cancelada." : "Un espacio para renovar tu piel y reconectar contigo."}</p><div className="detail-facts"><span><Icon name="clock" size={18} /> 2:00 PM – 3:30 PM</span><span><Icon name="user" size={18} /> Auxiliar: María López</span><span><Icon name="location" size={18} /> Meyer Spa · Sede principal</span></div></div></div><div className="appointment-actions"><button className="button button-dark" onClick={() => setDetail("appointment")}>Ver detalles <Icon name="arrow" size={17} /></button>{!cancelled && <button className="button button-outline" onClick={() => setConfirmCancel(true)}>Cancelar cita</button>}</div></div><div className="section-heading section-spaced"><div><div className="eyebrow">MOMENTOS VIVIDOS</div><h2>Historial de citas</h2></div><span className="muted">2 visitas anteriores</span></div><div className="surface history-list">{[{ day: "12", month: "AGO", title: "Masaje de relajación", date: "12 de agosto de 2025", person: "Laura Gómez" }, { day: "18", month: "JUL", title: "Hidratación facial", date: "18 de julio de 2025", person: "María López" }].map(item => <div className="history-row" key={item.day}><div className="history-date"><strong>{item.day}</strong><small>{item.month}</small></div><div className="history-copy"><strong>{item.title}</strong><span>{item.date} · {item.person}</span></div><span className="pill success"><Icon name="check" size={14} /> Finalizada</span></div>)}</div></div></>;
  }

  function renderPromotions() {
    return <>{pageIntro("EXCLUSIVO PARA TI", "Promociones", "Experiencias especiales para que sigas eligiéndote todos los días.")}<div className="promo-feature"><div className="promo-feature-copy"><span className="eyebrow">ESTE MES EN MEYER SPA</span><h2>Haz una pausa.<br /><em>Te la mereces.</em></h2><p>Descubre nuestros rituales de cuidado con beneficios pensados especialmente para ti.</p></div><Icon name="sparkle" size={90} strokeWidth={0.7} /></div><div className="section-heading section-spaced"><div><div className="eyebrow">OPORTUNIDADES DE BIENESTAR</div><h2>Hechas para ti</h2></div><span className="muted">{promotions.length} experiencias disponibles</span></div><div className="promo-grid">{promotions.map(promo => <article className="promo-card surface" key={promo.id}><div className="promo-image"><img src={promo.image} alt={promo.description} /><span className="promo-badge">{promo.offer}</span></div><div className="promo-body"><span className="eyebrow">{promo.category}</span><h3>{promo.title}</h3><p>{promo.description}</p><div className="promo-footer"><div><strong>{promo.price}</strong><del>{promo.oldPrice}</del></div><button className="round-arrow" onClick={() => setDetail(promo.id)} aria-label={`Ver promoción ${promo.description}`}><Icon name="arrow" size={18} /></button></div></div></article>)}</div></>;
  }

  function renderProcedures() {
    return <>{pageIntro("TU HISTORIA DE BIENESTAR", "Mis procedimientos", "Cada experiencia, cada avance, todo tu cuidado en un solo lugar.")}<div className="procedure-layout"><div className="procedure-primary"><div className="surface procedure-feature"><div className="procedure-feature-image"><img src={photos.facial} alt="Tratamiento de cuidado facial" /></div><div className="procedure-feature-content"><div className="eyebrow">PROCEDIMIENTO ACTUAL</div><div className="procedure-title-row"><h2>Limpieza facial profunda</h2><span className="pill"><span className="pill-dot" />{cancelled ? "Cancelada" : procedureConfirmed ? "Autorizado" : "En seguimiento"}</span></div><p>Un tratamiento diseñado para purificar, hidratar y devolverle luminosidad natural a tu piel.</p><div className="procedure-details"><span><Icon name="calendar" size={17} /> 25 de septiembre de 2025</span><span><Icon name="user" size={17} /> María López</span><span><Icon name="clock" size={17} /> 90 minutos</span></div><button className="button button-dark" onClick={() => setDetail("procedure")}>Ver procedimiento <Icon name="arrow" size={17} /></button></div></div><div className="surface timeline-card"><div className="eyebrow">PASO A PASO</div><h2>Seguimiento de mi proceso</h2><p className="section-description">Cada etapa de tu experiencia, siempre a la vista.</p>{timeline()}</div><div className="surface past-procedures"><div className="eyebrow">TU HISTORIAL</div><h2>Procedimientos anteriores</h2><div className="history-row"><div className="history-date"><strong>12</strong><small>AGO</small></div><div className="history-copy"><strong>Masaje de relajación</strong><span>12 de agosto de 2025 · Laura Gómez</span></div><span className="pill success">Finalizado</span></div><div className="history-row"><div className="history-date"><strong>18</strong><small>JUL</small></div><div className="history-copy"><strong>Hidratación facial</strong><span>18 de julio de 2025 · María López</span></div><span className="pill success">Finalizado</span></div></div></div><aside className="procedure-side"><div className="side-note"><div className="side-note-icon"><Icon name="shield" size={24} /></div><h3>Tu cuidado es nuestra prioridad.</h3><p>Revisa los detalles y recomendaciones de cada procedimiento para vivir una experiencia tranquila y segura.</p><button onClick={() => setDetail("procedure")}>Revisar detalles <Icon name="arrow" size={16} /></button></div></aside></div></>;
  }

  function renderCommunity() {
    return <>{pageIntro("CRECEMOS JUNTOS", "Nuestra comunidad", "Un espacio para compartir lo que nos hace sentir bien.")}<div className="community-layout"><div className="feed-column"><form className="surface composer" onSubmit={publish}><div className="composer-top"><div className="avatar small">{firstName[0]}R</div><label className="sr-only" htmlFor="post-draft">Comparte una actualización</label><textarea id="post-draft" placeholder="¿Cuál es tu avance de bienestar hoy?" value={draft} onChange={event => setDraft(event.target.value)} rows={2} /></div><div className="composer-bottom"><span><Icon name="sparkle" size={17} /> Inspira a alguien hoy</span><button className="button button-dark" type="submit" disabled={!draft.trim()}>Publicar <Icon name="arrow" size={16} /></button></div></form><div className="feed-heading"><div><div className="eyebrow">HISTORIAS QUE INSPIRAN</div><h2>El rincón de todos</h2></div><button className="sort-button" onClick={() => setSortNewest(!sortNewest)}><Icon name="sort" size={17} /> {sortNewest ? "Más recientes" : "Más antiguos"}</button></div>{(sortNewest ? posts : [...posts].reverse()).map(post => <article className="surface post-card" key={post.id}><div className="post-header"><div className={`avatar small ${post.color}`}>{post.initials}</div><div className="post-author"><strong>{post.author}</strong><span>{post.time} · Comunidad Meyer</span></div><Icon name="more" size={20} className="muted" /></div><p>{post.text}</p>{post.image && <img className="post-image" src={post.image} alt="Momento de bienestar compartido por la comunidad" />}<div className="post-counts"><span><Icon name="heart" size={15} /> {post.likes} Me gusta</span><span>{post.comments.length} comentarios</span></div><div className="post-actions"><button className={post.liked ? "liked" : ""} onClick={() => setPosts(current => current.map(p => p.id === post.id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p))}><Icon name="heart" size={18} /> Me gusta</button><button onClick={() => setOpenComment(openComment === post.id ? null : post.id)}><Icon name="message" size={18} /> Comentar</button></div>{openComment === post.id && <div className="comments-area">{post.comments.map((comment, i) => <div className="comment" key={i}><div className="avatar micro">{i === 0 ? "AM" : "AR"}</div><span>{comment}</span></div>)}<form onSubmit={event => { event.preventDefault(); addComment(post.id); }}><input value={commentDrafts[post.id] || ""} onChange={event => setCommentDrafts(current => ({ ...current, [post.id]: event.target.value }))} placeholder="Escribe un comentario..." aria-label="Escribe un comentario" /><button type="submit" aria-label="Enviar comentario" disabled={!commentDrafts[post.id]?.trim()}><Icon name="send" size={18} /></button></form></div>}</article>)}</div><aside className="community-aside"><div className="side-note community-note"><div className="side-note-icon"><Icon name="heart" size={24} /></div><div className="eyebrow">UN ESPACIO PARA TODOS</div><h3>Compartir también es cuidarse.</h3><p>Tu historia puede ser la inspiración que alguien más necesita hoy.</p><div className="note-divider" /><span>Con cariño, el equipo Meyer Spa</span></div></aside></div></>;
  }

  function renderProfile() {
    return <>{pageIntro("UN ESPACIO SOLO TUYO", "Mi perfil", "Tu información y tus preferencias, siempre contigo.")}<div className="profile-layout"><div className="surface profile-card"><div className="profile-cover" /><div className="profile-avatar">{firstName[0]}R</div><div className="profile-card-body"><div className="eyebrow">MIEMBRO MEYER SPA</div><h2>{name}</h2><p>Cliente desde julio de 2025</p><div className="profile-stats"><div><strong>03</strong><span>Visitas</span></div><div><strong>02</strong><span>Experiencias</span></div></div></div></div><div className="surface profile-form-card"><div className="section-heading"><div><div className="eyebrow">DATOS PERSONALES</div><h2>Información de contacto</h2></div><button className="text-action" onClick={() => { if (editingProfile) notify("Tu perfil se actualizó correctamente."); setEditingProfile(!editingProfile); }}>{editingProfile ? "Guardar cambios" : "Editar perfil"} <Icon name={editingProfile ? "check" : "pen"} size={16} /></button></div><div className="form-grid"><label>Nombre completo<input value={name} onChange={event => setName(event.target.value)} disabled={!editingProfile} /></label><label>Correo electrónico<input type="email" value={email} onChange={event => setEmail(event.target.value)} disabled={!editingProfile} /></label><label>Teléfono<input value={phone} onChange={event => setPhone(event.target.value)} disabled={!editingProfile} /></label><label>Tipo de cuenta<input value="Cliente Meyer Spa" disabled /></label></div><div className="profile-note"><Icon name="shield" size={18} /> Tu información personal se mantiene segura y privada.</div></div></div></>;
  }

  function renderNotifications() {
    return <>{pageIntro("NO TE PIERDAS NADA", "Notificaciones", "Novedades y recordatorios para seguir cuidándote.")}<div className="content-narrow"><div className="section-heading section-spaced"><div><div className="eyebrow">AL DÍA CONTIGO</div><h2>Actualizaciones recientes</h2></div><button className="text-action" onClick={() => setNotifications(current => current.map(n => ({ ...n, read: true })))}>Marcar todas como leídas <Icon name="check" size={16} /></button></div><div className="surface notification-list">{notifications.map(notification => <button className={`notification-row ${notification.read ? "" : "unread"}`} key={notification.id} onClick={() => setNotifications(current => current.map(n => n.id === notification.id ? { ...n, read: true } : n))}><div className="notification-icon"><Icon name={notification.icon} size={21} /></div><div><div className="notification-title"><strong>{notification.title}</strong>{!notification.read && <span className="unread-dot" />}</div><p>{notification.text}</p><small>{notification.time}</small></div><Icon name="chevron" size={18} className="muted" /></button>)}</div></div></>;
  }

  function renderDetail() {
    if (typeof detail === "number") {
      const promo = promotions.find(p => p.id === detail); if (!promo) return null;
      return <>{pageIntro("PROMOCIONES / DETALLE", promo.description, "Una experiencia especial pensada para tu bienestar.")}<div className="detail-layout"><div className="surface promo-detail"><div className="promo-detail-image"><img src={promo.image} alt={promo.description} /><span className="promo-badge">{promo.offer}</span></div><div className="promo-detail-body"><div className="eyebrow">{promo.category}</div><h2>{promo.title}</h2><p>Regálate un momento de pausa y reconexión. En Meyer Spa cuidamos de cada detalle para que disfrutes una experiencia inolvidable.</p><h3>Esta experiencia incluye</h3><ul className="included-list">{promo.includes.map(item => <li key={item}><Icon name="check" size={16} />{item}</li>)}</ul><div className="detail-purchase"><div><span>Precio especial</span><strong>{promo.price}</strong><del>{promo.oldPrice}</del></div><button className="button button-dark" onClick={() => requestPromotion(promo.description)}>Solicitar promoción <Icon name="arrow" size={17} /></button></div></div></div><div className="side-note"><div className="side-note-icon"><Icon name="sparkle" size={24} /></div><h3>Un momento para ti.</h3><p>Solicita esta promoción y nuestro equipo se pondrá en contacto contigo para coordinar tu visita.</p></div></div></>;
    }
    if (detail === "appointment") return <>{pageIntro("MI HORARIO / DETALLE", "Detalles de tu cita", "Todo lo que necesitas saber antes de tu visita.")}<div className="detail-layout"><div className="surface detail-panel"><div className="appointment-detail-top"><span className="pill"><span className="pill-dot" />{appointmentStatus}</span><span className="muted">Reserva #MS-2025-0925</span></div><h2>Limpieza facial profunda</h2><p>Prepárate para un momento de cuidado diseñado especialmente para ti.</p><div className="info-tiles"><div><Icon name="calendar" size={21} /><span>FECHA</span><strong>Jueves, 25 de septiembre</strong></div><div><Icon name="clock" size={21} /><span>HORARIO</span><strong>2:00 PM – 3:30 PM</strong></div><div><Icon name="user" size={21} /><span>TE ACOMPAÑA</span><strong>María López</strong></div><div><Icon name="location" size={21} /><span>LUGAR</span><strong>Meyer Spa · Sede principal</strong></div></div><div className="detail-divider"/><h3>Antes de tu visita</h3><p>Te recomendamos llegar 10 minutos antes, venir con el rostro limpio y contarnos si tienes alguna sensibilidad en la piel.</p><div className="appointment-actions"><button className="button button-dark" onClick={() => { setPage("procedimientos"); setDetail("procedure"); }}>Ver procedimiento <Icon name="arrow" size={17} /></button>{!cancelled && <button className="button button-outline" onClick={() => setConfirmCancel(true)}>Cancelar cita</button>}</div></div><div className="side-note"><div className="side-note-icon"><Icon name="heart" size={24} /></div><h3>Estamos esperando por ti.</h3><p>Si tienes preguntas antes de tu visita, nuestro equipo estará feliz de ayudarte.</p></div></div></>;
    return <>{pageIntro("PROCEDIMIENTOS / DETALLE", "Limpieza facial profunda", "Conoce tu tratamiento y acompaña cada etapa de tu proceso.")}<div className="detail-layout"><div className="procedure-primary"><div className="surface detail-panel"><div className="eyebrow">SOBRE TU TRATAMIENTO</div><h2>Un nuevo comienzo para tu piel</h2><p>Este procedimiento realiza una limpieza profunda para retirar impurezas, descongestionar los poros e hidratar la piel. Adaptamos cada paso a tus necesidades para lograr un resultado fresco y luminoso.</p><div className="detail-divider" /><div className="info-columns"><div><div className="detail-icon"><Icon name="sparkle" size={20} /></div><h3>Productos utilizados</h3><ul><li>Limpiador facial suave</li><li>Exfoliante enzimático</li><li>Mascarilla hidratante</li><li>Protector solar SPF 50</li></ul></div><div><div className="detail-icon"><Icon name="heart" size={20} /></div><h3>Recomendaciones</h3><ul><li>Evita la exposición directa al sol durante 24 horas.</li><li>Hidrata tu piel y usa protección solar.</li><li>Evita exfoliantes fuertes por 48 horas.</li></ul></div></div></div><div className="surface detail-panel"><div className="eyebrow">TU TRANQUILIDAD PRIMERO</div><h2>Autorización y firmas</h2><p>Confirma que conoces el procedimiento y las recomendaciones para continuar con tu experiencia.</p><label className="consent"><input type="checkbox" checked={authorized} onChange={event => setAuthorized(event.target.checked)} /><span>He leído y comprendido la descripción del procedimiento, sus productos y recomendaciones. Autorizo su realización.</span></label><div className="signature-grid"><SignaturePad label="Firma del auxiliar" onChange={setAssistantSigned} /><SignaturePad label="Firma del cliente" onChange={setClientSigned} /></div><div className="signature-actions"><span>{procedureConfirmed ? <><Icon name="check" size={17} /> Autorización registrada</> : "Ambas firmas y la autorización son necesarias para confirmar."}</span><button className="button button-dark" disabled={!authorized || !clientSigned || !assistantSigned || procedureConfirmed || cancelled} onClick={() => { setProcedureConfirmed(true); notify("Procedimiento autorizado correctamente."); }}>Confirmar autorización <Icon name="arrow" size={17} /></button></div></div></div><aside className="procedure-side"><div className="surface timeline-card"><div className="eyebrow">TU PROCESO</div><h2>Seguimiento</h2>{timeline(true)}</div></aside></div></>;
  }

  if (loggedOut) return <div className="signed-out"><div className="signed-out-card"><div className="brand-symbol"><Icon name="sparkle" size={28} strokeWidth={1.2} /></div><div className="brand-name">MEYER <span>SPA</span></div><div className="eyebrow">TU ESPACIO DE BIENESTAR</div><h1>Nos vemos pronto, {firstName}.</h1><p>Tu espacio de autocuidado siempre estará aquí para ti.</p><button className="button button-dark" onClick={() => { setLoggedOut(false); navigate("inicio"); }}>Volver al panel <Icon name="arrow" size={17} /></button></div></div>;

  return <div className={`app-shell ${mobileLanding ? "show-mobile-landing" : ""}`}><section className="mobile-menu-screen" aria-label="Menú del panel de cliente"><header className="mobile-client-header"><button onClick={() => navigate("perfil")} aria-label={`Abrir el perfil de ${firstName} R.`}><span className="mobile-client-avatar">{firstName[0]}R</span><span><small>MI CUENTA</small><strong>{firstName} R.</strong></span><Icon name="chevron" size={18} /></button></header><nav className="mobile-main-menu" aria-label="Menú principal">{navigation.map(item => <button key={item.page} className={page === item.page ? "active" : ""} onClick={() => navigate(item.page)}><span className="mobile-menu-icon"><Icon name={item.icon} size={21} /></span><span>{item.label}</span><Icon name="chevron" size={18} className="mobile-menu-chevron" /></button>)}</nav></section><aside className={`sidebar ${mobileMenu ? "open" : ""}`}><div className="sidebar-brand"><div className="brand-symbol"><Icon name="sparkle" size={24} strokeWidth={1.25} /></div><div><div className="brand-name">MEYER <span>SPA</span></div><div className="brand-caption">PANEL CLIENTE & COMUNIDAD</div></div><button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Cerrar menú"><Icon name="close" /></button></div><button className="sidebar-profile" onClick={() => navigate("perfil")} aria-label={`Abrir el perfil de ${firstName} R.`}><span className="avatar">{firstName[0]}R</span><span className="sidebar-profile-copy"><strong>{firstName} R.</strong><span>Cliente Meyer Spa</span></span><Icon name="chevron" size={17} /></button><div className="nav-label">MENÚ PRINCIPAL</div><nav className="side-nav" aria-label="Navegación principal">{navigation.map(item => <button key={item.page} className={page === item.page ? "active" : ""} onClick={() => navigate(item.page)}><Icon name={item.icon} size={19} /><span>{item.label}</span>{page === item.page && <span className="active-indicator" />}</button>)}</nav><div className="sidebar-bottom"><div className="sidebar-quote"><Icon name="sparkle" size={20} /><p>Un momento para ti puede cambiarlo todo.</p><span>MEYER SPA</span></div><button className="logout-button" onClick={() => setLoggedOut(true)}><Icon name="logout" size={19} /> Cerrar sesión</button></div></aside>{mobileMenu && <button className="mobile-overlay" aria-label="Cerrar menú" onClick={() => setMobileMenu(false)} />}<div className="main-area"><header className="topbar"><div className="topbar-left"><button className="menu-toggle" onClick={() => setMobileLanding(true)} aria-label="Abrir menú"><Icon name="menu" /></button><span className="breadcrumb-root">Panel cliente</span><Icon name="chevron" size={15} className="breadcrumb-chevron" /><span className="breadcrumb-current">{detail ? "Detalle" : navigation.find(item => item.page === page)?.label || (page === "perfil" ? "Mi perfil" : "Notificaciones")}</span></div><div className="topbar-right"><span className="topbar-greeting">Tu bienestar comienza aquí</span><span className="topbar-divider"/><button className="topbar-notification" onClick={() => navigate("notificaciones")} aria-label={`Notificaciones: ${unread} sin leer`}><Icon name="bell" size={20} />{unread > 0 && <span />}</button><button className="topbar-avatar avatar small" onClick={() => navigate("perfil")} aria-label="Ir a mi perfil">{firstName[0]}R</button></div></header><main className="main-content">{detail ? <><button className="back-link" onClick={() => setDetail(null)}><Icon name="arrow" size={17} /> Volver a {page === "promociones" ? "promociones" : page === "citas" ? "mi horario" : "procedimientos"}</button>{renderDetail()}</> : page === "inicio" ? renderHome() : page === "citas" ? renderAppointments() : page === "promociones" ? renderPromotions() : page === "procedimientos" ? renderProcedures() : page === "comunidad" ? renderCommunity() : page === "perfil" ? renderProfile() : renderNotifications()}<footer className="footer">© 2025 Meyer Spa <span>Hecho para acompañarte en tu bienestar.</span></footer></main></div>{toast && <div className="toast" role="status"><Icon name="check" size={17} />{toast}<button onClick={() => setToast("")} aria-label="Cerrar aviso"><Icon name="close" size={16} /></button></div>}{confirmCancel && <div className="modal-overlay" onClick={() => setConfirmCancel(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title" onClick={event => event.stopPropagation()}><div className="modal-icon"><Icon name="calendar" size={25} /></div><h2 id="cancel-title">¿Cancelar tu cita?</h2><p>Tu cita de limpieza facial del 25 de septiembre a las 2:00 PM quedará cancelada. Puedes volver a agendar cuando quieras.</p><div className="modal-actions"><button className="button button-outline" onClick={() => setConfirmCancel(false)}>Conservar cita</button><button className="button button-dark" onClick={() => { setCancelled(true); setConfirmCancel(false); notify("Tu cita fue cancelada."); }}>Sí, cancelar cita</button></div></div></div>}</div>;
}
