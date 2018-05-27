"use strict";

define(["qunit", "redux", "artifact/DefenseDiceValue", "model/Reducer", "model/MockDefenseDice"],
   function(QUnit, Redux, DefenseDiceValue, Reducer, MockDefenseDice)
   {
      QUnit.module("MockDefenseDice");

      QUnit.test("MockDefenseDice properties", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockDefenseDice(store, attackerId);
         assert.equal(dice.value(0), DefenseDiceValue.BLANK);
         assert.equal(dice.value(1), DefenseDiceValue.EVADE);
         assert.equal(dice.value(2), DefenseDiceValue.FOCUS);
      });

      QUnit.test("blankCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockDefenseDice(store, attackerId);
         LOGGER.trace("dice = " + dice);
         assert.equal(dice.blankCount(), 1);
      });

      QUnit.test("evadeCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockDefenseDice(store, attackerId);
         LOGGER.trace("dice = " + dice);
         assert.equal(dice.evadeCount(), 1);
      });

      QUnit.test("focusCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockDefenseDice(store, attackerId);
         LOGGER.trace("dice = " + dice);
         assert.equal(dice.focusCount(), 1);
      });

      QUnit.test("rerollBlank()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockDefenseDice(store, attackerId);

         // Run.
         dice.rerollBlank();

         // Verify.
         assert.equal(dice.blankCount(), 1);
      });
   });
