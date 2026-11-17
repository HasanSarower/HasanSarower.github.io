(() => {
  const panel = document.getElementById('paymentNetwork');
  const stage = document.getElementById('networkStage');
  const plane = stage.querySelector('.network-plane');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = document.getElementById('motionToggle');
  let frame = 0;
  let x = 0, y = 0;
  function resetTilt() {
    cancelAnimationFrame(frame); frame = 0;
    plane.style.setProperty('--rx', '0deg'); plane.style.setProperty('--ry', '0deg');
  }
  stage.addEventListener('pointermove', (event) => {
    if (reduced.matches || !fine.matches || panel.dataset.paused === 'true') return;
    const rect = stage.getBoundingClientRect();
    x = (event.clientX - rect.left) / rect.width - .5;
    y = (event.clientY - rect.top) / rect.height - .5;
    if (!frame) frame = requestAnimationFrame(() => {
      plane.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`);
      plane.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
      frame = 0;
    });
  });
  stage.addEventListener('pointerleave', resetTilt);
  reduced.addEventListener('change', resetTilt);
  fine.addEventListener('change', resetTilt);
  toggle.addEventListener('click', () => {
    const paused = panel.dataset.paused !== 'true';
    panel.dataset.paused = String(paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    if (paused) resetTilt();
  });
  let visible = false;
  const updateVisibility = () => { panel.dataset.visible = String(visible && !document.hidden); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateVisibility(); });
  observer.observe(panel);
  document.addEventListener('visibilitychange', updateVisibility);
  const flows = {
    remittance: {description:'Across currencies and borders, every transfer is a connected journey.', nodes:['MYR','USD','AED','BDT'], steps:['SEND','ROUTE','CONNECT','RECEIVE']},
    lending: {description:'From application to repayment, connected signals help inform each decision.', nodes:['01','02','03','04'], steps:['APPLY','ASSESS','DISBURSE','REPAY']},
    wallet: {description:'One balance, many possibilities. Connect the moments where money moves.', nodes:['+','⇄','↗','✓'], steps:['ADD','HOLD','PAY','SETTLE']}
  };
  panel.querySelectorAll('[data-flow]').forEach(button => button.addEventListener('click', () => {
    const flow = flows[button.dataset.flow];
    panel.querySelectorAll('[data-flow]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('flowDescription').textContent = flow.description;
    panel.querySelectorAll('[data-node]').forEach(node => { node.textContent = flow.nodes[Number(node.dataset.node)]; });
    panel.querySelectorAll('[data-step]').forEach(node => { node.textContent = flow.steps[Number(node.dataset.step)]; });
  }));
  if (!fine.matches) stage.querySelector('.network-footer span').textContent = 'Interactive concept · Explore a product flow';
})();
