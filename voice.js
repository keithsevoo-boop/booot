// AetherMind Voice - uses native Web Speech API (no external services)

const AetherVoice = {
  recognition: null,
  isListening: false,
  supported: false,

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }
    this.supported = true;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('user-input');
      if (input) {
        input.value = transcript;
        input.dispatchEvent(new Event('input'));
      }
      this.stop();
    };

    this.recognition.onerror = () => this.stop();
    this.recognition.onend = () => this.stop();
  },

  toggle() {
    if (!this.supported) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  },

  start() {
    if (!this.recognition) return;
    try {
      this.recognition.start();
      this.isListening = true;
      const btn = document.getElementById('voice-btn');
      if (btn) btn.classList.add('listening');
    } catch (e) {}
  },

  stop() {
    this.isListening = false;
    const btn = document.getElementById('voice-btn');
    if (btn) btn.classList.remove('listening');
    try {
      this.recognition?.stop();
    } catch (e) {}
  },

  speak(text) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text.slice(0, 300));
    utter.rate = 1.05;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }
};
