import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

const INITIAL_MESSAGES = [
  { from: 'staff', text: 'Good morning! How are you enjoying your stay at LuxeStay so far? Is there anything we can assist you with today?', time: '09:41 AM' },
  { from: 'guest', text: 'Everything is wonderful, thank you. I was wondering if it\'s possible to arrange a late checkout for tomorrow?', time: '09:45 AM' },
  { from: 'staff', text: 'I can certainly look into that for you. Our standard checkout is 11:00 AM. What time were you hoping to depart?', time: '09:47 AM' },
  { from: 'guest', text: 'Ideally around 2:00 PM if possible.', time: '09:50 AM' },
];

// Runtime message store (per session)
let chatMessages = [...INITIAL_MESSAGES];
let isTyping = false;

const STAFF_REPLIES = [
  'Of course! I\'ll arrange that for you right away.',
  'Absolutely, we\'d be happy to assist with that.',
  'That\'s been noted on your account. Is there anything else?',
  'Let me check with the relevant department and get back to you shortly.',
  'Wonderful! I\'ve logged your request. You\'ll receive a confirmation shortly.',
  'Thank you for letting us know. We\'ll take care of that immediately.',
];

export function renderChatView() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const messagesHtml = chatMessages.map(msg => msg.from === 'staff' ? `
    <div class="chat-bubble-wrap staff">
      <div class="chat-bubble staff-bubble">${msg.text}</div>
      <span class="chat-time">${msg.time}</span>
    </div>
  ` : `
    <div class="chat-bubble-wrap guest">
      <div class="chat-bubble guest-bubble">${msg.text}</div>
      <span class="chat-time" style="text-align:right;">${msg.time}</span>
    </div>
  `).join('');

  return `
    <div style="display:flex;flex-direction:column;height:100%;position:relative;">

      <!-- Chat Header (replaces standard header context) -->
      <div style="background:var(--surface-container-lowest);border-bottom:1px solid var(--outline-variant);padding:12px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0;">
        <button id="chat-back-btn" style="background:none;border:none;cursor:pointer;color:var(--primary);display:flex;align-items:center;padding:4px;">
          <span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span>
        </button>
        <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:1.5px solid var(--outline-variant);flex-shrink:0;">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw-k66C6pLHMk1ao75A0WlCwwkfJjSn9XQPtLzndZrksw4Yi6IuimyQXzwHWb_Iu3MyCZkEaH4C6AjzJrl_8YwicZz7hc23KK1Z15wCUbhBjT_ScdU3fnk4NOMDGq6CjOCF1mW3PlCEhPdwfmAKbafcO6qrN-3rbHXUqBSlOTI9px7CY0zLCrjeetqF3kBIvm260K9nw3Spp8LzDQCgRMA3rRqO21Sp6dZ8cuZMSy1CRfCzH_MmaE-" alt="Staff" style="width:100%;height:100%;object-fit:cover;" />
        </div>
        <div style="flex:1;">
          <div style="font-family:var(--font-serif);font-size:15px;font-weight:700;color:var(--primary);">Front Desk — Sarah</div>
          <div style="display:flex;align-items:center;gap:5px;margin-top:1px;">
            <span style="width:7px;height:7px;border-radius:50%;background:#10B981;flex-shrink:0;"></span>
            <span class="label-bold" style="font-size:10px;color:var(--on-surface-variant);">Online · Typically replies instantly</span>
          </div>
        </div>
        <span class="material-symbols-outlined" style="color:var(--on-surface-variant);font-size:20px;">call</span>
      </div>

      <!-- Messages Area -->
      <div id="chat-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:var(--surface-container-low);">

        <!-- Date Divider -->
        <div style="display:flex;justify-content:center;margin-bottom:8px;">
          <span class="label-bold" style="background:var(--surface-container);padding:4px 16px;border-radius:999px;font-size:10px;color:var(--on-surface-variant);letter-spacing:.08em;">TODAY</span>
        </div>

        ${messagesHtml}

        ${isTyping ? `
        <div style="display:flex;gap:4px;align-items:center;margin-left:4px;margin-top:4px;">
          <span class="typing-dot"></span>
          <span class="typing-dot" style="animation-delay:.15s;"></span>
          <span class="typing-dot" style="animation-delay:.3s;"></span>
        </div>` : ''}

      </div>

      <!-- Input Bar -->
      <div style="background:var(--surface-container-lowest);border-top:1px solid var(--outline-variant);padding:10px 12px;flex-shrink:0;">
        <div style="display:flex;align-items:flex-end;gap:8px;background:var(--surface-container-low);border-radius:16px;padding:6px 8px;border:1px solid var(--outline-variant);">
          <span class="material-symbols-outlined" style="font-size:22px;color:var(--on-surface-variant);margin-bottom:6px;cursor:pointer;">add</span>
          <textarea id="chat-input" rows="1" placeholder="Type your message…" style="flex:1;border:none;background:transparent;resize:none;font-size:14px;color:var(--on-surface);padding:6px 0;max-height:100px;outline:none;font-family:var(--font-body);line-height:1.4;"></textarea>
          <button id="chat-send-btn" style="width:36px;height:36px;border-radius:10px;background:var(--primary);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;margin-bottom:2px;">
            <span class="material-symbols-outlined" style="font-size:18px;color:#fff;">send</span>
          </button>
        </div>
        <!-- Quick replies -->
        <div style="display:flex;gap:6px;margin-top:8px;overflow-x:auto;padding-bottom:2px;">
          ${['Late checkout 2PM', 'Extra pillows please', 'Room service menu', 'Airport transfer'].map(q =>
            `<button class="quick-reply-btn" data-msg="${q}">${q}</button>`
          ).join('')}
        </div>
      </div>

    </div>
  `;
}

export function bindChatEvents() {
  // Back button
  const backBtn = document.getElementById('chat-back-btn');
  if (backBtn) backBtn.addEventListener('click', () => store.setView('home'));

  // Auto-resize textarea
  const input = document.getElementById('chat-input');
  if (input) {
    input.addEventListener('input', () => {
      input.style.height = '';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }

  // Send button
  const sendBtn = document.getElementById('chat-send-btn');
  if (sendBtn) sendBtn.addEventListener('click', sendMessage);

  // Quick replies
  document.querySelectorAll('.quick-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('chat-input');
      if (input) { input.value = btn.dataset.msg; sendMessage(); }
    });
  });
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  chatMessages.push({ from: 'guest', text, time: now });
  input.value = '';
  input.style.height = '';

  // Re-render chat area
  isTyping = true;
  store.setView('chat');

  // Staff reply after delay
  setTimeout(() => {
    isTyping = false;
    const reply = STAFF_REPLIES[Math.floor(Math.random() * STAFF_REPLIES.length)];
    const replyTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    chatMessages.push({ from: 'staff', text: reply, time: replyTime });
    store.setView('chat');

    // Scroll to bottom after re-render
    setTimeout(() => {
      const msgs = document.getElementById('chat-messages');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, 50);
  }, 1400);

  // Scroll to bottom
  setTimeout(() => {
    const msgs = document.getElementById('chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 50);
}
