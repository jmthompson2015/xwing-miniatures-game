import PilotCard from "../artifact/PilotCard.js";
import Range from "../artifact/Range.js";

import Agent from "./Agent.js";
import CardInstance from "./CardInstance.js";
import Position from "./Position.js";
import RangeRuler from "./RangeRuler.js";
import Reducer from "./Reducer.js";

QUnit.module("RangeRuler");

QUnit.test("findRange()", function(assert)
{
   assert.ok(!RangeRuler.findRange(-1));
   assert.equal(RangeRuler.findRange(0), Range.ONE);
   assert.equal(RangeRuler.findRange(100), Range.ONE);
   assert.equal(RangeRuler.findRange(101), Range.TWO);
   assert.equal(RangeRuler.findRange(200), Range.TWO);
   assert.equal(RangeRuler.findRange(201), Range.THREE);
   assert.equal(RangeRuler.findRange(300), Range.THREE);
   assert.equal(RangeRuler.findRange(301), Range.FOUR);
   assert.equal(RangeRuler.findRange(401), Range.FIVE);
   assert.ok(!RangeRuler.findRange(501));
});

QUnit.test("getRange() One", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var rebelAgent = new Agent(store, "Rebel Agent");
   var attacker = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);
   var attackerPosition = new Position(300, 80, -90);
   var imperialAgent = new Agent(store, "Imperial Agent");
   var defender = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
   var defenderPosition = new Position(300, 30, 45);

   // Run.
   var result = RangeRuler.getRange(attacker, attackerPosition, defender, defenderPosition);

   // Verify.
   assert.ok(result);
   assert.equal(result, Range.ONE);
});

QUnit.test("getRange() Two", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var rebelAgent = new Agent(store, "Rebel Agent");
   var attacker = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);
   var attackerPosition = new Position(300, 180, -90);
   var imperialAgent = new Agent(store, "Imperial Agent");
   var defender = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
   var defenderPosition = new Position(300, 30, 45);

   // Run.
   var result = RangeRuler.getRange(attacker, attackerPosition, defender, defenderPosition);

   // Verify.
   assert.ok(result);
   assert.equal(result, Range.TWO);
});

QUnit.test("getRange() Three", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var rebelAgent = new Agent(store, "Rebel Agent");
   var attacker = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);
   var attackerPosition = new Position(300, 280, -90);
   var imperialAgent = new Agent(store, "Imperial Agent");
   var defender = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
   var defenderPosition = new Position(300, 30, 45);

   // Run.
   var result = RangeRuler.getRange(attacker, attackerPosition, defender, defenderPosition);

   // Verify.
   assert.ok(result);
   assert.equal(result, Range.THREE);
});

const RangeRulerTest = {};
export default RangeRulerTest;