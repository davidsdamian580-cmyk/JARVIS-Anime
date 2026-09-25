const state={persona:"JARVIS",style:"futuristic anime assistant",id:"jarvis",messages:[]};
const $=s=>document.querySelector(s);
const chat=$("#chat"), speech=$("#speech"), input=$("#message");
document.querySelectorAll(".persona").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".persona").forEach(x=>x.classList.remove("active")); b.classList.add("active");
 state.persona=b.dataset.name; state.style=b.dataset.style; state.id=b.dataset.id;
 $("#avatar").textContent=b.dataset.id==="jarvis"?"AI":b.dataset.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
 $("#coreLabel").textContent=b.dataset.name.toUpperCase();
 speech.textContent=`Persona switched to ${b.dataset.name}.`;
}));
function add(role,text){const d=document.createElement("div");d.className=`msg ${role==="user"?"user":"ai"}`;d.innerHTML=`<div class="meta">${role==="user"?"YOU":state.persona}</div>${escapeHtml(text)}`;chat.appendChild(d);chat.scrollTop=chat.scrollHeight}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
async function sendMessage(text){
 text=text.trim(); if(!text)return; add("user",text); input.value=""; speech.textContent="Thinking...";
 state.messages.push({role:"user",content:text});
 try{
  const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,persona:state.persona,style:state.style,history:state.messages.slice(-12)})});
  const data=await r.json(); if(!r.ok) throw new Error(data.error||"Request failed");
  const reply=data.reply||"I couldn't generate a response.";
  state.messages.push({role:"assistant",content:reply}); add("assistant",reply); speech.textContent=reply;
  speak(reply);
 }catch(e){speech.textContent="Backend connection problem.";add("assistant","I couldn't reach the AI backend. Check that your Cloudflare Worker has the OPENAI_API_KEY secret.");}
}
$("#form").addEventListener("submit",e=>{e.preventDefault();sendMessage(input.value)});
function speak(t){if("speechSynthesis"in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.rate=.98;speechSynthesis.speak(u)}}
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR){const rec=new SR();rec.lang="en-US";rec.interimResults=false;$("#mic").onclick=()=>{rec.start();speech.textContent="Listening..."};rec.onresult=e=>{input.value=e.results[0][0].transcript;sendMessage(input.value)};rec.onerror=()=>speech.textContent="Voice input unavailable."}else $("#mic").disabled=true;
add("assistant","Online. Select an anime persona and ask me something.");