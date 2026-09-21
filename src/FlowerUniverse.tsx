import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play } from 'lucide-react';

export default function FlowerUniverse({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);

  return <dialog className={`universe-dialog landscape-universe ${paused ? 'is-paused' : ''}`} ref={dialog} onCancel={onClose} aria-labelledby="universe-title">
    <img className="rose-landscape" src="/art/rose-field.webp" alt="Un campo de rosas amarillas al atardecer, con un sendero entre rosales que se pierde en el horizonte" width="1536" height="1024" />
    <div className="landscape-light" aria-hidden="true"/>
    <div className="golden-motes" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,top:`${30+(i*19)%65}%`,animationDelay:`${-i*1.7}s`}}/>)}</div>
    <div className="universe-shade"/>
    <nav className="universe-controls" aria-label="Controles del campo"><button onClick={onClose}><ArrowLeft size={16}/> Volver a tu nota</button><button onClick={()=>setPaused(p=>!p)} aria-label={paused?'Animar el campo':'Pausar el movimiento'}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></nav>
    <div className="universe-dedication"><p>UN UNIVERSO DE FLORES, SOLO PARA TI</p><h2 id="universe-title">Haridian,<br/><em>te quiero.</em></h2><span>Si pudiera, te regalaría un campo entero.</span></div>
    <p className="universe-footnote">Todas estas flores son para ti. <span>♡</span></p>
  </dialog>;
}
