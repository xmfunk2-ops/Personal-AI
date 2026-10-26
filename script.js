import { GoogleGenAI } from 'https://esm.run/@google/genai';

// Siz taqdim etgan API kalit va SDK ulanishi
const apiKey = "AQ.Ab8RN6JDrIhP8APEGUCwntF7OBbIGsZj4C_PS2BTJL_vuumHqQ"; 
// Agar Google AI Studio formatidagi standart 'AIza...' kalitga o'tkazmoqchi bo'lsangiz ham shu yerga yozasiz.
const ai = new GoogleGenAI({ apiKey });

const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const messagesList = document.getElementById('messagesList');
const chatViewport = document.getElementById('chatViewport');

// Mobile sidebar controls
const menuToggle = document.getElementById('menuToggle');
const closeSidebar = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => sidebar.classList.add('open'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('open'));

// Chat form submission logic
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  // 1. Foydalanuvchi xabarini qo'shish
  appendUserMessage(text);
  userInput.value = '';

  // 2. AI yuklanish holati (Loading bubble)
  const loadingBubble = appendAIMessage("Avee AI o'ylamoqda...");

  try {
    // 3. Gemini API ga so'rov yuborish
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction: "Sening isming Avee AI. Sen foydalanuvchiga har qanday mavzuda yordam beradigan, samimiy, aqlli va universal sun'iy intellekt yordamchisisan. Javoblaringni aniq va tushunarli ber.",
      }
    });

    // 4. Javobni chiqarish
    loadingBubble.innerHTML = formatMarkdown(response.text);
  } catch (error) {
    console.error(error);
    loadingBubble.innerText = "Ulanishda xatolik yuz berdi. API kalitingizni tekshiring.";
  }

  chatViewport.scrollTop = chatViewport.scrollHeight;
});

function appendUserMessage(text) {
  const group = document.createElement('div');
  group.className = 'message-group user-group';
  group.innerHTML = `
    <div class="message-bubble user-bubble">
      ${escapeHtml(text)}
    </div>
  `;
  messagesList.appendChild(group);
  chatViewport.scrollTop = chatViewport.scrollHeight;
}

function appendAIMessage(text) {
  const group = document.createElement('div');
  group.className = 'message-group ai-group';
  group.innerHTML = `
    <div class="ai-avatar-small"><i class="fa-solid fa-bolt"></i></div>
    <div class="message-content-wrapper">
      <div class="sender-name">Avee AI</div>
      <div class="message-bubble ai-bubble">${text}</div>
    </div>
  `;
  messagesList.appendChild(group);
  chatViewport.scrollTop = chatViewport.scrollHeight;
  return group.querySelector('.ai-bubble');
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMarkdown(text) {
  // Oddiy matnni o'qishga qulaylashtirish
  return escapeHtml(text).replace(/\n/g, '<br>');
}
