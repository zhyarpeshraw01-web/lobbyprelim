(function(){
'use strict';
if(window.__HOSTED&&location.protocol==='file:'){location.replace('offline/index.html');return}
var D=window.__DATA, $=function(i){return document.getElementById(i)};
var MOBILE=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||(window.matchMedia&&matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<900);
var note=function(t){var n=$('ld-note');if(n)n.textContent=t};
function fatal(msg){$('loader').classList.add('done');$('err-t').textContent=msg;$('err').style.display='flex';$('err-b').onclick=function(){location.reload()}}
['gesturestart','gesturechange','gestureend'].forEach(function(e){document.addEventListener(e,function(ev){ev.preventDefault()})});
var PI=Math.PI, rad=function(d){return d*PI/180}, clamp=function(x,a,b){return Math.min(b,Math.max(a,x))};
var AX=11.1, AZ=10;
var LIGHTS={golden:'Golden hour',day:'Daylight',night:'Night'};
// ---------------------------------------------------------------- stations (your renders)
var ST={
 C1:{img:'p_c1',tag:'CAMERA C1',name:'Left of the entrance',pano:'C1',pos:[1.7,14.3],focus:.5,
  hs:[['LIGHT','Petal chandelier','More than a thousand pale petals drift beneath the ceiling dome, suspended on fine wires and warmed from within.',.80,.20],
      ['TREE','Timber canopies','Walnut trunks rise from the floor, flare into branching canopies and dissolve into the ceiling. Light veins climb the grain like sap.',.755,.47],
      ['RELIEF','Carved walnut relief','A leaf-shaped panel of carved timber — crane, waves and mountain — lit by a glowing edge and framed by travertine columns.',.40,.45],
      ['DESK','Front desk','A horseshoe of honed ivory mineral with fine light lines tracing its curve. The welcome point of the lobby.',.43,.64],
      ['WATER','Fluid surfaces','A brass and sage ribbon winds across the oak floor between the lounges, like a stream through a garden.',.41,.83],
      ['STONE','Soft seating','Pebble-like boucle chairs rest on oak discs, around travertine tables. Rounded, tactile and made for gathering.',.52,.82]]},
 C2:{img:'p_c2',tag:'CAMERA C2',name:'Right of the entrance',pano:'C2',pos:[20.0,15.8],focus:.5,
  hs:[['LIGHT','Petal chandelier','More than a thousand pale petals drift beneath the ceiling dome, suspended on fine wires and warmed from within.',.31,.12],
      ['TREE','Timber canopies','Walnut trunks rise from the floor, flare into branching canopies and dissolve into the ceiling. Light veins climb the grain like sap.',.07,.42],
      ['RELIEF','Carved walnut relief','A leaf-shaped panel of carved timber — crane, waves and mountain — lit by a glowing edge and framed by travertine columns.',.66,.49],
      ['DESK','Front desk','A horseshoe of honed ivory mineral with fine light lines tracing its curve. The welcome point of the lobby.',.63,.73],
      ['WATER','Fluid surfaces','A brass and sage ribbon winds across the oak floor between the lounges, like a stream through a garden.',.27,.88],
      ['STONE','Soft seating','Pebble-like boucle chairs rest on oak discs, around travertine tables. Rounded, tactile and made for gathering.',.52,.85]]},
 C3:{img:'p_c3',tag:'CAMERA C3',name:'Centre axis',pano:'C3',pos:[10.9,19.1],focus:.5,
  hs:[['LIGHT','Petal chandelier','More than a thousand pale petals drift beneath the ceiling dome, suspended on fine wires and warmed from within.',.50,.24],
      ['TREE','Timber canopies','Walnut trunks rise from the floor, flare into branching canopies and dissolve into the ceiling. Light veins climb the grain like sap.',.15,.22],
      ['RELIEF','Carved walnut relief','A leaf-shaped panel of carved timber — crane, waves and mountain — lit by a glowing edge and framed by travertine columns.',.52,.45],
      ['DESK','Front desk','A horseshoe of honed ivory mineral with fine light lines tracing its curve. The welcome point of the lobby.',.47,.625],
      ['WATER','Fluid surfaces','A brass and sage ribbon winds across the oak floor between the lounges, like a stream through a garden.',.60,.75],
      ['STONE','Soft seating','Pebble-like boucle chairs rest on oak discs, around travertine tables. Rounded, tactile and made for gathering.',.74,.73]]},
 D:{img:'p_detail',tag:'DETAIL',name:'Stone, bouclé & oak',pano:null,pos:null,focus:.5,
  hs:[['BOUCLÉ','Bouclé upholstery','Soft, tactile bouclé wraps the pebble chair and sofa — the “stone” of the concept, turned into something you want to sit in.',.10,.28],
      ['TRAVERTINE','Travertine tables','Nesting tables of honed travertine. Their fluted legs echo the columns of the lobby.',.55,.52],
      ['OAK','Oak discs & green rug','Each seat rests on an oak disc, set on deep green wool that echoes the garden outside.',.17,.77]]}
};
var ORDER=['C1','C2','C3','D'];
var PANO={C1:{pos:[1.7,14.3,1.55]},C2:{pos:[20.0,15.8,1.55]},C3:{pos:[10.9,19.1,1.6]}};
Object.keys(PANO).forEach(function(k){var v=PANO[k];v.w=[v.pos[0]-AX,v.pos[2],v.pos[1]-AZ];var dx=11-v.pos[0],dz=5.4-v.pos[1];v.yaw=Math.atan2(-dx,-dz);v.pitch=rad(2)});
var HS3=[ // 360 labels (world, plan metres)
 ['LIGHT','Petal chandelier',ST.C3.hs[0][2],[AX,4.4,AZ+.4]],
 ['TREE','Timber canopies',ST.C3.hs[1][2],[4.6,3.2,3.2]],
 ['WATER','Fluid surfaces',ST.C3.hs[4][2],[11,.75,6.5]],
 ['STONE','Soft seating',ST.C3.hs[5][2],[8.1,1.0,12.9]],
 ['RELIEF','Carved walnut relief',ST.C3.hs[2][2],[11,2.7,2.6]],
 ['DESK','Front desk',ST.C3.hs[3][2],[11,1.35,5.5]]
].map(function(h){return {tag:h[0],title:h[1],text:h[2],w:[h[3][0]-AX,h[3][1],h[3][2]-AZ]}});
HS3[0].w=[0,4.4,.4];

// ---------------------------------------------------------------- math
function basis(yaw,pitch){var cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);var fw=[-sy*cp,sp,-cy*cp],rt=[cy,0,-sy];var up=[rt[1]*fw[2]-rt[2]*fw[1],rt[2]*fw[0]-rt[0]*fw[2],rt[0]*fw[1]-rt[1]*fw[0]];return{fw:fw,rt:rt,up:up}}
var FACES=['px','nx','py','ny','pz','nz'],FANG={px:[-PI/2,0],nx:[PI/2,0],py:[0,PI/2],ny:[0,-PI/2],pz:[PI,0],nz:[0,0]};
var FF=[],FR=[],FU=[];FACES.forEach(function(f){var b=basis(FANG[f][0],FANG[f][1]);FF.push.apply(FF,b.fw);FR.push.apply(FR,b.rt);FU.push.apply(FU,b.up)});
var K=Math.tan(rad(45))/Math.tan(rad(45.5));

// ---------------------------------------------------------------- webgl
var cv=$('c'),gl=null;
try{gl=cv.getContext('webgl2',{antialias:false,alpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'})}catch(e){}
if(!gl){lite();return}
cv.addEventListener('webglcontextlost',function(e){e.preventDefault();fatal('The graphics were reset by your device (this can happen when the phone is low on memory). Tap reload.')});
function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o}
function prog(fs){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,'#version 300 es\nin vec2 a;out vec2 v;void main(){v=a;gl_Position=vec4(a,0.,1.);}'));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p}
var vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
function attr(p){var l=gl.getAttribLocation(p,'a');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0)}
function uloc(p,names){var o={};names.forEach(function(n){o[n]=gl.getUniformLocation(p,n)});return o}

