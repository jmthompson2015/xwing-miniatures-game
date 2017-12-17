"use strict";

define(["qunit", "accessory/xwingDataConverter/FactionConverter"], function(QUnit, FactionConverter)
{
   QUnit.module("FactionConverter");

   var NAMES = ["First Order", "Galactic Empire", "Rebel Alliance", "Resistance", "Scum and Villainy"];
   var ENUM_NAMES = ["_FIRST_ORDER", "_IMPERIAL", "_REBEL", "_RESISTANCE", "_SCUM"];
   var ENUM_VALUES = ["_firstOrder", "_imperial", "_rebel", "_resistance", "_scum"];

   QUnit.test("createEnumName", function(assert)
   {
      // Run / Verify.
      for (var i = 0; i < NAMES.length; i++)
      {
         var name = NAMES[i];
         var enumName = FactionConverter.createEnumName(name);
         assert.ok(enumName);
         assert.equal(enumName, ENUM_NAMES[i], enumName + " === " + ENUM_NAMES[i]);
      }
   });

   QUnit.test("createEnumValue", function(assert)
   {
      // Run / Verify.
      for (var i = 0; i < NAMES.length; i++)
      {
         var name = NAMES[i];
         var enumValue = FactionConverter.createEnumValue(name);
         assert.ok(enumValue);
         assert.equal(enumValue, ENUM_VALUES[i], enumValue + " === " + ENUM_VALUES[i]);
      }
   });
});
