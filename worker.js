export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null,{headers:cors()});
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const message = String(body.message || "").trim();
        if (!message) return json({error:"Message is required"},400);
        const persona = String(body.persona || "JARVIS");
        const style = String(body.style || "futuristic anime assistant");
        const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
        const instructions = `You are ${persona}, an original anime-inspired AI persona with a ${style} personality.
Do not claim to be the copyrighted character from any existing anime. You may use broad genre traits such as energetic, calm, heroic, tactical, or magical.
Stay helpful, concise, friendly, and safe. You are a web AI assistant, not a real-world device controller.
If the user asks for current information that you cannot verify, say so rather than inventing it.`;
        const input = history.length ? history : message;
        const response = await fetch("https://api.openai.com/v1/responses",{
          method:"POST",
          headers:{"Authorization":`Bearer ${env.OPENAI_API_KEY}`,"Content-Type":"application/json"},
          body:JSON.stringify({model:env.OPENAI_MODEL||"gpt-5.6-luna",instructions,input,max_output_tokens:700})
        });
        const data=await response.json();
        if(!response.ok) return json({error:data.error?.message||"OpenAI request failed"},500);
        let reply=data.output_text||"";
        if(!reply && Array.isArray(data.output)){
          reply=data.output.flatMap(x=>x.content||[]).map(x=>x.text||"").filter(Boolean).join("\\n");
        }
        return json({reply:reply||"I have no response yet."},200);
      } catch(e){ return json({error:"Server error"},500); }
    }
    return env.ASSETS.fetch(request);
  }
};
function cors(){return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"GET,POST,OPTIONS"}}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json",...cors()}})}