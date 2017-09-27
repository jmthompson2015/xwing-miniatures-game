"use strict";

define(["qunit", "artifact/js/DiceModification"], function(QUnit, DiceModification)
{
   QUnit.module("DiceModification");

   QUnit.test("DiceModification properties Target Lock Acquired", function(assert)
   {
      var modificationKey = DiceModification.ATTACK_SPEND_FOCUS;
      var properties = DiceModification.properties[modificationKey];
      assert.equal(properties.name, "Spend a Focus token");
      assert.equal(properties.key, modificationKey);
   });

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = DiceModification.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(DiceModification);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = DiceModification[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(DiceModification.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return DiceModification[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = DiceModification.keys();

      // Verify.
      assert.ok(result);
      var length = 4;
      assert.equal(result.length, length);
      var i = 0;
      assert.equal(result[i++], DiceModification.ATTACK_SPEND_FOCUS);
      assert.equal(result[i++], DiceModification.ATTACK_SPEND_TARGET_LOCK);
      assert.equal(result[i++], DiceModification.DEFENSE_SPEND_EVADE);
      assert.equal(result[length - 1], DiceModification.DEFENSE_SPEND_FOCUS);

      var properties = Object.getOwnPropertyNames(DiceModification);
      var count = properties.length - 1 - // properties
         1 - // keys
         1 - // toString
         1; // values
      assert.equal(result.length, count);
   });
});
