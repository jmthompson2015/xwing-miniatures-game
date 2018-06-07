import DiceModification from "../artifact/DiceModification.js";

import Action from "./Action.js";
import AttackDice from "./AttackDice.js";
import CombatAction from "./CombatAction.js";
import DefenseDice from "./DefenseDice.js";
import ModifyDiceAbility from "./ModifyDiceAbility.js";
import TargetLock from "./TargetLock.js";
import CardAction from "./CardAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import MockAttackDice from "./MockAttackDice.js";
import MockDefenseDice from "./MockDefenseDice.js";

QUnit.module("ModifyDiceAbility");

QUnit.test("condition()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   const abilities = ModifyDiceAbility;
   assert.ok(abilities);

   Object.keys(abilities).forEach(function(modificationKey)
   {
      const ability = abilities[modificationKey];

      if (ability.condition)
      {
         const result = ability.condition(store, token);
         assert.ok(result !== undefined, "modificationKey = " + modificationKey);
      }
   });
});

QUnit.test("consequent()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.
   const callback = function()
   {
      LOGGER.info("in callback()");
   };

   // Run / Verify.
   const abilities = ModifyDiceAbility;
   assert.ok(abilities);

   Object.keys(abilities).forEach(function(modificationKey)
   {
      const ability = abilities[modificationKey];

      if (ability.condition && ability.condition(store, token))
      {
         ability.consequent(store, token, callback);
         assert.ok(true, "modificationKey = " + modificationKey);
      }
   });
});

QUnit.test("attack spend focus", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const attacker = environment.activeCardInstance();
   const attackDice = AttackDice.get(store, attacker.id());
   assert.equal(attacker.focusCount(), 1);
   const focusCount0 = attackDice.focusCount();
   const hitCount0 = attackDice.hitCount();
   const ability = ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY][DiceModification.ATTACK_SPEND_FOCUS];
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      const attackDice = AttackDice.get(store, attacker.id());
      assert.equal(attacker.focusCount(), 0);
      assert.equal(attackDice.focusCount(), 0);
      assert.equal(attackDice.hitCount(), hitCount0 + focusCount0);
      done();
   };

   // Run.
   const done = assert.async();
   ability.consequent(store, attacker, callback);
});

QUnit.test("attack spend target lock", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[2]; // X-Wing.
   const defender = environment.pilotInstances()[0]; // TIE Fighter.
   TargetLock.newInstance(store, attacker, defender);
   const attackDice = AttackDice.get(store, attacker.id());
   const blankCount0 = attackDice.blankCount();
   const focusCount0 = attackDice.focusCount();
   const hitCount0 = attackDice.hitCount();
   const ability = ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY][DiceModification.ATTACK_SPEND_TARGET_LOCK];
   const callback = function()
   {
      // Verify.
      const attackDice = AttackDice.get(store, attacker.id());
      assert.ok(attackDice);
      assert.ok(attackDice.hitCount() >= hitCount0);
      assert.ok(attackDice.hitCount() <= blankCount0 + focusCount0 + hitCount0);
   };

   // Run.
   ability.consequent(store, attacker, callback);
});

QUnit.test("defense spend evade", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[2]; // X-Wing.
   const defender = environment.pilotInstances()[0]; // TIE Fighter.
   store.dispatch(CardAction.addEvadeCount(defender));
   const defenseDice = DefenseDice.get(store, attacker.id());
   assert.equal(defender.evadeCount(), 1);
   assert.equal(defender.focusCount(), 0);
   const evadeCount0 = defenseDice.evadeCount();
   const focusCount0 = defenseDice.focusCount();
   const ability = ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY][DiceModification.DEFENSE_SPEND_EVADE];
   const callback = function()
   {
      // Verify.
      assert.equal(defender.evadeCount(), 0);
      assert.equal(defender.focusCount(), 0);
      const defenseDice = DefenseDice.get(store, attacker.id());
      assert.ok(defenseDice);
      assert.equal(defenseDice.evadeCount(), evadeCount0 + 1);
      assert.equal(defenseDice.focusCount(), focusCount0);
   };

   // Run.
   ability.consequent(store, attacker, callback);
});

QUnit.test("defense spend focus", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[2]; // X-Wing.
   const defender = environment.pilotInstances()[0]; // TIE Fighter.
   const defenseDice = DefenseDice.get(store, attacker.id());
   store.dispatch(CardAction.addFocusCount(defender));
   assert.equal(defender.evadeCount(), 0);
   assert.equal(defender.focusCount(), 1);
   const evadeCount0 = defenseDice.evadeCount();
   const focusCount0 = defenseDice.focusCount();
   const ability = ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY][DiceModification.DEFENSE_SPEND_FOCUS];
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(defender.evadeCount(), 0);
      assert.equal(defender.focusCount(), 0);
      const defenseDice = DefenseDice.get(store, attacker.id());
      assert.ok(defenseDice);
      assert.equal(defenseDice.evadeCount(), evadeCount0 + focusCount0);
      assert.equal(defenseDice.focusCount(), 0);
      done();
   };

   // Run.
   const done = assert.async();
   ability.consequent(store, attacker, callback);
});

function createEnvironment()
{
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[2]; // X-Wing.
   const weapon = attacker.primaryWeapon();
   const defender = environment.pilotInstances()[0]; // TIE Fighter.
   const callback = function()
   {
      LOGGER.info("in callback()");
   };

   environment.setActiveToken(attacker);
   store.dispatch(CardAction.addFocusCount(attacker));
   store.dispatch(CardAction.addStressCount(attacker));

   store.dispatch(Action.setTokenAttackDice(attacker.id(), (new MockAttackDice(store, attacker.id())).values()));
   store.dispatch(Action.setTokenDefenseDice(attacker.id(), (new MockDefenseDice(store, attacker.id())).values()));
   store.dispatch(Action.setTokenInFiringArc(attacker, true));

   const combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
   store.dispatch(Action.setTokenCombatAction(attacker, combatAction));

   return environment;
}

const ModifyDiceAbilityTest = {};
export default ModifyDiceAbilityTest;