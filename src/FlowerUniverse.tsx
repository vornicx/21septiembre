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
    const sprites = [0, 25, -20, 45, -40, 15].map(rotation => {
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
      s.fillStyle=gold;s.strokeStyle='#dbb548';s.lineWidth=.25;const path=new Path2D(petal.path);s.fill(path);s.stroke(path);s.restore();
    }
    return sprite;
    });
    let disposed=false;
    const plant=new Image();
    plant.onload=()=>{
      if(disposed)return;
      // Each atlas column is a different rose bush. Prepare six mirrored variants once.
      sprites.forEach((sprite,i)=>{
        const tile=plant.naturalWidth/3;
        sprite.width=224;sprite.height=400;
        const brush=sprite.getContext('2d')!;
        brush.save();brush.translate(i>=3?224:0,0);brush.scale(i>=3?-1:1,1);
        brush.drawImage(plant,(i%3)*tile,plant.naturalHeight*.14,tile,plant.naturalHeight*.75,0,0,224,400);brush.restore();
        const pixels=brush.getImageData(0,0,224,400);
        for(let y=0;y<400;y++)for(let x=0;x<224;x++){
          const j=(y*224+x)*4;const brightness=Math.max(pixels.data[j],pixels.data[j+1],pixels.data[j+2]);
          pixels.data[j+3]=Math.round(Math.max(0,Math.min(1,(brightness-7)/20))*Math.min(1,(400-y)/25)*255);
        }
        brush.putImageData(pixels,0,0);
        brush.globalCompositeOperation='source-atop';brush.fillStyle=i>=3?'rgba(35,44,18,.12)':'rgba(255,220,140,.025)';brush.fillRect(0,0,224,400);brush.globalCompositeOperation='source-over';
      });
      el.dataset.art='rose-varieties';
      draw();
    };
    plant.src='/art/rose-varieties.webp';
    let seed=2109;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    const flowers=Array.from({length:1800},(_,i)=>({kind:i%sprites.length,x:(random()<.5?-1:1)*(.30+random()*8),z:random()*26,size:.76+random()*.5,phase:random()*6.28,d:0}));
    const grasses=Array.from({length:2400},()=>({x:(random()-.5)*17,z:random()*26,height:.4+random()*.8,shade:Math.floor(random()*4)}));
    const atmosphere=document.createElement('canvas');
    let w=0,h=0,frame=0,last=0,lastDraw=0,time=position.current.time,travel=position.current.travel;
    const resize=()=>{w=el.clientWidth;h=el.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.75);el.width=Math.round(w*dpr);el.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);paintAtmosphere();draw();};
    function paintAtmosphere(){
      atmosphere.width=w;atmosphere.height=h;
      const skyCtx=atmosphere.getContext('2d')!;const horizon=h*.49;
      const sky=skyCtx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#14292c');sky.addColorStop(.45,'#4a6058');sky.addColorStop(.8,'#a59b72');sky.addColorStop(1,'#dfbe7c');skyCtx.fillStyle=sky;skyCtx.fillRect(0,0,w,h);
      // Layered, soft cloud light and distant hills give the horizon depth.
      for(let i=0;i<17;i++){
        const x=((i*.618)%1)*w,y=h*(.05+((i*.137)%.33));
        skyCtx.save();skyCtx.translate(x,y);skyCtx.scale(1,.12);
        const cloud=skyCtx.createRadialGradient(0,0,0,0,0,w*.34);cloud.addColorStop(0,i%2?'#f1d7a612':'#112c2828');cloud.addColorStop(1,'#112c2800');skyCtx.fillStyle=cloud;skyCtx.fillRect(-w*.34,-w*.34,w*.68,w*.68);skyCtx.restore();
      }
      const light=skyCtx.createRadialGradient(w*.77,horizon-h*.08,0,w*.77,horizon-h*.08,h*.4);light.addColorStop(0,'#ffeacaa0');light.addColorStop(.16,'#f6d78b45');light.addColorStop(1,'#f0c97600');skyCtx.fillStyle=light;skyCtx.fillRect(0,0,w,horizon);
      skyCtx.fillStyle='#ffe8aa';skyCtx.beginPath();skyCtx.arc(w*.77,horizon-h*.08,h*.011,0,Math.PI*2);skyCtx.fill();
      for(let layer=0;layer<3;layer++){
        skyCtx.beginPath();skyCtx.moveTo(0,horizon);
        for(let x=0;x<=w+10;x+=10){const y=horizon-h*(.012+layer*.008)-(Math.sin(x/w*8+layer*2)+Math.sin(x/w*17+layer)*.35)*h*.009;skyCtx.lineTo(x,y);}
        skyCtx.lineTo(w,horizon+5);skyCtx.lineTo(0,horizon+5);skyCtx.fillStyle=['#a2a07566','#818d6560','#697c5060'][layer];skyCtx.fill();
      }
      const ground=skyCtx.createLinearGradient(0,horizon,0,h);ground.addColorStop(0,'#b2a56b');ground.addColorStop(.15,'#6d7948');ground.addColorStop(.5,'#344b30');ground.addColorStop(1,'#13271d');skyCtx.fillStyle=ground;skyCtx.fillRect(0,horizon,w,h-horizon);
    }
    function draw(){
      if(!ctx)return;
      const horizon=h*.49;
      ctx.globalAlpha=1;ctx.drawImage(atmosphere,0,0);
      for(const f of flowers)f.d=.35+((f.z-travel)%26+26)%26;
      const depth=flowers.sort((a,b)=>b.d-a.d);
      // Fine ground cover travels with the roses, anchoring their stems in the meadow.
      const grassColors=['#667245','#899052','#475e35','#a19b59'];
      for(const g of grasses){const d=.35+((g.z-travel)%26+26)%26;const scale=1/d;const x=w/2+g.x*w*.8*scale;const y=horizon+h*1.15*scale;if(x<0||x>w||y>h+40)continue;const blade=Math.min(w,h)*.035*scale*g.height;ctx.globalAlpha=Math.min(.6,scale*5)*Math.min(1,(26.35-d)*2);ctx.strokeStyle=grassColors[g.shade];ctx.lineWidth=Math.max(.55,scale*1.2);ctx.beginPath();ctx.moveTo(x-blade*.4,y);ctx.quadraticCurveTo(x-blade*.7,y-blade*.6,x-blade*.2,y-blade);ctx.moveTo(x,y);ctx.quadraticCurveTo(x+blade*.15,y-blade*.6,x+blade*.6,y-blade*.85);ctx.stroke();}
      for(const f of depth){const scale=1/f.d;const x=w/2+f.x*w*.8*scale;const y=horizon+h*1.15*scale;const size=Math.min(w*1.15,h)*.60*scale*f.size;if(x < -size||x>w+size||y>h+size)continue;ctx.globalAlpha=Math.min(.2,scale*.8);ctx.fillStyle='#0b1910';ctx.beginPath();ctx.ellipse(x,y-size*.07,size*.25,size*.035,0,0,Math.PI*2);ctx.fill();}
      for(const f of depth){const scale=1/f.d;const x=w/2+f.x*w*.8*scale;const y=horizon+h*1.15*scale;const size=Math.min(w*1.15,h)*.60*scale*f.size;if(x < -size||x>w+size)continue;ctx.globalAlpha=Math.min(1,.42+scale*4)*Math.min(1,(26.35-f.d)*2);const sway=Math.sin(time*.55+f.phase)*size*.018;ctx.drawImage(sprites[f.kind],x-size/2+sway,y-size*1.78,size,size*1.78);}
      ctx.globalAlpha=1;
      canvas.current?.setAttribute("data-distance",travel.toFixed(3));
      canvas.current?.setAttribute("data-motion",paused?"paused":"playing");
      const haze=ctx.createLinearGradient(0,horizon-5,0,horizon+h*.13);haze.addColorStop(0,'#d8be8240');haze.addColorStop(1,'#c1a46800');ctx.fillStyle=haze;ctx.fillRect(0,horizon-5,w,h*.14);
      for(let i=0;i<24;i++){const x=((i*.618+Math.sin(time*.08+i)*.02)%1+1)%1*w;const y=h*(.23+((i*.137+time*.006)% .7));ctx.fillStyle=`rgba(255,224,139,${.2+Math.sin(time+i)*.13})`;ctx.beginPath();ctx.arc(x,y,i%3===0?1.7:1,0,Math.PI*2);ctx.fill();}
    }
    function tick(now:number){const dt=Math.min((now-last)/1000,.05);last=now;if(!document.hidden&&!paused){time+=dt;travel+=dt*.65;if(now-lastDraw>32){draw();lastDraw=now;}}frame=requestAnimationFrame(tick);}
    const observer=new ResizeObserver(resize);observer.observe(el);resize();
    if(!paused)frame=requestAnimationFrame(tick);
    return()=>{disposed=true;position.current={time,travel};cancelAnimationFrame(frame);observer.disconnect();};
  }, [paused]);

  return <dialog className="universe-dialog travelling-garden" ref={dialog} onCancel={onClose} aria-labelledby="universe-title">
    <canvas ref={canvas} className="infinite-field" aria-label="Campo de rosas amarillas que se extiende hasta el horizonte" role="img"/>
    <div className="universe-shade"/>
    <nav className="universe-controls" aria-label="Controles del campo"><button onClick={onClose}><ArrowLeft size={16}/> Volver a la dedicatoria</button><button onClick={()=>setPaused(p=>!p)} aria-label={paused?'Animar el campo':'Pausar el movimiento'}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></nav>
    <div className="universe-dedication"><p>UN PASEO ENTRE ROSAS</p><h2 id="universe-title">Haridian,<br/><em>te quiero.</em></h2><span>Si pudiera, te regalaría un campo entero.</span></div>
    <p className="universe-footnote">Feliz 21 de septiembre, preciosa. <span>♡</span></p>
  </dialog>;
}
