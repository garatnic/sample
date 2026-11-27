const directions = {
  KeyW: [0, -1], KeyA: [-1, 0], KeyS: [0, 1], KeyD: [1, 0],
  ArrowUp: [0, -1], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowRight: [1, 0],
};

export function createInput(canvas, onTap) {
  const keys = new Set();
  const touch = { x: 0, y: 0 };
  let gesture = null;

  function clearTouch() {
    const pointerId = gesture?.pointerId;
    gesture = null;
    touch.x = 0;
    touch.y = 0;
    if (pointerId !== undefined && canvas.hasPointerCapture(pointerId)) {
      canvas.releasePointerCapture(pointerId);
    }
  }

  function clear() {
    keys.clear();
    clearTouch();
  }

  window.addEventListener('keydown', event => {
    if (!directions[event.code] || document.querySelector('dialog[open]')) return;
    event.preventDefault();
    keys.add(event.code);
  });
  window.addEventListener('keyup', event => keys.delete(event.code));
  window.addEventListener('blur', clear);

  function move(event) {
    if (event.pointerId !== gesture?.pointerId) return;
    const x = event.clientX - gesture.x;
    const y = event.clientY - gesture.y;
    const distance = Math.hypot(x, y);
    if (distance >= 8) gesture.dragged = true;
    if (!gesture.dragged) return;
    const length = Math.max(34, distance);
    touch.x = x / length;
    touch.y = y / length;
  }

  canvas.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || gesture || document.querySelector('dialog[open]')) return;
    gesture = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, started: performance.now(), dragged: false };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', event => {
    if (event.pointerId !== gesture?.pointerId) return;
    move(event);
    const tapped = !gesture.dragged && performance.now() - gesture.started <= 300;
    clearTouch();
    if (tapped) onTap(event);
  });
  for (const type of ['pointercancel', 'lostpointercapture']) {
    canvas.addEventListener(type, event => {
      if (event.pointerId === gesture?.pointerId) clearTouch();
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
