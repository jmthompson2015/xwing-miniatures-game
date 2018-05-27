"use strict";

define(["qunit", "redux", "artifact/PilotCard", "artifact/Range",
  "model/Agent", "model/Position", "model/RangeRuler", "model/Reducer", "model/CardInstance"],
   function(QUnit, Redux, PilotCard, Range,
      Agent, Position, RangeRuler, Reducer, CardInstance)
   {
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
   });
