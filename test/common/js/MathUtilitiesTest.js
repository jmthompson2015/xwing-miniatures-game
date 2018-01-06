"use strict";

define(["qunit", "common/js/MathUtilities"],
   /*jshint -W098 */
   function(QUnit, MathUtilities)
   {
      QUnit.module("MathUtilities");

      QUnit.test("vizziniRound()", function(assert)
      {
         assert.equal(MathUtilities.xwingRound(12.3456, -1), 10);
         assert.equal(MathUtilities.xwingRound(12.3456, 0), 12);
         assert.equal(MathUtilities.xwingRound(12.3456, 1), 12.3);
         assert.equal(MathUtilities.xwingRound(12.3456, 2), 12.35);
         assert.equal(MathUtilities.xwingRound(12.3456, 3), 12.346);
         assert.equal(MathUtilities.xwingRound(12.3456, 4), 12.3456);
      });
   });
