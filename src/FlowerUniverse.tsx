import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import LivingGarden from './LivingGarden';

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
    <LivingGarden paused={paused}/>
    <div className="universe-shade"/>
    <nav className="universe-controls" aria-label="Controles del campo"><button onClick={onClose}><ArrowLeft size={16}/> Volver a la dedicatoria</button><button onClick={()=>setPaused(p=>!p)} aria-label={paused?'Animar el campo':'Pausar el movimiento'}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></nav>
    <div className="universe-dedication"><p>UN UNIVERSO DE FLORES, SOLO PARA TI</p><h2 id="universe-title">Haridian,<br/><em>te quiero.</em></h2><span>Si el amor pudiera florecer, tendría este horizonte.</span></div>
    <p className="universe-footnote"><span className="garden-hint">Mueve el ratón o desliza para mirar alrededor</span>Todas estas flores son para ti. <span>♡</span></p>
  </dialog>;
}
