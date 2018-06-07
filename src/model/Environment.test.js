import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";
import PlayFormat from "../artifact/PlayFormat.js";
import Range from "../artifact/Range.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Agent from "./Agent.js";
import CardAction from "./CardAction.js";
import CardInstance from "./CardInstance.js";
import Environment from "./Environment.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import Position from "./Position.js";
import Reducer from "./Reducer.js";
import Squad from "./Squad.js";
import SquadBuilder from "./SquadBuilder.js";
import TargetLock from "./TargetLock.js";

QUnit.module("Environment");

QUnit.test("activeCardInstance()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const token0 = environment.pilotInstances()[0]; // TIE Fighter.
   assert.ok(!environment.activeCardInstance());

   // Run.
   environment.setActiveToken(token0);

   // Verify.
   assert.ok(environment.activeCardInstance().equals(token0));
});

QUnit.test("cardInstances()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   // Run.
   const result = environment.cardInstances();

   // Verify.
   assert.ok(result);
   result.sort(function(a, b)
   {
      return b.id() - a.id();
   });
   assert.equal(result.length, 39);
   assert.equal(result[5].card().key, PilotCard.MAULER_MITHEL);
   assert.equal(result[3].card().key, PilotCard.DARK_CURSE);
   assert.equal(result[2].card().key, PilotCard.LUKE_SKYWALKER);
});

QUnit.test("cardInstances() Huge", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();

   // Run.
   const result = environment.cardInstances();

   // Verify.
   assert.ok(result);
   result.sort(function(a, b)
   {
      return b.id() - a.id();
   });
   assert.equal(result.length, 52);
   assert.equal(result[4].card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
   assert.equal(result[6].card().key, PilotCard.WES_JANSON);
   assert.equal(result[11].card().key, PilotCard.CR90_CORVETTE);
   assert.equal(result[16].card().key, PilotCard.RAIDER_CLASS_CORVETTE);
   assert.equal(result[17].card().key, PilotCard.JUNO_ECLIPSE);
   assert.equal(result[18].card().key, PilotCard.GOZANTI_CLASS_CRUISER);
});

QUnit.test("createWeaponToRangeToDefenders() one", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attackerPosition0 = new Position(458, 895, -90); // X-Wing.
   const attacker = environment.getTokenAt(attackerPosition0);
   const attackerPosition = new Position(300, 70, -90);
   environment.moveToken(attackerPosition0, attackerPosition);
   let weapon = attacker.primaryWeapon();

   // Run.
   const result = environment.createWeaponToRangeToDefenders(attacker);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   {
      const weaponToRangeToDefenders = result[0];
      weapon = weaponToRangeToDefenders.weapon;
      assert.equal(weapon.name(), attacker.primaryWeapon().name());
      assert.equal(weapon.weaponValue(), attacker.primaryWeapon().weaponValue());

      const rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
      assert.ok(rangeToDefendersArray);
      assert.equal(rangeToDefendersArray.length, 1);

      const rangeToDefenders = rangeToDefendersArray[0];
      assert.equal(rangeToDefenders.range, Range.ONE);

      const defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 1);
   }
});

