// AetherMind Task Manager

const AetherTasks = {
  tasks: [],

  init() {
    this.load();
    this.render();
  },

  add(text) {
    if (!text.trim()) return;
    this.tasks.unshift({
      id: Date.now(),
      text: text.trim(),
      done: false,
      created: Date.now()
    });
    this.save();
    this.render();
  },

  toggle(id) {
    const t = this.tasks.find(x => x.id === id);
    if (t) {
      t.done = !t.done;
      this.save();
      this.render();
    }
  },

  remove(id) {
    this.tasks = this.tasks.filter(x => x.id !== id);
    this.save();
    this.render();
  },

  save() {
    try {
      localStorage.setItem('aethermind_tasks', JSON.stringify(this.tasks));
    } catch (e) {}
  },

  load() {
    try {
      const saved = localStorage.getItem('aethermind_tasks');
      if (saved) this.tasks = JSON.parse(saved);
    } catch (e) {}
  },

  render() {
    const list = document.getElementById('task-list');
    if (!list) return;
    list.innerHTML = '';

    if (this.tasks.length === 0) {
      list.innerHTML = '<li style="color:var(--text-secondary);font-size:0.9rem;padding:1rem 0;">No tasks yet. Add one above!</li>';
      return;
    }

    this.tasks.forEach(t => {
      const li = document.createElement('li');
      li.className = 'task-item' + (t.done ? ' done' : '');
      li.innerHTML = `
        <input type="checkbox" ${t.done ? 'checked' : ''} data-id="${t.id}" />
        <span>${this.escape(t.text)}</span>
        <button data-remove="${t.id}" title="Delete">×</button>
      `;
      list.appendChild(li);
    });

    list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => this.toggle(+cb.dataset.id));
    });
    list.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => this.remove(+btn.dataset.remove));
    });
  },

  escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
