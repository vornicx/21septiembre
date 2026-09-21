import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, Heart, Music2, Pause, Play, RotateCcw, Sparkles, X } from "lucide-react";
import { siteContent, type Memory } from "./data";

type Point = { x: number; y: number; z: number; size: number; alpha: number; phase: number };

const GOLD = { r: 255, g: 205, b: 74 };

function usePointerGlow() {
  useEffect(() => {
    const root = document.documentElement;
    const move = (event: PointerEvent) => {
      root.style.setProperty("--mx", `${event.clientX}px`);
      root.style.setProperty("--my", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
}

function AmbientCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const move = (e: PointerEvent) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div className="ambient-cursor" ref={ref} aria-hidden="true" />;
}

function HeartCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useMemo<Point[]>(() => {
    const total = 1150;
    return Array.from({ length: total }, (_, index) => {
      const t = (index / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.045;
      const shell = 0.72 + Math.random() * 0.32;
      const x = 16 * Math.pow(Math.sin(t), 3) * shell;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * shell;
      return {
        x,
        y: -y,
        z: (Math.random() - 0.5) * 9,
        size: 0.45 + Math.random() * 1.75,
        alpha: 0.28 + Math.random() * 0.72,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf = 0;
    let pointerX = 0;
    let pointerY = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const draw = () => {
      frame += 0.012;
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width, height) * (width < 600 ? 0.0168 : 0.0205);
      const cx = width / 2 + pointerX * 8;
      const cy = height * 0.47 + pointerY * 7;
      const breath = 1 + Math.sin(frame * 1.35) * 0.025;

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.42);
      glow.addColorStop(0, "rgba(255,199,51,.12)");
      glow.addColorStop(0.42, "rgba(255,182,16,.035)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (const point of points) {
        const wobble = Math.sin(frame * 1.7 + point.phase) * 0.12;
        const depth = 1 + point.z * 0.014;
        const px = cx + point.x * scale * breath * depth + pointerX * point.z * 0.9;
        const py = cy + point.y * scale * breath * depth + pointerY * point.z * 0.6 + wobble;
        const twinkle = 0.66 + Math.sin(frame * 2.2 + point.phase) * 0.34;
        const radius = point.size * (0.74 + depth * 0.25);

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${point.alpha * twinkle})`;
        ctx.shadowColor = "rgba(255,195,42,.75)";
        ctx.shadowBlur = radius * 4.5;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [points]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}

function GalaxyCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const points = useMemo<Point[]>(() => {
    const total = 1500;
    const arms = 5;
    return Array.from({ length: total }, (_, i) => {
      const radius = Math.pow(Math.random(), 0.58) * 18;
      const arm = i % arms;
      const angle = arm * ((Math.PI * 2) / arms) + radius * 0.58 + (Math.random() - 0.5) * 0.7;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.43,
        z: (Math.random() - 0.5) * 8,
        size: Math.random() * 1.5 + 0.25,
        alpha: Math.random() * 0.8 + 0.2,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let t = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      t += 0.0024;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.027;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t);
      for (const p of points) {
        const px = p.x * scale;
        const py = p.y * scale;
        const pulse = 0.65 + Math.sin(t * 140 + p.phase) * 0.35;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,205,90,${p.alpha * pulse})`;
        ctx.fill();
      }
      ctx.restore();

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.2);
      core.addColorStop(0, "rgba(255,239,187,.38)");
      core.addColorStop(0.12, "rgba(255,198,54,.2)");
      core.addColorStop(1, "rgba(255,166,0,0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, width, height);
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [points]);

  return <canvas className="galaxy-canvas" ref={ref} aria-hidden="true" />;
}

function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.035 }}
      transition={{ duration: 1.2, ease: [0.7, 0, 0.2, 1] }}
    >
      <div className="intro-aura" />
      <motion.div
        className="intro-orb"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 0.88, 1], opacity: [0, 1, 0.8, 1] }}
        transition={{ duration: 2.7, times: [0, 0.35, 0.7, 1] }}
      >
        <div className="intro-orb-core" />
      </motion.div>
      <motion.p
        className="intro-kicker"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        21 · 09
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 1 }}
      >
        {siteContent.intro}
      </motion.h1>
      <motion.button
        className="enter-button"
        type="button"
        onClick={onEnter}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.15, duration: 0.8 }}
        whileHover={{ scale: 1.035 }}
        whileTap={{ scale: 0.98 }}
      >
        Entrar <Sparkles size={15} strokeWidth={1.6} />
      </motion.button>
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="section-label"><span />{children}</div>;
}