QUnit.test("createWeaponToRangeToDefenders() four", function(assert)
{
   // Setup.
   const store00 = Redux.createStore(Reducer.root);
   const imperialAgent = new Agent(store00, "Imperial Agent");
   const rebelAgent = new Agent(store00, "Rebel Agent");
   const squad1 = new Squad(Faction.IMPERIAL, "squad1", 2016, "squad1", [
                 new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.OBSIDIAN_SQUADRON_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.OBSIDIAN_SQUADRON_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.BLACK_SQUADRON_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.BLACK_SQUADRON_PILOT, imperialAgent)
          ]);
   const squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [UpgradeCard.OUTRIDER, UpgradeCard.CALCULATION, UpgradeCard.MANGLER_CANNON, UpgradeCard.BLASTER_TURRET, UpgradeCard.PROTON_TORPEDOES])]);

   const store = Redux.createStore(Reducer.root);
   const positions1 = [new Position(450, 845, 90), new Position(450, 795, 90), new Position(450, 745, 90), new Position(450, 695, 90), new Position(450, 645, 90), new Position(450, 595, 90)];
   const positions2 = [new Position(458, 895, -90)];
   const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);

   const attacker = environment.pilotInstances()[6];
   const defender3 = environment.pilotInstances()[3];
   store.dispatch(CardAction.addFocusCount(attacker));
   TargetLock.newInstance(store, attacker, defender3);

   // Run.
   const result = environment.createWeaponToRangeToDefenders(attacker);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 4);
   let weaponToRangeToDefenders, weapon, rangeToDefendersArray, rangeToDefenders, defenders;
   {
      weaponToRangeToDefenders = result[0];
      weapon = weaponToRangeToDefenders.weapon;
      // assert.equal(weapon, attacker.primaryWeapon());
      assert.equal(weapon.name(), attacker.primaryWeapon().name());
      assert.equal(weapon.weaponValue(), attacker.primaryWeapon().weaponValue());

      rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
      assert.ok(rangeToDefendersArray);
      assert.equal(rangeToDefendersArray.length, 3);

      rangeToDefenders = rangeToDefendersArray[0];
      assert.equal(rangeToDefenders.range, Range.ONE);
      defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 3, "defenders.length === 3");

      rangeToDefenders = rangeToDefendersArray[1];
      assert.equal(rangeToDefenders.range, Range.TWO);
      defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 2);

      rangeToDefenders = rangeToDefendersArray[2];
      assert.equal(rangeToDefenders.range, Range.THREE);
      defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 1);
   }
   {
      weaponToRangeToDefenders = result[1];
      weapon = weaponToRangeToDefenders.weapon;
      assert.equal(weapon.upgradeKey(), UpgradeCard.MANGLER_CANNON);

      rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
      assert.ok(rangeToDefendersArray);
      assert.equal(rangeToDefendersArray.length, 3);

      rangeToDefenders = rangeToDefendersArray[0];
      assert.equal(rangeToDefenders.range, Range.ONE);
      defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 3, "defenders.length === 3");

      rangeToDefenders = rangeToDefendersArray[1];
      assert.equal(rangeToDefenders.range, Range.TWO);
      defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 2);

      rangeToDefenders = rangeToDefendersArray[2];
      assert.equal(rangeToDefenders.range, Range.THREE);
      defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 1);
   }
   {
      weaponToRangeToDefenders = result[2];
      weapon = weaponToRangeToDefenders.weapon;
      assert.equal(weapon.upgradeKey(), UpgradeCard.BLASTER_TURRET);

      rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
      assert.ok(rangeToDefendersArray);
      assert.equal(rangeToDefendersArray.length, 2);

      rangeToDefenders = rangeToDefendersArray[0];
      assert.equal(rangeToDefenders.range, Range.ONE);
      defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 3, "defenders.length === 3");

      rangeToDefenders = rangeToDefendersArray[1];
      assert.equal(rangeToDefenders.range, Range.TWO);
      defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 2);
   }
   {
      weaponToRangeToDefenders = result[3];
      weapon = weaponToRangeToDefenders.weapon;
      assert.equal(weapon.upgradeKey(), UpgradeCard.PROTON_TORPEDOES);

      rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
      assert.ok(rangeToDefendersArray);
      assert.equal(rangeToDefendersArray.length, 1);

      rangeToDefenders = rangeToDefendersArray[0];
      assert.equal(rangeToDefenders.range, Range.TWO);
      defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 1);
   }
});