// -- cube (360) program
var samp='';for(var s=0;s<2;s++)for(var i=0;i<6;i++)samp+='uniform sampler2D '+'AB'[s]+i+';';
var fn='';['A','B'].forEach(function(S){fn+='vec4 s'+S+'(int i,vec2 uv){';for(var i=0;i<5;i++)fn+='if(i=='+i+')return textureLod('+S+i+',uv,0.);';fn+='return textureLod('+S+'5,uv,0.);}'});
var PC=prog('#version 300 es\nprecision highp float;in vec2 v;out vec4 o;'+samp+'uniform vec3 F[6];uniform vec3 R[6];uniform vec3 U[6];uniform vec3 cf,cr,cu;uniform vec2 sc;uniform float mx,fade,vig,time;const float K='+K.toFixed(6)+';'+fn+
'vec4 look(vec3 d,bool a){int bi=0;float bd=-2.;for(int i=0;i<6;i++){float t=dot(d,F[i]);if(t>bd){bd=t;bi=i;}}vec2 p=vec2(dot(d,R[bi]),dot(d,U[bi]))/bd*K;vec2 uv=vec2(p.x*.5+.5,.5-p.y*.5);return a?sA(bi,uv):sB(bi,uv);}'+
'float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}'+
'void main(){vec3 d=normalize(cr*v.x*sc.x+cu*v.y*sc.y+cf);vec4 c=mx<=0.?look(d,true):(mx>=1.?look(d,false):mix(look(d,true),look(d,false),mx));c.rgb*=1.-vig*dot(v,v)*.22;c.rgb+=(h(v*900.+fract(time))-.5)*.012;c.rgb*=1.-fade;o=vec4(c.rgb,1.);}');
gl.useProgram(PC);attr(PC);
var UC=uloc(PC,['F','R','U','cf','cr','cu','sc','mx','fade','vig','time']);
gl.uniform3fv(UC.F,FF);gl.uniform3fv(UC.R,FR);gl.uniform3fv(UC.U,FU);
for(var s=0;s<2;s++)for(var i=0;i<6;i++)gl.uniform1i(gl.getUniformLocation(PC,'AB'[s]+i),s*6+i);

