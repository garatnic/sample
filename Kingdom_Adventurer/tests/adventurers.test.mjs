import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceAdventurers, createAdventurers } from '../game/src/adventurers.js?v=56';
import { hitMob } from '../game/src/combat.js?v=56';
import { createMobWorld } from '../game/src/mob-world.js?v=56';
import { items } from '../game/src/equipment.js?v=53';
import { createShopStock } from '../game/src/shop.js?v=55';
import { innDoors, shopDoors } from '../game/src/world.js?v=55';
import { nextMorningMinute } from '../game/src/clock.js?v=34';

function setup(enemies = []) {
  return { adventurers: createAdventurers(), mobWorld: createMobWorld(0, { individuals: enemies }),
    shopStock: createShopStock(), shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, 100])) };
}

test('ADV-01: six independent adventurers, shared combat progression and player loot priority', () => {
  const state = setup();
  const { individuals } = state.adventurers;
  assert.equal(individuals.length, 6);
  for (const innId of Object.keys(innDoors)) {
    const locals = individuals.filter(actor => actor.innId === innId);
    assert.equal(locals.length, 2);
    for (const actor of locals) {
      assert.equal(actor.level, 1);
      assert.equal(actor.hp, 100);
      assert.equal(actor.skills.get(actor.weaponClass).value, 25);
      assert.equal(items.get(actor.weaponId).skill, actor.weaponClass);
      assert.equal(Object.hasOwn(actor, 'nationId'), false);
    }
  }
  const actor = individuals[0];
  const { x, y } = actor;
  const enemy = { id: 'field-1', kind: 'rabbit', x, y, hp: 30, cooldown: 0 };
  const player = structuredClone(actor);
  hitMob(player, enemy, true);
  state.mobWorld = createMobWorld(0, { individuals: [enemy] });
  const loot = [];
  advanceAdventurers(state, loot, 1, 0.5, [], () => 0.5);
  assert.equal(state.mobWorld.mobs.size, 0);
  assert.ok(actor.skills.get(actor.weaponClass).experience > 0);
  assert.equal(loot[0].playerClaim, true);
  advanceAdventurers(state, loot, 2, 0.5, [], () => 0.5);
  assert.equal(loot.length, 1);
  assert.equal(actor.inventory.has('rabbit-fur'), false);
});

test('ADV-02: real shop balance, weapon upgrades, overnight rest and complete death loot', () => {
  const state = setup();
  const actor = state.adventurers.individuals[0];
  Object.assign(actor, shopDoors['goods-shop']);
  actor.inventory.set('rabbit-fur', 2);
  advanceAdventurers(state, [], 1, 0.5, []);
  assert.equal(actor.inventory.has('rabbit-fur'), false);
  assert.equal(actor.gold, 14);
  assert.equal(state.shopGold['goods-shop'], 96);
  Object.assign(actor, shopDoors['weapon-shop'], { gold: 35 });
  advanceAdventurers(state, [], 2, 0.5, []);
  assert.equal(actor.weaponId, 'iron-sword');
  assert.equal(actor.inventory.has('iron-dagger'), false);
  Object.assign(actor, innDoors[actor.innId], { hp: 20 });
  const loot = [];
  advanceAdventurers(state, loot, 3, 0.5, []);
  assert.equal(actor.sleepUntil, nextMorningMinute(3));
  advanceAdventurers(state, loot, actor.sleepUntil - 0.4, 0.5, []);
  assert.equal(actor.hp, 20);
  advanceAdventurers(state, loot, actor.sleepUntil, 0.5, []);
  assert.equal(actor.hp, 100);
  actor.hp = 1;
  actor.inventory.set('rabbit-fur', 4);
  state.mobWorld = createMobWorld(0, { individuals: [{ id: 'field-1',
    kind: 'wolf', x: actor.x, y: actor.y, hp: 42, cooldown: 0 }] });
  advanceAdventurers(state, loot, 1400, 0.5, [], () => 0.99);
  const replacement = state.adventurers.individuals[0];
  assert.notEqual(replacement.id, actor.id);
  assert.equal(replacement.level, 1);
  assert.equal(replacement.innId, Object.keys(innDoors).at(-1));
  assert.deepEqual(new Map(loot[0].contents), actor.inventory);
  assert.equal(loot[0].gold, actor.gold);
});
