import { readSave, writeSave, deleteSave } from './save-store.js?v=31';

export function setupSaveMenu({ input, canSave, capture, decode, restore, notify }) {
  const menu = document.querySelector('#save-menu');
  const opener = document.querySelector('#open-save');
  const feedback = document.querySelector('#save-feedback');
  const file = document.querySelector('#save-file');
  const save = document.querySelector('#save-now');
  const actions = [...menu.querySelectorAll('[data-save-action]')];
  let busy = false;

  function setBusy(value) {
    busy = value;
    for (const button of actions) button.disabled = value;
    if (!value) save.disabled = !canSave();
    file.disabled = value;
  }

  function message(text) {
    feedback.textContent = text;
  }

  async function run(action, failure) {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } catch {
      message(failure);
      if (!menu.open) notify(failure);
    } finally {
      setBusy(false);
    }
  }

  const saveGame = async ({ automatic = false } = {}) => {
    if (!canSave()) return;
    try {
      await writeSave(capture());
      if (!automatic) message('セーブしました。');
    } catch {
      const text = 'セーブに失敗しました。前回のセーブデータは保持されています。';
      message(text);
      if (automatic) notify(text);
    }
  };

  opener.addEventListener('click', () => {
    if (document.querySelector('dialog[open]')) return;
    input.clear();
    setBusy(busy);
    if (!canSave()) message('戦闘中や戦闘不能時はセーブできません。');
    menu.showModal();
  });

  save.addEventListener('click', () => run(() => saveGame(), 'セーブできませんでした。'));
  document.querySelector('#load-save').addEventListener('click', () => run(async () => {
    const data = await readSave();
    if (data === undefined) return message('セーブデータがありません。');
    if (!window.confirm('最後のセーブを読み込みますか？ 保存していない進行は失われます。')) return;
    restore(decode(data));
    menu.close();
    notify('セーブデータを読み込みました。');
  }, 'セーブデータを読み込めませんでした。'));

  document.querySelector('#export-save').addEventListener('click', () => run(async () => {
    const data = await readSave();
    if (data === undefined) return message('セーブデータがありません。');
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kingdom-adventurer-save.json';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    message('セーブデータをJSONに書き出しました。');
  }, 'セーブデータを書き出せませんでした。'));

  file.addEventListener('change', () => {
    const selected = file.files[0];
    file.value = '';
    if (!selected) return;
    void run(async () => {
      const data = JSON.parse(await selected.text());
      const restored = decode(data);
      if (!window.confirm('このファイルを読み込みますか？ 現在の進行と既存のセーブ枠が置き換わります。')) return;
      await writeSave(data);
      restore(restored);
      menu.close();
      notify('セーブデータを取り込みました。');
    }, '取り込めませんでした。対応するセーブJSONか、ブラウザの保存設定を確認してください。');
  });

  document.querySelector('#delete-save').addEventListener('click', () => run(async () => {
    if (await readSave() === undefined) return message('削除するセーブデータがありません。');
    if (!window.confirm('このブラウザのセーブデータを削除しますか？ あとから元に戻せません。')) return;
    await deleteSave();
    message('セーブデータを削除しました。プレイ中の状態は続けられます。');
  }, 'セーブデータを削除できませんでした。'));

  menu.addEventListener('cancel', event => {
    if (busy) event.preventDefault();
  });

  return {
    autoSave: () => saveGame({ automatic: true }),
    loadOnStart: () => run(async () => {
      const data = await readSave();
      if (data !== undefined) restore(decode(data));
    }, 'セーブデータを読み込めませんでした。「セーブ」から確認できます。'),
  };
}
