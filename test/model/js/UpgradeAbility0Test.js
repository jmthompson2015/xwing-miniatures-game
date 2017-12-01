"use strict";

define(["qunit", "artifact/js/Event", "artifact/js/Maneuver",
  "model/js/Action", "model/js/ActivationAction", "model/js/Adjudicator", "model/js/UpgradeAbility0", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Event, Maneuver,
      Action, ActivationAction, Adjudicator, UpgradeAbility, EnvironmentFactory)
   {
      QUnit.module("UpgradeAbility0");

      var delay = 10;

      QUnit.test("condition()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.pilotInstances()[2]; // X-Wing.

         // Run / Verify.
         Event.keys().forEach(function(eventKey)
         {
            var abilities = UpgradeAbility[eventKey];

            if (abilities)
            {
               Object.keys(abilities).forEach(function(upgradeKey)
               {
                  var ability = abilities[upgradeKey];

                  if (ability.condition)
                  {
                     var result = ability.condition(store, token);
                     assert.ok(result !== undefined, "eventKey = " + eventKey + " upgradeKey = " + upgradeKey);
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
            var abilities = UpgradeAbility[eventKey];

            if (abilities)
            {
               Object.keys(abilities).forEach(function(upgradeKey)
               {
                  var ability = abilities[upgradeKey];

                  if (ability.condition && ability.condition(store, token))
                  {
                     ability.consequent(store, token);
                     assert.ok(true, "eventKey = " + eventKey + " upgradeKey = " + upgradeKey);
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

         var token = environment.pilotInstances()[2]; // X-Wing.
         var maneuverKey = Maneuver.STRAIGHT_2_EASY;
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
