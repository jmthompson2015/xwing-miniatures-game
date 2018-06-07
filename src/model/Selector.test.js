import Action from "./Action.js";
import Adjudicator from "./Adjudicator.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import Reducer from "./Reducer.js";
import Selector from "./Selector.js";

QUnit.module("Selector");

QUnit.test("adjudicator()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const adjudicator = Adjudicator.create(store);
   store.dispatch(Action.setAdjudicator(adjudicator));

   // Run.
   const result = Selector.adjudicator(store.getState());

   // Verify.
   assert.ok(result);
   assert.equal(result, adjudicator);
});

QUnit.test("environment()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();

   // Run.
   const result = Selector.environment(store.getState());

   // Verify.
   assert.ok(result);
   assert.equal(result, environment);
});

const SelectorTest = {};
export default SelectorTest;