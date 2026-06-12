(function () {
  const products = [
    { id: 'water', icon: '水', name: '天然水 2L × 12本', category: '飲料', price: 1680, score: 96, tag: '補充のタイミング', reason: '残量から約3日後に不足する見込みです。', reasons: ['消費ログから補充タイミングを検出', '過去価格と在庫状況を比較', '配送先は匿名トークンで参照する設計'] },
    { id: 'coffee', icon: '珈', name: 'オリジナルブレンド コーヒー豆 1kg', category: '飲料', price: 2480, score: 91, tag: 'セール中', reason: 'いつもの購入周期に一致しています。', reasons: ['前回購入から28日経過', '通常価格より500円安い', '定期購入には自動変更しない'] },
    { id: 'filter', icon: '空', name: '加湿器用 交換フィルター', category: '日用品', price: 980, score: 89, tag: '季節のおすすめ', reason: '前回交換から推奨日数を超過しています。', reasons: ['交換目安を12日超過', '型番互換性を確認済み', '健康関連のためOwner承認が必須'] },
    { id: 'soap', icon: '洗', name: '衣料用洗剤 詰め替え 1.2L', category: '日用品', price: 598, score: 84, tag: 'よく一緒に購入', reason: '水の注文と同梱すると配送をまとめられます。', reasons: ['同梱で配送回数を削減', '購入頻度と在庫推定が一致', '最安値より使い慣れた商品を優先'] },
    { id: 'care', icon: '美', name: 'シャンプー モイスト 500ml', category: '健康', price: 698, score: 80, tag: '値下げ', reason: '登録商品の価格が下がりました。', reasons: ['過去平均より20%安い', '代替品への勝手な変更なし', '今回は見送り可能'] },
    { id: 'protein', icon: 'P', name: 'プロテイン 1kg', category: '健康', price: 3480, score: 77, tag: '体調管理', reason: '運動ログと購入履歴の周期に合致しています。', reasons: ['架空の運動ログを参照', '予算上限5,000円以内', '健康判断は行わず補充のみ提案'] }
  ];
  let selected = products[0];

  const yen = (value) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(value);
  const grid = document.getElementById('product-grid');

  function render(category) {
    const list = category === 'すべて' ? products : products.filter((item) => item.category === category);
    document.getElementById('count').textContent = `${list.length}件の提案`;
    grid.innerHTML = list.map((item) => `<button type="button" class="product-card${item.id === selected.id ? ' selected' : ''}" data-id="${item.id}">
      <span class="tag">${item.tag}</span><span class="product-icon">${item.icon}</span>
      <strong>${item.name}</strong><small>${item.reason}</small><b>${yen(item.price)}</b>
      <em>AIおすすめ度 ${item.score}%</em><i>→</i></button>`).join('');
    grid.querySelectorAll('.product-card').forEach((button) => button.addEventListener('click', () => select(button.dataset.id)));
  }

  function select(id, shouldScroll = true) {
    selected = products.find((item) => item.id === id);
    document.getElementById('detail-icon').textContent = selected.icon;
    document.getElementById('detail-name').textContent = selected.name;
    document.getElementById('detail-price').textContent = yen(selected.price);
    document.getElementById('detail-score').textContent = `${selected.score}%`;
    document.getElementById('detail-reasons').innerHTML = selected.reasons.map((reason) => `<li>${reason}</li>`).join('');
    document.getElementById('assistant-card').innerHTML = `<b>${selected.tag}</b><strong>${selected.name}</strong><span>${selected.reason}</span>`;
    render(document.querySelector('.filters .active').dataset.category);
    if (shouldScroll) document.getElementById('detail').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.querySelectorAll('.filters button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    render(button.dataset.category);
  }));
  document.querySelectorAll('input[type="range"]').forEach((input) => input.addEventListener('input', () => {
    input.previousElementSibling.textContent = input.value;
    const adjustment = Math.round((Number(input.value) - 50) / 20);
    products.forEach((item, index) => { item.score = Math.max(65, Math.min(99, 94 - index * 4 + adjustment)); });
    render(document.querySelector('.filters .active').dataset.category);
    select(selected.id, false);
  }));
  document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.scroll).scrollIntoView({ behavior: 'smooth' })));
  document.getElementById('window-shopping').addEventListener('click', () => {
    document.querySelector('[data-category="日用品"]').click();
    document.getElementById('recommend').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('reroll').addEventListener('click', () => select(products[(products.indexOf(selected) + 1) % products.length].id));
  document.getElementById('skip').addEventListener('click', () => select(products[(products.indexOf(selected) + 1) % products.length].id));
  document.getElementById('approve').addEventListener('click', () => {
    const receipt = document.getElementById('receipt');
    document.getElementById('receipt-copy').textContent = `${selected.name}（${yen(selected.price)}）のOwner承認をモック記録しました。実際の注文・決済・通信は発生していません。`;
    receipt.hidden = false;
    receipt.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  render('すべて');
  select('water', false);
})();
