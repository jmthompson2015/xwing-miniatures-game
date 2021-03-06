import EnvironmentFactory from "./EnvironmentFactory.js";
import Reducer from "./Reducer.js";
import TargetLock from "./TargetLock.js";

QUnit.module("TargetLock");

QUnit.test("TargetLock()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[0];
   const defender = environment.pilotInstances()[2];

   // Run.
   const result = TargetLock.newInstance(store, attacker, defender);

   // Verify.
   assert.ok(result);
   assert.equal(result.attacker(), attacker);
   assert.equal(result.defender(), defender);
   assert.equal(result.id(), "A");
   assert.equal(store.getState().targetLocks.size, 1);
});

QUnit.test("attacker()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[0];
   const defender = environment.pilotInstances()[2];
   const targetLock = TargetLock.newInstance(store, attacker, defender);

   // Run.
   const result = targetLock.attacker();

   // Verify.
   assert.ok(result);
   assert.equal(result, attacker);
});

QUnit.test("defender()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[0];
   const defender = environment.pilotInstances()[2];
   const targetLock = TargetLock.newInstance(store, attacker, defender);

   // Run.
   const result = targetLock.defender();

   // Verify.
   assert.ok(result);
   assert.equal(result, defender);
});

QUnit.test("delete()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[0];
   const defender = environment.pilotInstances()[2];
   const targetLock = TargetLock.newInstance(store, attacker, defender);
   assert.equal(store.getState().targetLocks.size, 1);
   assert.equal(store.getState().targetLocks.get(0).get("id"), "A");
   assert.equal(store.getState().targetLocks.get(0).get("attackerId"), attacker.id());
   assert.equal(store.getState().targetLocks.get(0).get("defenderId"), defender.id());

   // Run.
   targetLock.delete();

   // Verify.
   assert.equal(store.getState().targetLocks.size, 0);
});

QUnit.test("get()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[0];
   const defender = environment.pilotInstances()[2];
   TargetLock.newInstance(store, attacker, defender);

   // Run.
   const result = TargetLock.get(store, attacker, defender);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker(), attacker);
   assert.equal(result[0].defender(), defender);
   assert.equal(result[0].id(), "A");
   assert.equal(store.getState().targetLocks.size, 1);
});

QUnit.test("get() 2", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   TargetLock.newInstance(store, environment.pilotInstances()[0], environment.pilotInstances()[1]);
   TargetLock.newInstance(store, environment.pilotInstances()[1], environment.pilotInstances()[2]);
   TargetLock.newInstance(store, environment.pilotInstances()[2], environment.pilotInstances()[0]);

   // Run.
   let result = TargetLock.get(store, environment.pilotInstances()[0], environment.pilotInstances()[1]);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker().id(), environment.pilotInstances()[0].id());
   assert.equal(result[0].defender().id(), environment.pilotInstances()[1].id());
   assert.equal(result[0].id(), "A");

   // Run.
   result = TargetLock.get(store, environment.pilotInstances()[1], environment.pilotInstances()[2]);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker().id(), environment.pilotInstances()[1].id());
   assert.equal(result[0].defender().id(), environment.pilotInstances()[2].id());
   assert.equal(result[0].id(), "B");

   // Run.
   result = TargetLock.get(store, environment.pilotInstances()[2], environment.pilotInstances()[0]);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker().id(), environment.pilotInstances()[2].id());
   assert.equal(result[0].defender().id(), environment.pilotInstances()[0].id());
   assert.equal(result[0].id(), "C");

   assert.equal(store.getState().targetLocks.size, 3);
});

