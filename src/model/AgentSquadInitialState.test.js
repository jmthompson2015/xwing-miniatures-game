"use strict";

define(["qunit", "model/AgentSquadInitialState"], function(QUnit, AgentSquadInitialState)
{
   QUnit.module("AgentSquadInitialState");

   QUnit.test("AgentSquadInitialState()", function(assert)
   {
      // Run.
      var result = new AgentSquadInitialState();

      // Verify.
      assert.equal(result.delegateStore, undefined);
      assert.equal(result.displayItem, undefined);
      assert.equal(result.displayItemType, undefined);
      assert.equal(result.imageBase, undefined);
      assert.ok(result.pilots);
      assert.equal(result.pilots.size, 0);
      assert.ok(result.pilotIndexToUpgrades);
      assert.equal(result.pilotIndexToUpgrades.size, 0);
      assert.ok(result.ships);
      assert.equal(result.ships.size, 0);
      assert.equal(result.squad, undefined);
      assert.equal(result.team, undefined);
   });
});
