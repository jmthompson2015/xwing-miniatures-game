"use strict";

define(["qunit", "model/js/EndPhaseAction", "model/js/TargetLock", "model/js/CardAction", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, EndPhaseAction, TargetLock, CardAction, EnvironmentFactory)
   {
      QUnit.module("EndPhaseAction");

      QUnit.test("doIt() X-Wing", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token = environment.tokens()[2]; // X-Wing
         store.dispatch(CardAction.addEvadeCount(token));
         store.dispatch(CardAction.addFocusCount(token, 2));
         store.dispatch(CardAction.addReinforceCount(token));
         store.dispatch(CardAction.addStressCount(token));
         store.dispatch(CardAction.addTractorBeamCount(token));
         store.dispatch(CardAction.addWeaponsDisabledCount(token));
         var defender = environment.tokens()[0];
         TargetLock.newInstance(store, token, defender);
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            assert.equal(token.evadeCount(), 0);
            assert.equal(token.focusCount(), 0);
            assert.equal(token.reinforceCount(), 0);
            assert.equal(token.tractorBeamCount(), 0);
            assert.equal(token.weaponsDisabledCount(), 0);

            assert.equal(token.stressCount(), 1);
            assert.ok(TargetLock.getFirst(store, token, defender) !== undefined);
            assert.equal(token.usedAbilities().size, 0);

            done();
         };
         var action = new EndPhaseAction(environment, token, callback);

         // Run.
         var done = assert.async();
         action.doIt();
      });
   });
