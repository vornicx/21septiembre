import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import { flowerPetals } from './flowers';

export default function FlowerUniverse({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const position = useRef({time:0,travel:0});
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    // Draw each flower once, then reuse the sprite throughout the landscape.
    const sprites = [0, 25, -20].map(rotation => {
    const sprite = document.createElement('canvas');
    sprite.width = 160; sprite.height = 240;
    const s = sprite.getContext('2d')!;
    s.strokeStyle = '#667849'; s.lineWidth = 3;
    s.beginPath(); s.moveTo(80,235); s.quadraticCurveTo(62,156,80,75); s.stroke();
    s.fillStyle = '#4c6337';
    s.beginPath(); s.moveTo(76,184); s.quadraticCurveTo(22,178,30,138); s.quadraticCurveTo(72,144,76,184); s.fill();
    s.beginPath(); s.moveTo(76,156); s.quadraticCurveTo(122,150,130,119); s.quadraticCurveTo(86,120,76,156); s.fill();
    for(const petal of flowerPetals('rose')){
      s.save();s.translate(80,70);s.rotate((petal.angle+rotation)*Math.PI/180);s.scale(petal.scale,petal.scale);
      const gold=s.createLinearGradient(0,-65,15,25);gold.addColorStop(0,petal.light);gold.addColorStop(.5,'#f3d15a');gold.addColorStop(1,petal.shade);
      s.fillStyle=gold;s.strokeStyle='#c59a32';s.lineWidth=.7;const path=new Path2D(petal.path);s.fill(path);s.stroke(path);s.restore();
    }
    return sprite;
    });
    let seed=2109;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    const flowers=Array.from({length:1000},(_,i)=>({kind:i%sprites.length,x:(random()-.5)*15,z:random()*26,size:.7+random()*.55,phase:random()*6.28}));
    let w=0,h=0,frame=0,last=0,time=position.current.time,travel=position.current.travel;
    const resize=()=>{w=el.clientWidth;h=el.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.75);el.width=Math.round(w*dpr);el.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();};
    function draw(){
      if(!ctx)return;
      const horizon=h*.47;
      const sky=ctx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#111e23');sky.addColorStop(.65,'#465047');sky.addColorStop(1,'#c1a468');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
      const sun=ctx.createRadialGradient(w*.72,horizon-26,0,w*.72,horizon-26,h*.34);sun.addColorStop(0,'#f7d89577');sun.addColorStop(.2,'#e7c37725');sun.addColorStop(1,'#e7c37700');ctx.fillStyle=sun;ctx.fillRect(0,0,w,h);
      const ground=ctx.createLinearGradient(0,horizon,0,h);ground.addColorStop(0,'#868145');ground.addColorStop(.25,'#4d5a31');ground.addColorStop(1,'#132319');ctx.fillStyle=ground;ctx.fillRect(0,horizon,w,h-horizon);
      const depth=flowers.map(f=>({...f,d:1+((f.z-travel)%26+26)%26})).sort((a,b)=>b.d-a.d);
      for(const f of depth){const scale=1/f.d;const x=w/2+f.x*w*.8*scale;const y=horizon+h*1.08*scale;const size=Math.min(w,h)*.55*scale*f.size;if(x < -size||x>w+size)continue;ctx.globalAlpha=Math.min(1,.42+scale*4);const sway=paused?0:Math.sin(time*.7+f.phase)*size*.035;ctx.drawImage(sprites[f.kind],x-size/2+sway,y-size*1.5,size,size*1.5);}
      ctx.globalAlpha=1;
      const haze=ctx.createLinearGradient(0,horizon-5,0,horizon+h*.13);haze.addColorStop(0,'#c1a46870');haze.addColorStop(1,'#c1a46800');ctx.fillStyle=haze;ctx.fillRect(0,horizon-5,w,h*.14);
      for(let i=0;i<24;i++){const x=((i*.618+Math.sin(time*.08+i)*.02)%1+1)%1*w;const y=h*(.23+((i*.137+time*.006)% .7));ctx.fillStyle=`rgba(255,224,139,${.2+Math.sin(time+i)*.13})`;ctx.beginPath();ctx.arc(x,y,i%3===0?1.7:1,0,Math.PI*2);ctx.fill();}
    }
    function tick(now:number){const dt=Math.min((now-last)/1000,.05);last=now;if(!document.hidden&&!paused){time+=dt;travel+=dt*.32;draw();}frame=requestAnimationFrame(tick);}
    const observer=new ResizeObserver(resize);observer.observe(el);resize();
    if(!paused)frame=requestAnimationFrame(tick);
    return()=>{position.current={time,travel};cancelAnimationFrame(frame);observer.disconnect();};
  }, [paused]);

  return <dialog className="universe-dialog" ref={dialog} onCancel={onClose} aria-labelledby="universe-title">
    <canvas ref={canvas} className="infinite-field" aria-label="Campo de rosas amarillas que se extiende hasta el horizonte" role="img"/>
    <div className="universe-shade"/>
    <nav className="universe-controls" aria-label="Controles del campo"><button onClick={onClose}><ArrowLeft size={16}/> Volver a tu nota</button><button onClick={()=>setPaused(p=>!p)} aria-label={paused?'Animar el campo':'Pausar el movimiento'}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></nav>
    <div className="universe-dedication"><p>UN UNIVERSO DE FLORES, SOLO PARA TI</p><h2 id="universe-title">Haridian,<br/><em>te quiero.</em></h2><span>Si pudiera, te regalaría un campo entero.</span></div>
    <p className="universe-footnote">Todas estas flores son para ti. <span>♡</span></p>
  </dialog>;
}
