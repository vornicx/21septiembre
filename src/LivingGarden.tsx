import { useEffect, useRef } from 'react';

export default function LivingGarden({paused}:{paused:boolean}) {
 const ref=useRef<HTMLCanvasElement>(null);
 const pausedRef=useRef(paused);
 useEffect(()=>{pausedRef.current=paused;},[paused]);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
  let ready=false,disposed=false,raf=0,last=0,t=0,x=0,y=0,tx=0,ty=0,down=false,w=0,h=0;
  const image=new Image();image.onload=()=>{if(!disposed)ready=true;};image.src='/art/rose-field.webp';
  const resize=()=>{w=canvas.clientWidth;h=canvas.clientHeight;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  const move=(e:PointerEvent)=>{if(e.pointerType==='touch'&&!down)return;const b=canvas.getBoundingClientRect();tx=(e.clientX-b.left)/b.width*2-1;ty=(e.clientY-b.top)/b.height*2-1;};
  const start=(e:PointerEvent)=>{down=true;canvas.setPointerCapture(e.pointerId);move(e);};const end=()=>{down=false;};
  const key=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();tx=Math.max(-1,Math.min(1,tx+(e.key==='ArrowLeft'?-.25:e.key==='ArrowRight'?.25:0)));ty=Math.max(-1,Math.min(1,ty+(e.key==='ArrowUp'?-.25:e.key==='ArrowDown'?.25:0)));}};
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('keydown',key);
  function render(now:number){
   if(!canvas)return;
   const dt=Math.min((now-last)/1000,.05);last=now;
   if(ready&&!document.hidden&&ctx){
    if(!pausedRef.current){t+=dt;x+=(tx-x)*Math.min(1,dt*3);y+=(ty-y)*Math.min(1,dt*3);}
    const scale=Math.max(w/image.width,h/image.height)*1.14;
    const sw=w/scale,sh=h/scale;
    const sx=(image.width-sw)/2,sy=(image.height-sh)/2;
    // Independent horizontal bands move the foreground foliage more than the sky.
    // The extra source margin keeps every edge covered during touch/mouse parallax.
    const rows=Math.ceil(h/3);
    for(let row=0;row<rows;row++){
     const py=row*3,ph=Math.min(3,h-py),v=py/h;
     const depth=Math.max(0,Math.min(1,(v-.4)/.6));
     const wind=(Math.sin(t*.85+v*8)+.35*Math.sin(t*1.3+v*23))*3.5*depth*depth;
     const dx=x*image.width*.027*(.2+depth)+wind/scale;
     const dy=y*image.height*.008;
     ctx.drawImage(image,sx+dx,sy+py/scale+dy,sw,ph/scale,0,py,w,ph+.3);
    }
    canvas.dataset.view=`${x.toFixed(2)},${y.toFixed(2)}`;
    canvas.dataset.motion=pausedRef.current?'paused':'playing';
   }
   raf=requestAnimationFrame(render);
  }
  raf=requestAnimationFrame(render);
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',start);canvas.removeEventListener('pointerup',end);canvas.removeEventListener('pointercancel',end);canvas.removeEventListener('keydown',key);};
 },[]);
 return <><img className="garden-fallback" src="/art/rose-field.webp" alt="Rosales amarillos al atardecer"/><canvas className="living-garden" ref={ref} tabIndex={0} aria-label="Campo interactivo de rosas. Mueve el ratón, arrastra con el dedo o usa las flechas para mirar alrededor."/><div className="floating-petals" aria-hidden="true">{Array.from({length:16},(_,i)=><span key={i} style={{left:`${i*6.7}%`,animationDelay:`${-i*2.1}s`,animationDuration:`${15+i%5*3}s`}}/>)}</div></>;
}
