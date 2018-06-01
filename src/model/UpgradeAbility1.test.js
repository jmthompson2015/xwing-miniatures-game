import Phase from "../artifact/Phase.js";

import EnvironmentFactory from "./EnvironmentFactory.js";
import UpgradeAbility from "./UpgradeAbility1.js";

QUnit.module("UpgradeAbility1");

QUnit.test("condition()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      var abilities = UpgradeAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(upgradeKey)
         {
            var ability = abilities[upgradeKey];

            if (ability.condition)
            {
               var result = ability.condition(store, token);
               assert.ok(result !== undefined, "phaseKey = " + phaseKey + " upgradeKey = " + upgradeKey);
            }
         });
      }
   });

   assert.ok(true);
});

QUnit.test("consequent()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      var abilities = UpgradeAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(upgradeKey)
         {
            var ability = abilities[upgradeKey];

            if (ability.condition && ability.condition(store, token))
            {
               ability.consequent(store, token);
               assert.ok(true, "phaseKey = " + phaseKey + " upgradeKey = " + upgradeKey);
            }
         });
      }
   });

   assert.ok(true);
});

QUnit.test("function()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      var abilities = UpgradeAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(upgradeKey)
         {
            var ability = abilities[upgradeKey];

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
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var token = environment.pilotInstances()[2]; // X-Wing.

   environment.setActiveToken(token);

   return environment;
}

const UpgradeAbility1Test = {};
export default UpgradeAbility1Test;