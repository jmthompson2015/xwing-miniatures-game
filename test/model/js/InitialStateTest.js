"use strict";

define(["qunit", "artifact/js/Phase", "model/js/InitialState"],
   function(QUnit, Phase, InitialState)
   {
      QUnit.module("InitialState");

      QUnit.test("InitialState()", function(assert)
      {
         // Run.
         var result = new InitialState();

         // Verify.
         assert.ok(!result.playFormatKey);
         assert.equal(result.round, 0);
         assert.equal(result.phaseKey, Phase.SETUP);
         assert.ok(!result.activeTokenId);
      });
   });
