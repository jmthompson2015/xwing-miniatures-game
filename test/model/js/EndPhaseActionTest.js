"use strict";

define(["qunit", "model/js/Action", "model/js/EndPhaseAction", "model/js/Selector", "model/js/TargetLock", "model/js/TokenAction", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Action, EndPhaseAction, Selector, TargetLock, TokenAction, EnvironmentFactory)
   {
      QUnit.module("EndPhaseAction");

      QUnit.test("doIt() X-Wing", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token = environment.tokens()[2]; // X-Wing
         store.dispatch(TokenAction.addEvadeCount(token));
         store.dispatch(TokenAction.addFocusCount(token, 2));
         store.dispatch(TokenAction.addReinforceCount(token));
         store.dispatch(TokenAction.addStressCount(token));
         store.dispatch(TokenAction.addTractorBeamCount(token));
         store.dispatch(TokenAction.addWeaponsDisabledCount(token));
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
