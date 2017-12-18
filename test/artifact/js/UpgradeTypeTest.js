"use strict";

define(["qunit", "artifact/js/UpgradeType"], function(QUnit, UpgradeType)
{
   QUnit.module("UpgradeType");

   QUnit.test("UpgradeType properties Astromech", function(assert)
   {
      var typeKey = UpgradeType.ASTROMECH;
      var properties = UpgradeType.properties[typeKey];
      assert.equal(properties.name, "Astromech");
      assert.equal(properties.key, "astromech");
   });

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = UpgradeType.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(UpgradeType);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = UpgradeType[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(UpgradeType.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return UpgradeType[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = UpgradeType.keys();

      // Verify.
      assert.ok(result);
      assert.equal(result.length, 17);
      var i = 0;
      assert.equal(result[i++], UpgradeType.ASTROMECH);
      assert.equal(result[i++], UpgradeType.BOMB);
      assert.equal(result[i++], UpgradeType.CANNON);
      assert.equal(result[i++], UpgradeType.CARGO);
      assert.equal(result[i++], UpgradeType.CREW);
      assert.equal(result[i++], UpgradeType.ELITE);
      assert.equal(result[i++], UpgradeType.HARDPOINT);
      assert.equal(result[i++], UpgradeType.ILLICIT);
      assert.equal(result[i++], UpgradeType.MISSILE);
      assert.equal(result[i++], UpgradeType.MODIFICATION);
      assert.equal(result[i++], UpgradeType.SALVAGED_ASTROMECH);
      assert.equal(result[i++], UpgradeType.SYSTEM);
      assert.equal(result[i++], UpgradeType.TEAM);
      assert.equal(result[i++], UpgradeType.TECH);
      assert.equal(result[i++], UpgradeType.TITLE);
      assert.equal(result[i++], UpgradeType.TORPEDO);
      assert.equal(result[i++], UpgradeType.TURRET);

      var properties = Object.getOwnPropertyNames(UpgradeType);
      var count = properties.length - 1 - // properties
         1 - // keys
         1 - // findByName
         1 - // toString
         1; // values
      assert.equal(result.length, count);
   });
});
