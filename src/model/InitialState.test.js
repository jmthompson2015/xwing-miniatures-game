import Phase from "../artifact/Phase.js";

import InitialState from "./InitialState.js";

QUnit.module("InitialState");

QUnit.test("InitialState()", function(assert)
{
   // Run.
   const result = new InitialState();

   // Verify.
   assert.ok(!result.playFormatKey);
   assert.equal(result.round, 0);
   assert.equal(result.phaseKey, Phase.SETUP);
   assert.ok(!result.activeCardId);
});

const InitialStateTest = {};
export default InitialStateTest;