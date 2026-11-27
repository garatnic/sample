import { createMobWorld } from '../game/src/mob-world.js?v=42';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createSkills, gainSkillExperience, skillDefinitions } from '../game/src/skills.js?v=32';
import { experienceToNextLevel, gainExperience } from '../game/src/growth.js?v=32';
import { playerAttack, recordWeaponHit } from '../game/src/weapon-skill.js?v=39';
import { createEncounters, updateCombat } from '../game/src/combat.js?v=42';
import { areas, makeSave, restoreSave } from '../game/src/save-data.js?v=42';
import { cave, field, legacyFieldSpawns, shopDoors, start } from '../game/src/world.js?v=41';
import { items } from '../game/src/equipment.js?v=39';

const id = 'one-handed';
const required = skillDefinitions.get(id).requiredXp;
const character = () => ({ ...start, level: 1, hp: 100, mp: 100, experience: 0, cooldown: 0,
  pendingPoison: 0, weaponId: null, inventory: new Map(), armor: new Map(), skills: createSkills() });

test('SKILL-01: roster, independent progress, thresholds, cap and inert skills', () => {
  const p = character();
  assert.equal(skillDefinitions.size, 18);
  assert.equal(new Set([...skillDefinitions.values()].map(s => s.group)).size, 3);
  assert.deepEqual(p.skills.get(id), { value: 15, experience: 0 });
  assert(required(25) > required(15));
  assert.equal(gainSkillExperience(p, 'archery', 1e6), 0);
  assert.equal(gainSkillExperience(p, id, required(15) + required(16) + 4), 33);
  assert.deepEqual(p.skills.get(id), { value: 17, experience: 4 });
  assert.equal(p.experience, 33);
  gainSkillExperience(p, id, 1e7);
  assert.deepEqual(p.skills.get(id), { value: 100, experience: 0 });
  assert.equal(gainSkillExperience(p, id, 100), 0);
  assert.deepEqual(p.skills.get('archery'), { value: 15, experience: 0 });
});

test('SKILL-02: base weapon XP, matching damage calculation and level carryover', () => {
  const p = character();
  const sword = items.get('iron-sword');
  assert.equal(playerAttack(p, sword), 17 + 5 * 1.075);
  assert.equal(playerAttack(p, items.get('iron-hammer')), 31);
  recordWeaponHit(p, sword, 0);
  recordWeaponHit(p, items.get('iron-hammer'), 31);
  assert.equal(p.skills.get(id).experience, 0);
  recordWeaponHit(p, sword, 23);
  assert.equal(p.skills.get(id).experience, 30);
  p.skills.get(id).value = 100;
  assert.equal(playerAttack(p, sword), 24.5);
  assert.deepEqual([1, 2, 3, 5, 10, 20, 50].map(experienceToNextLevel), [100, 125, 150, 200, 325, 575, 1325]);
  gainExperience(p, 240);
  assert.deepEqual([p.level, p.experience, p.hp, p.mp, playerAttack(p)], [3, 15, 120, 100, 21]);
});

test('SKILL-03: normal combat grants XP once on a valid hit and keeps kill rewards', () => {
  const p = character();
  Object.assign(p, { x: 350, y: 450, weaponId: 'iron-dagger' });
  const encounters = createEncounters(cave.spawns);
  const quest = { status: 'active', targets: { rat: 2 }, progress: {} };
  const state = { area: cave, player: p, encounters, lootDrops: [], guilds: new Map([['guild', { quests: [quest] }]]) };
  updateCombat(state, 0);
  assert.equal(p.skills.get(id).experience, 0);
  const enemy = encounters[0].enemy;
  Object.assign(p, { x: enemy.x + 16, y: enemy.y });
  updateCombat(state, 0);
  updateCombat(state, 0);
  assert.equal(p.skills.get(id).experience, 12);
  assert(enemy.hp > 0);
  p.cooldown = 0;
  p.weaponId = null;
  updateCombat(state, 0);
  assert.equal(encounters[0].enemy, null);
  assert.equal(p.experience, 0);
  assert.equal(p.skills.get(id).experience, 12);
  assert.equal(state.lootDrops.length, 1);
  assert.equal(quest.progress.rat, 1);
});

test('SKILL-04: JSON and ver.1 migration preserve progress and reject invalid skills', () => {
  const player = character();
  Object.assign(player, { level: 4, experience: 80, hp: 115, weaponId: 'iron-sword' });
  player.inventory.set('iron-sword', 1);
  player.skills.set(id, { value: 22, experience: 18 });
  const areaStates = new Map(areas.map(area => [area, { encounters: createEncounters(area.spawns), lootDrops: [] }]));
  const state = { player, area: field, gold: 42, guilds: new Map(), harvest: null,
    shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, 97])) };
  const data = JSON.parse(JSON.stringify(makeSave(state, areaStates, 0)));
  assert.deepEqual(restoreSave(data).player.skills, player.skills);
  const old = structuredClone(data);
  old.version = 1;
  old.areas[0].encounters = legacyFieldSpawns.slice(0, 8).map(({ id }) => ({ id, enemy: null, remaining: 0, generation: 0 }));
  old.player.experience = 30;
  delete old.player.skills;
  const restored = restoreSave(old);
  assert.deepEqual([restored.player.level, restored.player.experience, restored.player.hp, restored.player.weaponId, restored.gold],
    [4, 87, 115, 'iron-sword', 42]);
  assert.deepEqual(restored.player.skills, createSkills());
  data.player.skills[0][1].value = 101;
  assert.throws(() => restoreSave(data));
});

test('SKILL-05: passive wildlife flee when hunted and drop materials', () => {
  for (const kind of ['deer', 'rabbit', 'fox']) {
    const player = { ...character(), x: 3000, y: 3000 };
    const maxHp = { deer: 34, rabbit: 20, fox: 26 }[kind];
    const animal = { id: 'field-1', kind, x: 3009, y: 3000, hp: maxHp, maxHp,
      flash: 0, cooldown: 0, flee: 0, hunted: false, angle: 0, turnIn: 5 };
    const mobWorld = createMobWorld(0, { individuals: [animal] });
    const state = { player, area: field, mobWorld, guilds: new Map(), lootDrops: [] };
    updateCombat(state, 0.04);
    assert.equal(animal.hp, animal.maxHp);
    assert.equal(player.hp, 100);
    updateCombat(state, 0.04, true);
    assert.equal(animal.hp, animal.maxHp - 17);
    assert.equal(animal.flee, 3);
    assert.equal(animal.hunted, true);
    updateCombat(state, 0.04);
    assert.ok(animal.x > 3009);
    assert.equal(player.hp, 100);
    player.x = animal.x;
    player.cooldown = 0;
    updateCombat(state, 0.001);
    assert.equal(mobWorld.mobs.size, 0);
    assert.equal(state.lootDrops[0].gold, 0);
    assert.ok(state.lootDrops[0].materials.length);
  }
});