// -- photo (depth parallax) program
var PP=prog('#version 300 es\nprecision highp float;in vec2 v;out vec4 o;uniform sampler2D iA,dA,iB,dB;uniform vec2 ctr,hf,off,amp;uniform float focA,focB,mx,fade,time,lift;'+
'\n#define ITER '+(MOBILE?8:14)+'\nvec3 pom(sampler2D im,sampler2D dp,vec2 uv,float foc,vec2 gx,vec2 gy){vec2 p=uv;for(int i=0;i<ITER;i++){float d=textureLod(dp,p,0.).r;p=uv+off*amp*(d-foc);}p=clamp(p,vec2(.001),vec2(.999));return textureGrad(im,p,gx,gy).rgb;}'+
'float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}'+
'void main(){vec2 uv=ctr+vec2(v.x*hf.x,-v.y*hf.y);vec2 gx=dFdx(uv),gy=dFdy(uv);vec3 c=mx<=0.?pom(iA,dA,uv,focA,gx,gy):(mx>=1.?pom(iB,dB,uv,focB,gx,gy):mix(pom(iA,dA,uv,focA,gx,gy),pom(iB,dB,uv,focB,gx,gy),mx));'+
'c*=1.-.16*dot(v,v)*.5;c=c*(1.+lift*.0);c+=(h(v*900.+fract(time))-.5)*.010;c*=1.-fade;o=vec4(c,1.);}');
gl.useProgram(PP);attr(PP);
var UP_=uloc(PP,['ctr','hf','off','amp','focA','focB','mx','fade','time','lift']);
['iA','dA','iB','dB'].forEach(function(n,i){gl.uniform1i(gl.getUniformLocation(PP,n),i)});

function makeTex(img,mip){var t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
 if(mip){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);var ex=gl.getExtension('EXT_texture_filter_anisotropic');if(ex)gl.texParameterf(gl.TEXTURE_2D,ex.TEXTURE_MAX_ANISOTROPY_EXT,4)}else gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t}
function loadImg(src){return new Promise(function(res,rej){var im=new Image();im.onload=function(){res(im)};im.onerror=rej;im.src=src})}
var PH={};
function loadPhoto(k){
 if(PH[k])return Promise.resolve(PH[k]);var d=D.photos[ST[k].img];
 return Promise.all([loadImg(d.img),loadImg(d.dep)]).then(function(a){
  var c=document.createElement('canvas');c.width=a[1].width;c.height=a[1].height;var x=c.getContext('2d');x.drawImage(a[1],0,0);
  return PH[k]={img:makeTex(a[0],true),dep:makeTex(a[1],false),ar:a[0].width/a[0].height,dd:x.getImageData(0,0,c.width,c.height)}});
}
function depthAt(ph,u,v){var w=ph.dd.width,h=ph.dd.height,x=clamp(Math.round(u*(w-1)),0,w-1),y=clamp(Math.round(v*(h-1)),0,h-1);return ph.dd.data[(y*w+x)*4]/255}
var scratch=null;
function loadSet(view,light){
 var key=view+'_'+light;
 if(D.sets){ // hosted: one atlas per set (3 x 2 faces)
  var src=(MOBILE?D.sets[key].lo:D.sets[key].hi);
  return loadImg(src).then(function(im){
   var fs=im.width/3;if(!scratch)scratch=document.createElement('canvas');scratch.width=scratch.height=fs;var cx=scratch.getContext('2d'),tex=[];
   for(var i=0;i<6;i++){cx.clearRect(0,0,fs,fs);cx.drawImage(im,(i%3)*fs,Math.floor(i/3)*fs,fs,fs,0,0,fs,fs);tex.push(makeTex(scratch,false))}
   return{key:key,tex:tex}});
 }
 var p=[];FACES.forEach(function(f){p.push(loadImg(D.faces[key+'_'+f]))});return Promise.all(p).then(function(ims){return{key:key,tex:ims.map(function(i){return makeTex(i,false)})}})}
function bindSet(S,set){for(var i=0;i<6;i++){gl.activeTexture(gl.TEXTURE0+(S==='A'?0:6)+i);gl.bindTexture(gl.TEXTURE_2D,set.tex[i])}}
function freeSet(s){if(s)s.tex.forEach(function(t){gl.deleteTexture(t)})}

// ---------------------------------------------------------------- state
var st={mode:'photo',sta:'C3',light:'golden',fade:1,busy:false,tour:false,labels:true,
 // photo
 cx:.5,cy:.5,zoom:1.07,ox:0,oy:0,tx:0,ty:0,idle:0,mx:0,pointer:false,
 // pano
 yaw:0,pitch:0,fov:68,vy:0,vp:0,drag:false,gyro:false};