QUnit.test("createWeaponToRangeToDefenders() one with weapon", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const attackerPosition0 = new Position(458, 895, -90); // X-Wing.
   const attacker = environment.getTokenAt(attackerPosition0);
   const attackerPosition = new Position(300, 220, -90);
   environment.moveToken(attackerPosition0, attackerPosition);
   const defender = environment.pilotInstances()[0]; // TIE Fighter
   let weapon = attacker.secondaryWeapons()[0]; // Proton Torpedoes
   assert.ok(weapon);
   assert.equal(weapon.name(), "Proton Torpedoes");
   TargetLock.newInstance(store, attacker, defender);
   assert.ok(attacker);
   assert.equal(environment.getPositionFor(attacker).x(), 300);
   assert.equal(environment.getPositionFor(attacker).y(), 220);

   // Run.
   const result = environment.createWeaponToRangeToDefenders(attacker, weapon);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1, "result.length === 1");
   {
      const weaponToRangeToDefenders = result[0];
      weapon = weaponToRangeToDefenders.weapon;
      assert.equal(weapon.name(), attacker.secondaryWeapons()[0].name());
      assert.equal(weapon.weaponValue(), attacker.secondaryWeapons()[0].weaponValue());

      const rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
      assert.ok(rangeToDefendersArray);
      assert.equal(rangeToDefendersArray.length, 1);

      const rangeToDefenders = rangeToDefendersArray[0];
      assert.equal(rangeToDefenders.range, Range.TWO, "range === two");

      const defenders = rangeToDefenders.defenders;
      assert.ok(defenders);
      assert.equal(defenders.length, 1);
   }
});

QUnit.test("discardDamage()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const damage = environment.drawDamage();
   assert.equal(store.getState().damageDeck.size, 32);
   assert.equal(store.getState().damageDiscardPile.size, 0);

   // Run.
   environment.discardDamage(damage);

   // Verify.
   assert.equal(store.getState().damageDeck.size, 32);
   assert.equal(store.getState().damageDiscardPile.size, 1);
   assert.equal(CardInstance.get(store, store.getState().damageDiscardPile.get(0)).card().key, damage.card().key);
});

QUnit.test("drawDamage()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   assert.equal(store.getState().damageDeck.size, 33);
   assert.equal(store.getState().damageDiscardPile.size, 0);

   // Run.
   const result = environment.drawDamage();

   // Verify.
   assert.ok(result);
   assert.equal(store.getState().damageDeck.size, 32);
   assert.equal(store.getState().damageDiscardPile.size, 0);
});

QUnit.test("drawDamage() empty", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   for (let i = 0; i < 33; i++)
   {
      const damage = environment.drawDamage();
      environment.discardDamage(damage);
   }
   assert.equal(store.getState().damageDeck.size, 0);
   assert.equal(store.getState().damageDiscardPile.size, 33);

   // Run.
   const result = environment.drawDamage();

   // Verify.
   assert.ok(result);
   assert.equal(store.getState().damageDeck.size, 32);
   assert.equal(store.getState().damageDiscardPile.size, 0);
});

QUnit.test("getDefenders() Imperial vs Rebel", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attacker = environment.pilotInstances()[0]; // TIE Fighter.

   // Run.
   const result = environment.getDefenders(attacker);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
});

QUnit.test("getDefenders() Rebel vs Imperial", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attacker = environment.pilotInstances()[2]; // X-Wing.

   // Run.
   const result = environment.getDefenders(attacker);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
});

QUnit.test("getDefenders() Rebel vs Rebel", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const agent1 = new Agent(store, "1");
   const squad1 = SquadBuilder.findByNameAndYear("Worlds #2", 2016).buildSquad(agent1);
   const agent2 = new Agent(store, "2");
   const squad2 = SquadBuilder.findByNameAndYear("Worlds #4", 2016).buildSquad(agent1);
   const environment = new Environment(store, agent1, squad1, agent2, squad2);
   const attacker = environment.pilotInstances()[0]; // X-Wing.

   // Run.
   const result = environment.getDefenders(attacker);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
   assert.ok(result[0].equals(environment.pilotInstances()[2]));
   assert.ok(result[1].equals(environment.pilotInstances()[3]));
});

