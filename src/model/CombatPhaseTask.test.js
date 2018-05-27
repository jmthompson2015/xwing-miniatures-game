"use strict";

define(["qunit",
  "model/Action", "model/Adjudicator", "model/CombatPhaseTask", "model/Position",
  "model/EnvironmentFactory"],
   function(QUnit, Action, Adjudicator, CombatPhaseTask, Position, EnvironmentFactory)
   {
      QUnit.module("CombatPhaseTask");

      var delay = 10;

      QUnit.test("performCombatPhase()", function(assert)
      {
         // Setup.
         var task = createTask();
         var store = task.store();
         var environment = store.getState().environment;
         var token0 = environment.pilotInstances()[0]; // TIE Fighter.
         var position0 = environment.getPositionFor(token0);
         var token2 = environment.pilotInstances()[2]; // X-Wing.
         var position2 = environment.getPositionFor(token2);
         var newPosition2 = new Position(position0.x(), position0.y() + 50, position2.heading());
         environment.moveToken(position2, newPosition2);
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            done();
         };

         // Run.
         var done = assert.async();
         task.doIt(callback);
      });

      function createTask(isHuge)
      {
         var environment;

         if (isHuge)
         {
            environment = EnvironmentFactory.createHugeShipEnvironment();
         }
         else
         {
            environment = EnvironmentFactory.createCoreSetEnvironment();
         }

         var store = environment.store();
         Adjudicator.create(store);
         store.dispatch(Action.setDelay(delay));

         return new CombatPhaseTask(store);
      }
   });