var cur=null,nxt=null,phA=null,phB=null,phAk='C3',phBk=null,pset=null,panoView='C3',mapDirty=true,aim=false,aimY=0,aimP=0;
function size(){var dpr=Math.min(window.devicePixelRatio||1,MOBILE?1.5:2),w=innerWidth,h=innerHeight;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);gl.viewport(0,0,cv.width,cv.height)}
addEventListener('resize',size);size();
var t0=performance.now();

// photo window (cover fit)
function win(ph){var sa=innerWidth/innerHeight,ia=ph.ar,hx,hy,z=st.zoom;if(sa>ia){hx=.5/z;hy=.5/z*ia/sa}else{hy=.5/z;hx=.5/z*sa/ia}return{hx:hx,hy:hy}}
function clampC(ph){var w=win(ph);st.cx=clamp(st.cx,w.hx,1-w.hx);st.cy=clamp(st.cy,w.hy,1-w.hy)}
var AMP=[.024,.024*.6];
function drawPhoto(){
 gl.useProgram(PP);var A=phA,B=phB||phA,w=win(A);clampC(A);
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,A.img);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,A.dep);
 gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,B.img);gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,B.dep);
 gl.uniform2f(UP_.ctr,st.cx,st.cy);gl.uniform2f(UP_.hf,w.hx,w.hy);gl.uniform2f(UP_.off,st.ox,st.oy);gl.uniform2f(UP_.amp,AMP[0],AMP[1]*A.ar);
 gl.uniform1f(UP_.focA,ST[phAk].focus);gl.uniform1f(UP_.focB,phBk?ST[phBk].focus:.5);gl.uniform1f(UP_.mx,phB?st.mx:0);gl.uniform1f(UP_.fade,st.fade);gl.uniform1f(UP_.time,(performance.now()-t0)*.001%1);gl.uniform1f(UP_.lift,0);
 gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}
function camB(){return basis(st.yaw,st.pitch)}
function drawPano(){
 gl.useProgram(PC);bindSet('A',cur);bindSet('B',nxt||cur);
 var b=camB(),th=Math.tan(rad(st.fov)/2),as=cv.width/cv.height;
 gl.uniform3fv(UC.cf,b.fw);gl.uniform3fv(UC.cr,b.rt);gl.uniform3fv(UC.cu,b.up);gl.uniform2f(UC.sc,as*th,th);
 gl.uniform1f(UC.mx,nxt?st.mx:0);gl.uniform1f(UC.fade,st.fade);gl.uniform1f(UC.vig,1);gl.uniform1f(UC.time,(performance.now()-t0)*.001%1);
 gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}
function draw(){if(st.mode==='photo')drawPhoto();else drawPano()}

// ---------------------------------------------------------------- tween helper
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function tween(dur,fn,done){var t1=performance.now();(function s(){var k=Math.min(1,(performance.now()-t1)/dur);fn(k,ease(k));if(k<1)requestAnimationFrame(s);else done&&done()})()}

// ---------------------------------------------------------------- station switching
function photoGo(k,cb){
 if(st.busy||(k===phAk&&!phB)){cb&&cb();return}
 st.busy=true;closeCard();
 loadPhoto(k).then(function(ph){
  phB=ph;phBk=k;st.mx=0;var z0=st.zoom,cx0=st.cx,cy0=st.cy;
  tween(1100,function(kk,e){st.mx=e;st.zoom=z0+(1.07-z0)*e+Math.sin(kk*PI)*.05;st.cx=cx0+(.5-cx0)*e;st.cy=cy0+(.5-cy0)*e},function(){
   phA=ph;phAk=k;phB=null;phBk=null;st.mx=0;st.sta=k;st.zoom=1.07;st.cx=.5;st.cy=.5;st.busy=false;updateUI();mapDirty=true;cb&&cb()});
  st.sta=k;updateUI();
 }).catch(function(e){st.busy=false;console.error(e)});
}
function panoGo(view,light){
 if(st.busy||(view===panoView&&light===st.light&&!nxt))return;st.busy=true;closeCard();
 var changed=view!==panoView;
 loadSet(view,light).then(function(ns){
  nxt=ns;st.mx=0;var f0=st.fov,y0=st.yaw,p0=st.pitch,V=PANO[view],dy=Math.atan2(Math.sin(V.yaw-y0),Math.cos(V.yaw-y0));
  tween(changed?1100:900,function(k,e){st.mx=e;if(changed){st.yaw=y0+dy*e;st.pitch=p0+(V.pitch-p0)*e;st.fov=f0-Math.sin(k*PI)*7}},function(){
   freeSet(cur);cur=ns;nxt=null;st.mx=0;panoView=view;st.light=light;st.sta=view;st.busy=false;updateUI();mapDirty=true});
  panoView=view;st.light=light;st.sta=view;updateUI();
 }).catch(function(e){st.busy=false;console.error(e)});
}
function setMode(m,after,sta){
 if(st.busy||st.mode===m)return;st.busy=true;closeCard();if(sta)st.sta=sta;
 var go=function(){
  var pre=m==='pano'?loadSet(ST[st.sta].pano||'C3',st.light):Promise.resolve();
  pre.then(function(ns){
   if(m==='pano'){var v=ST[st.sta].pano||'C3';freeSet(cur);cur=ns;nxt=null;panoView=v;var V=PANO[v];st.yaw=V.yaw;st.pitch=V.pitch;st.fov=68;st.sta=v}
   else{var k=st.sta;if(!ST[k])k='C3';st.sta=k}
   st.mode=m;st.busy=false;updateUI();mapDirty=true;
   var f=st.fade;tween(500,function(k,e){st.fade=1-e});after&&after();
  }).catch(function(e){st.busy=false;console.error(e)});
 };
 if(m==='photo'){loadPhoto(st.sta).then(function(ph){phA=ph;phAk=st.sta;phB=null;st.zoom=1.07;st.cx=.5;st.cy=.5;fadeOut(go)})}
 else fadeOut(go);
}
function fadeOut(cb){tween(450,function(k,e){st.fade=e},cb)}
function gotoSta(k){
 if(st.mode==='photo')photoGo(k);
 else if(ST[k].pano)panoGo(ST[k].pano,st.light);
 else setMode('photo',null,k);
}

