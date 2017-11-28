"use strict";

define(["qunit", "redux", "artifact/js/Faction", "model/js/Agent", "model/js/Reducer"],
   function(QUnit, Redux, Faction, Agent, Reducer)
   {
      QUnit.module("Agent");

      QUnit.test("Agent()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var name = "agent1";

         // Run.
         var result = new Agent(store, name, Faction.IMPERIAL);

         // Verify.
         assert.ok(result);
         assert.equal(result.id(), 1);
         assert.equal(result.name(), name);
      });
   });
