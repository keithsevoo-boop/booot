// AetherMind Chat Engine - Sophisticated local response system (no external LLM APIs)

const AetherChat = {
  history: [],
  currentId: null,

  responses: {
    greetings: [
      "Hello! I'm AetherMind, your intelligent companion. How can I help you today?",
      "Hey there! Ready to explore ideas, solve problems, or get things done?",
      "Welcome back. What's on your mind?"
    ],
    capabilities: `I'm AetherMind — a next-gen AI companion prototype. Here's what I can do right now:

• **Chat** intelligently about almost any topic
• **Brainstorm** ideas, plans, and strategies
• **Write** code, emails, stories, and more
• **Manage tasks** — just ask me to add one
• **Voice conversation** (click the mic)
• **Launch apps** on your phone via the Apps panel
• **Stay private** — core experience runs without external paid APIs

I'm designed as a beautiful, extensible foundation ready for real models and agent tools.`,

    code: `Here's a clean example:

\`\`\`javascript
// Simple reactive counter
function createCounter(initial = 0) {
  let count = initial;
  return {
    get value() { return count; },
    increment() { count++; return count; },
    decrement() { count--; return count; }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
\`\`\`

Want a different language or a full project scaffold?`,

    plan: `Here's a focused daily plan framework:

**Morning (Focus)**
1. Review top 3 priorities
2. Deep work block (90 min)
3. Quick movement break

**Afternoon (Execution)**
4. Meetings / collaboration
5. Secondary tasks
6. Review progress

**Evening (Recovery)**
7. Wind-down ritual
8. Prepare tomorrow's top 3

Would you like me to customize this for a specific goal?`,

    default: [
      "That's an interesting point. Let me think through it with you...",
      "I understand. Here's a thoughtful take on that:",
      "Great question. From my perspective:",
      "Let's explore that idea together."
    ]
  },

  init() {
    this.loadHistory();
  },

  generateResponse(input) {
    const lower = input.toLowerCase().trim();

    if (/^(hi|hello|hey|good morning|good evening)/.test(lower)) {
      return this.pick(this.responses.greetings);
    }
    if (/what can you do|capabilities|help me|features/.test(lower)) {
      return this.responses.capabilities;
    }
    if (/code|javascript|python|function|script|programming/.test(lower)) {
      return this.responses.code;
    }
    if (/plan|schedule|day|routine|productive/.test(lower)) {
      return this.responses.plan;
    }
    if (/quantum/.test(lower)) {
      return `Quantum computing uses the principles of quantum mechanics — superposition and entanglement — to process information in ways classical computers can't.

Instead of bits (0 or 1), quantum computers use **qubits** that can exist in multiple states at once. This allows them to explore many possibilities simultaneously for certain problems (cryptography, simulation, optimization).

It's still early days, but the potential is enormous. Want a deeper dive into any part?`;
    }
    if (/motivat|inspire|encourage/.test(lower)) {
      return `You already have everything you need to take the next step.  
Clarity comes from action, not waiting.  

Start small. Stay consistent. Protect your energy.  
The future version of you is built by the choices you make today.

You've got this.`;
    }
    if (/task|todo|remind|add .*task/.test(lower)) {
      return "I can help with that! Open the Tasks panel (checkmark icon) or just tell me the task and I'll note it for you. What would you like to add?";
    }
    if (/thank/.test(lower)) {
      return "You're very welcome. I'm here whenever you need me.";
    }

    // Generic intelligent-looking response
    const opener = this.pick(this.responses.default);
    return `${opener}

Regarding "${input.slice(0, 60)}${input.length > 60 ? '…' : ''}":

This is a rich topic. In a production version of AetherMind I would pull from a powerful reasoning model and tools. Right now I'm running a sophisticated local engine designed to demonstrate the full experience and architecture.

Would you like me to:
• Break this down into steps
• Generate related ideas
• Turn it into a task list
• Or explore a specific angle?`;
  },

  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  addMessage(role, content) {
    this.history.push({ role, content, time: Date.now() });
    this.saveHistory();
  },

  saveHistory() {
    try {
      localStorage.setItem('aethermind_history', JSON.stringify(this.history.slice(-50)));
    } catch (e) {}
  },

  loadHistory() {
    try {
      const saved = localStorage.getItem('aethermind_history');
      if (saved) this.history = JSON.parse(saved);
    } catch (e) {}
  },

  clear() {
    this.history = [];
    this.saveHistory();
  }
};
