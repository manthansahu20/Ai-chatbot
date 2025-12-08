// Basic frontend-only ChatGPT-style UI script
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// DOM
const convEl = $('#conversations');
const messagesEl = $('#messages');
const newChatBtn = $('#newChatBtn');
const sendBtn = $('#sendBtn');
const inputEl = $('#messageInput');
const themeToggle = $('#themeToggle');
const voiceBtn = $('#voiceBtn');
const clearBtn = $('#clearBtn');

// State
let conversations = []; 
let activeConvId = null;
const STORAGE_KEY = 'chat_ui_conversations_v1';

// Utility
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);
const timeNow = () => new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

// Load + Save
function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw) conversations = JSON.parse(raw);

  if(conversations.length === 0){
    const id = uid();
    conversations.push({
      id,
      title:'New Chat',
      messages:[{
        who:'bot',
        text:'Namaste! Ye frontend-only ChatGPT-style UI hai.\nKuch pucho 🙂',
        time:timeNow()
      }],
      created:Date.now()
    });
    activeConvId = id;
    save();
  } else {
    activeConvId = conversations[0].id;
  }
}
function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

// Conversation list
function renderConversations(){
  convEl.innerHTML='';
  conversations.forEach(conv=>{
    const div=document.createElement('div');
    div.className='conv'+(conv.id===activeConvId?' active':'');
    div.dataset.id=conv.id;
    div.innerHTML=`<div class="title">${conv.title}</div>`;
    div.onclick=()=>{ activeConvId=conv.id; render(); save(); };
    convEl.appendChild(div);
  });
}

// Messages render
function renderMessages(){
  messagesEl.innerHTML='';
  const conv = conversations.find(c=>c.id===activeConvId);
  if(!conv) return;

  conv.messages.forEach(m=>{
    const el=document.createElement('div');
    el.className='message '+(m.who==='user'?'user':'bot');

    const bubble=document.createElement('div');
    bubble.className='bubble';
    bubble.innerHTML=m.text.replace(/\n/g,'<br>');

    const meta=document.createElement('div');
    meta.className='meta';

    const copy=document.createElement('button');
    copy.className='copy-btn btn tiny';
    copy.textContent='Copy';
    copy.onclick=()=>{
      navigator.clipboard.writeText(m.text);
      copy.textContent='Copied';
      setTimeout(()=>copy.textContent='Copy',900);
    };

    const time=document.createElement('span');
    time.className='time muted';
    time.textContent=m.time;

    meta.append(copy,time);
    el.append(bubble,meta);
    messagesEl.appendChild(el);
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function render(){
  renderConversations();
  renderMessages();
}

// New Chat
newChatBtn.onclick=()=>{
  const id=uid();
  const conv={
    id,
    title:'Chat '+(conversations.length+1),
    messages:[{who:'bot', text:'Naya chat shuru hua. Kuch pucho!', time:timeNow()}],
    created:Date.now()
  };
  conversations.unshift(conv);
  activeConvId=id;
  save();
  render();
};

// Send message
function sendMessage(){
  const text=inputEl.value.trim();
  if(!text) return;

  const conv=conversations.find(c=>c.id===activeConvId);
  conv.messages.push({who:'user', text, time:timeNow()});
  renderMessages();
  save();
  inputEl.value='';

  // typing indicator
  const typingEl=document.createElement('div');
  typingEl.className='message bot';
  typingEl.innerHTML=`<div class="bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop=messagesEl.scrollHeight;

  setTimeout(()=>{
    typingEl.remove();
    let reply=generateReply(text);
    conv.messages.push({who:'bot', text:reply, time:timeNow()});
    save();
    renderMessages();
  },700+Math.random()*900);
}

sendBtn.onclick=sendMessage;
inputEl.onkeydown=(e)=>{ if(e.key==="Enter") sendMessage(); };

function generateReply(text){
  const t=text.toLowerCase();
  if(/hello|hi|namaste/.test(t)) return 'Namaste! Main yahan hoon 🙂';
  if(/time|samay/.test(t)) return 'Time: '+new Date().toLocaleTimeString();
  if(/date/.test(t)) return 'Date: '+new Date().toLocaleDateString();
  if(/help/.test(t)) return 'Main frontend chatbot hoon. Backend add karoge to real answer milega.';

  return 'Achha! Aapne bola: '+text;
}

load();
render();