// ---------------------------------------------------------------- input
var ptr={};
cv.addEventListener('pointerdown',function(e){cv.setPointerCapture(e.pointerId);ptr[e.pointerId]=[e.clientX,e.clientY];cv.classList.add('drag');st.drag=true;st.vy=st.vp=0;stopTour();hideHint();st.idle=0});
cv.addEventListener('pointermove',function(e){
 st.idle=0;st.pointer=true;
 if(st.mode==='photo'){st.tx=clamp((e.clientX/innerWidth-.5)*2,-1,1);st.ty=clamp((e.clientY/innerHeight-.5)*2,-1,1)}
 var p=ptr[e.pointerId];if(!p)return;var ids=Object.keys(ptr);
 if(ids.length===2){var o=ptr[ids.find(function(i){return +i!==+e.pointerId})];var d0=Math.hypot(p[0]-o[0],p[1]-o[1]);ptr[e.pointerId]=[e.clientX,e.clientY];var d1=Math.hypot(e.clientX-o[0],e.clientY-o[1]);zoomBy(d0/d1);return}
 var dx=e.clientX-p[0],dy=e.clientY-p[1];ptr[e.pointerId]=[e.clientX,e.clientY];
 if(st.mode==='photo'){var w=win(phA);st.cx-=dx/innerWidth*2*w.hx;st.cy-=dy/innerHeight*2*w.hy}
 else{var s=rad(st.fov)/cv.clientHeight;st.yaw+=dx*s;st.pitch+=dy*s;st.vy=dx*s;st.vp=dy*s;clampP()}
});
function up(e){delete ptr[e.pointerId];if(!Object.keys(ptr).length){cv.classList.remove('drag');st.drag=false}}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('pointerleave',function(){st.pointer=false});
function zoomBy(f){if(st.mode==='photo')st.zoom=clamp(st.zoom/f,1.07,2.6);else st.fov=clamp(st.fov*f,34,100)}
cv.addEventListener('wheel',function(e){e.preventDefault();zoomBy(1+e.deltaY*.0012);hideHint()},{passive:false});
function clampP(){st.pitch=clamp(st.pitch,-rad(86),rad(86))}
var keys={};
addEventListener('keydown',function(e){
 var k=e.key.toLowerCase();keys[k]=true;
 if(k>='1'&&k<='4')gotoSta(ORDER[+k-1]);
 else if(k==='t')toggleTour();else if(k==='l')toggleLabels();else if(k==='p')shot();else if(k==='f')fs();else if(k==='h'||k==='?')$('help').classList.toggle('show');
 else if(k==='escape'){$('help').classList.remove('show');closeCard()}
 else if(k==='+'||k==='=')zoomBy(.9);else if(k==='-')zoomBy(1.1);
 else if(st.mode==='pano'&&k==='g')panoGo(panoView,'golden');else if(st.mode==='pano'&&k==='d')panoGo(panoView,'day');else if(st.mode==='pano'&&k==='n')panoGo(panoView,'night');
});
addEventListener('keyup',function(e){delete keys[e.key.toLowerCase()]});

