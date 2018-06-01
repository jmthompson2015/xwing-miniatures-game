import AgentSquadAction from "./AgentSquadAction.js";

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

const AgentSquadActionTest = {};
export default AgentSquadActionTest;