QUnit.test("getDefendersInRange()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attacker = environment.pilotInstances()[2]; // X-Wing
   const attackerPosition0 = environment.getPositionFor(attacker);
   const attackerPosition = new Position(458, 50, -90);
   environment.moveToken(attackerPosition0, attackerPosition);

   // Run.
   const result = environment.getDefendersInRange(attacker);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
   assert.equal(result[0].card().shipFaction.factionKey, Faction.IMPERIAL);
});

QUnit.test("getFriendlyTokensAtRange() zero", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attacker = environment.pilotInstances()[2]; // X-Wing
   const attackerPosition0 = environment.getPositionFor(attacker);
   const attackerPosition = new Position(458, 50, -90);
   environment.moveToken(attackerPosition0, attackerPosition);

   // Run.
   const result = environment.getFriendlyTokensAtRange(attacker, Range.TWO);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 0);
});

QUnit.test("getFriendlyTokensAtRange() one", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attacker = environment.pilotInstances()[0]; // TIE Fighter
   const attackerPosition0 = environment.getPositionFor(attacker);
   const attackerPosition = new Position(458, 50, -90);
   environment.moveToken(attackerPosition0, attackerPosition);

   // Run.
   const result = environment.getFriendlyTokensAtRange(attacker, Range.TWO);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].card().key, PilotCard.DARK_CURSE);
});

QUnit.test("getPositionFor()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const token = environment.pilotInstances()[0];
   const position = new Position(305, 20, 90);

   // Run.
   const result = environment.getPositionFor(token);

   // Verify.
   assert.ok(result);
   assert.strictEqual(result.toString(), position.toString());
});

QUnit.test("getPositionFor() Huge2", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();
   const token = environment.pilotInstances()[3]; // CR90

   // Run.
   let result = environment.getPositionFor(token);

   // Verify.
   assert.ok(result);
   assert.equal(result.x(), 458);
   assert.equal(result.y(), 803);
   assert.equal(result.heading(), 270);

   // Run.
   result = environment.getPositionFor(token.tokenFore());

   // Verify.
   assert.ok(result);
   assert.equal(result.x(), 458);
   assert.equal(result.y(), 803 - 72);
   assert.equal(result.heading(), 270);

   // Run.
   result = environment.getPositionFor(token.tokenAft());

   // Verify.
   assert.ok(result);
   assert.equal(result.x(), 458);
   assert.equal(result.y(), 803 + 72);
   assert.equal(result.heading(), 270);
});

QUnit.test("getPositionFor() Huge2 330 deg", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();
   const token = environment.pilotInstances()[3]; // CR90
   const fromPosition = new Position(458, 803, 270);
   const toPosition = new Position(458, 750, 330);
   environment.moveToken(fromPosition, toPosition);

   // Run.
   let result = environment.getPositionFor(token);

   // Verify.
   assert.ok(result);
   assert.equal(result.x(), 458);
   assert.equal(result.y(), 750);
   assert.equal(result.heading(), 330);

   // Run.
   result = environment.getPositionFor(token.tokenFore());

   // Verify.
   assert.ok(result);
   assert.equal(result.x(), 458 + 62);
   assert.equal(result.y(), 750 - 36);
   assert.equal(result.heading(), 330);

   // Run.
   result = environment.getPositionFor(token.tokenAft());

   // Verify.
   assert.ok(result);
   assert.equal(result.x(), 458 - 62);
   assert.equal(result.y(), 750 + 36);
   assert.equal(result.heading(), 330);
});

QUnit.test("getTargetableDefenders() none", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attackerPosition = new Position(458, 895, -90);
   const attacker = environment.getTokenAt(attackerPosition);
   const weapon = attacker.primaryWeapon();

   // Run.
   const result = environment.getTargetableDefenders(attacker, attackerPosition, weapon);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 0);
});