// ---------------------------------------------------------------- UI
var tourT=null,hintT=null;
function toggleTour(){st.tour?stopTour():startTour()}
function startTour(){st.tour=true;$('b-auto').classList.add('on');hideHint();if(st.mode!=='photo')setMode('photo');scheduleTour()}
function scheduleTour(){clearTimeout(tourT);tourT=setTimeout(function(){if(!st.tour)return;if(st.busy||st.mode!=='photo')return scheduleTour();var i=ORDER.indexOf(st.sta);photoGo(ORDER[(i+1)%ORDER.length]);scheduleTour()},8500)}
function stopTour(){if(!st.tour)return;st.tour=false;clearTimeout(tourT);$('b-auto').classList.remove('on')}
function hideHint(){$('w-hint').style.opacity=0}
function toggleLabels(){st.labels=!st.labels;$('b-hs').classList.toggle('on',st.labels);if(!st.labels)closeCard()}
function fs(){var d=document;if(!d.fullscreenElement&&!d.webkitFullscreenElement){(d.documentElement.requestFullscreen||d.documentElement.webkitRequestFullscreen).call(d.documentElement)}else{(d.exitFullscreen||d.webkitExitFullscreen).call(d)}}
function shot(){draw();cv.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='Sculpted_Rhythm_'+st.sta+'_'+st.mode+'.png';a.click();var f=$('flash');f.style.transition='none';f.style.opacity=.8;requestAnimationFrame(function(){f.style.transition='opacity .5s';f.style.opacity=0})})}
var gv=$('g-view');
ORDER.forEach(function(k){var b=document.createElement('button');b.className='th';b.dataset.v=k;b.innerHTML='<img alt="" src="'+D.thumbs[k]+'"><span>'+(k==='D'?'Detail':k)+'</span>';b.setAttribute('aria-label',k==='D'?'Detail':k);b.onclick=function(){stopTour();gotoSta(k)};gv.appendChild(b)});
document.querySelectorAll('[data-l]').forEach(function(b){b.onclick=function(){if(st.mode==='pano')panoGo(panoView,b.dataset.l)}});
document.querySelectorAll('[data-m]').forEach(function(b){b.onclick=function(){stopTour();setMode(b.dataset.m)}});
$('b-auto').onclick=toggleTour;$('b-shot').onclick=shot;$('b-full').onclick=fs;$('b-help').onclick=function(){$('help').classList.toggle('show')};
$('b-hs').classList.add('on');$('b-hs').onclick=toggleLabels;
$('card-x').onclick=closeCard;function closeCard(){$('card').classList.remove('show')}
function updateUI(){
 var k=st.sta,S=ST[k];
 document.querySelectorAll('[data-v]').forEach(function(b){b.classList.toggle('on',b.dataset.v===k)});
 document.querySelectorAll('[data-l]').forEach(function(b){b.classList.toggle('on',b.dataset.l===st.light)});
 document.querySelectorAll('[data-m]').forEach(function(b){b.classList.toggle('on',b.dataset.m===st.mode)});
 $('g-light').style.display=st.mode==='pano'?'':'none';
 $('w-tag').textContent=S.tag+' · '+(st.mode==='pano'?'360° · '+LIGHTS[st.light].toUpperCase():'YOUR RENDER');
 $('w-title').textContent=S.name;
 var touch=('ontouchstart' in window);$('w-hint').textContent=st.mode==='pano'?'Drag to look around \u00b7 pinch to zoom':(touch?'Drag to pan \u00b7 tap Tilt to move with your phone':'Move the mouse to look into the render \u00b7 drag to pan');
 $('w-hint').style.opacity=1;clearTimeout(hintT);hintT=setTimeout(hideHint,7000);
}
// hotspots
var hsEls=[];function mkHS(n){while(hsEls.length<n){var b=document.createElement('button');b.className='hs';b.innerHTML='<i></i><span></span>';$('hotspots').appendChild(b);hsEls.push(b)}}
mkHS(6);
function openCard(tag,title,text){$('card-tag').textContent=tag;$('card-title').textContent=title;$('card-text').textContent=text;$('card').classList.add('show')}
function updateHS(){
 var n=0;
 if(st.busy||!st.labels){hsEls.forEach(function(e){e.style.display='none'});return}
 if(st.mode==='photo'){
  var S=ST[st.sta],ph=phA,w=win(ph);
  S.hs.forEach(function(h,i){
   var el=hsEls[i];if(!el)return;
   var d=depthAt(ph,h[3],h[4]),fx=st.ox*AMP[0]*(d-S.focus),fy=st.oy*AMP[1]*ph.ar*(d-S.focus);
   var u=h[3]-fx,v=h[4]-fy,sx=(u-st.cx)/w.hx*.5+.5,sy=(v-st.cy)/w.hy*.5+.5;
   if(sx<-.02||sx>1.02||sy<-.02||sy>1.02){el.style.display='none';return}
   el.firstChild.nextSibling.textContent=h[0];el.onclick=function(){stopTour();openCard(h[0],h[1],h[2])};
   el.style.display='flex';el.style.transform='translate('+(sx*innerWidth).toFixed(1)+'px,'+(sy*innerHeight).toFixed(1)+'px) translate(-11px,-50%)';n++;
  });
  for(var j=S.hs.length;j<hsEls.length;j++)hsEls[j].style.display='none';
 }else{
  var v=PANO[panoView],b=camB(),th=Math.tan(rad(st.fov)/2),as=innerWidth/innerHeight;
  HS3.forEach(function(h,i){
   var el=hsEls[i],d=[h.w[0]-v.w[0],h.w[1]-v.w[1],h.w[2]-v.w[2]],z=d[0]*b.fw[0]+d[1]*b.fw[1]+d[2]*b.fw[2];
   if(z<.3){el.style.display='none';return}
   var x=(d[0]*b.rt[0]+d[1]*b.rt[1]+d[2]*b.rt[2])/z/(th*as),y=(d[0]*b.up[0]+d[1]*b.up[1]+d[2]*b.up[2])/z/th;
   if(Math.abs(x)>1.05||Math.abs(y)>1.05){el.style.display='none';return}
   el.firstChild.nextSibling.textContent=h.tag;el.onclick=function(){openCard(h.tag,h.title,h.text);var dx=h.w[0]-v.w[0],dy=h.w[1]-v.w[1],dz=h.w[2]-v.w[2];aimY=Math.atan2(-dx,-dz);aimP=Math.atan2(dy,Math.hypot(dx,dz));aim=true};
   el.style.display='flex';el.style.transform='translate('+((x*.5+.5)*innerWidth).toFixed(1)+'px,'+((-y*.5+.5)*innerHeight).toFixed(1)+'px) translate(-11px,-50%)';
  });
 }
}
// minimap
var mc=$('map'),mx=mc.getContext('2d'),plan=new Image();plan.src=D.plan;
function drawMap(){
 var w=mc.width,h=mc.height;mx.clearRect(0,0,w,h);if(plan.complete)mx.drawImage(plan,0,0,w,h);
 var a;if(st.mode==='pano'){var b=camB();a=Math.atan2(b.fw[0],b.fw[2])}else{var V=PANO[st.sta]||PANO.C3;a=Math.atan2(-Math.sin(V.yaw),-Math.cos(V.yaw))*-1;a=Math.atan2(-Math.sin(V.yaw),-Math.cos(V.yaw))}
 ['C1','C2','C3'].forEach(function(k){var P=ST[k].pos,px=P[0]/22*w,py=P[1]/20*h,on=k===st.sta;
  if(on){var half=st.mode==='pano'?rad(st.fov*.5)*1.25:rad(34);mx.fillStyle='rgba(182,138,70,.35)';mx.beginPath();mx.moveTo(px,py);mx.arc(px,py,80,PI/2-a-half,PI/2-a+half);mx.closePath();mx.fill()}
  mx.fillStyle=on?'#b6783a':'#123e38';mx.beginPath();mx.arc(px,py,on?10:8,0,7);mx.fill();mx.strokeStyle='#fff';mx.lineWidth=2.5;mx.stroke();
  mx.fillStyle='#fff';mx.font='600 10px Poppins,sans-serif';mx.textAlign='center';mx.textBaseline='middle';mx.fillText(k[1],px,py+.5)});
}
mc.addEventListener('click',function(e){var r=mc.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*22,y=(e.clientY-r.top)/r.height*20,best=null,bd=1e9;
 ['C1','C2','C3'].forEach(function(k){var d=Math.hypot(ST[k].pos[0]-x,ST[k].pos[1]-y);if(d<bd){bd=d;best=k}});if(bd<3){stopTour();gotoSta(best)}});
