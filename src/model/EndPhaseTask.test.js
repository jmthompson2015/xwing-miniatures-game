import CardAction from "./CardAction.js";
import EndPhaseTask from "./EndPhaseTask.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import TargetLock from "./TargetLock.js";

QUnit.module("EndPhaseTask");

QUnit.test("doIt() X-Wing", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const pilotInstances = environment.pilotInstances();
   const defender = pilotInstances[0];
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
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      const pilotInstances = environment.pilotInstances();
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
   const task = new EndPhaseTask(store);

   // Run.
   const done = assert.async();
   task.doIt(callback);
});

const EndPhaseTaskTest = {};
export default EndPhaseTaskTest;