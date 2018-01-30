"use strict";

define(["qunit", "redux",
  "artifact/js/Maneuver", "artifact/js/PilotCard", "artifact/js/Faction", "artifact/js/UpgradeCard",
  "model/js/Action", "model/js/ActivationAction", "model/js/Adjudicator", "model/js/Agent", "model/js/CardAction", "model/js/CardInstance", "model/js/Environment", "model/js/EventObserver", "model/js/PhaseObserver", "model/js/Position", "model/js/Reducer", "model/js/Squad", "model/js/SquadBuilder",
  "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Redux,
      Maneuver, PilotCard, Faction, UpgradeCard,
      Action, ActivationAction, Adjudicator, Agent, CardAction, CardInstance, Environment, EventObserver, PhaseObserver, Position, Reducer, Squad, SquadBuilder,
      EnvironmentFactory)
   {
      QUnit.module("ActivationAction");

      var delay = 10;

      QUnit.test("doIt() Adrenaline Rush", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.ADRENALINE_RUSH;
         var callback = function()
         {
            assert.ok(true, "test resumed from async operation");

            var token = action.token();
            assert.equal(token.upgradeKeys.length, 0);
            assert.ok(!token.isStressed());

            done();
         };
         var action = createActivationAction(upgradeKey, undefined, callback);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() Huge", function(assert)
      {
         // Setup.
         var squadBuilder1 = SquadBuilder.HugeShipImperialSquadBuilder;
         var squadBuilder2 = SquadBuilder.HugeShipRebelSquadBuilder;
         var store = Redux.createStore(Reducer.root);
         var agent1 = new Agent(store, "1");
         var agent2 = new Agent(store, "2");
         var squad1 = squadBuilder1.buildSquad(agent1);
         var squad2 = squadBuilder2.buildSquad(agent2);
         store.dispatch(Action.setDelay(delay));
         var environment = new Environment(store, agent1, squad1, agent2, squad2);
         Adjudicator.create(store);
         var token = environment.pilotInstances()[0]; // Gozanti-class Cruiser
         EventObserver.observeStore(store);
         PhaseObserver.observeStore(store);
         var maneuverKey = Maneuver.STRAIGHT_1_3;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            // Execute maneuver.
            var position = environment.getPositionFor(token);
            assert.equal(position.x(), 458);
            assert.equal(position.y(), 96 + (1 * 40));
            assert.equal(position.heading(), 90);

            // Check pilot stress.
            assert.ok(!token.isStressed());
            assert.equal(token.stressCount(), 0);

            // Gain energy.
            assert.equal(token.energyCount(), 4);

            // Perform action.
            assert.equal(token.focusCount(), 0);

            done();
         };
         var action = ActivationAction.create(store, token.id(), callback);
         var maneuver = Maneuver.properties[maneuverKey];
         store.dispatch(Action.setTokenManeuver(token, maneuver));
         var position = environment.getPositionFor(token);
         assert.equal(position.x(), 458);
         assert.equal(position.y(), 96);
         assert.equal(position.heading(), 90);
         assert.equal(token.energyCount(), 4);
         store.dispatch(CardAction.addEnergyCount(token, -2));
         assert.equal(token.energyCount(), 2);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() Inertial Dampeners", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.INERTIAL_DAMPENERS;
         var callback = function()
         {
            assert.ok(true, "test resumed from async operation");

            var environment = action.environment();
            var token = action.token();
            assert.equal(token.upgradeKeys.length, 0);
            var position = environment.getPositionFor(token);
            assert.ok(position);
            assert.equal(position.x(), 400);
            assert.equal(position.y(), 800);
            assert.equal(position.heading(), 270);
            assert.ok(token.isStressed());

            done();
         };
         var action = createActivationAction(upgradeKey, undefined, callback);
         action.performAction = function()
         {
            // Skip the ship action.
            this.finishPerformAction();
         };

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() K4 Security Droid", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.K4_SECURITY_DROID;
         var callback = function()
         {
            assert.ok(true, "test resumed from async operation");

            assert.equal(store.getState().targetLocks.size, 1);

            done();
         };
         var action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_2_EASY, callback);
         var store = action.store();
         assert.equal(store.getState().targetLocks.size, 0);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() Lambda-class Shuttle stationary", function(assert)
      {
         // Setup.
         var squadBuilder1 = SquadBuilder.findByNameAndYear("Worlds #4", 2015);
         var squadBuilder2 = SquadBuilder.findByNameAndYear("Worlds #1", 2015);
         var store = Redux.createStore(Reducer.root);
         var agent1 = new Agent(store, "1");
         var agent2 = new Agent(store, "2");
         var squad1 = squadBuilder1.buildSquad(agent1);
         var squad2 = squadBuilder2.buildSquad(agent2);
         store.dispatch(Action.setDelay(delay));
         var environment = new Environment(store, agent1, squad1, agent2, squad2);
         Adjudicator.create(store);
         var token = environment.pilotInstances()[2]; // Lambda-class Shuttle
         EventObserver.observeStore(store);
         PhaseObserver.observeStore(store);
         var maneuverKey = Maneuver.STATIONARY_0_HARD;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            // Execute maneuver.
            var position = environment.getPositionFor(token);
            assert.equal(position.x(), 686);
            assert.equal(position.y(), 40);
            assert.equal(position.heading(), 90);

            // Check pilot stress.
            assert.ok(token.isStressed());
            assert.equal(token.stressCount(), 1);

            // Perform action.
            assert.equal(token.focusCount(), 0);

            done();
         };
         var action = ActivationAction.create(store, token.id(), callback);
         action.performAction = function()
         {
            // Skip the ship action.
            this.finishPerformAction();
         };
         var maneuver = Maneuver.properties[maneuverKey];
         store.dispatch(Action.setTokenManeuver(token, maneuver));
         var position = environment.getPositionFor(token);
         assert.equal(position.x(), 686);
         assert.equal(position.y(), 40);
         assert.equal(position.heading(), 90);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() Lightning Reflexes", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.LIGHTNING_REFLEXES;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            var environment = action.environment();
            var token = action.token();
            assert.equal(token.upgradeKeys.length, 0);
            var position = environment.getPositionFor(token);
            assert.equal(position.x(), 400);
            assert.equal(position.y(), 600);
            assert.equal(position.heading(), 90);
            assert.ok(token.isStressed());

            done();
         };
         var action = createActivationAction(upgradeKey, undefined, callback);
         action.performAction = function()
         {
            // Skip the ship action.
            this.finishPerformAction();
         };

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() Maneuvering Fins", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.MANEUVERING_FINS;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            var environment = action.environment();
            var token = environment.activeCardInstance();
            var activationAction = ActivationAction.get(token.store(), token.id());
            assert.ok(activationAction);
            assert.equal(activationAction.maneuverKey(), Maneuver.BANK_LEFT_2_STANDARD);

            done();
         };
         var action = createActivationAction(upgradeKey, Maneuver.TURN_LEFT_2_STANDARD, callback);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() Outlaw Tech", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.OUTLAW_TECH;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            var token = action.token();
            assert.equal(token.focusCount(), 2);

            done();
         };
         var action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_4_HARD, callback);
         action.performAction = function()
         {
            // Skip the ship action.
            this.finishPerformAction();
         };
         assert.equal(action.token().focusCount(), 1);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() Push the Limit", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.PUSH_THE_LIMIT;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            assert.equal(token.isStressed(), true);

            done();
         };
         var action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_2_EASY, callback);
         var token = action.token();
         assert.equal(token.isStressed(), false);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() R2-D2", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.R2_D2_ASTROMECH;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            assert.equal(action.token().shieldCount(), 5);

            done();
         };
         var action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_2_EASY, callback);
         var store = action.environment().store();
         store.dispatch(CardAction.addShieldCount(action.token(), -1));
         assert.equal(action.token().shieldCount(), 4);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() R2-D2 at max", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.R2_D2_ASTROMECH;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            assert.equal(action.token().shieldCount(), 5);

            done();
         };
         var action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_2_EASY, callback);
         assert.equal(action.token().shieldCount(), 5);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() TIE/x7", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.TIE_X7;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            var token = action.token();
            assert.ok(token.evadeCount(), 1);

            done();
         };
         var action = createActivationAction(upgradeKey, undefined, callback);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() X-Wing", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         Adjudicator.create(store);
         store.dispatch(Action.setDelay(delay));
         var token = environment.pilotInstances()[2]; // X-Wing
         environment.setActiveToken(token);
         var maneuverKey = Maneuver.STRAIGHT_1_STANDARD;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            // Execute maneuver.
            var position = environment.getPositionFor(token);
            assert.ok(position, "position !== undefined");
            assert.equal(position.x(), 458);
            assert.equal(position.y(), 895 - (2 * 20 + 1 * 40));
            assert.equal(position.heading(), 270);

            // Check pilot stress.
            assert.ok(!token.isStressed());
            assert.equal(token.stressCount(), 0);

            // Perform action.
            assert.equal(token.focusCount(), 1);

            done();
         };
         var action = ActivationAction.create(store, token.id(), callback);
         var maneuver = Maneuver.properties[maneuverKey];
         store.dispatch(Action.setTokenManeuver(token, maneuver));
         var position = environment.getPositionFor(token);
         assert.equal(position.x(), 458);
         assert.equal(position.y(), 895);
         assert.equal(position.heading(), 270);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      QUnit.test("doIt() X-Wing K-turn", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         Adjudicator.create(store);
         store.dispatch(Action.setDelay(delay));
         var token = environment.pilotInstances()[2]; // X-Wing
         var maneuverKey = Maneuver.KOIOGRAN_TURN_4_HARD;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            // Execute maneuver.
            var position = environment.getPositionFor(token);
            assert.equal(position.x(), 458);
            assert.equal(position.y(), 895 - (2 * 20 + 4 * 40));
            assert.equal(position.heading(), 90);

            // Check pilot stress.
            assert.ok(token.isStressed());
            assert.equal(token.stressCount(), 1);

            // Perform action.
            assert.equal(token.focusCount(), 0);

            done();
         };
         var action = ActivationAction.create(store, token.id(), callback);
         action.performAction = function()
         {
            // Skip the ship action.
            this.finishPerformAction();
         };
         var maneuver = Maneuver.properties[maneuverKey];
         store.dispatch(Action.setTokenManeuver(token, maneuver));
         var position = environment.getPositionFor(token);
         assert.equal(position.x(), 458);
         assert.equal(position.y(), 895);
         assert.equal(position.heading(), 270);

         // Run.
         var done = assert.async();
         action.doIt();
      });

      function createActivationAction(upgradeKey, maneuverKey, callback0)
      {
         var store00 = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store00, "Rebel Agent");
         var imperialAgent = new Agent(store00, "Imperial Agent");
         var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2016, "squad1", [new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent)]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [upgradeKey])]);
         var positions1 = [new Position(400, 500, 90)];
         var positions2 = [new Position(400, 800, -90)];

         var store = Redux.createStore(Reducer.root);
         Adjudicator.create(store);
         var environment = new Environment(store, rebelAgent, squad1, imperialAgent, squad2, positions1, positions2);
         var token = environment.pilotInstances()[1];
         EventObserver.observeStore(store);
         PhaseObserver.observeStore(store);
         environment.setActiveToken(token);
         store.dispatch(CardAction.addFocusCount(token));

         var myManeuverKey = (maneuverKey !== undefined ? maneuverKey : Maneuver.STRAIGHT_3_STANDARD);

         var callback = (callback0 !== undefined ? callback0 : function()
         {
            LOGGER.info("callback() start");
         });

         store.dispatch(Action.setDelay(delay));
         var answer = ActivationAction.create(store, token.id(), callback);
         var maneuver = Maneuver.properties[myManeuverKey];
         store.dispatch(Action.setTokenManeuver(token, maneuver));
         return answer;
      }
   });
