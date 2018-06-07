import AttackDiceValue from "../artifact/AttackDiceValue.js";

import Action from "./Action.js";
import AttackDice from "./AttackDice.js";
import Reducer from "./Reducer.js";

QUnit.module("AttackDice");

QUnit.test("AttackDice() size", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const size = 3;

   // Run.
   const dice = new AttackDice(store, attackerId, size);

   // Verify.
   for (let i = 0; i < size; i++)
   {
      assert.ok(dice.value(i));
   }
});

QUnit.test("AttackDice() values", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const values = [AttackDiceValue.BLANK, AttackDiceValue.CRITICAL_HIT, AttackDiceValue.FOCUS, AttackDiceValue.HIT];

   // Run.
   const dice = new AttackDice(store, attackerId, values);

   // Verify.
   for (let i = 0; i < values.length; i++)
   {
      assert.equal(dice.value(i), values[i]);
   }
});

QUnit.test("AttackDice properties", function(assert)
{
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new AttackDice(store, attackerId, 3);
   assert.ok(dice.value(0));
   assert.ok(dice.value(1));
   assert.ok(dice.value(2));
});

QUnit.test("addDie()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new AttackDice(store, attackerId, 1);
   assert.equal(dice.size(), 1);

   // Run.
   dice.addDie();

   // Verify.
   assert.equal(dice.size(), 2);
   assert.ok(AttackDiceValue.keys().includes(dice.value(1)));
});

QUnit.test("blankCount()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new AttackDice(store, attackerId, 1);

   // Run / Verify.
   if (dice.value(0) === AttackDiceValue.BLANK)
   {
      assert.equal(dice.blankCount(), 1);
   }
   else
   {
      assert.equal(dice.blankCount(), 0);
   }
});

QUnit.test("changeAllToValue()", function(assert)
{
   // Setup.
   const dice = createFocusDice(2);
   assert.equal(dice.focusCount(), 2);
   assert.equal(dice.hitCount(), 0);

   // Run.
   dice.changeAllToValue(AttackDiceValue.FOCUS, AttackDiceValue.HIT);

   // Verify.
   assert.equal(dice.focusCount(), 0);
   assert.equal(dice.hitCount(), 2);
});

QUnit.test("changeOneToValue()", function(assert)
{
   // Setup.
   const dice = createFocusDice(2);
   assert.equal(dice.focusCount(), 2);
   assert.equal(dice.hitCount(), 0);

   // Run.
   dice.changeOneToValue(AttackDiceValue.FOCUS, AttackDiceValue.HIT);

   // Verify.
   assert.equal(dice.focusCount(), 1);
   assert.equal(dice.hitCount(), 1);
});

QUnit.test("criticalHitCount()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new AttackDice(store, attackerId, 1);

   // Run / Verify.
   if (dice.value(0) === AttackDiceValue.CRITICAL_HIT)
   {
      assert.equal(dice.criticalHitCount(), 1);
   }
   else
   {
      assert.equal(dice.criticalHitCount(), 0);
   }
});

QUnit.test("focusCount()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new AttackDice(store, attackerId, 1);

   // Run / Verify.
   if (dice.value(0) === AttackDiceValue.FOCUS)
   {
      assert.equal(dice.focusCount(), 1);
   }
   else
   {
      assert.equal(dice.focusCount(), 0);
   }
});

QUnit.test("get()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new AttackDice(store, attackerId, 1);

   // Run / Verify.
   const result = AttackDice.get(store, attackerId);

   // Verify.
   assert.ok(result);
   assert.ok(result !== dice);
   assert.equal(result.size(), dice.size());
   assert.equal(result.value(0), dice.value(0));
});

QUnit.test("hitCount()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   const dice = new AttackDice(store, attackerId, 1);

   // Run / Verify.
   if (dice.value(0) === AttackDiceValue.HIT)
   {
      assert.equal(dice.hitCount(), 1);
   }
   else
   {
      assert.equal(dice.hitCount(), 0);
   }
});

QUnit.test("rerollAllBlank()", function(assert)
{
   // Setup.
   const dice = createBlankDice(1);

   // Run.
   dice.rerollAllBlank();

   // Verify.
   if (dice.value(0) === AttackDiceValue.BLANK)
   {
      assert.equal(dice.blankCount(), 1);
   }
   else
   {
      assert.equal(dice.blankCount(), 0);
   }
});

QUnit.test("rerollAllFocus()", function(assert)
{
   // Setup.
   const dice = createFocusDice(1);

   // Run.
   dice.rerollAllFocus();

   // Verify.
   if (dice.value(0) === AttackDiceValue.FOCUS)
   {
      assert.equal(dice.focusCount(), 1);
   }
   else
   {
      assert.equal(dice.focusCount(), 0);
   }
});

QUnit.test("rerollBlank() 1", function(assert)
{
   // Setup.
   const dice = createBlankDice(1);

   // Run.
   dice.rerollBlank();

   // Verify.
   if (dice.value(0) === AttackDiceValue.BLANK)
   {
      assert.equal(dice.blankCount(), 1);
   }
   else
   {
      assert.equal(dice.blankCount(), 0);
   }
});