function MemoryModal({ memory, onClose }: { memory: Memory | null; onClose: () => void }) {
  useEffect(() => {
    if (!memory) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [memory, onClose]);

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            className="memory-modal"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="Cerrar">
              <X size={20} />
            </button>
            <div className="modal-media">
              {memory.image ? <img src={memory.image} alt="" /> : <div className="media-placeholder"><span>{memory.id}</span></div>}
            </div>
            <div className="modal-copy">
              <span>{memory.eyebrow}</span>
              <h3>{memory.title}</h3>
              <em>{memory.date}</em>
              <p>{memory.text}</p>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Sunflower({ index, text, onOpen }: { index: number; text: string; onOpen: () => void }) {
  const petals = Array.from({ length: 18 });
  return (
    <button
      className="sunflower"
      style={{ "--delay": `${(index % 6) * -0.7}s` } as CSSProperties}
      onClick={onOpen}
      aria-label={text}
    >
      <span className="sunflower-glow" />
      <span className="petal-ring">
        {petals.map((_, i) => (
          <span className="petal" key={i} style={{ "--r": `${i * 20}deg` } as CSSProperties} />
        ))}
        <span className="flower-core" />
      </span>
      <span className="flower-stem" />
      <span className="flower-number">{String(index + 1).padStart(2, "0")}</span>
    </button>
  );
}

const constellationPoints = [
  [11, 56], [27, 28], [42, 66], [56, 37], [70, 59], [84, 27], [91, 71]
];

function App() {
  const reducedMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  usePointerGlow();

  const toggleAudio = useCallback(() => {
    if (!audioRef.current || !siteContent.audioUrl) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => setAudioPlaying(false));
    }
  }, [audioPlaying]);

  const replay = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <main className={entered ? "site entered" : "site"}>
      <AnimatePresence>{!entered && <Intro onEnter={() => setEntered(true)} />}</AnimatePresence>

      <motion.div className="progress-line" style={{ scaleX: progress }} />
      <AmbientCursor />

      {siteContent.audioUrl && (
        <>
          <audio ref={audioRef} src={siteContent.audioUrl} loop preload="metadata" />
          <button className="sound-toggle" onClick={toggleAudio} aria-label={audioPlaying ? "Pausar música" : "Reproducir música"}>
            {audioPlaying ? <Pause size={16} /> : <Music2 size={16} />}
          </button>
        </>
      )}

      <section className="hero">
        <div className="hero-stars" />
        <HeartCanvas />
        <div className="hero-vignette" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.65, duration: 1.3 }}
        >
          <span className="hero-overline">UN UNIVERSO PARA TI</span>
          <h1>{siteContent.heroTitle}</h1>
          <p>{siteContent.heroSubtitle}</p>
        </motion.div>
        <motion.div
          className="scroll-cue"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>{siteContent.heroHint}</span>
          <ArrowDown size={16} />
        </motion.div>
      </section>

      <section className="universe shell">
        <div className="section-intro">
          <SectionLabel>01 — NUESTRO UNIVERSO</SectionLabel>
          <h2>Hay recuerdos que<br />se quedan <i>orbitando.</i></h2>
          <p>No los ordenaría por importancia. Solo dejaría que aparecieran, uno a uno, como lo hacen cuando pienso en ti.</p>
        </div>

        <div className="memory-orbit">
          {siteContent.memories.map((memory, index) => (
            <motion.button
              key={memory.id}
              className={`memory-card memory-card-${index + 1}`}
              onClick={() => setSelectedMemory(memory)}
              initial={{ opacity: 0, y: 70, rotate: index % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: index * 0.06 }}
              whileHover={{ y: -8, rotate: index % 2 ? -0.6 : 0.6 }}
            >
              <span className="memory-index">{memory.id}</span>
              <div className="memory-image">
                {memory.image ? <img src={memory.image} alt="" /> : <div className="memory-placeholder"><Sparkles size={24} /></div>}
              </div>
              <div className="memory-meta">
                <span>{memory.eyebrow}</span>
                <h3>{memory.title}</h3>
                <p>{memory.date}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="garden">
        <div className="garden-haze" />
        <div className="shell garden-inner">
          <SectionLabel>02 — PEQUEÑAS RAZONES</SectionLabel>
          <div className="garden-heading">
            <h2>{siteContent.reasonsTitle}</h2>
            <p>{siteContent.reasonsSubtitle}<br />Toca una flor.</p>
          </div>
          <div className="flower-field">
            {siteContent.reasons.map((reason, index) => (
              <Sunflower key={reason} index={index} text={reason} onOpen={() => setSelectedReason(reason)} />
            ))}
          </div>
        </div>
      </section>

      <section className="constellation shell">
        <div className="constellation-copy">
          <SectionLabel>03 — NUESTROS MOMENTOS</SectionLabel>
          <h2>Si pudiera guardar<br />cada momento<br /><i>en el cielo.</i></h2>
          <p>Tocaría cada estrella solo para volver a ese instante.</p>
        </div>
        <div className="constellation-map">
          <svg viewBox="0 0 100 100" role="img" aria-label="Constelación interactiva de recuerdos">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.1" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="lineFade" x1="0" x2="1">
                <stop offset="0%" stopColor="#7c6227" stopOpacity=".15" />
                <stop offset="45%" stopColor="#f5c952" stopOpacity=".72" />
                <stop offset="100%" stopColor="#7c6227" stopOpacity=".15" />
              </linearGradient>
            </defs>
            {constellationPoints.slice(0, -1).map((point, index) => {
              const next = constellationPoints[index + 1];
              return <line key={index} x1={point[0]} y1={point[1]} x2={next[0]} y2={next[1]} stroke="url(#lineFade)" strokeWidth=".22" />;
            })}
            {constellationPoints.map((point, index) => (
              <g key={index} className="star-node" onClick={() => setSelectedStar(index)} role="button" tabIndex={0}>
                <circle cx={point[0]} cy={point[1]} r="4.8" fill="transparent" />
                <circle cx={point[0]} cy={point[1]} r=".72" fill="#ffe8a0" filter="url(#glow)" />
                <circle className="star-pulse" cx={point[0]} cy={point[1]} r="1.8" fill="none" stroke="#d9ad40" strokeWidth=".18" />
              </g>
            ))}
          </svg>
          <AnimatePresence mode="wait">
            {selectedStar !== null && (
              <motion.div
                className="star-caption"
                key={selectedStar}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <span>ESTRELLA {String(selectedStar + 1).padStart(2, "0")}</span>
                <strong>{siteContent.constellation[selectedStar]}</strong>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="gallery">
        <div className="shell gallery-header">
          <SectionLabel>04 — QUEDARME AQUÍ</SectionLabel>
          <h2>Algunos lugares cambian<br />cuando estás tú.</h2>
        </div>
        <div className="gallery-stream">
          {siteContent.gallery.map((item, index) => (
            <motion.article
              className={`gallery-frame frame-${index + 1}`}
              key={item.id}
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.05 }}
            >
              <div className="gallery-visual">
                {item.image ? <img src={item.image} alt="" /> : <div className="gallery-placeholder"><span>{String(index + 1).padStart(2, "0")}</span></div>}
                <div className="gallery-shade" />
                <div className="gallery-word">{item.word}</div>
              </div>
              <p>{item.caption}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="wow">
        <GalaxyCanvas />
        <div className="wow-vignette" />
        <motion.p
          className="wow-prelude"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4 }}
        >
          {siteContent.wowPrelude}
        </motion.p>
        <motion.div
          className="wow-name"
          initial={{ opacity: 0, scale: 0.93, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.65 }}
          transition={{ duration: 1.8, delay: 0.2 }}
        >
          <span>PARA</span>
          <h2>{siteContent.recipientName}</h2>
          <p>{siteContent.wowLine}</p>
        </motion.div>
      </section>

      <section className="finale">
        <motion.div
          className="final-point"
          initial={{ scale: 7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.6 }}
        />
        <motion.div
          className="final-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.45 }}
        >
          <Heart size={18} fill="currentColor" strokeWidth={1.2} />
          <h2>{siteContent.finale}</h2>
          <p>No quiero saber cómo termina la historia. Quiero vivirla.</p>
          <button onClick={replay}>
            <RotateCcw size={15} /> Volver al principio
          </button>
        </motion.div>
        <span className="tiny-footer">HECHO PARA TI · 21.09</span>
      </section>

      <MemoryModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />

      <AnimatePresence>
        {selectedReason && (
          <motion.div
            className="reason-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReason(null)}
          >
            <motion.div
              className="reason-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 170, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sheet-handle" />
              <span className="reason-mini">UNA DE MUCHAS</span>
              <h3>{selectedReason}</h3>
              <button onClick={() => setSelectedReason(null)}>Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;