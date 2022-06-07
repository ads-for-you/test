class ItcTabs {
  constructor(target, config) {
    const defaultConfig = {};
    this._config = Object.assign(defaultConfig, config);
    this._elTabs = typeof target === 'string' ? document.querySelector(target) : target;

    this._elButtons = [];
    this._elPanes = [];
    [...this._elTabs.children].forEach(el => {
      [...el.children].forEach(el => {
        if (el.classList.contains('tabs__btn')) {
          this._elButtons.push(el);
        } else if (el.classList.contains('tabs__pane')) {
          this._elPanes.push(el);
        }
      })
    });
    this._eventShow = new Event('tab.itc.change');
    this._init();
    this._events();
  }
  _init() {
    this._elTabs.setAttribute('role', 'tablist');
    this._elButtons.forEach((el, index) => {
      el.dataset.index = index;
      el.setAttribute('role', 'tab');
      this._elPanes[index].setAttribute('role', 'tabpanel');
    });
  }
  show(elLinkTarget) {
    const elPaneTarget = this._elPanes[this._elButtons.indexOf(elLinkTarget)];
    let elLinkActive = null;
    let elPaneShow = null;
    this._elButtons.forEach(el => {
      if (el.classList.contains('tabs__btn_active')) {
        elLinkActive = el;
      }
    })
    this._elPanes.forEach(el => {
      if (el.classList.contains('tabs__pane_show')) {
        elPaneShow = el;
      }
    })
    if (elLinkTarget === elLinkActive) {
      return;
    }
    elLinkActive ? elLinkActive.classList.remove('tabs__btn_active') : null;
    elPaneShow ? elPaneShow.classList.remove('tabs__pane_show') : null;
    elLinkTarget.classList.add('tabs__btn_active');
    elPaneTarget.classList.add('tabs__pane_show');
    this._elTabs.dispatchEvent(this._eventShow);
    elLinkTarget.focus();
  }
  showByIndex(index) {
    const elLinkTarget = this._elButtons[index];
    elLinkTarget ? this.show(elLinkTarget) : null;
  };
  _events() {
    this._elTabs.addEventListener('click', (e) => {
      const target = e.target.closest('.tabs__btn');
      if (this._elButtons.includes(target)) {
        e.preventDefault();
        this.show(target);
      }
    });
  }
}

// получаем элемент
const elTabs = document.querySelector('#tabs');
// инициализируем элемент как ItcTabs
const tabs = new ItcTabs(elTabs);

const data = {
  'tabs1-1': [
    { title: 'Вкладка 1.1', content: 'Содержимое 1.1...' },
    { title: 'Вкладка 1.2', content: 'Содержимое 1.2...' },
    { title: 'Вкладка 1.3', content: 'Содержимое 1.3...' },
    { title: 'Вкладка 1.4', content: 'Содержимое 1.4...' },
  ],
  'tabs1-2': [
    { title: 'Вкладка 2.1', content: 'Содержимое 2.1...' },
    { title: 'Вкладка 2.2', content: 'Содержимое 2.2...' },
    { title: 'Вкладка 2.3', content: 'Содержимое 2.3...' },
    { title: 'Вкладка 2.4', content: 'Содержимое 2.4...' },
  ],
  'tabs1-3': [
    
  ]
}

const addTabs = (id, data, target) => {
  let output = `<div {{id}} class="tabs">
    <div class="tabs__nav">{{buttons}}</div>
    <div class="tabs__content">{{content}}</div>
  </div>`;
  output = output.replace('{{id}}', `id="${id}"`);
  let buttons = '';
  let content = '';
  data.forEach(item => {
    buttons += `<button class="tabs__btn">${item['title']}</button>`;
    content += `<div class="tabs__pane">${item['content']}</div>`;
  })
  output = output.replace('{{buttons}}', buttons);
  output = output.replace('{{content}}', content);
  if (!target.querySelector(`#${id}`)) {
    target.insertAdjacentHTML('beforeend', output);
    const tab = new ItcTabs(`#${id}`);
    tab.showByIndex(0);
  }
}

if (elTabs.querySelector('.tabs__pane_show')) {
  elTabs.querySelectorAll('.tabs__pane_show').forEach(el => {
    const id = el.id.replace('tab', 'tabs');
    if (data[id]) {
      addTabs(id, data[id], el);
    }
  });
}

elTabs.addEventListener('tab.itc.change', () => {
  elTabs.querySelectorAll('.tabs__pane_show').forEach(el => {
    const id = el.id.replace('tab', 'tabs');
    if (data[id]) {
      addTabs(id, data[id], el);
    }
  });
})