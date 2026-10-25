// AetherMind Main Application

document.addEventListener('DOMContentLoaded', () => {
  // Init modules
  AetherChat.init();
  AetherTasks.init();
  AetherVoice.init();

  // Elements
  const messagesEl = document.getElementById('messages');
  const welcomeEl = document.getElementById('welcome');
  const inputEl = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const onlineStatus = document.getElementById('online-status');

  // Online detection
  function updateOnlineStatus() {
    const online = navigator.onLine;
    onlineStatus.classList.toggle('offline', !online);
    onlineStatus.title = online ? 'Online' : 'Offline';
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // Theme
  const savedTheme = localStorage.getItem('aethermind_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : '');
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? '' : 'light');
    localStorage.setItem('aethermind_theme', isLight ? 'dark' : 'light');
  });

  // Sidebar mobile
  document.getElementById('menu-toggle').addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    document.getElementById('tasks-panel').classList.remove('open');
    document.getElementById('apps-panel').classList.remove('open');
    overlay.classList.remove('visible');
  });

  // Panels
  document.getElementById('tasks-toggle').addEventListener('click', () => {
    document.getElementById('tasks-panel').classList.add('open');
    overlay.classList.add('visible');
  });
  document.getElementById('close-tasks').addEventListener('click', () => {
    document.getElementById('tasks-panel').classList.remove('open');
    overlay.classList.remove('visible');
  });
  document.getElementById('apps-toggle').addEventListener('click', () => {
    document.getElementById('apps-panel').classList.add('open');
    overlay.classList.add('visible');
  });
  document.getElementById('close-apps').addEventListener('click', () => {
    document.getElementById('apps-panel').classList.remove('open');
    overlay.classList.remove('visible');
  });

  // Tasks
  document.getElementById('add-task-btn').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    AetherTasks.add(input.value);
    input.value = '';
  });
  document.getElementById('task-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      AetherTasks.add(e.target.value);
      e.target.value = '';
    }
  });

  // Voice
  document.getElementById('voice-btn').addEventListener('click', () => AetherVoice.toggle());

  // New chat
  document.getElementById('new-chat-btn').addEventListener('click', () => {
    AetherChat.clear();
    messagesEl.innerHTML = '';
    welcomeEl.style.display = 'block';
    document.getElementById('current-chat-title').textContent = 'New Conversation';
  });

  // Suggestions
  document.querySelectorAll('.suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      inputEl.value = btn.dataset.prompt;
      sendMessage();
    });
  });

  // Quick actions
  document.querySelectorAll('.action-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const map = {
        summarize: 'Summarize the key points of our conversation so far.',
        code: 'Write a clean code example for a common useful utility.',
        ideas: 'Help me brainstorm creative ideas for a new project.',
        plan: 'Help me create a focused plan for today.'
      };
      inputEl.value = map[btn.dataset.action] || '';
      sendMessage();
    });
  });

  // Auto-resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 150) + 'px';
  });

  // Send
  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    welcomeEl.style.display = 'none';
    appendMessage('user', text);
    AetherChat.addMessage('user', text);
    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'message assistant';
    typing.id = 'typing';
    typing.innerHTML = `
      <div class="avatar">A</div>
      <div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>
    `;
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Simulate thinking delay
    setTimeout(() => {
      typing.remove();
      const reply = AetherChat.generateResponse(text);
      appendMessage('assistant', reply);
      AetherChat.addMessage('assistant', reply);
      sendBtn.disabled = false;
    }, 600 + Math.random() * 800);
  }

  function appendMessage(role, content) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const avatar = role === 'assistant' ? 'A' : 'You';
    const formatted = formatContent(content);
    div.innerHTML = `
      <div class="avatar">${avatar}</div>
      <div class="bubble">${formatted}</div>
    `;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function formatContent(text) {
    // Basic markdown-like formatting
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    return html;
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Restore previous messages if any
  if (AetherChat.history.length > 0) {
    welcomeEl.style.display = 'none';
    AetherChat.history.forEach(m => appendMessage(m.role, m.content));
  }

  // Service worker registration for PWA / offline
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
});
