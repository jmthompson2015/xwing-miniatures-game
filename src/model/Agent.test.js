import Agent from "./Agent.js";
import Reducer from "./Reducer.js";
import EnvironmentFactory from "./EnvironmentFactory.js";

QUnit.module("Agent");

QUnit.test("Agent()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var name = "agent1";

   // Run.
   var result = new Agent(store, name);

   // Verify.
   assert.ok(result);
   assert.equal(result.id(), 1);
   assert.equal(result.name(), name);
});

QUnit.test("pilotInstances()", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var agent = environment.firstAgent();

   // Run.
   var result = agent.pilotInstances();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
   var i = 0;
   assert.equal(result[i++].card().name, "\"Mauler Mithel\"");
   assert.equal(result[i++].card().name, "\"Dark Curse\"");
});

QUnit.test("pilotInstances() Huge isPure = true", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createHugeShipEnvironment();
   var agent = environment.firstAgent();
   var isPure = true;

   // Run.
   var result = agent.pilotInstances(isPure);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 4);
   var i = 0;
   assert.equal(result[i++].card().name, "Gozanti-class Cruiser");
   assert.equal(result[i++].card().name, "Juno Eclipse");
   assert.equal(result[i++].card().name, "Raider-class Corvette (fore)");
   assert.equal(result[i++].card().name, "Raider-class Corvette (aft)");
});

QUnit.test("pilotInstances() Huge isPure = false", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createHugeShipEnvironment();
   var agent = environment.firstAgent();
   var isPure = false;

   // Run.
   var result = agent.pilotInstances(isPure);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 3);
   var i = 0;
   assert.equal(result[i++].card().name, "Gozanti-class Cruiser");
   assert.equal(result[i++].card().name, "Juno Eclipse");
   assert.equal(result[i++].card().name, "Raider-class Corvette");
});

const AgentTest = {};
export default AgentTest;