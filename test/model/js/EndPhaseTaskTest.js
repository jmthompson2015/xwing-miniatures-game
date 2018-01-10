"use strict";

define(["qunit", "model/js/EndPhaseTask", "model/js/TargetLock", "model/js/CardAction", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, EndPhaseTask, TargetLock, CardAction, EnvironmentFactory)
   {
      QUnit.module("EndPhaseTask");

      QUnit.test("doIt() X-Wing", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var pilotInstances = environment.pilotInstances();
         var defender = pilotInstances[0];
         pilotInstances.forEach(function(cardInstance)
         {
            store.dispatch(CardAction.addEvadeCount(cardInstance));
            store.dispatch(CardAction.addFocusCount(cardInstance, 2));
            store.dispatch(CardAction.addReinforceCount(cardInstance));
            store.dispatch(CardAction.addStressCount(cardInstance));
            store.dispatch(CardAction.addTractorBeamCount(cardInstance));
            store.dispatch(CardAction.addWeaponsDisabledCount(cardInstance));
            TargetLock.newInstance(store, cardInstance, defender);
         });
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");

            var pilotInstances = environment.pilotInstances();
            pilotInstances.forEach(function(cardInstance)
            {
               assert.equal(cardInstance.evadeCount(), 0);
               assert.equal(cardInstance.focusCount(), 0);
               assert.equal(cardInstance.reinforceCount(), 0);
               assert.equal(cardInstance.tractorBeamCount(), 0);
               assert.equal(cardInstance.weaponsDisabledCount(), 0);

               assert.equal(cardInstance.stressCount(), 1);
               assert.ok(TargetLock.getFirst(store, cardInstance, defender) !== undefined);
               assert.equal(cardInstance.usedAbilities().size, 0);
            });

            done();
         };
         var task = new EndPhaseTask(store);

         // Run.
         var done = assert.async();
         task.doIt(callback);
      });
   });
