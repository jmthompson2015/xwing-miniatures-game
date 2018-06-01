import EnvironmentFactory from "./EnvironmentFactory.js";
import PlanningPhaseTask from "./PlanningPhaseTask.js";

QUnit.module("PlanningPhaseTask");

QUnit.test("doIt() X-Wing", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var store = environment.store();
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      var pilotInstances = environment.pilotInstances();
      var pilotToManeuver = store.getState().pilotToManeuver;
      LOGGER.info("pilotToManeuver = " + pilotToManeuver);
      assert.ok(pilotToManeuver);
      var keys = pilotToManeuver.keySeq().toArray();
      assert.ok(keys);
      assert.equal(keys.length, pilotInstances.length);
      keys.forEach(function(key)
      {
         assert.ok(pilotToManeuver.get(key));
      });

      done();
   };
   var task = new PlanningPhaseTask(store);

   // Run.
   var done = assert.async();
   task.doIt(callback);
});

const PlanningPhaseTaskTest = {};
export default PlanningPhaseTaskTest;