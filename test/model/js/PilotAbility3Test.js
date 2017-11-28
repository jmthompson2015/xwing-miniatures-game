"use strict";

define(["qunit", "artifact/js/Phase", "model/js/Action", "model/js/Adjudicator", "model/js/CombatAction", "model/js/PilotAbility3", "model/js/CardAction",
  "../../../test/model/js/EnvironmentFactory", "../../../test/model/js/MockAttackDice", "../../../test/model/js/MockDefenseDice"],
   function(QUnit, Phase, Action, Adjudicator, CombatAction, PilotAbility, CardAction,
      EnvironmentFactory, MockAttackDice, MockDefenseDice)
   {
      QUnit.module("PilotAbility3");

      QUnit.test("condition()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.tokens()[2]; // X-Wing.

         // Run / Verify.
         Phase.keys().forEach(function(phaseKey)
         {
            var abilities = PilotAbility[phaseKey];

            if (abilities)
            {
               Object.keys(abilities).forEach(function(pilotKey)
               {
                  var ability = abilities[pilotKey];

                  if (ability.condition)
                  {
                     var result = ability.condition(store, token);
                     assert.ok(result !== undefined, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
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
         Phase.keys().forEach(function(phaseKey)
         {
            var abilities = PilotAbility[phaseKey];

            if (abilities)
            {
               Object.keys(abilities).forEach(function(pilotKey)
               {
                  var ability = abilities[pilotKey];

                  if (ability.condition && ability.condition(store, token))
                  {
                     ability.consequent(store, token, callback);
                     assert.ok(true, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
                  }
               });
            }
         });
      });

      QUnit.test("function()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.tokens()[2]; // X-Wing.

         // Run / Verify.
         Phase.keys().forEach(function(phaseKey)
         {
            var abilities = PilotAbility[phaseKey];

            if (abilities)
            {
               Object.keys(abilities).forEach(function(pilotKey)
               {
                  var ability = abilities[pilotKey];

                  if (typeof ability === "function")
                  {
                     ability(store, token);
                     assert.ok(true, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
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
         Adjudicator.create(store);

         var attacker = environment.tokens()[2]; // X-Wing.
         var weapon = attacker.primaryWeapon();
         var defender = environment.tokens()[0]; // TIE Fighter.
         var callback = function()
         {
            LOGGER.info("in callback()");
         };

         environment.setActiveToken(attacker);
         store.dispatch(CardAction.addFocusCount(attacker));
         store.dispatch(CardAction.addStressCount(attacker));

         store.dispatch(Action.setTokenAttackDice(attacker.id(), (new MockAttackDice(store, attacker.id())).values()));
         store.dispatch(Action.setTokenDefenderHit(attacker, true));
         store.dispatch(Action.setTokenDefenseDice(attacker.id(), (new MockDefenseDice(store, attacker.id())).values()));
         store.dispatch(Action.setTokenInFiringArc(attacker, true));

         var combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
         store.dispatch(Action.setTokenCombatAction(attacker, combatAction));

         return environment;
      }
   });
