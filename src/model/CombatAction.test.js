/*
 * Test upgrades with headers Attack [Focus] and Attack [Target Lock].
 */
import DamageCard from "../artifact/DamageCard.js";
import Phase from "../artifact/Phase.js";
import PilotCard from "../artifact/PilotCard.js";
import Faction from "../artifact/Faction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Ability from "./Ability.js";
import Action from "./Action.js";
import Adjudicator from "./Adjudicator.js";
import Agent from "./Agent.js";
import AttackDice from "./AttackDice.js";
import CombatAction from "./CombatAction.js";
import DefenseDice from "./DefenseDice.js";
import Environment from "./Environment.js";
import EnvironmentAction from "./EnvironmentAction.js";
import EventObserver from "./EventObserver.js";
import MockAttackDice from "./MockAttackDice.js";
import MockDefenseDice from "./MockDefenseDice.js";
import PhaseObserver from "./PhaseObserver.js";
import Position from "./Position.js";
import Reducer from "./Reducer.js";
import Selector from "./Selector.js";
import Squad from "./Squad.js";
import TargetLock from "./TargetLock.js";
import CardInstance from "./CardInstance.js";
import CardAction from "./CardAction.js";
import UpgradeAbility3 from "./UpgradeAbility3.js";

QUnit.module("CombatAction-1");

var delay = 10;

