import Phase from "../artifact/Phase.js";

import DamageAbility from "./DamageAbility3.js";
import EnvironmentFactory from "./EnvironmentFactory.js";

QUnit.module("DamageAbility3");

QUnit.test("condition()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = DamageAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(damageKey)
         {
            const ability = abilities[damageKey];

            if (ability.condition)
            {
               const result = ability.condition(store, token);
               assert.ok(result !== undefined, "phaseKey = " + phaseKey + " damageKey = " + damageKey);
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
      const abilities = DamageAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(damageKey)
         {
            const ability = abilities[damageKey];

            if (ability.condition && ability.condition(store, token))
            {
               ability.consequent(store, token, callback);
               assert.ok(true, "phaseKey = " + phaseKey + " damageKey = " + damageKey);
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
      const abilities = DamageAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(damageKey)
         {
            const ability = abilities[damageKey];

            if (typeof ability === "function")
            {
               ability(store, token);
               assert.ok(true, "phaseKey = " + phaseKey + " damageKey = " + damageKey);
            }
         });
      }
   });

   assert.ok(true);
});

function createEnvironment()
{
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const token = environment.pilotInstances()[2]; // X-Wing.

   environment.setActiveToken(token);

   return environment;
}

const DamageAbility3Test = {};
export default DamageAbility3Test;