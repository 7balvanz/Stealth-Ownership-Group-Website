const json = (body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname!='/api/inquiry')return env.ASSETS.fetch(request);
  if(request.method!=='POST')return json({error:'Method not allowed'},405);
  if(request.headers.get('origin')!==url.origin)return json({error:'Invalid request origin'},403);
  if(Number(request.headers.get('content-length')||0)>20000)return json({error:'Message too large'},413);
  let data;try{const raw=await request.text();if(raw.length>20000)return json({error:'Message too large'},413);data=JSON.parse(raw)}catch{return json({error:'Invalid request'},400)}
  if(data.website)return json({success:true});
  const limits={name:120,email:200,company:200,message:6000,inquiry:30};
  for(const [k,max]of Object.entries(limits))if(typeof data[k]!=='string'||data[k].length>max)return json({error:'Please check your details.'},400);
  const {name,email,company,message,inquiry}=data;
  if(!name.trim()||!message.trim()||!/^\S+@\S+\.\S+$/.test(email)||/[\r\n]/.test(email)||!['acquisition','management','investor','general'].includes(inquiry))return json({error:'Please check your details.'},400);
  if(!env.CONTACT_EMAIL||!env.INQUIRY_TO)return json({error:'Email delivery is temporarily unavailable. Please try again later.'},503);
  try{
   await env.CONTACT_EMAIL.send({from:'contact@stealthownershipgroup.com',to:env.INQUIRY_TO,replyTo:email,subject:'SOG website inquiry — '+inquiry,text:`Name: ${name}\nEmail: ${email}\nCompany: ${company}\nInquiry: ${inquiry}\n\n${message}`});
   return json({success:true});
  }catch{return json({error:'Your inquiry could not be delivered. Please try again later.'},502)}
 }
};
