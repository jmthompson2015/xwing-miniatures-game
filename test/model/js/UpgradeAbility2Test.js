"use strict";

define(["qunit", "artifact/js/Maneuver", "artifact/js/Phase",
  "model/js/Action", "model/js/ActivationAction", "model/js/Adjudicator", "model/js/UpgradeAbility2", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Maneuver, Phase,
      Action, ActivationAction, Adjudicator, UpgradeAbility, EnvironmentFactory)
   {
      QUnit.module("UpgradeAbility2");

      var delay = 10;

      QUnit.test("condition()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.tokens()[2]; // X-Wing.

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
            var abilities = UpgradeAbility[phaseKey];

            if (abilities)
            {
               Object.keys(abilities).forEach(function(upgradeKey)
               {
                  var ability = abilities[upgradeKey];

                  if (ability.condition && ability.condition(store, token))
                  {
                     var consequent = ability.consequent.bind(ability);
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
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.tokens()[2]; // X-Wing.

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
         var store = environment.store();
         Adjudicator.create(store);

         var token = environment.tokens()[2]; // X-Wing.
         var maneuverKey = Maneuver.STRAIGHT_3_STANDARD;
         var callback = function()
         {
            LOGGER.info("in callback()");
         };

         environment.setActiveToken(token);

         ActivationAction.create(store, token.id(), callback, delay);
         var maneuver = Maneuver.properties[maneuverKey];
         store.dispatch(Action.setTokenManeuver(token, maneuver));

         return environment;
      }
   });
