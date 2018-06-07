import Action from "./Action.js";
import Adjudicator from "./Adjudicator.js";
import CombatPhaseTask from "./CombatPhaseTask.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import Position from "./Position.js";

QUnit.module("CombatPhaseTask");

const delay = 10;

QUnit.test("performCombatPhase()", function(assert)
{
   // Setup.
   const task = createTask();
   const store = task.store();
   const environment = store.getState().environment;
   const token0 = environment.pilotInstances()[0]; // TIE Fighter.
   const position0 = environment.getPositionFor(token0);
   const token2 = environment.pilotInstances()[2]; // X-Wing.
   const position2 = environment.getPositionFor(token2);
   const newPosition2 = new Position(position0.x(), position0.y() + 50, position2.heading());
   environment.moveToken(position2, newPosition2);
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      done();
   };

   // Run.
   const done = assert.async();
   task.doIt(callback);
});

function createTask(isHuge)
{
   let environment;

   if (isHuge)
   {
      environment = EnvironmentFactory.createHugeShipEnvironment();
   }
   else
   {
      environment = EnvironmentFactory.createCoreSetEnvironment();
   }

   const store = environment.store();
   Adjudicator.create(store);
   store.dispatch(Action.setDelay(delay));

   return new CombatPhaseTask(store);
}

const CombatPhaseTaskTest = {};
export default CombatPhaseTaskTest;