QUnit.test("getTargetableDefenders() one", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attackerPosition0 = new Position(458, 895, -90);
   const attacker = environment.getTokenAt(attackerPosition0);
   const attackerPosition = new Position(305, 70, -90);
   environment.moveToken(attackerPosition0, attackerPosition);
   const weapon = attacker.primaryWeapon();

   // Run.
   const result = environment.getTargetableDefenders(attacker, attackerPosition, weapon);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
});

QUnit.test("getTargetableDefendersAtRange() none", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attackerPosition = new Position(458, 895, -90);
   const attacker = environment.getTokenAt(attackerPosition);
   const weapon = attacker.primaryWeapon();

   // Run.
   const result = environment.getTargetableDefendersAtRange(attacker, attackerPosition, weapon,
      Range.ONE);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 0);
});

QUnit.test("getTargetableDefendersAtRange() one", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attackerPosition0 = new Position(458, 895, -90);
   const attacker = environment.getTokenAt(attackerPosition0);
   const attackerPosition = new Position(305, 70, -90);
   environment.moveToken(attackerPosition0, attackerPosition);
   const weapon = attacker.primaryWeapon();

   // Run.
   const result = environment.getTargetableDefendersAtRange(attacker, attackerPosition, weapon, Range.ONE);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
});

QUnit.test("getTokenAt() 1", function(assert)
{
   const position = new Position(305, 20, 90);
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   const token = environment.getTokenAt(position);
   assert.strictEqual(token.card().key, PilotCard.MAULER_MITHEL);
});

QUnit.test("getTokenAt() 2", function(assert)
{
   const position = new Position(610, 20, 90);
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   const token = environment.getTokenAt(position);
   assert.strictEqual(token.card().key, PilotCard.DARK_CURSE);
});

QUnit.test("getTokenAt() 3", function(assert)
{
   const position = new Position(458, 895, -90);
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   const token = environment.getTokenAt(position);
   assert.strictEqual(token.card().key, PilotCard.LUKE_SKYWALKER);
});

QUnit.test("getTokenById()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   // Run / Verify.
   assert.equal(environment.getTokenById(1).id(), 1);
   assert.equal(environment.getTokenById(2).id(), 2);
   assert.equal(environment.getTokenById(3).id(), 3);
});

QUnit.test("getTokensAtRange()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attacker = environment.pilotInstances()[2]; // X-Wing
   const attackerPosition0 = environment.getPositionFor(attacker);
   const attackerPosition = new Position(458, 50, -90);
   environment.moveToken(attackerPosition0, attackerPosition);

   // Run.
   const result = environment.getTokensAtRange(attacker, Range.TWO);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
   assert.equal(result[0].card().key, PilotCard.MAULER_MITHEL);
   assert.equal(result[1].card().key, PilotCard.DARK_CURSE);
});

QUnit.test("getTokensForActivation()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   // Run.
   const result = environment.getTokensForActivation();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 3);
   let token;
   let i = 0;
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 6);
   assert.equal(token.card().key, PilotCard.DARK_CURSE);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 7);
   assert.equal(token.card().key, PilotCard.MAULER_MITHEL);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 8);
   assert.equal(token.card().key, PilotCard.LUKE_SKYWALKER);
});

QUnit.test("getTokensForActivation() Huge", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();

   // Run.
   const result = environment.getTokensForActivation();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 6);
   let token;
   let i = 0;
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 8);
   assert.equal(token.card().key, PilotCard.JUNO_ECLIPSE);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 8);
   assert.equal(token.card().key, PilotCard.WES_JANSON);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 2);
   assert.equal(token.card().key, PilotCard.GOZANTI_CLASS_CRUISER);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 3);
   assert.equal(token.card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
   token = result[i++];
   assert.equal(token.tokenFore().pilotSkillValue(), 4);
   assert.equal(token.tokenAft().pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE);
   token = result[i++];
   assert.equal(token.tokenFore().pilotSkillValue(), 4);
   assert.equal(token.tokenAft().pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.CR90_CORVETTE);
});

