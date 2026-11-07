const $=i=>document.getElementById(i),T0=()=>new Date().toISOString().slice(0,10);
let S=JSON.parse(localStorage.nf||'null')||{p:null,dia:[],pts:0,st:0,last:'',bd:[],th:0,ch:{},q:{},n:0},FF={};
const sv=()=>localStorage.nf=JSON.stringify(S),nm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
const FE=[['f1','🧬','Hồ sơ & dị ứng','BMI, calo, nước uống mỗi ngày'],['f2','🔎','Tra cứu thông minh','252 món Bắc – Trung – Nam'],['f3','📷','Camera AI','Chụp món ăn, biết ngay dinh dưỡng'],['f4','🍱','Thực đơn khoa học','3 bữa cân đối, đổi theo ý thích'],['f5','📒','Nhật ký theo dõi','Biểu đồ calo và lời khuyên'],['f6','🏆','Học mà chơi','Điểm, huy hiệu, 9 giao diện']];
$('nv').innerHTML=FE.map(f=>`<a href="#${f[0]}" id="n${f[0]}">${f[2].split(' ')[0]=='Hồ'?'Hồ sơ':f[2]}</a>`).join('');
$('fg').innerHTML=FE.map(f=>`<div class="fc" onclick="go('${f[0]}')"><i>${f[1]}</i><h3>${f[2]}</h3><p class="mu">${f[3]}</p></div>`).join('');
function go(id){location.hash=id}
function route(){const id=(location.hash||'#home').slice(1);document.querySelectorAll('section').forEach(s=>s.classList.toggle('on',s.id==id));FE.forEach(f=>$('n'+f[0]).classList.toggle('on',f[0]==id));scrollTo(0,0);if(id=='f4')menu(1);if(id=='f5')diary();if(id=='f6')game()}
addEventListener('hashchange',route);
function toast(m){const t=$('tt');t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2600)}
function pts(n,w){S.pts+=n;sv();toast('+'+n+' điểm · '+w);hud()}
const LV=[0,100,250,450,700,1000,1400,1900,2500],lv=()=>LV.filter(x=>S.pts>=x).length-1;
function hud(){$('pc').textContent='⭐ '+S.pts+' · 🔥 '+S.st;if($('gp')){$('gp').textContent=S.pts;$('gs').textContent=S.st;$('gl2').textContent=lv()+1}}
// hồ sơ
function saveP(){const p={n:pn.value,a:+pa.value,s:ps.value,h:+ph.value,w:+pw.value,t:+pt.value,al:pl.value.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean)};
if(!(p.a>=15&&p.a<=22&&p.h>100&&p.w>20))return toast('Hãy nhập tuổi 15–22, chiều cao và cân nặng hợp lệ');
const bmr=10*p.w+6.25*p.h-5*p.a+(p.s=='Nam'?5:-161);p.bmi=+(p.w/(p.h/100)**2).toFixed(1);p.kcal=Math.round(bmr*p.t/50)*50;p.wt=+(p.w*.035).toFixed(1);
const first=!S.p;S.p=p;sv();showP();if(first)pts(20,'tạo hồ sơ')}
function showP(){const p=S.p;if(!p)return;const c=p.bmi<18.5?'Thiếu cân':p.bmi<25?'Bình thường':p.bmi<30?'Thừa cân':'Béo phì';
pr.innerHTML=`<div class="tiles"><div class="tl"><b>${p.bmi}</b><small>BMI · ${c}</small></div><div class="tl"><b>${p.kcal.toLocaleString('vi')}</b><small>kcal mỗi ngày</small></div><div class="tl"><b>${p.wt} L</b><small>nước mỗi ngày</small></div></div>`+(p.al.length?`<div class="tip">Đã lưu dị ứng: ${p.al.join(', ')}. Ứng dụng sẽ cảnh báo ngay khi món ăn liên quan.</div>`:'')}
function fill(){const p=S.p;if(!p)return;pn.value=p.n;pa.value=p.a;ps.value=p.s;ph.value=p.h;pw.value=p.w;pt.value=p.t;pl.value=p.al.join(', ');showP()}
// dị ứng
const AS={'tôm':'tôm','cua':'cua','hải sản':'tôm,cua,ốc,hến,mực,sứa,cá,trai,lươn','sữa':'sữa,phô mai,latte,milo,bạc xỉu,cheese,pizza,kem','trứng':'trứng,pudding','đậu phộng':'đậu phộng,lạc,bánh tráng trộn,bún đậu','gluten':'mì,bánh mì,pizza,hamburger,sandwich,taco,hot dog,nuggets','cá':'cá','đậu nành':'đậu phụ,đậu hũ,đậu nành'};
function alg(n,extra){if(!S.p)return[];const t=n.toLowerCase()+' '+(extra||'').toLowerCase();return S.p.al.filter(a=>(AS[a]||a).split(',').some(k=>t.includes(k)))}
// tra cứu
function sug(){const q=nm(sq.value.trim());if(!q)return sg.innerHTML='';sg.innerHTML='<div class="sg">'+D.filter(d=>nm(d[0]).includes(q)).slice(0,8).map(d=>`<div onclick="pick('${d[0].replace(/'/g,"\\'")}')">${d[0]} <span class="mu">· ${d[2]} kcal</span></div>`).join('')+'</div>'}
function pick(n){sq.value=n;look()}
function mk(d){return{n:d[0],por:d[1],k:d[2],p:d[3],f:d[4],c:d[5],o:d[6],al:alg(d[0])}}
async function look(){sg.innerHTML='';const q=nm(sq.value.trim());if(!q)return;S.n++;const d=D.find(x=>nm(x[0])==q)||D.find(x=>nm(x[0]).includes(q));r2.hidden=false;
if(d){pts(2,'tra cứu');return showF('r2',mk(d))}
r2.innerHTML='<p class="mu">Đang nhờ Gemini tra cứu…</p>';try{showF('r2',await aiFood([{text:'Món ăn: '+sq.value}]))}catch(e){r2.innerHTML='<p>'+e.message+'</p>'}}
function tip(f){return f.tip||(f.k>=550?'Món nhiều năng lượng, hãy chia nhỏ khẩu phần và ăn kèm rau.':f.p>=25?'Giàu đạm, tốt cho cơ bắp và sự phát triển.':f.c>60?'Nhiều tinh bột, nên thêm rau xanh và nguồn đạm.':f.f>25?'Khá nhiều chất béo, hạn chế ăn thường xuyên.':'Món khá cân đối, nhớ ăn kèm rau và trái cây.')}
function showF(el,f,m){m=m||1;FF[el]=f;const v=x=>Math.round(x*m*10)/10,a=f.al||[],L=el=='r3'?['Ít','Vừa','Nhiều']:['S','M','L'],M=[.7,1,1.3];
$(el).hidden=false;$(el).innerHTML=(a.length?`<div class="al">⚠ Cảnh báo: món này có chứa ${a.join(', ')}!</div>`:'')+`<h3>${f.n}</h3><p class="mu">${f.por||''}${f.o?' · Đặc sản: '+f.o:''}</p><div class="sz">${M.map((x,i)=>`<button class="btn s ${x==m?'on':''}" onclick="showF('${el}',FF['${el}'],${x})">${L[i]}</button>`).join('')}</div>
<div class="tiles"><div class="tl"><b>${v(f.k)}</b><small>kcal</small></div><div class="tl"><b>${v(f.p)} g</b><small>đạm</small></div><div class="tl"><b>${v(f.f)} g</b><small>béo</small></div><div class="tl"><b>${v(f.c)} g</b><small>carb</small></div></div>${f.vit?`<p class="mu">Vitamin &amp; khoáng chất: ${f.vit}</p>`:''}<div class="tip">${tip(f)}</div><button class="btn" style="margin-top:12px" onclick="add('${el}',${m})">Lưu vào nhật ký</button>`}
function add(el,m){const f=FF[el],v=x=>Math.round(x*m*10)/10;S.dia.push({d:T0(),n:f.n,k:v(f.k),p:v(f.p),f:v(f.f),c:v(f.c)});sv();pts(10,'ghi nhật ký')}
// AI
async function ai(parts){if(!localStorage.nfk){dk.showModal();throw Error('Hãy nhập API key Gemini ở cửa sổ vừa mở.')}
const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':localStorage.nfk},body:JSON.stringify({contents:[{parts}],generationConfig:{responseMimeType:'application/json',temperature:.4,thinkingConfig:{thinkingBudget:0}}})});
if(!r.ok)throw Error(r.status==429?'AI đang hết quota tạm thời, hãy thử lại sau ít phút.':r.status==400||r.status==403?'API key chưa đúng, hãy kiểm tra lại ở nút ⚙.':'Lỗi kết nối AI ('+r.status+')');
return JSON.parse((await r.json()).candidates[0].content.parts[0].text)}
async function aiFood(parts){const j=await ai([...parts,{text:'Bạn là chuyên gia dinh dưỡng Việt Nam. Xác định món ăn và trả JSON: {"n":tên món,"por":khẩu phần tham khảo,"k":kcal,"p":gam đạm,"f":gam béo,"c":gam carb,"vit":vitamin và khoáng chất chính,"o":tỉnh/thành đặc sản theo đơn vị hành chính mới của Việt Nam, để "" nếu món phổ biến khắp nơi,"ing":[nguyên liệu chính],"al":[chất gây dị ứng thường gặp],"tip":một lời khuyên ngắn cho học sinh THPT}. Số liệu là số.'}]);
j.al=alg(j.n,(j.ing||[]).join(' ')+' '+(j.al||[]).join(' '));return j}
function snap(i){const fl=i.files[0];if(!fl)return;const im=new Image();im.onload=async()=>{const k=Math.min(1,768/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);const u=c.toDataURL('image/jpeg',.8);pv.src=u;pv.style.display='block';r3.hidden=false;r3.innerHTML='<p class="mu">AI đang phân tích món ăn…</p>';S.n++;
try{showF('r3',await aiFood([{inline_data:{mime_type:'image/jpeg',data:u.split(',')[1]}}]))}catch(e){r3.innerHTML='<p>'+e.message+'</p>'}i.value=''};im.src=URL.createObjectURL(fl)}
function saveK(){localStorage.nfk=ky.value.trim();dk.close();toast('Đã lưu API key')}
// thực đơn
const FR=['Chuối (1 quả)','Cam (1 quả)','Ổi (1 quả)','Táo (1 quả)','Đu đủ (1 chén)'],rn=a=>a[Math.random()*a.length|0];let MN=null;
function menu(keep){if(!S.p){mn.innerHTML='<p class="mu">Hãy <a href="#f1">tạo hồ sơ</a> để nhận thực đơn phù hợp.</p>';return}if(keep&&MN)return draw();const T=S.p.kcal,ok=D.filter(d=>!alg(d[0]).length&&d[2]<720),veg=ok.filter(d=>/^(rau|canh|gỏi|nộm)/i.test(d[0])&&d[2]<200);
const pick=(re,s)=>{const c=ok.filter(d=>re.test(d[0])&&d[2]>=T*s*.4&&d[2]<=T*s*.8);return rn(c.length?c:ok.filter(d=>d[2]<=T*s))};
MN=[['Sáng',[pick(/phở|bún|bánh mì|cháo|xôi|mì|miến|hủ tiếu/i,.3)],FR[0]],['Trưa',[pick(/cơm/i,.4),rn(veg)],rn(FR)],['Tối',[pick(/cơm|bún|mì|phở|hủ tiếu/i,.3),rn(veg)],rn(FR)]];draw();toast('Đã tạo thực đơn mới')}
function draw(){let tot=0;mn.innerHTML=MN.map(m=>{const it=m[1].filter(Boolean);const k=it.reduce((a,d)=>a+d[2],0)+90;tot+=k;return`<div class="card" style="background:#f3f9ff;box-shadow:none"><h3>Bữa ${m[0].toLowerCase()} · ${k} kcal</h3>${it.map(d=>`<div class="row"><span>${d[0]} <small class="mu">${d[1]}</small></span><b>${d[2]} kcal</b></div>`).join('')}<div class="row"><span>${m[2]} <small class="mu">trái cây</small></span><b>90 kcal</b></div></div>`}).join('')+`<div class="tip">Tổng khoảng ${tot} kcal, mục tiêu của bạn là ${S.p.kcal} kcal. Thực đơn có tinh bột, đạm, béo, rau xanh và trái cây.</div>`}
// nhật ký
const td=()=>S.dia.filter(x=>x.d==T0());
function diary(){const L=td(),T=S.p?S.p.kcal:2000,e=Math.round(L.reduce((a,b)=>a+b.k,0)),P=L.reduce((a,b)=>a+b.p,0)*4,F=L.reduce((a,b)=>a+b.f,0)*9,C=L.reduce((a,b)=>a+b.c,0)*4,s=P+F+C||1;
const x=rg.getContext('2d');x.clearRect(0,0,240,240);x.lineWidth=26;x.lineCap='round';x.strokeStyle='#dbeafe';x.beginPath();x.arc(120,120,95,0,7);x.stroke();x.strokeStyle=e>T?'#e5384a':'#2f8cff';x.beginPath();x.arc(120,120,95,-1.5708,-1.5708+6.2832*Math.min(e/T,1));x.stroke();x.fillStyle='#0b3a6b';x.textAlign='center';x.font='800 34px Be Vietnam Pro';x.fillText(e,120,125);x.font='14px Be Vietnam Pro';x.fillStyle='#5b7a99';x.fillText('/ '+T+' kcal',120,150);
mc.innerHTML=[['Tinh bột',C,'#2f8cff'],['Đạm',P,'#17a870'],['Béo',F,'#f5a524']].map(m=>`<label>${m[0]} · ${Math.round(m[1]/s*100)}%<div class="bar"><i style="width:${m[1]/s*100}%;background:${m[2]}"></i></div></label>`).join('');
tp.textContent=!L.length?'Chưa có món nào hôm nay. Hãy tra cứu hoặc chụp món ăn rồi lưu vào nhật ký.':!L.some(d=>/rau|canh|gỏi|nộm|salad/i.test(d.n))?'Hôm nay bạn thiếu chất xơ, hãy thêm rau xanh hoặc trái cây.':e>T*1.1?'Bạn đã vượt mục tiêu calo, bữa sau hãy ăn nhẹ hơn.':P/s<.15?'Hôm nay bạn hơi thiếu đạm, thử thêm trứng, cá hoặc đậu phụ.':'Chế độ ăn hôm nay khá cân đối. Tiếp tục phát huy!';
dl.innerHTML=L.map((d,i)=>`<div class="row"><span>${d.n}</span><span><b>${d.k} kcal</b> <button class="btn s" style="padding:3px 10px" onclick="del(${S.dia.indexOf(d)})">Xóa</button></span></div>`).join('')||'<p class="mu">Trống</p>'}
function del(i){S.dia.splice(i,1);sv();diary()}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='nutrifuture-'+T0()+'.json';a.click()}
function imp(i){const r=new FileReader();r.onload=()=>{try{S=JSON.parse(r.result);sv();location.reload()}catch{toast('File JSON không hợp lệ')}};r.readAsText(i.files[0])}
// gamification
const TH=[['Khởi đầu xanh','linear-gradient(#eaf6ff,#d3ecff)','120,190,255',-.6,0,1],['Rạng đông','radial-gradient(circle at 85% 0,#ffd98a,transparent 45%),linear-gradient(#fff6e6,#dff1ff)','255,200,120',-.3,.1,2],['Thiên lam','linear-gradient(#bfe6ff,#7cc4f2)','255,255,255',0,.5,3],['Cực quang','linear-gradient(120deg,#0b3a5c,#1fa37a,#6a5cff,#0b3a5c)','120,255,200',-.3,.1,1],['Hành tinh','radial-gradient(#1b2a5a,#070b1f)','140,220,255',-.15,.1,1],['Hoàng kim','linear-gradient(#fff8e1,#ffe9a8)','230,170,40',.7,0,1],['Thần quang','radial-gradient(#fff,#fdf3d8 45%,#e9e4ff)','255,215,130',.35,.25,4],['Vĩnh Hằng','linear-gradient(#2b0a05,#7a1d05)','255,140,40',-1.4,0,1],['Ngân hà','radial-gradient(#2a1458,#05020f)','255,255,255',.02,.05,5]],BD=[['Người mới',()=>S.p],['Ăn uống lành mạnh',()=>S.dia.filter(d=>/rau|canh|gỏi|nộm/i.test(d.n)).length>=5],['7 ngày liên tục',()=>S.st>=7],['Nhà thám hiểm',()=>S.n>=10],['Thủ lĩnh điểm số',()=>S.pts>=500]];
let cv=bg.getContext('2d'),P=[],th=0,pv_;
function setTh(i){th=i;const t=TH[i];document.body.style.background=t[1];document.body.className='t'+(i+1);P=[];if(!matchMedia('(prefers-reduced-motion:reduce)').matches)for(let k=0;k<(i==8?110:i==7?50:34);k++)P.push({x:Math.random(),y:Math.random(),r:(Math.random()*14+5)*(i==8?.2:1)*(i==2?3:1),s:Math.random()+.4,w:Math.random()*6})}
function loop(t){bg.width=innerWidth;bg.height=innerHeight;const T=TH[th];P.forEach(p=>{p.y+=T[3]*p.s/300;p.x+=T[4]*p.s/600+Math.sin(t/1500+p.w)*.0006;if(p.y<-.05)p.y=1.05;if(p.y>1.05)p.y=-.05;if(p.x>1.05)p.x=-.05;const X=p.x*bg.width,Y=p.y*bg.height;cv.beginPath();
if(th==6)cv.ellipse(X,Y,p.r*1.6,p.r*.5,t/2000+p.w,0,7);else cv.arc(X,Y,th==8?p.r*(.6+.4*Math.sin(t/400+p.w)):p.r,0,7);
if(th==0||th==3){cv.fillStyle=`rgba(${T[2]},.12)`;cv.fill();cv.strokeStyle=`rgba(${T[2]},.6)`;cv.stroke()}else{cv.fillStyle=`rgba(${T[2]},${th==2?.25:.65})`;cv.fill()}});
if(th==8&&(t%7000)<500){const q=(t%7000)/500;cv.strokeStyle='#fff';cv.beginPath();cv.moveTo(bg.width*(.2+q*.5),bg.height*q*.5);cv.lineTo(bg.width*(.2+q*.5)-90,bg.height*q*.5-50);cv.stroke()}requestAnimationFrame(loop)}
function game(){hud();const w=new Date(),k=T0().slice(0,8),V=[...new Set(S.dia.filter(d=>(w-new Date(d.d))<6048e5&&/rau|canh|gỏi|nộm/i.test(d.n)).map(d=>d.n))].length;
cb.style.width=Math.min(V/5,1)*100+'%';ct.textContent=V+'/5 loại rau củ'+(S.ch[k+Math.floor(w.getDate()/7)]?' · Đã nhận thưởng':'');const ck=k+Math.floor(w.getDate()/7);if(V>=5&&!S.ch[ck]){S.ch[ck]=1;pts(50,'hoàn thành thử thách tuần')}
bg2.innerHTML=BD.map(b=>`<span class="bd ${b[1]()?'ok':''}">${b[1]()?'🏅 ':'🔒 '}${b[0]}</span>`).join('');
tg.innerHTML=TH.map((t,i)=>`<div class="th ${i==S.th?'cur':''} ${i>lv()?'lk':''}" onclick="prev(${i})"><b>Cấp ${i+1}</b><br>${t[0]}<br><small class="mu">${i>lv()?'🔒 '+LV[i]+' điểm':i==S.th?'Đang dùng':'Đã mở khóa'}</small>${i<=lv()&&i!=S.th?`<br><button class="btn s" style="margin-top:6px;padding:4px 12px" onclick="event.stopPropagation();S.th=${i};sv();setTh(${i});game()">Dùng</button>`:''}</div>`).join('')}
function prev(i){setTh(i);toast('Xem thử 5 giây');clearTimeout(pv_);pv_=setTimeout(()=>setTh(S.th),5000)}
const QB=[{q:'Nhóm chất nào là nguồn năng lượng chính của cơ thể?',a:['Tinh bột','Vitamin','Nước','Khoáng chất'],c:0},{q:'Mỗi ngày nên ăn tối thiểu bao nhiêu gam rau và trái cây?',a:['100 g','400 g','50 g','1 kg'],c:1},{q:'Chất nào giúp xây dựng và phục hồi cơ bắp?',a:['Đường','Chất béo','Chất đạm','Muối'],c:2},{q:'Vitamin C có nhiều nhất trong thực phẩm nào?',a:['Cam, ổi','Gạo','Thịt heo','Dầu ăn'],c:0},{q:'1 gam chất béo cung cấp khoảng bao nhiêu kcal?',a:['4','9','2','7'],c:1}];
async function quiz(){const k=T0();if(S.q[k]&&S.q[k].done)return toast('Hôm nay bạn đã làm xong, mai quay lại nhé!');qz.innerHTML='<p class="mu">AI đang soạn câu hỏi…</p>';let Q;try{Q=await ai([{text:'Tạo 5 câu trắc nghiệm dinh dưỡng khác nhau cho học sinh THPT Việt Nam, xếp từ khó đến dễ, mã ngẫu nhiên '+Math.random()+'. Trả JSON mảng [{"q":câu hỏi,"a":[4 đáp án],"c":chỉ số đáp án đúng}].'}]);if(!Array.isArray(Q)||Q.length<5)throw 0}catch(e){Q=QB}
let i=0,ok=0;const show=()=>{if(i>4){S.q[k]={done:1};sv();qz.innerHTML=`<h3>Hoàn thành: đúng ${ok}/5 câu</h3>`;if(ok==5)toast('Tuyệt đối! Điểm tuyệt đối 🎉');return}const x=Q[i];qz.innerHTML=`<p><b>Câu ${i+1}/5:</b> ${x.q}</p>`+x.a.map((a,j)=>`<button data-j="${j}">${a}</button>`).join('');qz.querySelectorAll('button').forEach(b=>b.onclick=()=>{const j=+b.dataset.j;qz.querySelectorAll('button').forEach((o,n)=>{o.disabled=1;if(n==x.c)o.classList.add('ok')});if(j==x.c){ok++;pts(20,'trả lời đúng')}else b.classList.add('no');i++;setTimeout(show,1300)})};show()}
// khởi động
if(S.last!=T0()){const y=new Date(Date.now()-864e5).toISOString().slice(0,10);S.st=S.last==y?S.st+1:1;S.last=T0();sv();if(S.st>1)setTimeout(()=>pts(10,'chuỗi '+S.st+' ngày'),800)}
fill();setTh(Math.min(S.th,lv()));hud();route();requestAnimationFrame(loop);
