

import QUnit from "qunit";
import FactionConverter from "../accessory/xwing-data-converter/FactionConverter";
   QUnit.module("FactionConverter");

   var NAMES = ["First Order", "Galactic Empire", "Rebel Alliance", "Resistance", "Scum and Villainy"];
   var ENUM_NAMES = ["FIRST_ORDER", "IMPERIAL", "REBEL", "RESISTANCE", "SCUM"];
   var ENUM_VALUES = ["firstOrder", "imperial", "rebel", "resistance", "scum"];

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

