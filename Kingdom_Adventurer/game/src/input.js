const directions = {
  KeyW: [0, -1], KeyA: [-1, 0], KeyS: [0, 1], KeyD: [1, 0],
  ArrowUp: [0, -1], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowRight: [1, 0],
};

export function createInput(stick, knob) {
  const keys = new Set();
  const touch = { x: 0, y: 0 };
  let pointer = null;

  function clear() {
    keys.clear();
    if (pointer !== null && stick.hasPointerCapture(pointer)) stick.releasePointerCapture(pointer);
    pointer = null;
    touch.x = 0;
    touch.y = 0;
    knob.style.transform = '';
  }

  window.addEventListener('keydown', event => {
    if (!directions[event.code] || document.querySelector('dialog[open]')) return;
    event.preventDefault();
    keys.add(event.code);
  });
  window.addEventListener('keyup', event => keys.delete(event.code));
  window.addEventListener('blur', clear);

  function move(event) {
    if (event.pointerId !== pointer) return;
    const bounds = stick.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    const length = Math.max(34, Math.hypot(x, y));
    touch.x = x / length;
    touch.y = y / length;
    knob.style.transform = `translate(${touch.x * 34}px, ${touch.y * 34}px)`;
  }

  stick.addEventListener('pointerdown', event => {
    if (pointer !== null) return;
    pointer = event.pointerId;
    stick.setPointerCapture(pointer);
    move(event);
  });
  stick.addEventListener('pointermove', move);
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    stick.addEventListener(type, event => {
      if (event.pointerId === pointer) clear();
    });
  }

  return {
    clear,
    read() {
      let { x, y } = touch;
      for (const code of keys) {
        x += directions[code][0];
        y += directions[code][1];
      }
      const pad = Array.from(navigator.getGamepads?.() ?? []).find(Boolean);
      if (pad && Math.hypot(pad.axes[0] ?? 0, pad.axes[1] ?? 0) > 0.2) {
        x += pad.axes[0] ?? 0;
        y += pad.axes[1] ?? 0;
      }
      return { x, y };
    },
  };
}
