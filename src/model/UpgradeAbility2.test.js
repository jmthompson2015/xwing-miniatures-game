import Maneuver from "../artifact/Maneuver.js";
import Phase from "../artifact/Phase.js";

import Action from "./Action.js";
import ActivationAction from "./ActivationAction.js";
import Adjudicator from "./Adjudicator.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import UpgradeAbility from "./UpgradeAbility2.js";

QUnit.module("UpgradeAbility2");

const delay = 10;

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
               const consequent = ability.consequent.bind(ability);
               consequent(store, token, callback);
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

   const token = environment.pilotInstances()[2]; // X-Wing.
   const maneuverKey = Maneuver.STRAIGHT_3_STANDARD;
   const callback = function()
   {
      LOGGER.info("in callback()");
   };

   environment.setActiveToken(token);
   store.dispatch(Action.setDelay(delay));
   ActivationAction.create(store, token.id(), callback);
   const maneuver = Maneuver.properties[maneuverKey];
   store.dispatch(Action.setTokenManeuver(token, maneuver));

   return environment;
}

const UpgradeAbility2Test = {};
export default UpgradeAbility2Test;