"use strict";

define(["qunit", "artifact/js/ConditionCard"], function(QUnit, ConditionCard)
{
   QUnit.module("ConditionCard");

   QUnit.test("ConditionCard properties Fanatical Devotion", function(assert)
   {
      var upgrade = ConditionCard.FANATICAL_DEVOTION;
      var properties = ConditionCard.properties[upgrade];
      assert.equal(properties.name, "Fanatical Devotion");
      assert.equal(properties.description, "When defending, you cannot spend focus tokens. When attacking, if you spend a focus token to change all focus results to hit results, set aside the first focus result that you change. The set-aside hit result cannot be canceled by defense dice, but the defender may cancel critical hit results before it.");
      assert.equal(properties.key, "fanaticalDevotion");
   });

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = ConditionCard.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(ConditionCard);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = ConditionCard[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(ConditionCard.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return ConditionCard[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = ConditionCard.keys();

      // Verify.
      assert.ok(result);
      var length = 2;
      assert.equal(result.length, length);
      var i = 0;
      assert.equal(result[i++], ConditionCard.FANATICAL_DEVOTION);
      assert.equal(result[i++], ConditionCard.ILL_SHOW_YOU_THE_DARK_SIDE);

      var properties = Object.getOwnPropertyNames(ConditionCard);
      var count = properties.length - 1 - // properties
         1 - // keys
         1 - // toString
         1; // values
      assert.equal(result.length, count);
   });
});
