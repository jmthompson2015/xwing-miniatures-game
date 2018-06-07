import Agent from "./Agent.js";
import Reducer from "./Reducer.js";
import EnvironmentFactory from "./EnvironmentFactory.js";

QUnit.module("Agent");

QUnit.test("Agent()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const name = "agent1";

   // Run.
   const result = new Agent(store, name);

   // Verify.
   assert.ok(result);
   assert.equal(result.id(), 1);
   assert.equal(result.name(), name);
});

QUnit.test("pilotInstances()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const agent = environment.firstAgent();

   // Run.
   const result = agent.pilotInstances();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
   let i = 0;
   assert.equal(result[i++].card().name, "\"Mauler Mithel\"");
   assert.equal(result[i++].card().name, "\"Dark Curse\"");
});

QUnit.test("pilotInstances() Huge isPure = true", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();
   const agent = environment.firstAgent();
   const isPure = true;

   // Run.
   const result = agent.pilotInstances(isPure);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 4);
   let i = 0;
   assert.equal(result[i++].card().name, "Gozanti-class Cruiser");
   assert.equal(result[i++].card().name, "Juno Eclipse");
   assert.equal(result[i++].card().name, "Raider-class Corvette (fore)");
   assert.equal(result[i++].card().name, "Raider-class Corvette (aft)");
});

QUnit.test("pilotInstances() Huge isPure = false", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createHugeShipEnvironment();
   const agent = environment.firstAgent();
   const isPure = false;

   // Run.
   const result = agent.pilotInstances(isPure);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 3);
   let i = 0;
   assert.equal(result[i++].card().name, "Gozanti-class Cruiser");
   assert.equal(result[i++].card().name, "Juno Eclipse");
   assert.equal(result[i++].card().name, "Raider-class Corvette");
});

const AgentTest = {};
export default AgentTest;