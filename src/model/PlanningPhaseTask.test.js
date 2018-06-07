import EnvironmentFactory from "./EnvironmentFactory.js";
import PlanningPhaseTask from "./PlanningPhaseTask.js";

QUnit.module("PlanningPhaseTask");

QUnit.test("doIt() X-Wing", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      const pilotInstances = environment.pilotInstances();
      const pilotToManeuver = store.getState().pilotToManeuver;
      LOGGER.info("pilotToManeuver = " + pilotToManeuver);
      assert.ok(pilotToManeuver);
      const keys = pilotToManeuver.keySeq().toArray();
      assert.ok(keys);
      assert.equal(keys.length, pilotInstances.length);
      keys.forEach(function(key)
      {
         assert.ok(pilotToManeuver.get(key));
      });

      done();
   };
   const task = new PlanningPhaseTask(store);

   // Run.
   const done = assert.async();
   task.doIt(callback);
});

const PlanningPhaseTaskTest = {};
export default PlanningPhaseTaskTest;