import { useEffect, useRef, useState } from 'react';

const vertex = `attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
const fragment = `precision highp float;
uniform sampler2D u_image;uniform vec2 u_resolution;uniform vec2 u_pointer;uniform float u_time;uniform float u_aspect;varying vec2 v_uv;
void main(){
 vec2 uv=vec2(v_uv.x,1.-v_uv.y);
 float screen=u_resolution.x/u_resolution.y;
 vec2 fit=vec2(min(1.,screen/u_aspect),min(1.,u_aspect/screen));
 vec2 p=(uv-.5)*fit*.88+.5;
 float depth=smoothstep(.38,1.,p.y);
 // Foreground foliage moves more than the distant horizon.
 p+=u_pointer*vec2(.038,.014)*(0.15+depth);
 float wind=sin(p.x*11.+u_time*.65)+.45*sin(p.x*23.-u_time*.92+p.y*7.);
 p.x+=wind*.0048*depth*depth;
 p.y+=sin(p.x*17.+u_time*.78)*.0018*depth;
 vec3 color=texture2D(u_image,p).rgb;
 // Moving broad light, not a global Ken Burns zoom.
 float light=sin(p.x*4.-u_time*.17+p.y)*.017*depth;
 color+=vec3(light,light*.8,light*.35);
 gl_FragColor=vec4(color,1.);
}`;

export default function LivingGarden({paused}:{paused:boolean}) {
 const ref=useRef<HTMLCanvasElement>(null);
 const pausedRef=useRef(paused);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{pausedRef.current=paused;},[paused]);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  if(!gl){setFailed(true);return;}
  const shaders:WebGLShader[]=[];
  function compile(type:number,source:string){const s=gl!.createShader(type)!;shaders.push(s);gl!.shaderSource(s,source);gl!.compileShader(s);if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS))throw Error('Garden shader unavailable');return s;}
  let program:WebGLProgram;
  try{program=gl.createProgram()!;gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Garden unavailable');}catch{setFailed(true);shaders.forEach(s=>gl.deleteShader(s));return;}
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const attrib=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(attrib);gl.vertexAttribPointer(attrib,2,gl.FLOAT,false,0,0);
  const resolution=gl.getUniformLocation(program,'u_resolution'),pointer=gl.getUniformLocation(program,'u_pointer'),time=gl.getUniformLocation(program,'u_time');
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  let ready=false,disposed=false,raf=0,last=0,t=0,x=0,y=0,tx=0,ty=0,down=false;
  const image=new Image();image.src='/art/rose-field.webp';image.onload=()=>{if(disposed)return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.uniform1f(gl.getUniformLocation(program,'u_aspect'),image.width/image.height);ready=true;};image.onerror=()=>{if(!disposed)setFailed(true);};
  const resize=()=>{const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(canvas.clientWidth*dpr);canvas.height=Math.round(canvas.clientHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(resolution,canvas.width,canvas.height);};
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  const move=(e:PointerEvent)=>{if(e.pointerType==='touch'&&!down)return;const b=canvas.getBoundingClientRect();tx=(e.clientX-b.left)/b.width*2-1;ty=(e.clientY-b.top)/b.height*2-1;};
  const start=(e:PointerEvent)=>{down=true;canvas.setPointerCapture(e.pointerId);move(e);};const end=()=>{down=false;};
  const key=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();tx=Math.max(-1,Math.min(1,tx+(e.key==='ArrowLeft'?-.25:e.key==='ArrowRight'?.25:0)));ty=Math.max(-1,Math.min(1,ty+(e.key==='ArrowUp'?-.25:e.key==='ArrowDown'?.25:0)));}};
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('keydown',key);
  function render(now:number){if(!gl)return;const dt=Math.min((now-last)/1000,.05);last=now;if(ready&&!document.hidden){if(!pausedRef.current){t+=dt;x+=(tx-x)*Math.min(1,dt*3);y+=(ty-y)*Math.min(1,dt*3);}gl.uniform1f(time,t);gl.uniform2f(pointer,x,y);gl.drawArrays(gl.TRIANGLES,0,6);}raf=requestAnimationFrame(render);}
  raf=requestAnimationFrame(render);
  const lost=(e:Event)=>{e.preventDefault();setFailed(true);};canvas.addEventListener('webglcontextlost',lost);
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',start);canvas.removeEventListener('pointerup',end);canvas.removeEventListener('pointercancel',end);canvas.removeEventListener('keydown',key);canvas.removeEventListener('webglcontextlost',lost);gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));};
 },[]);
 return <><img className="garden-fallback" src="/art/rose-field.webp" alt="Rosales amarillos al atardecer"/>{!failed&&<canvas className="living-garden" ref={ref} tabIndex={0} aria-label="Campo interactivo de rosas. Mueve el ratón, arrastra con el dedo o usa las flechas para mirar alrededor."/>}<div className="floating-petals" aria-hidden="true">{Array.from({length:16},(_,i)=><span key={i} style={{left:`${i*6.7}%`,animationDelay:`${-i*2.1}s`,animationDuration:`${15+i%5*3}s`}}/>)}</div></>;
}
