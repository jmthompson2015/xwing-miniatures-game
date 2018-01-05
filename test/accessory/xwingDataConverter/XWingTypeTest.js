"use strict";

define(["qunit", "accessory/xwingDataConverter/XWingType"],
   function(QUnit, XWingType)
   {
      QUnit.module("XWingType");

      QUnit.test("XWingType properties Pilots", function(assert)
      {
         var key = XWingType.PILOTS;
         var properties = XWingType.properties[key];
         assert.equal(properties.name, "Pilots");
         assert.equal(properties.filepath, "../../../lib/xwing-data/data/pilots.js");
         assert.equal(properties.key, key);
      });

      QUnit.test("keys and values", function(assert)
      {
         // Setup.

         // Run.
         var result = XWingType.keys();
         var ownPropertyNames = Object.getOwnPropertyNames(XWingType);

         // Verify.
         ownPropertyNames.forEach(function(key)
         {
            var key2 = XWingType[key];

            if (key !== "properties" && typeof key2 === "string")
            {
               assert.ok(XWingType.properties[key2], "Missing value for key = " + key);
            }
         });

         result.forEach(function(value)
         {
            var p = ownPropertyNames.filter(function(key)
            {
               return XWingType[key] === value;
            });

            assert.equal(p.length, 1, "Missing key for value = " + value);
         });
      });

      QUnit.test("required properties", function(assert)
      {
         XWingType.values().forEach(function(ship)
         {
            assert.ok(ship.name, "Missing name for " + ship.key);
            assert.ok(ship.filepath, "Missing filepath for " + ship.name);
            assert.ok(ship.key, "Missing key for " + ship.name);
         });
      });

      QUnit.test("values()", function(assert)
      {
         // Run.
         var result = XWingType.keys();

         // Verify.
         assert.ok(result);
         var length = 7;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], "conditions");
         assert.equal(result[i++], "damages");
         assert.equal(result[i++], "damagesTfa");
         assert.equal(result[i++], "pilots");
         assert.equal(result[i++], "ships");
         assert.equal(result[i++], "sources");
         assert.equal(result[i++], "upgrades");

         var properties = Object.getOwnPropertyNames(XWingType);
         var count = properties.length - 1 - // properties
            1 - // keys
            1; // values
         assert.equal(result.length, count);
      });
   });
