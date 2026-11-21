const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(id, focus = false) {
  const selected = tabs.find(tab => tab.getAttribute('aria-controls') === id);
  if (!selected) return;
  for (const tab of tabs) {
    const active = tab === selected;
    tab.setAttribute('aria-selected', active);
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  }
  if (focus) selected.focus({ preventScroll: true });
}
function tabFromHash() {
  selectTab(location.hash.slice(1) || 'why');
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => {
    const id = tab.getAttribute('aria-controls');
    selectTab(id);
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
  });
  tab.addEventListener('keydown', event => {
    const destinations = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    };
    const next = tabs[destinations[event.key]];
    if (!next) return;
    event.preventDefault();
    next.click();
    next.focus();
  });
}
window.addEventListener('hashchange', tabFromHash);
tabFromHash();
for (const link of document.querySelectorAll('[data-jump]')) {
  link.addEventListener('click', event => {
    event.preventDefault();
    const id = link.dataset.jump;
    selectTab(id, true);
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    document.getElementById('proposal').scrollIntoView({ block: 'start' });
  });
}
for (const button of document.querySelectorAll('[data-view]')) {
  button.addEventListener('click', () => {
    for (const option of document.querySelectorAll('[data-view]')) {
      const active = option === button;
      option.setAttribute('aria-pressed', active);
      document.getElementById(option.dataset.view).hidden = !active;
    }
  });
}
function element(tag, className, copy) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (copy) node.textContent = copy;
  return node;
}
for (const group of plateMenu) {
  const section = element('section', 'menu-section');
  const grid = element('div', 'dish-grid');
  section.append(element('h3', '', group.heading), grid);
  for (const [name, price, calories, description, alt, src] of group.items) {
    const card = element('article', 'dish');
    const zoom = element('button', 'zoom dish-photo');
    zoom.type = 'button';
    zoom.dataset.image = src;
    zoom.dataset.caption = name + ' · Illustrative image';
    zoom.setAttribute('aria-label', 'Enlarge illustrative image of ' + name);
    const img = element('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    zoom.append(img, element('span', '', 'Enlarge'));
    const detail = element('div', 'dish-detail');
    detail.append(element('h4', '', name),
      element('p', 'dish-meta', [price, calories + ' Cal'].filter(Boolean).join(' · ')),
      element('p', '', description));
    card.append(zoom, detail);
    grid.append(card);
  }
  document.getElementById('menu-items').append(section);
}
const dialog = document.querySelector('dialog');
const enlarged = dialog.querySelector('img');
document.addEventListener('click', event => {
  const button = event.target.closest('[data-image]');
  if (!button) return;
  enlarged.src = button.dataset.image;
  enlarged.alt = button.querySelector('img').alt;
  dialog.querySelector('#image-caption').textContent = button.dataset.caption;
  dialog.showModal();
});
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
