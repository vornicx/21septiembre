import { useRef, useState } from 'react';
import FlowerUniverse from './FlowerUniverse';
import { ArrowDown, ArrowUp, Heart, Sparkles } from 'lucide-react';

function Bouquet() {
  return <img className="bouquet bouquet-artwork" src="/art/yellow-bouquet.webp" alt="Ramo de peonías y rosas amarillas con hojas verdes y un lazo dorado" width="1024" height="1536" fetchPriority="high" />;
}
export default function App() {
  const [opened,setOpened]=useState(false);
  const [universe,setUniverse]=useState(false);
  const letter=useRef<HTMLElement>(null);
  function openLetter(){setOpened(true);requestAnimationFrame(()=>letter.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'}));}
  return <main id="inicio">
    <header className="masthead"><a href="#inicio" aria-label="Volver al inicio">21<span> / </span>09</a><span>PARA TI, HARIDIAN</span><Heart size={16} aria-hidden="true"/></header>
    <section className="hero" aria-labelledby="title">
      <div className="hero-copy"><p className="eyebrow"><span/>21 DE SEPTIEMBRE</p><h1 id="title">Hoy, tus flores<br/>amarillas<br/><em>van por aquí.</em></h1><p className="intro">No puedo dártelas en persona hoy.<br/>Pero no quería dejarte sin ellas.</p><button className="note-button" onClick={openLetter} aria-expanded={opened} aria-controls="nota">Tengo algo para ti <ArrowDown size={16}/></button></div>
      <figure className="flower-art"><div className="halo"/><span className="orbit orbit-one"/><span className="orbit orbit-two"/><Bouquet/><figcaption>Hay detalles que también cruzan la distancia.</figcaption></figure>
      <div className="hero-bottom"><span>PARA SACARTE UNA SONRISA</span><span>Con cariño, desde aquí <span className="little-star">✳</span></span></div>
    </section>
    <section className={`letter-section ${opened?'is-open':''}`} id="nota" ref={letter} aria-labelledby="letter-title">
      <span className="letter-flower" aria-hidden="true">✳</span><p className="eyebrow">HARIDIAN, ESTO ES PARA TI</p><h2 id="letter-title">Me habría gustado<br/>llevarte <em>flores de verdad.</em></h2><p>Hoy no puedo, así que he hecho este pequeño detalle para ti. Para que, aunque sea a través de una pantalla, tengas tus flores amarillas.</p><p>Ojalá te saque una sonrisa.<br/>Eso es lo que quería regalarte hoy.</p><p className="love-note">Te quiero, Haridian.</p><div className="signature">Con todo mi cariño,<span>Vadim</span></div><Heart size={19} className="letter-heart" aria-hidden="true"/>
    </section>
    <section className="universe-invitation" aria-labelledby="invitation-title"><Sparkles size={22} aria-hidden="true"/><p className="eyebrow">Y UNA COSA MÁS…</p><h2 id="invitation-title">Un ramo se me<br/>quedaba <em>pequeño.</em></h2><p>Así que también hay un campo entero para ti.</p><button className="note-button universe-button" onClick={()=>setUniverse(true)} aria-haspopup="dialog">Entrar en tu universo de flores <Sparkles size={16}/></button></section>
    {universe && <FlowerUniverse onClose={()=>setUniverse(false)}/>}
    <footer><span>FELIZ 21 DE SEPTIEMBRE <span className="footer-heart">♡</span></span><a href="#inicio">Volver a las flores <ArrowUp size={14}/></a></footer>
  </main>;
}
