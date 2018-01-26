"use strict";

define(["qunit", "redux", "artifact/js/Event", "artifact/js/Maneuver",
  "model/js/Action", "model/js/ActivationAction", "model/js/Adjudicator", "model/js/Agent", "model/js/Environment", "model/js/EventObserver", "model/js/PhaseObserver", "model/js/Reducer", "model/js/SquadBuilder", "model/js/UpgradeAbility0",
  "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Redux, Event, Maneuver,
      Action, ActivationAction, Adjudicator, Agent, Environment, EventObserver, PhaseObserver, Reducer, SquadBuilder, UpgradeAbility,
      EnvironmentFactory)
   {
      QUnit.module("UpgradeAbility0");

      var delay = 10;

      QUnit.test("Attanni Mindlink receive focus", function(assert)
      {
         // Setup.
         var environment = createEnvironment2();
         var firstAgent = environment.firstAgent();
         var pilotInstances1 = firstAgent.pilotInstances();
         assert.ok(pilotInstances1);
         assert.equal(pilotInstances1.length, 3);
         assert.equal(pilotInstances1[0].focusCount(), 0);
         assert.equal(pilotInstances1[1].focusCount(), 0);
         assert.equal(pilotInstances1[2].focusCount(), 0);
         var secondAgent = environment.secondAgent();
         var pilotInstances2 = secondAgent.pilotInstances();
         assert.ok(pilotInstances2);
         assert.equal(pilotInstances2.length, 1);
         assert.equal(pilotInstances2[0].focusCount(), 0);

         // Run.
         pilotInstances1[0].receiveFocus();

         // Verify.
         assert.equal(pilotInstances1[0].focusCount(), 1);
         assert.equal(pilotInstances1[1].focusCount(), 1);
         assert.equal(pilotInstances1[2].focusCount(), 1);
         assert.equal(pilotInstances2[0].focusCount(), 0);
      });

      QUnit.test("Attanni Mindlink receive stress", function(assert)
      {
         // Setup.
         var environment = createEnvironment2();
         var firstAgent = environment.firstAgent();
         var pilotInstances1 = firstAgent.pilotInstances();
         assert.ok(pilotInstances1);
         assert.equal(pilotInstances1.length, 3);
         assert.equal(pilotInstances1[0].stressCount(), 0);
         assert.equal(pilotInstances1[1].stressCount(), 0);
         assert.equal(pilotInstances1[2].stressCount(), 0);
         var secondAgent = environment.secondAgent();
         var pilotInstances2 = secondAgent.pilotInstances();
         assert.ok(pilotInstances2);
         assert.equal(pilotInstances2.length, 1);
         assert.equal(pilotInstances2[0].stressCount(), 0);

         // Run.
         pilotInstances1[0].receiveStress();

         // Verify.
         assert.equal(pilotInstances1[0].stressCount(), 1);
         assert.equal(pilotInstances1[1].stressCount(), 1);
         assert.equal(pilotInstances1[2].stressCount(), 1);
         assert.equal(pilotInstances2[0].stressCount(), 0);
      });

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
         store.dispatch(Action.setDelay(delay));
         ActivationAction.create(store, token.id(), callback);
         var maneuver = Maneuver.properties[maneuverKey];
         store.dispatch(Action.setTokenManeuver(token, maneuver));

         return environment;
      }

      function createEnvironment2()
      {
         var store = Redux.createStore(Reducer.root);
         var firstAgent = new Agent(store, "First Agent");
         var squadBuilder1 = SquadBuilder.findByNameAndYear("US Nationals #4", 2017);
         var firstSquad = squadBuilder1.buildSquad(firstAgent);
         var secondAgent = new Agent(store, "Second Agent");
         var secondSquad = SquadBuilder.CoreSetRebelSquadBuilder.buildSquad(secondAgent);
         var environment = new Environment(store, firstAgent, firstSquad, secondAgent, secondSquad);
         EventObserver.observeStore(store);
         PhaseObserver.observeStore(store);

         return environment;
      }
   });
