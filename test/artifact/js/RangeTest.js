"use strict";

define(["qunit", "artifact/js/Range"], function(QUnit, Range)
{
   QUnit.module("Range");

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = Range.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(Range);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = Range[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(Range.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return Range[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = Range.keys();

      // Verify.
      assert.ok(result);
      var length = 5;
      assert.equal(result.length, length);
      var i = 0;
      assert.equal(result[i++], Range.ONE);
      assert.equal(result[i++], Range.TWO);
      assert.equal(result[i++], Range.THREE);
      assert.equal(result[i++], Range.FOUR);
      assert.equal(result[i++], Range.FIVE);

      var properties = Object.getOwnPropertyNames(Range);
      var count = properties.length - 1 - // properties
         1 - // keys
         1 - // toString
         1 - // values
         1; // STANDARD_RANGES
      assert.equal(result.length, count);
   });
});
