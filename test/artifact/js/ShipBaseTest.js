"use strict";

define(["qunit", "artifact/js/ShipBase"], function(QUnit, ShipBase)
{
   QUnit.module("ShipBase");

   QUnit.test("ShipBase properties Large", function(assert)
   {
      var shipBase = ShipBase.LARGE;
      var properties = ShipBase.properties[shipBase];
      assert.equal(properties.width, 80);
      assert.equal(properties.height, 80);
      assert.equal(properties.key, shipBase);
   });

   QUnit.test("ShipBase properties Small", function(assert)
   {
      var shipBase = ShipBase.SMALL;
      var properties = ShipBase.properties[shipBase];
      assert.equal(properties.width, 40);
      assert.equal(properties.height, 40);
      assert.equal(properties.key, shipBase);
   });

   QUnit.test("isHuge()", function(assert)
   {
      assert.ok(!ShipBase.isHuge(ShipBase.SMALL));
      assert.ok(!ShipBase.isHuge(ShipBase.LARGE));
      assert.ok(ShipBase.isHuge(ShipBase.HUGE1));
      assert.ok(ShipBase.isHuge(ShipBase.HUGE2));
   });

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = ShipBase.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(ShipBase);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = ShipBase[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(ShipBase.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return ShipBase[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = ShipBase.keys();

      // Verify.
      assert.ok(result);
      assert.equal(result.length, 4);
      var i = 0;
      assert.equal(result[i++], ShipBase.SMALL);
      assert.equal(result[i++], ShipBase.LARGE);
      assert.equal(result[i++], ShipBase.HUGE1);
      assert.equal(result[i++], ShipBase.HUGE2);

      var properties = Object.getOwnPropertyNames(ShipBase);
      var count = properties.length - 1 - // properties
         1 - // isHuge
         1 - // keys
         1 - // toString
         1; // values
      assert.equal(result.length, count);
   });
});
