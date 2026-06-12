(function () {
  const views = document.querySelectorAll('.view');
  const nav = document.querySelectorAll('nav button');

  function show(id) {
    views.forEach((view) => view.classList.toggle('active', view.id === id));
    nav.forEach((button) => button.classList.toggle('active', button.dataset.view === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nav.forEach((button) => button.addEventListener('click', () => show(button.dataset.view)));
  document.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', () => show(button.dataset.next)));
  document.querySelectorAll('.agent').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.agent').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
  }));

  document.getElementById('mock-buy').addEventListener('click', () => {
    document.getElementById('result').textContent = 'モック購入を記録しました。外部送信・決済・永続保存は行っていません。';
    const item = document.createElement('div');
    item.innerHTML = '<time>NOW</time><strong>モック購入をOwnerが承認</strong><span>¥1,980 / provider: disabled / persistence: none</span>';
    document.getElementById('timeline').appendChild(item);
    setTimeout(() => show('history'), 900);
  });

  document.getElementById('reset').addEventListener('click', () => location.reload());
})();
