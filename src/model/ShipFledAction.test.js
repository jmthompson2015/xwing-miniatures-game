import EnvironmentFactory from "./EnvironmentFactory.js";
import Position from "./Position.js";
import ShipFledAction from "./ShipFledAction.js";
import TargetLock from "./TargetLock.js";

QUnit.module("ShipFledAction");

QUnit.test("doIt()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const fromPosition = new Position(305, 20, 90);
   LOGGER.trace("fromPosition = " + fromPosition.toString());
   const token = environment.getTokenAt(fromPosition);
   const defender = environment.pilotInstances()[2]; // X-Wing.
   TargetLock.newInstance(store, token, defender);
   assert.equal(store.getState().targetLocks.size, 1);
   const shipFledAction = new ShipFledAction(environment, token, fromPosition);

   // Run.
   shipFledAction.doIt();

   // Verify.
   assert.equal(token.damageCount(), 0);
   assert.equal(token.criticalDamageCount(), 0);
   assert.ok(!environment.getTokenAt(fromPosition));
   assert.equal(store.getState().targetLocks.size, 0);
});

const ShipFledActionTest = {};
export default ShipFledActionTest;