QUnit.test("CombatAction.doIt() Advanced Homing Missiles", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.ADVANCED_HOMING_MISSILES;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      // assert.ok(TargetLock.getFirst(store, attacker, defender));
      assert.equal(TargetLock.getFirst(store, attacker, defender).id(), "A");
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 0);

      assert.ok([1, 2].includes(defender.damageCount() + defender.criticalDamageCount()));
      done();
   };
   var combatAction = createCombatActionRange2(upgradeKey, callback);
   var environment = combatAction.environment();
   var store = environment.store();
   var tokens = environment.pilotInstances();
   var attacker = tokens[1]; // Dash Rendar YT-2400
   var defender = tokens[0]; // Academy PilotCard TIE Fighter

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Advanced Proton Torpedoes", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.ADVANCED_PROTON_TORPEDOES;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(TargetLock.getFirst(store, attacker, defender), undefined);
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 0);
      var attackDice = AttackDice.get(store, attacker.id());
      assert.equal(attackDice.blankCount(), 0);
      assert.equal(attackDice.criticalHitCount(), 1);
      assert.equal(attackDice.focusCount(), 2);
      assert.equal(attackDice.hitCount(), 1);

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.ok([1, 2].includes(defender.damageCount() + defender.criticalDamageCount()));
      assert.equal(defender.hullValue(), 3);
      done();
   };
   var combatAction = createCombatAction(upgradeKey, callback);
   var store = combatAction.store();
   var environment = combatAction.environment();
   var tokens = environment.pilotInstances();
   var attacker = tokens[1]; // Dash Rendar YT-2400
   var defender = tokens[0]; // Academy PilotCard TIE Fighter

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Assault Missiles", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.ASSAULT_MISSILES;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.ok(!TargetLock.getFirst(store, attacker, defender));
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(combatAction.executionCount(), 1);
      assert.equal(attacker.secondaryWeapons().length, 0);
      verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.ok([1, 2].includes(defender.damageCount() + defender.criticalDamageCount()));
      assert.equal(defender.hullValue(), 3);
      done();
   };
   var combatAction = createCombatActionRange2(upgradeKey, callback);
   var store = combatAction.store();
   var environment = combatAction.environment();
   var tokens = environment.pilotInstances();
   var attacker = tokens[1]; // Dash Rendar YT-2400
   var defender = tokens[0]; // Academy PilotCard TIE Fighter

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Blaster Turret", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.BLASTER_TURRET;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(combatAction.executionCount(), 1);
      assert.equal(attacker.focusCount(), 0);
      assert.ok(attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 1);
      verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

      assert.ok(!defender.isDestroyed());
      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.ok([1, 2].includes(defender.damageCount() + defender.criticalDamageCount()));
      assert.equal(defender.hullValue(), 3);
      done();
   };
   var combatAction = createCombatAction(upgradeKey, callback);
   var store = combatAction.store();
   var environment = combatAction.environment();
   var tokens = environment.pilotInstances();
   var attacker = tokens[1]; // Dash Rendar YT-2400
   var defender = tokens[0]; // Academy PilotCard TIE Fighter
   assert.equal(attacker.focusCount(), 1);

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Cluster Missiles", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.CLUSTER_MISSILES;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(combatAction.executionCount(), 2);
      assert.ok(!TargetLock.getFirst(store, attacker, defender));
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 0);
      verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.ok([2, 3].includes(defender.damageCount() + defender.criticalDamageCount()), "sum damage");
      assert.equal(defender.hullValue(), 3);
      if (defender.criticalDamageKeys().get(0) === DamageCard.DIRECT_HIT_V2 && defender.criticalDamageKeys().get(1) === DamageCard.DIRECT_HIT_V2)
      {
         assert.ok(defender.isDestroyed());
      }
      else if (defender.criticalDamageKeys().get(0) === DamageCard.DIRECT_HIT_V2 || defender.criticalDamageKeys().get(1) === DamageCard.DIRECT_HIT_V2)
      {
         assert.ok(defender.isDestroyed());
      }
      else
      {
         assert.ok(!defender.isDestroyed());
      }
      done();
   };
   var combatAction = createCombatAction(upgradeKey, callback);
   var store = combatAction.store();
   var environment = combatAction.environment();
   var tokens = environment.pilotInstances();
   var attacker = tokens[1]; // Dash Rendar YT-2400
   var defender = tokens[0]; // Academy PilotCard TIE Fighter

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Concussion Missiles", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.CONCUSSION_MISSILES;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.ok(!TargetLock.getFirst(store, attacker, defender));
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 0);
      var attackDice = AttackDice.get(store, attacker.id());
      assert.equal(attackDice.blankCount(), 0);
      assert.equal(attackDice.criticalHitCount(), 1);
      assert.equal(attackDice.focusCount(), 1);
      assert.equal(attackDice.hitCount(), 2);

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.ok([2, 3].includes(defender.damageCount() + defender.criticalDamageCount()));
      assert.equal(defender.hullValue(), 3);
      done();
   };
   var combatAction = createCombatActionRange2(upgradeKey, callback);
   var store = combatAction.store();
   var environment = combatAction.environment();
   var tokens = environment.pilotInstances();
   var attacker = tokens[1]; // Dash Rendar YT-2400
   var defender = tokens[0]; // Academy PilotCard TIE Fighter

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Flechette Torpedoes", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.FLECHETTE_TORPEDOES;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.ok(!TargetLock.getFirst(store, attacker, defender));
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 0);
      verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.ok([1, 2].includes(defender.damageCount() + defender.criticalDamageCount()), "defender.damageCount() + defender.criticalDamageCount() === 1");
      assert.ok(defender.isStressed());
      assert.ok([1, 2].includes(defender.stressCount()), "defender.stressCount() === 1");
      done();
   };
   var combatAction = createCombatAction(upgradeKey, callback);
   var store = combatAction.store();
   var environment = combatAction.environment();
   var tokens = environment.pilotInstances();
   var attacker = tokens[1]; // Dash Rendar YT-2400
   var defender = tokens[0]; // Academy PilotCard TIE Fighter

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Ion Pulse Missiles", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.ION_PULSE_MISSILES;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.ok(TargetLock.getFirst(store, attacker, defender));
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 0);

      assert.equal(defender.damageCount(), 1);
      assert.equal(defender.criticalDamageCount(), 0);
      assert.equal(defender.ionCount(), 2);
      done();
   };
   var combatAction = createCombatActionRange2(upgradeKey, callback);
   var environment = combatAction.environment();
   var store = environment.store();
   var tokens = environment.pilotInstances();
   var attacker = tokens[1]; // Dash Rendar YT-2400
   var defender = tokens[0]; // Academy PilotCard TIE Fighter

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Ion Torpedoes", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.ION_TORPEDOES;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.ok(!TargetLock.getFirst(store, attacker, defender));
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(combatAction.executionCount(), 1);
      assert.equal(attacker.secondaryWeapons().length, 0);
      var attackDice = AttackDice.get(store, attacker.id());
      assert.equal(attackDice.size(), 4);
      assert.equal(attacker.ionCount(), 0);
      verifyAttackDice(assert, AttackDice.get(store, attacker.id()));
      assert.ok(Selector.isDefenderHit(store.getState(), attacker));

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.equal(defender.damageCount() + defender.criticalDamageCount(), 1);
      assert.ok(!defender.isDestroyed());
      assert.equal(defender.ionCount(), 1);
      assert.equal(token2.ionCount(), 1);
      done();
   };
   var combatAction = createCombatActionRange2(upgradeKey, callback);
   var environment = combatAction.environment();
   var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
   var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter
   var store = environment.store();
   var defenderPosition = combatAction.defenderPosition();
   var token2 = new CardInstance(store, PilotCard.ACADEMY_PILOT, defender.agent());
   var token2Position = new Position(defenderPosition.x() + 80, defenderPosition.y(), defenderPosition.heading());
   store.dispatch(EnvironmentAction.placeToken(token2Position, token2));
   assert.equal(environment.pilotInstances().length, 3);

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Plasma Torpedoes", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.PLASMA_TORPEDOES;
   var store00 = Redux.createStore(Reducer.root);
   var rebelAgent = new Agent(store00, "Rebel Agent");
   var attacker = new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [upgradeKey]);
   var attackerPosition = new Position(458, 895, -90);
   var imperialAgent = new Agent(store00, "Imperial Agent");
   var defender = new CardInstance(store00, PilotCard.PATROL_LEADER, imperialAgent);
   var defenderPosition = new Position(450, 845, 90);

   var store = Redux.createStore(Reducer.root);
   var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [defender]);
   var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [attacker]);
   var positions1 = [defenderPosition];
   var positions2 = [attackerPosition];
   var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
   imperialAgent = environment.firstAgent();
   imperialAgent.getModifyDefenseDiceAction = function(attacker, defender, callback)
   {
      callback(undefined);
   };
   rebelAgent = environment.secondAgent();
   rebelAgent.getModifyAttackDiceAction = function(attacker, defender, callback)
   {
      callback(undefined);
   };
   var tokens = environment.pilotInstances();
   attacker = tokens[1];
   defender = tokens[0];
   Adjudicator.create(store);
   var weapon = attacker.secondaryWeapons()[0];

   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);

   store.dispatch(CardAction.addFocusCount(attacker));
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.ok(!TargetLock.getFirst(store, attacker, defender));
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(combatAction.executionCount(), 1);
      assert.equal(attacker.secondaryWeapons().length, 0);
      assert.equal(AttackDice.get(store, attacker.id()).size(), 4);
      verifyAttackDice(assert, AttackDice.get(store, attacker.id()));
      assert.ok(Selector.isDefenderHit(store.getState(), attacker));

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.equal(defender.damageCount(), 0);
      assert.equal(defender.criticalDamageCount(), 0);
      assert.ok(!defender.isDestroyed());
      assert.equal(defender.shieldCount(), 2);
      done();
   };
   TargetLock.newInstance(store, attacker, defender);
   environment.setActiveToken(attacker);
   store.dispatch(Action.setDelay(delay));
   var combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
   assert.ok(attacker.isUpgradedWith(upgradeKey));
   assert.equal(attacker.secondaryWeapons().length, 1);
   assert.equal(defender.shieldCount(), 4);

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Proton Rockets", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.PROTON_ROCKETS;
   var store00 = Redux.createStore(Reducer.root);
   var rebelAgent = new Agent(store00, "Rebel Agent");
   rebelAgent.getModifyAttackDiceAction = function(store, adjudicator, attacker, defender, callback)
   {
      var rawAbility = UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][upgradeKey];
      var ability;
      if (rawAbility && rawAbility.condition(store, attacker))
      {
         ability = new Ability(UpgradeCard, upgradeKey, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
      }
      var isAccepted = (ability !== undefined);
      callback(ability, isAccepted);
   };
   var attacker = new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [upgradeKey]);
   var attackerPosition = new Position(458, 895, -90);
   var imperialAgent = new Agent(store00, "Imperial Agent");
   imperialAgent.getModifyDefenseDiceAction = function(store, adjudicator, attacker, defender, callback)
   {
      callback(undefined);
   };
   var defender = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
   var defenderPosition = new Position(450, 845, 90);

   var store = Redux.createStore(Reducer.root);
   var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [defender]);
   var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [attacker]);
   var positions1 = [defenderPosition];
   var positions2 = [attackerPosition];
   var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
   var tokens = environment.pilotInstances();
   attacker = tokens[1];
   defender = tokens[0];
   Adjudicator.create(store);
   var weapon = attacker.secondaryWeapons()[0];

   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);

   store.dispatch(CardAction.addFocusCount(attacker));
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 0);
      assert.equal(AttackDice.get(store, attacker.id()).size(), 2 + 2);

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      done();
   };
   environment.setActiveToken(attacker);
   store.dispatch(Action.setDelay(delay));
   var combatAction = new CombatAction(store, attacker, weapon, defender, callback, undefined, MockDefenseDice);
   assert.ok(attacker.isUpgradedWith(upgradeKey));
   assert.equal(attacker.secondaryWeapons().length, 1);

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() Proton Torpedoes", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.PROTON_TORPEDOES;
   var callback = function()
   {
      // Verify.
      assert.ok(!TargetLock.getFirst(store, attacker, defender));
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 0);
      var attackDice = AttackDice.get(store, attacker.id());
      assert.equal(attackDice.blankCount(), 1);
      assert.equal(attackDice.criticalHitCount(), 2);
      assert.equal(attackDice.focusCount(), 0);
      assert.equal(attackDice.hitCount(), 1);

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.ok([2, 3].includes(defender.damageCount() + defender.criticalDamageCount()));
      done();
   };
   var combatAction = createCombatActionRange2(upgradeKey, callback);
   var store = combatAction.store();
   var environment = combatAction.environment();
   var tokens = environment.pilotInstances();
   var attacker = tokens[1]; // Dash Rendar YT-2400
   var defender = tokens[0]; // Academy PilotCard TIE Fighter
   assert.ok(TargetLock.getFirst(store, attacker, defender));
   assert.ok(attacker.isUpgradedWith(upgradeKey));
   assert.equal(attacker.secondaryWeapons().length, 1);

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