QUnit.test("getTokensForActivation() Huge pure", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();

   // Run.
   const result = environment.getTokensForActivation(true);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 8);
   let token;
   let i = 0;
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 8);
   assert.equal(token.card().key, PilotCard.JUNO_ECLIPSE);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 8);
   assert.equal(token.card().key, PilotCard.WES_JANSON);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 2);
   assert.equal(token.card().key, PilotCard.GOZANTI_CLASS_CRUISER);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 3);
   assert.equal(token.card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".fore");
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".aft");
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".fore");
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".aft");
});

QUnit.test("getTokensForCombat()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   // Run.
   const result = environment.getTokensForCombat();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 3);
   let token;
   let i = 0;
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 8);
   assert.equal(token.card().key, PilotCard.LUKE_SKYWALKER);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 7);
   assert.equal(token.card().key, PilotCard.MAULER_MITHEL);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 6);
   assert.equal(token.card().key, PilotCard.DARK_CURSE);
});

QUnit.test("getTokensForCombat() Huge", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();

   // Run.
   const result = environment.getTokensForCombat();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 8);
   let token;
   let i = 0;
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 8);
   assert.equal(token.card().key, PilotCard.JUNO_ECLIPSE);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 8);
   assert.equal(token.card().key, PilotCard.WES_JANSON);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".fore");
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".aft");
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".fore");
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 4);
   assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".aft");
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 3);
   assert.equal(token.card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
   token = result[i++];
   assert.equal(token.pilotSkillValue(), 2);
   assert.equal(token.card().key, PilotCard.GOZANTI_CLASS_CRUISER);
});

QUnit.test("getUnfriendlyTokensAtRange() one", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attacker = environment.pilotInstances()[2]; // X-Wing
   const attackerPosition0 = environment.getPositionFor(attacker);
   const attackerPosition = new Position(458, 50, -90);
   environment.moveToken(attackerPosition0, attackerPosition);

   // Run.
   const result = environment.getUnfriendlyTokensAtRange(attacker, Range.TWO);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
   assert.equal(result[0].card().key, PilotCard.MAULER_MITHEL);
   assert.equal(result[1].card().key, PilotCard.DARK_CURSE);
});

QUnit.test("incrementRound()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   assert.equal(environment.round(), 0);

   // Run.
   environment.incrementRound();

   // Verify.
   assert.equal(environment.round(), 1);
});

QUnit.test("moveToken()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const token = environment.pilotInstances()[0];
   const fromPosition = environment.getPositionFor(token);
   const toPosition = new Position(fromPosition.x() + 100, fromPosition.y() + 100, fromPosition.heading() + 90);
   assert.equal(environment.getPositionFor(token), fromPosition);
   assert.ok(environment.getTokenAt(fromPosition).equals(token));

   // Run.
   environment.moveToken(fromPosition, toPosition);

   // Verify.
   assert.strictEqual(environment.getPositionFor(token), toPosition);
   assert.ok(environment.getTokenAt(toPosition).equals(token));
});

QUnit.test("parentOf() CR90", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();
   const parentInstance = environment.pilotInstances()[3]; // CR90
   const tokenFore = parentInstance.tokenFore();
   assert.ok(tokenFore);
   assert.equal(tokenFore.idParent(), 41);
   const tokenAft = parentInstance.tokenAft();
   assert.ok(tokenAft);
   assert.equal(tokenAft.idParent(), 41);

   // Run.
   const result = environment.parentOf(tokenFore);

   // Verify.
   assert.ok(result);
   assert.equal(result.card().key, PilotCard.CR90_CORVETTE);
});

