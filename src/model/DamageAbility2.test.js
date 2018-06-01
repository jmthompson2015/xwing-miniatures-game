import Phase from "../artifact/Phase.js";

import CardInstance from "./CardInstance.js";
import DamageAbility from "./DamageAbility2.js";
import EnvironmentFactory from "./EnvironmentFactory.js";

QUnit.module("DamageAbility2");

QUnit.test("condition()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      var abilities = DamageAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(damageKey)
         {
            var ability = abilities[damageKey];

            if (ability.condition)
            {
               var result = ability.condition(store, token);
               assert.ok(result !== undefined, "phaseKey = " + phaseKey + " damageKey = " + damageKey);
            }
         });
      }
   });
});

QUnit.test("consequent()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.
   var callback = function()
   {
      LOGGER.info("in callback()");
   };

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      var abilities = DamageAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(damageKey)
         {
            var damageInstance = new CardInstance(store, damageKey);
            token.receiveCriticalDamage(damageInstance);
            var ability = abilities[damageKey];

            if (ability.condition && ability.condition(store, token))
            {
               ability.consequent(store, token, callback);
               assert.ok(true, "phaseKey = " + phaseKey + " damageKey = " + damageKey);
            }
         });
      }
   });
});

function createEnvironment()
{
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var token = environment.pilotInstances()[2]; // X-Wing.

   environment.setActiveToken(token);

   return environment;
}

const DamageAbility2Test = {};
export default DamageAbility2Test;