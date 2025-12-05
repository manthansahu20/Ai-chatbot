const chatBox = document.getElementById("chatBox");
const typing = document.getElementById("typing");

// Load old chat
window.onload = () => {
    let oldChat = JSON.parse(localStorage.getItem("chatHistory")) || [];
    oldChat.forEach(msg => addMessage(msg.text, msg.type, msg.time));
};

function getTime() {
    let d = new Date();
    return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
}

function saveChat(text, type) {
    let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
    history.push({ text, type, time: getTime() });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

function sendMessage() {
    let inp = document.getElementById("userInput");
    let text = inp.value.trim();
    if (!text) return;

    addMessage(text, "user", getTime());
    saveChat(text, "user");

    inp.value = "";

    typing.style.display = "block";

    setTimeout(() => {
        generateBotReply(text);
    }, 1000);
}

function addMessage(message, type, time) {
    let msg = document.createElement("div");
    msg.classList.add("msg", type);
    msg.innerHTML = `${message}<div class="time">${time}</div>`;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function generateBotReply(text) {
    typing.style.display = "none";

    let msg = text.toLowerCase();
    let reply = "";

    // AI responses
    if (msg.includes("hi") || msg.includes("hello")) reply = "Hello! How can I help you today?";
    else if (msg.includes("name")) reply = "I am Nova — your AI assistant!";
    else if (msg.includes("help")) reply = "Sure! Tell me what you want to know.";
    else if (msg.includes("html")) reply = "HTML is the skeleton of webpages.";
    else if (msg.includes("css")) reply = "CSS is used for design, layout, animation and styling.";
    else if (msg.includes("js")) reply = "JavaScript makes webpages interactive.";
    else if (msg.includes("who made you")) reply = "I was created by Om Prakash Purohit — the legend! 🔥";
    else if (msg.includes("love")) reply = "Love is beautiful! Keep smiling ❤️";
    else if (msg.includes("bye")) reply = "Goodbye! Come back soon 😊";
    else reply = "I'm still learning… but I understand you 😄";

    addMessage(reply, "bot", getTime());
    saveChat(reply, "bot");
}
