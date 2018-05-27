"use strict";

define(["qunit", "model/AgentSquadAction"], function(QUnit, AgentSquadAction)
{
   QUnit.module("AgentSquadAction");

   QUnit.test("setDisplayItem()", function(assert)
   {
      // Setup.
      var displayItem = {};

      // Run.
      var result = AgentSquadAction.setDisplayItem(displayItem);

      // Verify.
      assert.ok(result);
      assert.equal(result.type, AgentSquadAction.SET_DISPLAY_ITEM);
      assert.equal(result.displayItem, displayItem);
   });
});
