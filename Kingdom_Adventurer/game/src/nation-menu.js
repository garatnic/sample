import { actionNames, capacity, modeFor } from './nation-simulation.js?v=34';
import { nationSettings as config } from './nation-settings.js?v=34';

export function setupNationMenu(state, input, field) {
  const dialog = document.querySelector('#nation-menu');
  const content = document.querySelector('#nation-content');
  function open(selected) {
    content.replaceChildren();
    const viewpoint = state.area === field ? state.player : null;
    for (const nation of state.nations.nations) {
      if (selected && nation.id !== selected.id) continue;
      const [city] = nation.cities;
      const population = city.residents.length;
      const houses = city.buildings.filter(b => b.kind === 'house').length;
      const warehouses = city.buildings.filter(b => b.kind === 'warehouse').length;
      const total = capacity(nation);
      const used = nation.stock.wood + nation.stock.food;
      const info = Object.entries(actionNames).map(([action, name]) =>
        `${name} ${city.residents.filter(p => p.action === action).length}人`).join(' ／ ');
      const worker = city.project && city.residents.find(p => p.id === city.project.workerId);
      const progress = worker && Math.floor(100 * Math.max(0, state.nations.minute - worker.task.startWork)
        / (worker.task.end - worker.task.startWork));
      const section = document.createElement('section');
      const heading = document.createElement('h3');
      heading.textContent = `${nation.name} · ${city.name}`;
      const list = document.createElement('dl');
      const rows = [
        ['処理', modeFor(city, viewpoint) === 'near' ? '近距離' : '遠距離'],
        ['人口', `${population}人`], ['民家', `${houses} / ${config.house.max}軒`],
        ['倉庫', `${warehouses} / ${config.warehouse.max}軒`],
        ['木材', nation.stock.wood], ['食料', nation.stock.food],
        ['保管状況', `${used} / ${total}（${Math.floor(100 * used / total)}%）`],
        ['1日の食料消費', population * config.foodPerResident],
        ['住民の行動', info],
        ['建築', worker ? `${actionNames[worker.action]} ${progress}%` : '建築なし'],
      ];
      for (const [label, value] of rows) {
        const term = document.createElement('dt');
        const detail = document.createElement('dd');
        term.textContent = label;
        detail.textContent = value;
        list.append(term, detail);
      }
      section.append(heading, list);
      content.append(section);
    }
    input.clear();
    dialog.showModal();
  }
  document.querySelector('#open-nations').addEventListener('click', () => open(null));
  return open;
}