QUnit.test("CombatAction.doIt() XX-23 S-Thread Tracers", function(assert)
{
   // Setup.
   var upgradeKey = UpgradeCard.XX_23_S_THREAD_TRACERS;
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.ok(!attacker.isUpgradedWith(upgradeKey));
      assert.equal(attacker.secondaryWeapons().length, 0);
      verifyAttackDice(assert, AttackDice.get(store, attacker.id()));
      assert.ok(Selector.isDefenderHit(store.getState(), attacker));

      verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
      assert.equal(defender.damageCount(), 0);
      assert.equal(defender.criticalDamageCount(), 0);

      assert.ok(TargetLock.getFirst(store, token2, defender));
      done();
   };
   var combatAction = createCombatActionRange2(upgradeKey, callback);
   var environment = combatAction.environment();
   var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
   var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter
   var store = environment.store();
   var attackerPosition = combatAction.attackerPosition();
   var token2 = new CardInstance(store, PilotCard.ROOKIE_PILOT, attacker.agent());
   var token2Position = new Position(attackerPosition.x() + 80, attackerPosition.y(), attackerPosition.heading());
   store.dispatch(EnvironmentAction.placeToken(token2Position, token2));
   assert.equal(environment.pilotInstances().length, 3);

   // Run.
   var done = assert.async();
   combatAction.doIt();
});

