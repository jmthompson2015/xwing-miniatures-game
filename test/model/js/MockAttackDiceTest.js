"use strict";

define(["qunit", "redux", "artifact/js/AttackDiceValue", "model/js/Reducer", "../../../test/model/js/MockAttackDice"],
   function(QUnit, Redux, AttackDiceValue, Reducer, MockAttackDice)
   {
      QUnit.module("MockAttackDice");

      QUnit.test("MockAttackDice properties", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockAttackDice(store, attackerId);
         assert.equal(dice.value(0), AttackDiceValue.BLANK);
         assert.equal(dice.value(1), AttackDiceValue.CRITICAL_HIT);
         assert.equal(dice.value(2), AttackDiceValue.FOCUS);
         assert.equal(dice.value(3), AttackDiceValue.HIT);
      });

      QUnit.test("blankCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockAttackDice(store, attackerId);
         LOGGER.trace("dice = " + dice);
         assert.equal(dice.blankCount(), 1);
      });

      QUnit.test("criticalHitCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockAttackDice(store, attackerId);
         LOGGER.trace("dice = " + dice);
         assert.equal(dice.criticalHitCount(), 1);
      });

      QUnit.test("focusCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockAttackDice(store, attackerId);
         LOGGER.trace("dice = " + dice);
         assert.equal(dice.focusCount(), 1);
      });

      QUnit.test("hitCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockAttackDice(store, attackerId);
         LOGGER.trace("dice = " + dice);
         assert.equal(dice.hitCount(), 1);
      });

      QUnit.test("rerollBlank()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var attackerId = 1;
         var dice = new MockAttackDice(store, attackerId);

         // Run.
         dice.rerollBlank();

         // Verify.
         assert.equal(dice.value(0), AttackDiceValue.BLANK);
         assert.equal(dice.value(1), AttackDiceValue.CRITICAL_HIT);
         assert.equal(dice.value(2), AttackDiceValue.FOCUS);
         assert.equal(dice.value(3), AttackDiceValue.HIT);
      });
   });
