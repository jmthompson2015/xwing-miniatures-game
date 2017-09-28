"use strict";

define(["qunit", "model/js/Position", "model/js/ShipDestroyedAction", "model/js/TargetLock", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Position, ShipDestroyedAction, TargetLock, EnvironmentFactory)
   {
      QUnit.module("ShipDestroyedAction");

      QUnit.test("doIt()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var fromPosition = new Position(305, 20, 90); // TIE Fighter.
         var token = environment.getTokenAt(fromPosition);
         var defender = environment.tokens()[2]; // X-Wing.
         TargetLock.newInstance(store, token, defender);
         assert.equal(store.getState().targetLocks.size, 1);
         var shipDestroyedAction = new ShipDestroyedAction(environment, token, fromPosition);

         // Run.
         shipDestroyedAction.doIt();

         // Verify.
         assert.equal(token.damageCount(), 0);
         assert.equal(token.criticalDamageCount(), 0);
         assert.ok(!environment.getTokenAt(fromPosition));
         assert.equal(store.getState().targetLocks.size, 0);
      });
   });
