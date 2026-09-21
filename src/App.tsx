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
      <div className="hero-poem"><p className="small-label">ESTE 21 DE SEPTIEMBRE</p><h1 id="title">Haridian,<br/>estas flores<br/><em>son para ti.</em></h1><p className="hero-note">Con todo lo que siento por ti.<br/>Hoy, y cada día.</p><a className="read-dedication" href="#dedicatoria">Esto es para ti, Haridian <ArrowDown size={16}/></a></div>
      <div className="hero-end"><span>UNAS FLORES. UN TE QUIERO. TÚ.</span><span>De Vadim, para ti.</span></div>
    </section>

    <section className="dedication-section" id="dedicatoria" aria-labelledby="letter-title">
      <figure className="bouquet-scene" data-reveal><img className="bouquet-artwork" src="/art/yellow-bouquet.webp" alt="Peonías y rosas amarillas, un ramo dedicado a Haridian" width="1024" height="1536" loading="lazy"/></figure>
      <article className="love-letter" data-reveal><p className="small-label">PARA TI, HARIDIAN</p><h2 id="letter-title">Hay mil maneras<br/>de decir <em>te quiero.</em></h2><div className="letter-body"><p>Haridian,</p><p>Me habría encantado darte estas flores en persona. Ver tu cara al recibirlas. Y decirte, cerquita, lo mucho que te quiero.</p><p>Hoy me quedo con las ganas de abrazarte, de darte un beso y de pasar un rato contigo sin tener que mirar la hora. De esas cosas sencillas que, cuando son contigo, significan tanto.</p><p>Me hace ilusión pensar en todo lo que nos queda por compartir. En los planes que todavía son solo ganas, en las conversaciones que se alargan y en el próximo abrazo. Sobre todo, en ese abrazo.</p><p>Estas flores amarillas van con todo mi cariño. Ojalá al verlas sonrías y sientas un poquito de lo que me pasa a mí cuando pienso en ti.</p><p>Y si hoy pudiera pedir algo, sería estar a tu lado, mirarte y decírtelo así, sin más: qué bonito es quererte.</p></div><p className="handwritten">Te quiero, Haridian.</p><div className="signature">Con todo mi cariño,<span>Vadim</span></div></article>
    </section>

    <section className="garden-invitation" aria-labelledby="garden-title"><img src="/art/roses-closeup.webp" alt="" width="1536" height="1024" loading="lazy"/><div className="garden-invitation-shade"/><div className="garden-invitation-copy" data-reveal><p className="small-label">ENTRE ROSAS AMARILLAS</p><h2 id="garden-title">Que el mundo<br/>florezca <em>para ti.</em></h2><p>Un paseo entre flores.<br/>Sin prisa, sin final.</p><button className="garden-enter" onClick={()=>setUniverse(true)} aria-haspopup="dialog">Entrar en tu jardín <ArrowUpRight size={18}/></button></div></section>
    <footer><div><p>Feliz 21 de septiembre, Haridian.</p><span>Estas flores son para hoy. Mi te quiero, también para mañana.</span></div><a href="#inicio" aria-label="Volver al principio"><ArrowUp size={18}/></a></footer>
    {universe&&<FlowerUniverse onClose={()=>setUniverse(false)}/>}
  </main>;
}