// tilt / gyro
if('DeviceOrientationEvent' in window&&('ontouchstart' in window||navigator.maxTouchPoints>0)&&MOBILE)$('b-gyro').style.display='';
if(!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen))$('b-full').style.display='none';
var gOff=null;
$('b-gyro').onclick=function(){
 if(st.gyro){st.gyro=false;this.classList.remove('on');return}
 var on=function(){st.gyro=true;gOff=null;$('b-gyro').classList.add('on');hideHint()};
 if(typeof DeviceOrientationEvent.requestPermission==='function')DeviceOrientationEvent.requestPermission().then(function(s){if(s==='granted')on()});else on();
};
function mmul(a,b){var r=[];for(var i=0;i<3;i++)for(var j=0;j<3;j++)r[i*3+j]=a[i*3]*b[j]+a[i*3+1]*b[3+j]+a[i*3+2]*b[6+j];return r}
function Rx(t){var c=Math.cos(t),s=Math.sin(t);return[1,0,0,0,c,-s,0,s,c]}function Ry(t){var c=Math.cos(t),s=Math.sin(t);return[c,0,s,0,1,0,-s,0,c]}function Rz(t){var c=Math.cos(t),s=Math.sin(t);return[c,-s,0,s,c,0,0,0,1]}
addEventListener('deviceorientation',function(e){
 if(!st.gyro||e.alpha==null)return;
 if(st.mode==='photo'){var g=clamp((e.gamma||0)/22,-1,1),b=clamp(((e.beta||0)-55)/22,-1,1);st.tx=g;st.ty=b;st.idle=0;st.pointer=true;return}
 var o=rad((screen.orientation&&screen.orientation.angle)||window.orientation||0);
 var M=mmul(mmul(mmul(mmul(Ry(rad(e.alpha)),Rx(rad(e.beta))),Rz(-rad(e.gamma))),Rx(-PI/2)),Rz(-o));
 var fw=[-M[2],-M[5],-M[8]],y=Math.atan2(-fw[0],-fw[2]),p=Math.asin(clamp(fw[1],-1,1));
 if(gOff===null)gOff=PANO[panoView].yaw-y;st.yaw=y+gOff;st.pitch=p;st.vy=st.vp=0;
});

