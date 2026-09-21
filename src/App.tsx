import { useRef, useState } from 'react';
import FlowerUniverse from './FlowerUniverse';
import { flowerKinds, flowerShape } from './flowers';
import { ArrowDown, ArrowUp, Heart, Sparkles } from 'lucide-react';

function Bouquet() {
  const flowers = [{x:172,y:235,s:.84,r:-22},{x:330,y:198,s:.9,r:18},{x:224,y:128,s:.86,r:-12},{x:395,y:296,s:.76,r:32},{x:115,y:340,s:.72,r:-30},{x:275,y:305,s:1.08,r:8},{x:355,y:96,s:.58,r:20}];
  return <svg className="bouquet" viewBox="0 0 520 650" role="img" aria-label="Un ramo de margaritas, tulipanes, amapolas y girasoles amarillos">
    <defs>
      <linearGradient id="petal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff2a2"/><stop offset=".5" stopColor="#efc64b"/><stop offset="1" stopColor="#b9821f"/></linearGradient>
      <radialGradient id="center"><stop stopColor="#6b4927"/><stop offset=".8" stopColor="#392a1c"/><stop offset="1" stopColor="#9a7133"/></radialGradient>
      <linearGradient id="leaf"><stop stopColor="#737950"/><stop offset="1" stopColor="#303c2e"/></linearGradient>
    </defs>
    <g fill="none" stroke="#72754a" strokeWidth="3">
      {flowers.map((f,i)=><path key={i} d={`M ${f.x} ${f.y} Q ${f.x-20} 425 267 602`}/>)}
    </g>
    <g fill="url(#leaf)" stroke="#7b8153" strokeWidth=".6">
      <path d="M242 502 Q138 487 145 414 Q229 419 242 502Z"/><path d="M282 467 Q288 395 353 393 Q351 451 282 467Z"/>
      <path d="M215 424 Q135 406 154 361 Q212 362 215 424Z"/><path d="M268 554 Q307 482 362 501 Q332 549 268 554Z"/>
      <path d="M203 338 Q173 265 127 280 Q136 327 203 338Z"/><path d="M310 333 Q355 256 384 274 Q383 321 310 333Z"/>
    </g>
    {flowers.map((f,i)=>{const kind=flowerKinds[i%flowerKinds.length];const shape=flowerShape(kind);return <g key={i} className={`bloom bloom-${i}`} style={{transformOrigin:`${f.x}px ${f.y}px`}}><g transform={`translate(${f.x} ${f.y}) rotate(${f.r}) scale(${f.s*1.18})`}>
      {Array.from({length:shape.petals},(_,j)=><path key={j} transform={`rotate(${j*360/shape.petals})`} d={shape.path} fill="url(#petal)" stroke="#d9ad35" strokeWidth=".7"/>)}
      {kind==='tulip' && <><path d="M0 34 Q-20 -1 -16 -29 M0 34 Q20 -1 17 -29" stroke="#c99927" strokeWidth="1.5" fill="none"/><path d="M-5 24 Q-12 0 -7 -16" stroke="#fff1a0" strokeWidth="2" fill="none" opacity=".6"/></>}
      {shape.center>0 && <circle r={shape.center} fill={kind==='sunflower'?'url(#center)':shape.color}/>}
      {Array.from({length:kind==='sunflower'?37:kind==='tulip'?0:18},(_,j)=>{const a=j*2.4,r=Math.sqrt(j)*(kind==='sunflower'?2.6:1.6);return <circle key={j} cx={Math.cos(a)*r} cy={Math.sin(a)*r} r=".9" fill="#f2cb65" opacity=".7"/>})}
    </g></g>})}
    <g fill="none" stroke="#c6aa77" strokeWidth="3"><path d="M245 539 Q265 548 289 538 M246 545 Q265 554 287 544"/><path d="M266 546 C219 503 209 551 266 546 C317 511 321 553 266 546 M266 547 Q247 565 240 583 M268 547 Q286 568 293 573"/></g>
  </svg>;
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