QUnit.test("parentOf() Raider-class", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();
   const parentInstance = environment.pilotInstances()[2]; // Raider-class
   const tokenFore = parentInstance.tokenFore();
   assert.ok(tokenFore);
   assert.equal(tokenFore.idParent(), 36);
   const tokenAft = parentInstance.tokenAft();
   assert.ok(tokenAft);
   assert.equal(tokenAft.idParent(), 36);

   // Run.
   const result = environment.parentOf(tokenFore);

   // Verify.
   assert.ok(result);
   assert.equal(result.card().key, PilotCard.RAIDER_CLASS_CORVETTE);
});

QUnit.test("pilotInstances()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   // Run.
   const result = environment.pilotInstances();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 3);
   assert.equal(result[0].card().key, PilotCard.MAULER_MITHEL);
   assert.equal(result[1].card().key, PilotCard.DARK_CURSE);
   assert.equal(result[2].card().key, PilotCard.LUKE_SKYWALKER);
});

QUnit.test("pilotInstances() pure", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const isPure = true;

   // Run.
   const result = environment.pilotInstances(isPure);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 3);
   assert.equal(result[0].card().key, PilotCard.MAULER_MITHEL);
   assert.equal(result[1].card().key, PilotCard.DARK_CURSE);
   assert.equal(result[2].card().key, PilotCard.LUKE_SKYWALKER);
});

QUnit.test("pilotInstances() Huge", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();

   // Run.
   const result = environment.pilotInstances();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 6);
   let i = 0;
   assert.equal(result[i++].card().key, PilotCard.GOZANTI_CLASS_CRUISER);
   assert.equal(result[i++].card().key, PilotCard.JUNO_ECLIPSE);
   assert.equal(result[i++].card().key, PilotCard.RAIDER_CLASS_CORVETTE);
   assert.equal(result[i++].card().key, PilotCard.CR90_CORVETTE);
   assert.equal(result[i++].card().key, PilotCard.WES_JANSON);
   assert.equal(result[i++].card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
});

QUnit.test("pilotInstances() Huge pure", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();

   // Run.
   const result = environment.pilotInstances(true);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 8);
   let i = 0;
   assert.equal(result[i++].card().key, PilotCard.GOZANTI_CLASS_CRUISER);
   assert.equal(result[i++].card().key, PilotCard.JUNO_ECLIPSE);
   assert.equal(result[i++].card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".fore");
   assert.equal(result[i++].card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".aft");
   assert.equal(result[i++].card().key, PilotCard.CR90_CORVETTE + ".fore");
   assert.equal(result[i++].card().key, PilotCard.CR90_CORVETTE + ".aft");
   assert.equal(result[i++].card().key, PilotCard.WES_JANSON);
   assert.equal(result[i++].card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
});

QUnit.test("playFormatKey() Standard", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   // Run.
   const result = environment.playFormatKey();

   // Verify.
   assert.ok(result);
   assert.equal(result, PlayFormat.STANDARD);
});

QUnit.test("playFormatKey() Epic", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();

   // Run.
   const result = environment.playFormatKey();

   // Verify.
   assert.ok(result);
   assert.equal(result, PlayFormat.EPIC);
});

QUnit.test("removeToken()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const token = environment.pilotInstances()[0];
   const position = environment.getPositionFor(token);
   assert.equal(environment.getPositionFor(token), position);
   assert.ok(environment.getTokenAt(position).equals(token));

   // Run.
   environment.removeToken(token);

   // Verify.
   assert.strictEqual(environment.getPositionFor(token), undefined);
   assert.strictEqual(environment.getTokenAt(position), undefined);
});

QUnit.test("toString()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   // Run / Verify.
   assert.equal(environment.toString(), "(305, 20, 90) 34 \u2022 \"Mauler Mithel\" (TIE Fighter) pilot\n(610, 20, 90) 36 \u2022 \"Dark Curse\" (TIE Fighter) pilot\n(458, 895, 270) 37 \u2022 Luke Skywalker (X-Wing) pilot\n");
});

const EnvironmentTest = {};
export default EnvironmentTest;