"use strict";

define(["qunit", "artifact/js/DamageCard", "artifact/js/Event",
  "model/js/Action", "model/js/CardInstance", "model/js/DamageAbility0", "model/js/CardAction", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, DamageCard, Event,
      Action, CardInstance, DamageAbility, CardAction, EnvironmentFactory)
   {
      QUnit.module("DamageAbility0");

      QUnit.test("condition()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.pilotInstances()[2]; // X-Wing.

         // Run / Verify.
         Event.keys().forEach(function(eventKey)
         {
            var abilities = DamageAbility[eventKey];

            if (abilities)
            {
               Object.keys(abilities).forEach(function(damageKey)
               {
                  var ability = abilities[damageKey];

                  if (ability.condition)
                  {
                     var result = ability.condition(store, token);
                     assert.ok(result !== undefined, "eventKey = " + eventKey + " damageKey = " + damageKey);
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

         // Run / Verify.
         Event.keys().forEach(function(eventKey)
         {
            var abilities = DamageAbility[eventKey];

            if (abilities)
            {
               Object.keys(abilities).forEach(function(damageKey)
               {
                  var damageInstance = new CardInstance(store, damageKey);
                  token.receiveCriticalDamage(damageInstance);
                  var eventCallback = function()
                  {
                     assert.ok(true, "eventKey = " + eventKey + " damageKey = " + damageKey);
                  };
                  store.dispatch(Action.enqueueEvent(eventKey, token, eventCallback));
                  store.dispatch(Action.dequeueEvent());
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