// ---------------------------------------------------------------- loop
var last=performance.now(),mapT=0;
function frame(now){
 var dt=Math.min(.05,(now-last)/1000),tt=now/1000;last=now;
 if(st.mode==='photo'){
  st.idle+=dt;
  var sway=st.idle>2.5||!st.pointer?1:0,tx=st.tx,ty=st.ty;
  if(sway){var amt=st.tour?.9:.55;tx=Math.sin(tt*.55)*amt;ty=Math.sin(tt*.41+1)*amt*.45}
  var a=1-Math.exp(-dt*(sway?1.6:5));st.ox+=(tx-st.ox)*a;st.oy+=(ty-st.oy)*a;
  if(sway&&!st.drag&&!st.busy&&phA&&st.zoom<1.3){var w=win(phA),r=.5-w.hx;if(r>.02){st.cx+=(.5+Math.sin(tt*.2)*r*.9-st.cx)*(1-Math.exp(-dt*.8))}}
  if(keys.arrowleft)st.cx-=dt*.2;if(keys.arrowright)st.cx+=dt*.2;if(keys.arrowup)st.cy-=dt*.2;if(keys.arrowdown)st.cy+=dt*.2;
 }else{
  var k=dt*60,sp=rad(st.fov)*dt*.9;
  if(keys.arrowleft)st.yaw+=sp;if(keys.arrowright)st.yaw-=sp;if(keys.arrowup)st.pitch+=sp;if(keys.arrowdown)st.pitch-=sp;
  if(!st.drag&&!st.gyro){
   if(aim){var dy=Math.atan2(Math.sin(aimY-st.yaw),Math.cos(aimY-st.yaw)),dp=aimP-st.pitch,aa=1-Math.exp(-dt*4);st.yaw+=dy*aa;st.pitch+=dp*aa;st.vy=st.vp=0;if(Math.abs(dy)+Math.abs(dp)<.004)aim=false}
   else{st.yaw+=st.vy;st.pitch+=st.vp;st.vy*=Math.pow(.92,k);st.vp*=Math.pow(.92,k);if(Math.abs(st.vy)<1e-5)st.vy=0;if(Math.abs(st.vp)<1e-5)st.vp=0}
  }
  if(st.drag)aim=false;clampP();
 }
 if(!st.busy&&st.fade>0&&!fading)st.fade=Math.max(0,st.fade-dt*.9);
 draw();updateHS();
 mapT+=dt;if(mapT>.06){mapT=0;drawMap()}
 requestAnimationFrame(frame);
}
var fading=false;
// ---------------------------------------------------------------- boot
note('Loading your render\u2026');
loadPhoto('C3').then(function(ph){
 phA=ph;phAk='C3';st.sta='C3';st.fade=1;st.zoom=1.25;updateUI();
 $('loader').classList.add('done');
 tween(5200,function(k,e){st.zoom=1.25-.18*e});
 requestAnimationFrame(frame);
 // warm the other photos in the background
 ['C1','C2','D'].forEach(function(k,i){setTimeout(function(){loadPhoto(k)},1500+i*700)});
 window.__rooms={st:st,go:gotoSta,mode:setMode,draw:draw,panoGo:panoGo};
}).catch(function(e){console.error(e);fatal('Could not load the images. If you opened the page from a zip preview, unzip it first, or open the GitHub Pages link.')});

// ---------------------------------------------------------------- fallback (no WebGL 2): simple image viewer
function lite(){
 var L=$('lite'),im=$('lite-img'),k='C3',keysL=['C1','C2','C3','D'];L.style.display='block';cv.style.display='none';
 ['g-mode','g-light','b-gyro','b-full','b-shot','minimap','hotspots','b-hs'].forEach(function(i){var e=$(i);if(e)e.style.display='none'});
 var gv=$('g-view');
 var set=function(n){k=n;im.src=D.photos[ST[n].img].img;$('w-tag').textContent=ST[n].tag+' \u00b7 YOUR RENDER';$('w-title').textContent=ST[n].name;$('w-hint').textContent='Move or tilt to look around';document.querySelectorAll('[data-v]').forEach(function(b){b.classList.toggle('on',b.dataset.v===n)})};
 ORDER.forEach(function(n){var b=document.createElement('button');b.className='th';b.dataset.v=n;b.innerHTML='<img alt="" src="'+D.thumbs[n]+'"><span>'+(n==='D'?'Detail':n)+'</span>';b.onclick=function(){set(n)};gv.appendChild(b)});
 $('b-auto').style.display='none';$('b-help').style.display='none';
 var mv=function(x,y){im.style.transform='translate('+(-x*14).toFixed(1)+'px,'+(-y*8).toFixed(1)+'px)'};
 addEventListener('pointermove',function(e){mv((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2)});
 addEventListener('deviceorientation',function(e){if(e.gamma!=null)mv(clamp(e.gamma/25,-1,1),clamp((e.beta-55)/25,-1,1))});
 set('C3');$('loader').classList.add('done');
}
})();
