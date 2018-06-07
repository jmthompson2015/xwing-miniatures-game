import DefenseDiceValue from "../artifact/DefenseDiceValue.js";

import Reducer from "./Reducer.js";
import MockDefenseDice from "./MockDefenseDice.js";

QUnit.module("MockDefenseDice");

QUnit.test("MockDefenseDice properties", function(assert)
{
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new MockDefenseDice(store, attackerId);
   assert.equal(dice.value(0), DefenseDiceValue.BLANK);
   assert.equal(dice.value(1), DefenseDiceValue.EVADE);
   assert.equal(dice.value(2), DefenseDiceValue.FOCUS);
});

QUnit.test("blankCount()", function(assert)
{
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new MockDefenseDice(store, attackerId);
   LOGGER.trace("dice = " + dice);
   assert.equal(dice.blankCount(), 1);
});

QUnit.test("evadeCount()", function(assert)
{
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new MockDefenseDice(store, attackerId);
   LOGGER.trace("dice = " + dice);
   assert.equal(dice.evadeCount(), 1);
});

QUnit.test("focusCount()", function(assert)
{
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new MockDefenseDice(store, attackerId);
   LOGGER.trace("dice = " + dice);
   assert.equal(dice.focusCount(), 1);
});

QUnit.test("rerollBlank()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new MockDefenseDice(store, attackerId);

   // Run.
   dice.rerollBlank();

   // Verify.
   assert.equal(dice.blankCount(), 1);
});

const MockDefenseDiceTest = {};
export default MockDefenseDiceTest;