QUnit.test("getByAttacker()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   TargetLock.newInstance(store, environment.pilotInstances()[0], environment.pilotInstances()[1]);
   TargetLock.newInstance(store, environment.pilotInstances()[1], environment.pilotInstances()[2]);
   TargetLock.newInstance(store, environment.pilotInstances()[2], environment.pilotInstances()[0]);

   // Run.
   let result = TargetLock.getByAttacker(store, environment.pilotInstances()[0]);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker().id(), environment.pilotInstances()[0].id());
   assert.equal(result[0].defender().id(), environment.pilotInstances()[1].id());
   assert.equal(result[0].id(), "A");

   // Run.
   result = TargetLock.getByAttacker(store, environment.pilotInstances()[1]);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker().id(), environment.pilotInstances()[1].id());
   assert.equal(result[0].defender().id(), environment.pilotInstances()[2].id());
   assert.equal(result[0].id(), "B");

   // Run.
   result = TargetLock.getByAttacker(store, environment.pilotInstances()[2]);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker().id(), environment.pilotInstances()[2].id());
   assert.equal(result[0].defender().id(), environment.pilotInstances()[0].id());
   assert.equal(result[0].id(), "C");

   assert.equal(store.getState().targetLocks.size, 3);
});

QUnit.test("getByDefender()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   TargetLock.newInstance(store, environment.pilotInstances()[0], environment.pilotInstances()[1]);
   TargetLock.newInstance(store, environment.pilotInstances()[1], environment.pilotInstances()[2]);
   TargetLock.newInstance(store, environment.pilotInstances()[2], environment.pilotInstances()[0]);

   // Run.
   let result = TargetLock.getByDefender(store, environment.pilotInstances()[1]);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker().id(), environment.pilotInstances()[0].id());
   assert.equal(result[0].defender().id(), environment.pilotInstances()[1].id());
   assert.equal(result[0].id(), "A");

   // Run.
   result = TargetLock.getByDefender(store, environment.pilotInstances()[2]);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker().id(), environment.pilotInstances()[1].id());
   assert.equal(result[0].defender().id(), environment.pilotInstances()[2].id());
   assert.equal(result[0].id(), "B");

   // Run.
   result = TargetLock.getByDefender(store, environment.pilotInstances()[0]);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].attacker().id(), environment.pilotInstances()[2].id());
   assert.equal(result[0].defender().id(), environment.pilotInstances()[0].id());
   assert.equal(result[0].id(), "C");

   assert.equal(store.getState().targetLocks.size, 3);
});

QUnit.test("id()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[0];
   const defender = environment.pilotInstances()[2];
   const targetLock = TargetLock.newInstance(store, attacker, defender);

   // Run.
   const result = targetLock.id();

   // Verify.
   assert.ok(result);
   assert.equal(result, "A");
});

QUnit.test("nextId()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);

   // Run / Verify.
   assert.equal(TargetLock.nextId(store), "A");
   let i;

   for (i = 0; i < 24; i++)
   {
      TargetLock.nextId(store);
   }

   assert.equal(TargetLock.nextId(store), "Z");
   assert.equal(TargetLock.nextId(store), "AA");

   for (i = 0; i < 24; i++)
   {
      TargetLock.nextId(store);
   }

   assert.equal(TargetLock.nextId(store), "ZZ");
   assert.equal(TargetLock.nextId(store), "A");
});

QUnit.test("removeAllTargetLocks()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   TargetLock.newInstance(store, environment.pilotInstances()[0], environment.pilotInstances()[1]);
   TargetLock.newInstance(store, environment.pilotInstances()[1], environment.pilotInstances()[2]);
   TargetLock.newInstance(store, environment.pilotInstances()[2], environment.pilotInstances()[0]);
   assert.equal(store.getState().targetLocks.size, 3);

   // Run.
   TargetLock.removeAllTargetLocks(store, environment.pilotInstances()[0]);

   // Verify.
   assert.equal(store.getState().targetLocks.size, 1);
   assert.equal(TargetLock.getByAttacker(store, environment.pilotInstances()[0]).length, 0);
   assert.equal(TargetLock.getByDefender(store, environment.pilotInstances()[0]).length, 0);
});

QUnit.test("values()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const attacker = environment.pilotInstances()[0];
   const defender = environment.pilotInstances()[2];
   const targetLock = TargetLock.newInstance(store, attacker, defender);

   // Run.
   const result = targetLock.values();

   // Verify.
   assert.ok(result);
   assert.equal(result.get("attackerId"), attacker.id());
   assert.equal(result.get("defenderId"), defender.id());
   assert.equal(result.get("id"), "A");
});

const TargetLockTest = {};
export default TargetLockTest;