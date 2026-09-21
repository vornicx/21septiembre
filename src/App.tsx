import { useEffect, useRef, useState } from 'react';
import FlowerUniverse from './FlowerUniverse';
import { ArrowDown, ArrowUp, ArrowUpRight, Heart } from 'lucide-react';

export default function App() {
  const [universe,setUniverse]=useState(false);
  const page=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}),{threshold:.12});
    page.current?.querySelectorAll('[data-reveal]').forEach(el=>{el.classList.add('will-reveal');observer.observe(el);});
    return()=>observer.disconnect();
  },[]);
  return <main id="inicio" ref={page}>
    <section className="love-hero" aria-labelledby="title">
      <img className="hero-landscape" src="/art/rose-field.webp" alt="Un horizonte de rosas amarillas bajo la luz del atardecer" width="1536" height="1024" fetchPriority="high"/>
      <div className="hero-shade"/>
      <header className="masthead"><span>21 / 09</span><span>PARA HARIDIAN, CON AMOR</span><Heart size={17} aria-hidden="true"/></header>
      <div className="hero-poem"><p className="small-label">ESTE 21 DE SEPTIEMBRE</p><h1 id="title">Si el amor<br/>fuera una flor,<br/><em>sería para ti.</em></h1><p className="hero-note">Hoy no puedo llevarte flores.<br/>Pero puedo hacer que florezcan para ti.</p><a className="read-dedication" href="#dedicatoria">Esto es para ti, Haridian <ArrowDown size={16}/></a></div>
      <div className="hero-end"><span>UNAS FLORES. UN TE QUIERO. TÚ.</span><span>De Vadim, para ti.</span></div>
    </section>

    <section className="meaning-section" aria-labelledby="meaning-title">
      <div className="date-emblem" aria-hidden="true"><span>21</span><small>SEPTIEMBRE</small></div>
      <div data-reveal><p className="small-label">LO QUE QUIERO DECIRTE CON ESTAS FLORES</p><h2 id="meaning-title">Qué bonito que exista<br/>un día para regalar <em>luz.</em></h2><div className="meaning-copy"><p>Hoy quiero que estas flores amarillas te digan algo muy sencillo: pienso en ti. Me importas. Y me hace ilusión hacer algo bonito para ti.</p><p>Para mí, ese es el sentido de este 21 de septiembre. Encontrar una forma de acercarme a ti, incluso cuando no puedo estar a tu lado.</p></div><span className="fine-line"/></div>
    </section>

    <section className="dedication-section" id="dedicatoria" aria-labelledby="letter-title">
      <figure className="bouquet-scene" data-reveal><img className="bouquet-artwork" src="/art/yellow-bouquet.webp" alt="Peonías y rosas amarillas, un ramo dedicado a Haridian" width="1024" height="1536" loading="lazy"/><figcaption>Las flores que hoy quería llevarte.</figcaption></figure>
      <article className="love-letter" data-reveal><p className="small-label">PARA TI, HARIDIAN</p><h2 id="letter-title">Hay mil maneras<br/>de decir <em>te quiero.</em></h2><div className="letter-body"><p>Haridian,</p><p>Me habría encantado darte estas flores en persona. Ver tu cara al recibirlas. Y decirte, cerquita, lo mucho que te quiero.</p><p>Como hoy no puedo hacerlo, he preparado este detalle. He buscado otra manera de llevarte un poquito de esa alegría, de hacerte sentir querida y de estar presente en tu día.</p><p>Porque el amor también está en eso: en pensar en alguien y tener ganas de hacerle sonreír. En dedicarle tiempo. En cuidar los pequeños gestos.</p><p>Estas flores son mi forma de decirte que hoy estoy pensando en ti.</p></div><p className="handwritten">Te quiero, Haridian.</p><div className="signature">Con todo mi cariño,<span>Vadim</span></div></article>
    </section>

    <section className="love-ode" aria-labelledby="ode-title"><span className="ode-rule"/><div data-reveal><Heart size={22} strokeWidth={1} aria-hidden="true"/><p className="small-label">A LO BONITO DE QUERER</p><h2 id="ode-title">Que nunca nos falten<br/>las ganas de hacer<br/><em>algo bonito por amor.</em></h2><p>Ni un día señalado para demostrarlo.<br/>Ni una forma de decirlo, aunque sea desde lejos.</p></div><span className="ode-rule"/></section>

    <section className="garden-invitation" aria-labelledby="garden-title"><img src="/art/rose-field.webp" alt="" width="1536" height="1024" loading="lazy"/><div className="garden-invitation-shade"/><div className="garden-invitation-copy" data-reveal><p className="small-label">Y SI UN RAMO NO FUERA SUFICIENTE…</p><h2 id="garden-title">Que el mundo<br/>florezca <em>para ti.</em></h2><p>He imaginado un lugar lleno de rosas amarillas.<br/>Y todas, absolutamente todas, son para ti.</p><button className="garden-enter" onClick={()=>setUniverse(true)} aria-haspopup="dialog">Entrar en tu jardín <ArrowUpRight size={18}/></button></div></section>
    <footer><div><p>Feliz 21 de septiembre, Haridian.</p><span>Estas flores son para hoy. Mi te quiero, también para mañana.</span></div><a href="#inicio" aria-label="Volver al principio"><ArrowUp size={18}/></a></footer>
    {universe&&<FlowerUniverse onClose={()=>setUniverse(false)}/>}
  </main>;
}