QUnit.test("rerollBlank() 2", function(assert)
{
   // Setup.
   const dice = createBlankDice(2);

   // Run.
   dice.rerollBlank(2);

   // Verify.
   if (dice.value(0) === AttackDiceValue.BLANK && dice.value(1) === AttackDiceValue.BLANK)
   {
      assert.equal(dice.blankCount(), 2);
   }
   else if (dice.value(0) === AttackDiceValue.BLANK || dice.value(1) === AttackDiceValue.BLANK)
   {
      assert.equal(dice.blankCount(), 1);
   }
   else
   {
      assert.equal(dice.blankCount(), 0);
   }
});

QUnit.test("rerollBlankAndFocus() 2, 0", function(assert)
{
   // Setup.
   const dice = createBlankDice(2);

   // Run.
   dice.rerollBlankAndFocus(2);

   // Verify.
   if (dice.value(0) === AttackDiceValue.BLANK && dice.value(1) === AttackDiceValue.BLANK)
   {
      assert.equal(dice.blankCount(), 2);
   }
   else if (dice.value(0) === AttackDiceValue.BLANK || dice.value(1) === AttackDiceValue.BLANK)
   {
      assert.equal(dice.blankCount(), 1);
   }
   else
   {
      assert.equal(dice.blankCount(), 0);
   }
});

QUnit.test("rerollBlankAndFocus() 0, 2", function(assert)
{
   // Setup.
   const dice = createFocusDice(2);

   // Run.
   dice.rerollBlankAndFocus(2);

   // Verify.
   if (dice.value(0) === AttackDiceValue.FOCUS && dice.value(1) === AttackDiceValue.FOCUS)
   {
      assert.equal(dice.focusCount(), 2);
   }
   else if (dice.value(0) === AttackDiceValue.FOCUS || dice.value(1) === AttackDiceValue.FOCUS)
   {
      assert.equal(dice.focusCount(), 1);
   }
   else
   {
      assert.equal(dice.focusCount(), 0);
   }
});

QUnit.test("rerollFocus() 1", function(assert)
{
   // Setup.
   const dice = createFocusDice(1);

   // Run.
   dice.rerollFocus();

   // Verify.
   if (dice.value(0) === AttackDiceValue.FOCUS)
   {
      assert.equal(dice.focusCount(), 1);
   }
   else
   {
      assert.equal(dice.focusCount(), 0);
   }
});

QUnit.test("rerollFocus() 2", function(assert)
{
   // Setup.
   const dice = createFocusDice(2);

   // Run.
   dice.rerollFocus(2);

   // Verify.
   if (dice.value(0) === AttackDiceValue.FOCUS && dice.value(1) === AttackDiceValue.FOCUS)
   {
      assert.equal(dice.focusCount(), 2);
   }
   else if (dice.value(0) === AttackDiceValue.FOCUS || dice.value(1) === AttackDiceValue.FOCUS)
   {
      assert.equal(dice.focusCount(), 1);
   }
   else
   {
      assert.equal(dice.focusCount(), 0);
   }
});

QUnit.test("spendFocusToken()", function(assert)
{
   // Setup.
   const dice = createFocusDice(2);
   assert.equal(dice.focusCount(), 2);

   // Run.
   dice.spendFocusToken();

   // Verify.
   assert.equal(dice.focusCount(), 0);
   assert.equal(dice.hitCount(), 2);
});

QUnit.test("spendTargetLock()", function(assert)
{
   // Setup.
   const dice = createFocusDice(2);
   assert.equal(dice.focusCount(), 2);

   // Run.
   dice.spendTargetLock();

   // Verify.
   switch (dice.focusCount())
   {
      case 0:
         assert.equal(dice.blankCount() + dice.criticalHitCount() + dice.hitCount(), 2);
         break;
      case 1:
         assert.equal(dice.blankCount() + dice.criticalHitCount() + dice.hitCount(), 1);
         break;
      case 2:
         assert.equal(dice.blankCount() + dice.criticalHitCount() + dice.hitCount(), 0);
         break;
   }
});

QUnit.test("toString()", function(assert)
{
   // Setup.
   const dice = createFocusDice(2);
   assert.equal(dice.focusCount(), 2);

   // Run.
   const result = dice.toString();

   // Verify.
   assert.equal(result, "attackerId=1, size=2, values=focus,focus");
});

function createBlankDice(count)
{
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   let answer;

   do {
      store.dispatch(Action.setTokenAttackDice(1));
      answer = new AttackDice(store, attackerId, count);
   }
   while (answer.blankCount() < count);

   return answer;
}

function createFocusDice(count)
{
   const store = Redux.createStore(Reducer.root);
   const attackerId = 1;
   let answer;

   do {
      store.dispatch(Action.setTokenAttackDice(1));
      answer = new AttackDice(store, attackerId, count);
   }
   while (answer.focusCount() < count);

   return answer;
}

const AttackDiceTest = {};
export default AttackDiceTest;