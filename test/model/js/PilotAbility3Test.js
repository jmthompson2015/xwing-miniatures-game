"use strict";

define(["qunit", "artifact/js/Phase",
  "model/js/Action", "model/js/Adjudicator", "model/js/CardAction", "model/js/CombatAction", "model/js/PilotAbility3", "model/js/Position", "model/js/RangeRuler", "model/js/SquadBuilder",
  "../../../test/model/js/EnvironmentFactory", "../../../test/model/js/MockAttackDice", "../../../test/model/js/MockDefenseDice"],
   function(QUnit, Phase, Action, Adjudicator, CardAction, CombatAction, PilotAbility, Position, RangeRuler, SquadBuilder,
      EnvironmentFactory, MockAttackDice, MockDefenseDice)
   {
      QUnit.module("PilotAbility3");

      QUnit.test("Epsilon Leader", function(assert)
      {
         // Setup.
         var squadBuilder1 = SquadBuilder.findByNameAndYear("First Order TFA Core Set: 39 Points", 2015);
         var environment = EnvironmentFactory.createEnvironment(squadBuilder1, SquadBuilder.CoreSetRebelSquadBuilder);
         var store = environment.store();
         var firstAgent = environment.firstAgent();
         var pilotInstances1 = firstAgent.pilotInstances();
         var epsilonLeader = pilotInstances1[0];
         var zetaAce = pilotInstances1[1];

         var secondAgent = environment.secondAgent();
         var pilotInstances2 = secondAgent.pilotInstances();
         var lukeSkywalker = pilotInstances2[0];

         var epsilonLeaderPosition0 = environment.getPositionFor(epsilonLeader);
         var epsilonLeaderPosition1 = new Position(510, 20, 90);
         environment.moveToken(epsilonLeaderPosition0, epsilonLeaderPosition1);
         store.dispatch(CardAction.addStressCount(epsilonLeader));
         store.dispatch(CardAction.addStressCount(zetaAce));
         store.dispatch(CardAction.addStressCount(lukeSkywalker));
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.equal(epsilonLeader.stressCount(), 0, "epsilonLeader.stressCount() === 0");
            assert.equal(zetaAce.stressCount(), 0, "zetaAce.stressCount() === 0");
            assert.equal(lukeSkywalker.stressCount(), 1, "lukeSkywalker.stressCount() === 1");
            done();
         };

         // Run.
         var done = assert.async();
         store.dispatch(Action.enqueuePhase(Phase.COMBAT_START, undefined, callback));
      });

      QUnit.test("condition()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.pilotInstances()[2]; // X-Wing.

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
         var token = environment.pilotInstances()[2]; // X-Wing.
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
         var token = environment.pilotInstances()[2]; // X-Wing.

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

         var attacker = environment.pilotInstances()[2]; // X-Wing.
         var weapon = attacker.primaryWeapon();
         var defender = environment.pilotInstances()[0]; // TIE Fighter.
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
