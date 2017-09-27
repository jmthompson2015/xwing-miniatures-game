"use strict";

define(["qunit", "artifact/js/DamageCardTrait"], function(QUnit, DamageCardTrait)
{
   QUnit.module("DamageCardTrait");

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = DamageCardTrait.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(DamageCardTrait);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = DamageCardTrait[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(DamageCardTrait.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return DamageCardTrait[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = DamageCardTrait.keys();

      // Verify.
      assert.ok(result);
      assert.equal(result.length, 2);
      var i = 0;
      assert.equal(result[i++], DamageCardTrait.PILOT);
      assert.equal(result[i++], DamageCardTrait.SHIP);

      var properties = Object.getOwnPropertyNames(DamageCardTrait);
      var count = properties.length - 1 - // properties
         1 - // keys
         1 - // toString
         1; // values
      assert.equal(result.length, count);
   });
});