function createCombatAction(upgradeKey, callback0, y)
{
   var store00 = Redux.createStore(Reducer.root);
   var rebelAgent = new Agent(store00, "Rebel Agent");
   var attacker = new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [upgradeKey]);
   var attackerPosition = new Position(458, 895, -90);
   var imperialAgent = new Agent(store00, "Imperial Agent");
   var defender = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
   var myY = (y !== undefined ? y : 845);
   var defenderPosition = new Position(450, myY, 90);

   var store = Redux.createStore(Reducer.root);
   var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [defender]);
   var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [attacker]);
   var positions1 = [defenderPosition];
   var positions2 = [attackerPosition];
   var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
   imperialAgent = environment.firstAgent();
   imperialAgent.getModifyDefenseDiceAction = function(attacker, defender, callback)
   {
      callback(undefined, false);
   };
   rebelAgent = environment.secondAgent();
   rebelAgent.getModifyAttackDiceAction = function(attacker, defender, callback)
   {
      var rawAbility = UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][upgradeKey];
      var ability;
      if (rawAbility && rawAbility.condition(store, attacker))
      {
         ability = new Ability(UpgradeCard, upgradeKey, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
      }
      var isAccepted = (ability !== undefined);
      callback(ability, isAccepted);
   };
   var tokens = environment.pilotInstances();
   attacker = tokens[1];
   defender = tokens[0];
   var weapon = attacker.secondaryWeapons()[0];
   if (weapon === undefined)
   {
      weapon = attacker.primaryWeapon();
   }

   environment.setActiveToken(attacker);
   store.dispatch(CardAction.addFocusCount(attacker));
   TargetLock.newInstance(store, attacker, defender);

   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);
   Adjudicator.create(store);

   var callback = (callback0 !== undefined ? callback0 : function()
   {
      LOGGER.info("callback() start");
   });

   store.dispatch(Action.setDelay(delay));

   return new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
}

function createCombatActionRange2(upgradeKey, callback0)
{
   return createCombatAction(upgradeKey, callback0, 700);
}

function verifyAttackDice(assert, attackDice)
{
   assert.ok(attackDice);
   //  LOGGER.info("attackDice = " + attackDice);
   assert.equal(attackDice.blankCount(), 1);
   assert.equal(attackDice.criticalHitCount(), 1);
   assert.equal(attackDice.focusCount(), 1);
   assert.equal(attackDice.hitCount(), 1);
}

function verifyDefenseDice(assert, defenseDice)
{
   assert.ok(defenseDice);
   assert.equal(defenseDice.blankCount(), 1);
   assert.equal(defenseDice.evadeCount(), 1);
   assert.equal(defenseDice.focusCount(), 1);
}

const CombatActionTest = {};
export default CombatActionTest;