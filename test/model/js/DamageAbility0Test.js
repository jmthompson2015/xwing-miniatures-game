"use strict";

define(["qunit", "artifact/js/DamageCard", "artifact/js/Event",
  "model/js/Action", "model/js/DamageAbility0", "model/js/CardAction", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, DamageCard, Event,
      Action, DamageAbility, CardAction, EnvironmentFactory)
   {
      QUnit.module("DamageAbility0");

      QUnit.test("condition()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.tokens()[2]; // X-Wing.

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
         var token = environment.tokens()[2]; // X-Wing.
         var callback = function()
         {
            LOGGER.info("in callback()");
         };

         // Run / Verify.
         Event.keys().forEach(function(eventKey)
         {
            var abilities = DamageAbility[eventKey];

            if (abilities)
            {
               Object.keys(abilities).forEach(function(damageKey)
               {
                  var ability = abilities[damageKey];

                  if (ability.condition && ability.condition(store, token))
                  {
                     ability.consequent(store, token, callback);
                     assert.ok(true, "eventKey = " + eventKey + " damageKey = " + damageKey);
                  }
               });
            }
         });

         assert.ok(true);
      });

      function createEnvironment()
      {
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token = environment.tokens()[2]; // X-Wing.

         environment.setActiveToken(token);
         store.dispatch(CardAction.addCriticalDamage(token, DamageCard.MINOR_EXPLOSION));
         store.dispatch(Action.enqueueEvent(Event.RECEIVE_CRITICAL_DAMAGE, token));

         return environment;
      }
   });
