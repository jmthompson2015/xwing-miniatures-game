import Phase from "../artifact/Phase.js";

import Action from "./Action.js";
import Adjudicator from "./Adjudicator.js";
import CombatAction from "./CombatAction.js";
import CardAction from "./CardAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import MockAttackDice from "./MockAttackDice.js";
import MockDefenseDice from "./MockDefenseDice.js";
import UpgradeAbility from "./UpgradeAbility4.js";

QUnit.module("UpgradeAbility4");

QUnit.test("condition()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = UpgradeAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(upgradeKey)
         {
            const ability = abilities[upgradeKey];

            if (ability.condition)
            {
               const result = ability.condition(store, token);
               assert.ok(result !== undefined, "phaseKey = " + phaseKey + " upgradeKey = " + upgradeKey);
            }
         });
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
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = UpgradeAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(upgradeKey)
         {
            const ability = abilities[upgradeKey];

            if (ability.condition && ability.condition(store, token))
            {
               ability.consequent(store, token, callback);
               assert.ok(true, "phaseKey = " + phaseKey + " upgradeKey = " + upgradeKey);
            }
         });
      }
   });
});

QUnit.test("function()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = UpgradeAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(upgradeKey)
         {
            const ability = abilities[upgradeKey];

            if (typeof ability === "function")
            {
               ability(store, token);
               assert.ok(true, "phaseKey = " + phaseKey + " upgradeKey = " + upgradeKey);
            }
         });
      }
   });

   assert.ok(true);
});

function createEnvironment()
{
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);

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

   const combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
   store.dispatch(Action.setTokenCombatAction(attacker, combatAction));

   return environment;
}

const UpgradeAbility4Test = {};
export default UpgradeAbility4Test;