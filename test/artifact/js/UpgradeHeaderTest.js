"use strict";

define(["qunit", "artifact/js/UpgradeHeader"], function(QUnit, UpgradeHeader)
{
   QUnit.module("UpgradeHeader");

   QUnit.test("UpgradeHeader properties Attack (Focus)", function(assert)
   {
      var headerKey = UpgradeHeader.ATTACK_FOCUS;
      var properties = UpgradeHeader.properties[headerKey];
      assert.equal(properties.name, "Attack [Focus]");
      assert.equal(properties.key, "attackFocus");
   });

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = UpgradeHeader.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(UpgradeHeader);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = UpgradeHeader[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(UpgradeHeader.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return UpgradeHeader[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      var result = UpgradeHeader.keys();
      assert.ok(result);
      assert.equal(result.length, 6);
      var i = 0;
      assert.equal(result[i++], UpgradeHeader.ACTION);
      assert.equal(result[i++], UpgradeHeader.ATTACK);
      assert.equal(result[i++], UpgradeHeader.ATTACK_ENERGY);
      assert.equal(result[i++], UpgradeHeader.ATTACK_FOCUS);
      assert.equal(result[i++], UpgradeHeader.ATTACK_TARGET_LOCK);
      assert.equal(result[i++], UpgradeHeader.ENERGY);

      var properties = Object.getOwnPropertyNames(UpgradeHeader);
      var count = properties.length - 1 - // properties
         1 - // keys
         1 - // toString
         1; // values
      assert.equal(result.length, count);
   });
});
