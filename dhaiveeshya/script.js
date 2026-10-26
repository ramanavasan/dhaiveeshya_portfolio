(function(){
var $=function(s,r){return(r||document).querySelector(s)},reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function ini(){return $('#name').textContent.trim().split(/\s+/).map(function(w){return w[0]}).join('').slice(0,2).toUpperCase()||'DA'}
function syncName(){var i=ini();$('#ini').textContent=i;$('#fname').textContent=$('#name').textContent.replace(/[\[\]]/g,'')}
$('#name').addEventListener('input',syncName);syncName();$('#yr').textContent=new Date().getFullYear();
/* upload helpers (images stay local to the viewer's browser) */
function wire(lbl){var inp=$('input',lbl);lbl.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();inp.click()}});
inp.addEventListener('change',function(){var f=inp.files[0];if(!f)return;var im=$('img',lbl)||lbl.appendChild(document.createElement('img'));im.src=URL.createObjectURL(f);im.alt=f.name.replace(/\.\w+$/,'');im.loading='lazy';im.onclick=null})}
function slot(c,n,cap){for(var i=0;i<n;i++){var h;if(cap){h='<figure><label class="ph" tabindex="0"><span>Add photo</span><input type="file" accept="image/*" hidden></label><figcaption><small contenteditable="true">Date (optional)</small><span contenteditable="true">Short caption</span></figcaption></figure>'}else h='<label class="ph" tabindex="0"><span>Add photo</span><input type="file" accept="image/*" hidden></label>';c.insertAdjacentHTML('beforeend',h)}}
document.querySelectorAll('.ph,.portrait').forEach(wire);
/* nav */
$('#burger').onclick=function(){var o=$('#links').classList.toggle('open');this.setAttribute('aria-expanded',o)};
document.querySelectorAll('.links a').forEach(function(a){a.onclick=function(){$('#links').classList.remove('open')}});
addEventListener('scroll',function(){var h=document.documentElement;$('#prog').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';},{passive:true});
var secs=[].slice.call(document.querySelectorAll('main section[id]'));addEventListener('scroll',function(){var y=scrollY+140,cur='home';secs.forEach(function(x){if(x.offsetTop<=y)cur=x.id});document.querySelectorAll('.links a').forEach(function(a){a.classList.toggle('act',a.getAttribute('href')==='#'+cur)})},{passive:true});var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.rv').forEach(function(x){io.observe(x)});
/* project slider */
var sl=$('#slider'),tm;function step(d){var c=sl.firstElementChild.offsetWidth+22;if(d>0&&sl.scrollLeft+sl.clientWidth>=sl.scrollWidth-4)sl.scrollTo({left:0});else if(d<0&&sl.scrollLeft<4)sl.scrollTo({left:sl.scrollWidth});else sl.scrollBy({left:d*c})}
$('#prev').onclick=function(){step(-1)};$('#next').onclick=function(){step(1)};
function auto(){if(reduce)return;clearInterval(tm);tm=setInterval(function(){if(!document.hidden)step(1)},4500)}
['mouseenter','focusin','touchstart'].forEach(function(e){sl.parentNode.addEventListener(e,function(){clearInterval(tm)},{passive:true})});['mouseleave','focusout'].forEach(function(e){sl.parentNode.addEventListener(e,auto)});auto();
/* resume download */
var RPDF='';
$('#rdl').onclick=async function(){var m=$('#rmsg');m.textContent='';try{var d=typeof claude!=='undefined'&&await claude.use('downloads');if(!d){var a=document.createElement('a');a.href='assets/resume.pdf';a.download='Dhaiveeshya_A_Resume.pdf';document.body.appendChild(a);a.click();a.remove();return}
var b=atob(RPDF),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);await d.save({filename:'Dhaiveeshya_A_Resume.pdf',data:new Blob([u],{type:'application/pdf'})})}catch(e){if(!e||e.code!=='declined')m.textContent='Could not start the download here. Open the resume and save the image instead.'}};
/* resume viewer */
var rm=$('#rm');function ro(){$('#rm img').src=$('#rbtn img').src;rm.classList.add('on');$('#rx').focus()}function rc(){rm.classList.remove('on')}
$('#rbtn').onclick=ro;$('#rview').onclick=ro;var hrv=$('#hero-rview');if(hrv)hrv.onclick=ro;$('#rx').onclick=rc;rm.addEventListener('click',function(e){if(e.target===rm)rc()});addEventListener('keydown',function(e){if(e.key==='Escape')rc()});
/* resume download + live demo (need viewer capabilities) */
if(window.claude&&claude.use){
claude.use('sample').then(function(sm){if(!sm)return;return Promise.resolve(sm.limits()).then(function(l){if(!l||!l.images)return;var f=null;$('#demo').hidden=false;
$('#dfile').onchange=function(){f=this.files[0];if(!f)return;var p=$('#dprev');p.src=URL.createObjectURL(f);p.hidden=false;$('#dgo').disabled=false;$('#dout').textContent=''};
$('#dpick').onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#dfile').click()}};
$('#dgo').onclick=function(){if(!f)return;var o=$('#dout'),b=this;b.disabled=true;o.textContent='Thinking...';
sm('Look at this photo. If it clearly shows a human face, name the most likely emotion (happy, sad, angry, surprised, fearful, disgusted or neutral) and give one short sentence about the visible cues. If there is no clear face, say so. Keep it under 40 words. This is a casual demo.',{images:[f],modelTier:'quick',cache:false,onText:function(t){o.textContent=t.text}}).then(function(r){o.textContent=r.text},function(e){o.textContent=(e&&e.code==='not_granted')?'Permission was not granted.':'The demo could not run right now.'}).then(function(){b.disabled=false})}})}).catch(function(){})}
/* typed subtitle */
var txt='B.Tech AI & DS Student',tp=$('#typed');function type(){if(reduce){tp.textContent=txt;return}var i=0;(function s(){tp.textContent=txt.slice(0,++i);if(i<txt.length)setTimeout(s,55)})()}
/* intro */
var done=false;function go(){if(done)return;done=true;$('#intro').classList.add('out');document.body.classList.add('ready');setTimeout(function(){$('#intro').remove()},1100);setTimeout(type,500);startRibbon()}
$('#skip').onclick=go;
if(document.readyState==='complete')setTimeout(go,reduce?0:2300);else addEventListener('load',function(){setTimeout(go,reduce?0:2200)});
/* ribbon cursor */
function startRibbon(){
if(reduce||!matchMedia('(hover:hover) and (pointer:fine) and (min-width:900px)').matches)return;
try{
var cv=$('#rib'),cx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),W,H,pts=[],N=26,mx=-99,my=-99,hx=-99,hy=-99,raf=0,last=0,tight=0,bursts=[],t0=0,moved=false;
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}size();addEventListener('resize',size);
document.documentElement.classList.add('rc');
var dot=document.createElement('div');dot.style.cssText='position:fixed;left:0;top:0;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:#AD7796;box-shadow:0 0 0 4px rgba(244,189,211,.5);pointer-events:none;z-index:95;transition:transform .25s';document.body.appendChild(dot);
function mv(e){mx=e.clientX;my=e.clientY;if(!moved){hx=mx;hy=my;moved=true}dot.style.left=mx+'px';dot.style.top=my+'px';var el=e.target.closest&&e.target.closest('a,button,.btn,input,textarea,label');tight=el?1:0;dot.style.transform=tight?'scale(1.8)':'scale(1)';kick()}
function dn(e){for(var i=0;i<14;i++){var a=i/14*6.283;bursts.push({x:e.clientX,y:e.clientY,a:a,r:2,l:1})}kick()}
addEventListener('mousemove',mv,{passive:true});addEventListener('mousedown',dn);
function kick(){if(!raf)raf=requestAnimationFrame(draw)}
function col(i,a){var k=i/N,r=Math.round(244+(198-244)*k),g=Math.round(189+(181-189)*k),b=Math.round(211+(240-211)*k);return'rgba('+r+','+g+','+b+','+a+')'}
function draw(ts){raf=0;t0=ts;cx.clearRect(0,0,W,H);
hx+=(mx-hx)*.28;hy+=(my-hy)*.28;
var dx=mx-hx,dy=my-hy,idle=Math.abs(dx)+Math.abs(dy)<.4;
pts.unshift({x:hx,y:hy});var maxN=idle?0:N;
if(idle&&pts.length)pts.length=Math.max(0,pts.length-2);else if(pts.length>N)pts.length=N;
/* ribbon as tapered swirling segments */
var amp=tight?3:11;
for(var i=pts.length-1;i>0;i--){var p=pts[i],q=pts[i-1],k=1-i/N,ang=Math.atan2(q.y-p.y,q.x-p.x)+1.5708,w=Math.sin(ts/140+i*.55)*amp*k;
cx.beginPath();cx.moveTo(p.x+Math.cos(ang)*w,p.y+Math.sin(ang)*w);var w2=Math.sin(ts/140+(i-1)*.55)*amp*(1-(i-1)/N);
cx.lineTo(q.x+Math.cos(ang)*w2,q.y+Math.sin(ang)*w2);cx.lineCap='round';cx.lineWidth=(tight?1.5:1)+k*5;cx.strokeStyle=col(i,k*.8);cx.stroke();
/* delicate highlight */
cx.lineWidth=.7;cx.strokeStyle='rgba(255,255,255,'+(k*.7)+')';cx.stroke()}
/* click swirl burst */
for(var j=bursts.length-1;j>=0;j--){var b=bursts[j];b.a+=.18;b.r+=2.4;b.l-=.05;if(b.l<=0){bursts.splice(j,1);continue}
cx.beginPath();cx.arc(b.x+Math.cos(b.a)*b.r,b.y+Math.sin(b.a)*b.r,2.2*b.l,0,6.283);cx.fillStyle=col(j%N,b.l*.8);cx.fill()}
if(pts.length||bursts.length||!idle)raf=requestAnimationFrame(draw)}
}catch(err){document.documentElement.classList.remove('rc')}}
})();
