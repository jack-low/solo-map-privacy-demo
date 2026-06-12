(function () {
  const state = { client: 'Codex App', method: 'mcp', installed: false, approved: false };
  const manifest = document.getElementById('manifest');
  const terminal = document.getElementById('terminal');
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function renderManifest() {
    manifest.textContent = JSON.stringify({
      name: 'solo-map-commerce',
      client: state.client,
      transport: state.method,
      tools: ['search_catalog', 'create_purchase_intent', 'create_checkout'],
      auth: state.method === 'mcp' ? 'oauth + owner approval' : 'scoped agent key'
    }, null, 2);
    document.getElementById('method').textContent = state.method.toUpperCase();
  }

  document.querySelectorAll('[data-jump]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.jump).scrollIntoView({ behavior: 'smooth' })));
  document.getElementById('copy-command').addEventListener('click', async () => {
    await navigator.clipboard?.writeText('npx solo-map-agent install');
    document.getElementById('copy-command').textContent = 'copied: npx solo-map-agent install';
  });
  document.querySelectorAll('.client').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.client').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.client = button.dataset.client;
    state.method = button.dataset.method;
    renderManifest();
  }));
  document.getElementById('install').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = 'creating install session...';
    await sleep(700);
    state.installed = true;
    button.textContent = '✓ install_session_demo_7f2a';
    terminal.innerHTML += '\n<span>✓ install session created: ins_demo_7f2a</span>';
    addLog('agent.install_session.created', state.client, 'OK');
  });
  document.getElementById('approve-scopes').addEventListener('click', (event) => {
    if (!state.installed) {
      event.currentTarget.textContent = '先にInstall Sessionを作成';
      return;
    }
    state.approved = true;
    event.currentTarget.textContent = '✓ Scope approved';
    document.querySelectorAll('#scopes label:has(input:checked)').forEach((item) => item.classList.add('approved'));
    addLog('owner.scopes.approved', 'demo-owner', 'OK');
  });

  document.getElementById('execute').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    if (!state.approved) {
      button.textContent = 'Scope承認が必要です';
      document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    button.disabled = true;
    const stages = [...document.querySelectorAll('.stage')];
    stages.forEach((stage) => { stage.className = 'stage'; stage.querySelector('i').textContent = 'WAIT'; });
    for (const stage of stages) {
      stage.classList.add('running');
      stage.querySelector('i').textContent = 'RUN';
      await sleep(650);
      stage.classList.remove('running');
      stage.classList.add('done');
      stage.querySelector('i').textContent = 'PASS';
      addLog(`tool.${stage.dataset.stage}.completed`, 'codex-demo-01', 'PASS');
    }
    const product = document.getElementById('product').selectedOptions[0].textContent;
    document.getElementById('result').innerHTML = `<span>STATUS</span><b>CHECKOUT CREATED</b><code>chk_demo_${Date.now().toString().slice(-6)} / ${product}</code>`;
    button.textContent = '✓ execution completed';
    button.disabled = false;
  });

  function addLog(event, actor, status) {
    const row = document.createElement('div');
    const now = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    row.className = 'audit-row flash';
    row.innerHTML = `<span>${now}</span><strong>${event}</strong><span>${actor}</span><i class="ok">${status}</i><code>tr_${Math.random().toString(16).slice(2, 6)}</code>`;
    document.getElementById('logs').prepend(row);
  }

  const canvas = document.getElementById('network');
  const ctx = canvas.getContext('2d');
  let points = [];
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    points = Array.from({ length: Math.min(55, Math.floor(innerWidth / 22)) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .15, vy: (Math.random() - .5) * .15 }));
  }
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    points.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
      ctx.fillStyle = '#38dff833'; ctx.fillRect(p.x, p.y, 2, 2);
      points.slice(i + 1).forEach((q) => {
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 125) { ctx.strokeStyle = `rgba(56,223,248,${(1 - d / 125) * .07})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      });
    });
    requestAnimationFrame(draw);
  }
  addEventListener('resize', resize);
  resize(); draw(); renderManifest();
})();
