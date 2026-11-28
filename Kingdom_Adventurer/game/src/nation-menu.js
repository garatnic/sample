import { actionNames, modeFor, refreshNationDemand } from './nation-simulation.js?v=52';
import { nationSettings as config } from './nation-settings.js?v=50';

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
      const demand = refreshNationDemand(nation, state.nations.minute);
      const total = demand.limit;
      const used = nation.stock.wood + nation.stock.food;
      const roles = ['food', 'wood', 'general'].map(role => city.residents.filter(p => p.role === role).length);
      const foodWorkers = city.residents.filter(p => p.action === 'gatherFood' || p.carrying?.kind === 'food').length;
      const woodWorkers = city.residents.filter(p => p.action === 'gatherWood' || p.carrying?.kind === 'wood').length;
      const builders = Number(Boolean(city.project));
      const wanderers = city.residents.filter(p => p.action === 'wander').length;
      const other = population - foodWorkers - woodWorkers - builders - wanderers;
      const percent = value => `${(value * 100).toFixed(1)}%`;
      const resourceRows = ['food', 'wood'].flatMap(kind => {
        const name = kind === 'food' ? '食料' : '木材';
        return [
          [name, `${nation.stock[kind]}個（予約 ${demand.reserved[kind]}個）`],
          [`${name}の備蓄`, `最低 ${demand.minimum[kind]} ／ 理想 ${demand.ideal[kind]} ／ 実効 ${demand.effective[kind]}`],
          [`${name}の消費・余剰`, `日次消費 ${demand.daily[kind]} ／ 現在の余剰 ${demand.surplus[kind]}`],
        ];
      });
      const finance = nation.finance;
      const income = finance && finance.food + finance.wood + finance.supplied;
      const needsWarehouse = demand.plans.get(city.id)?.kind === 'warehouse';
      const warehouseInProgress = city.project?.site.kind === 'warehouse';
      const expansionStatus = warehouseInProgress ? '建築中' : needsWarehouse
        ? `必要（木材 ${Math.min(nation.stock.wood, config.warehouse.cost)} / ${config.warehouse.cost}個 確保）`
        : warehouses >= config.warehouse.max ? '上限到達' : total < demand.requiredCapacity ? '必要（工事待ち）' : '不要';
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
        ['倉庫増設', expansionStatus],
        ...resourceRows,
        ['建築用木材', `${demand.buildingWood}個`],
        ['保管状況', `${used} / ${total}個（${Math.floor(100 * used / total)}%）／ 必要 ${demand.requiredCapacity}個`],
        ['住民の役割', `専属採集 ${roles[0]} ／ 専属木こり ${roles[1]} ／ 一般 ${roles[2]}人`],
        ['住民の行動', `採集・運搬 ${foodWorkers} ／ 伐採・運搬 ${woodWorkers} ／ 建築 ${builders} ／ 徘徊 ${wanderers} ／ その他 ${other}人`],
        ['一般住民の抽選', `自由徘徊 ${percent(demand.leisure)} ／ 食料 ${percent((1 - demand.leisure) * demand.labor.food)} ／ 伐採 ${percent((1 - demand.leisure) * demand.labor.wood)}`],
        ['国庫', `${nation.treasury.toLocaleString()}G`],
        ['前日の収支', finance ? `収入 ${income}G ／ 支出 ${finance.bought}G ／ 純収支 ${income - finance.bought}G` : '精算前'],
        ...(finance ? [
          ['資源売却', `食料 ${finance.food}G ／ 木材 ${finance.wood}G`],
          ['商店精算', `供給 ${finance.supplied}G ／ 買取 ${finance.bought}G`],
        ] : []),
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
