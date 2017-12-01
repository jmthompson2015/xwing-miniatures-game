"use strict";

define(["qunit", "model/js/Position", "model/js/ShipFledAction", "model/js/TargetLock", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Position, ShipFledAction, TargetLock, EnvironmentFactory)
   {
      QUnit.module("ShipFledAction");

      QUnit.test("doIt()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var fromPosition = new Position(305, 20, 90);
         LOGGER.trace("fromPosition = " + fromPosition.toString());
         var token = environment.getTokenAt(fromPosition);
         var defender = environment.pilotInstances()[2]; // X-Wing.
         TargetLock.newInstance(store, token, defender);
         assert.equal(store.getState().targetLocks.size, 1);
         var shipFledAction = new ShipFledAction(environment, token, fromPosition);

         // Run.
         shipFledAction.doIt();

         // Verify.
         assert.equal(token.damageCount(), 0);
         assert.equal(token.criticalDamageCount(), 0);
         assert.ok(!environment.getTokenAt(fromPosition));
         assert.equal(store.getState().targetLocks.size, 0);
      });
   });
