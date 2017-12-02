"use strict";

define(["qunit", "artifact/js/Phase", "model/js/CardInstance", "model/js/DamageAbility2", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Phase, CardInstance, DamageAbility, EnvironmentFactory)
   {
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
   });
