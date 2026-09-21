import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Heart } from 'lucide-react';

function Bouquet() {
  const flowers = [{x:172,y:235,s:.84,r:-22},{x:330,y:198,s:.9,r:18},{x:224,y:128,s:.86,r:-12},{x:395,y:296,s:.76,r:32},{x:115,y:340,s:.72,r:-30},{x:275,y:305,s:1.08,r:8},{x:355,y:96,s:.58,r:20}];
  return <svg className="bouquet" viewBox="0 0 520 650" role="img" aria-label="Un ramo ilustrado de siete flores amarillas">
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
    {flowers.map((f,i)=><g key={i} className={`bloom bloom-${i}`} style={{transformOrigin:`${f.x}px ${f.y}px`}}><g transform={`translate(${f.x} ${f.y}) rotate(${f.r}) scale(${f.s})`}>
      {Array.from({length:13},(_,j)=><path key={j} transform={`rotate(${j*360/13})`} d="M-7 -12 C-30 -37 -24 -76 -5 -84 C12 -77 23 -39 7 -12Z" fill="url(#petal)" stroke="#dfb543" strokeWidth=".6"/>)}
      {Array.from({length:10},(_,j)=><path key={j} transform={`rotate(${j*36+14}) scale(.73)`} d="M-7 -12 C-30 -37 -24 -76 -5 -84 C12 -77 23 -39 7 -12Z" fill="url(#petal)"/>)}
      <circle r="23" fill="url(#center)"/>
      {Array.from({length:37},(_,j)=>{const a=j*2.4,r=Math.sqrt(j)*3;return <circle key={j} cx={Math.cos(a)*r} cy={Math.sin(a)*r} r="1.25" fill="#c6a15b" opacity=".65"/>})}
    </g></g>)}
    <g fill="none" stroke="#c6aa77" strokeWidth="3"><path d="M245 539 Q265 548 289 538 M246 545 Q265 554 287 544"/><path d="M266 546 C219 503 209 551 266 546 C317 511 321 553 266 546 M266 547 Q247 565 240 583 M268 547 Q286 568 293 573"/></g>
  </svg>;
}
export default function App() {
  const [opened,setOpened]=useState(false);
  const letter=useRef<HTMLElement>(null);
  function openLetter(){setOpened(true);requestAnimationFrame(()=>letter.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'}));}
  return <main id="inicio">
    <header className="masthead"><a href="#inicio" aria-label="Volver al inicio">21<span> / </span>09</a><span>UN DETALLE PARA TI</span><Heart size={16} aria-hidden="true"/></header>
    <section className="hero" aria-labelledby="title">
      <div className="hero-copy"><p className="eyebrow"><span/>21 DE SEPTIEMBRE</p><h1 id="title">Hoy, tus flores<br/>amarillas<br/><em>van por aquí.</em></h1><p className="intro">No puedo dártelas en persona hoy.<br/>Pero no quería dejarte sin ellas.</p><button className="note-button" onClick={openLetter} aria-expanded={opened} aria-controls="nota">Tengo algo para ti <ArrowDown size={16}/></button></div>
      <figure className="flower-art"><div className="halo"/><span className="orbit orbit-one"/><span className="orbit orbit-two"/><Bouquet/><figcaption>Hay detalles que también cruzan la distancia.</figcaption></figure>
      <div className="hero-bottom"><span>PARA SACARTE UNA SONRISA</span><span>Con cariño, desde aquí <span className="little-star">✳</span></span></div>
    </section>
    <section className={`letter-section ${opened?'is-open':''}`} id="nota" ref={letter} aria-labelledby="letter-title">
      <span className="letter-flower" aria-hidden="true">✳</span><p className="eyebrow">UNA NOTA PARA TI</p><h2 id="letter-title">Me habría gustado<br/>llevarte <em>flores de verdad.</em></h2><p>Hoy no puedo, así que he hecho este pequeño rincón para ti. Para que, aunque sea a través de una pantalla, tengas tus flores amarillas.</p><p>Ojalá te saque una sonrisa.<br/>Eso es lo que quería regalarte hoy.</p><div className="signature">Con cariño,<span>Vadim</span></div><Heart size={19} className="letter-heart" aria-hidden="true"/>
    </section>
    <footer><span>FELIZ 21 DE SEPTIEMBRE <span className="footer-heart">♡</span></span><a href="#inicio">Volver a las flores <ArrowUp size={14}/></a></footer>
  </main>;
}
