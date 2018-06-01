

import QUnit from "qunit";
import EnumGenerator from "../accessory/xwing-data-converter/EnumGenerator";
   QUnit.module("EnumGenerator");

   var NAMES = ["Academy Pilot", "ARC-170", "\"Chopper\"", "Graz the Hunter", "Luke Skywalker", "M3-A Interceptor", "TIE/x7"];
   var ENUM_NAMES = ["ACADEMY_PILOT", "ARC_170", "CHOPPER", "GRAZ_THE_HUNTER", "LUKE_SKYWALKER", "M3_A_INTERCEPTOR", "TIE_X7"];
   var ENUM_VALUES = ["academyPilot", "arc170", "chopper", "grazTheHunter", "lukeSkywalker", "m3AInterceptor", "tieX7"];

   /////////////////////////////////////////////////////////////////////////////
   // Pilots.

   var BOBA_FETT_IMPERIAL = {
      "name": "Boba Fett",
      "ship": "Firespray-31",
      "faction": "Galactic Empire",
      "xws": "bobafett",
   };

   var BOBA_FETT_SCUM = {
      "name": "Boba Fett",
      "ship": "Firespray-31",
      "faction": "Scum and Villainy",
      "xws": "bobafett",
   };

   var DALAN_OBEROS_STAR_VIPER = {
      "name": "Dalan Oberos",
      "xws": "dalanoberos",
      "ship": "StarViper",
      "faction": "Scum and Villainy",
   };

   var DALAN_OBEROS_KIMOGILA = {
      "name": "Dalan Oberos",
      "xws": "dalanoberos",
      "ship": "M12-L Kimogila Fighter",
      "faction": "Scum and Villainy",
   };

   var POE_DAMERON = {
      "name": "Poe Dameron",
      "ship": "T-70 X-wing",
      "faction": "Resistance",
      "xws": "poedameron",
   };

   var POE_DAMERON_HOTR = {
      "name": "Poe Dameron",
      "xws": "poedameron-swx57",
      "ship": "T-70 X-wing",
      "faction": "Resistance",
   };

   /////////////////////////////////////////////////////////////////////////////
   // Ships.

   var JUMP_MASTER_5000 = {
      "name": "JumpMaster 5000",
      "faction": ["Scum and Villainy"],
      "xws": "jumpmaster5000",
   };

   var STAR_VIPER = {
      "name": "StarViper",
      "faction": ["Scum and Villainy"],
      "xws": "starviper",
   };

   var X_WING = {
      "name": "X-wing",
      "faction": ["Rebel Alliance"],
      "xws": "xwing",
   };

   var Y_WING = {
      "name": "Y-wing",
      "faction": ["Rebel Alliance", "Scum and Villainy"],
      "xws": "ywing",
   };

   /////////////////////////////////////////////////////////////////////////////
   // Upgrades.

   var ADAPTABILITY_DECREASE = {
      "name": "Adaptability (-1)",
      "xws": "adaptability",
      "slot": "Elite",
   };

   var ADAPTABILITY_INCREASE = {
      "name": "Adaptability (+1)",
      "xws": "adaptability",
      "slot": "Elite",
   };

   var ARC_CASTER_RECHARGING = {
      "name": "ARC Caster (Recharging)",
      "xws": "arccaster",
      "slot": "Cannon",
   };

   var CHOPPER_ASTROMECH = {
      "name": "\"Chopper\"",
      "xws": "chopper",
      "slot": "Astromech",
   };

   var CHOPPER_CREW = {
      "name": "\"Chopper\"",
      "slot": "Crew",
      "xws": "chopper",
   };

   var INTENSITY_EXHAUSTED = {
      "name": "Intensity (Exhausted)",
      "xws": "intensity",
      "slot": "Elite",
   };

   var GHOST_PHANTOM_II = {
      "name": "Ghost",
      "xws": "ghost-swx72",
      "slot": "Title",
   };

   var MILLENNIUM_FALCON_HOTR = {
      "name": "Millennium Falcon",
      "xws": "millenniumfalcon-swx57",
      "slot": "Title",
   };

   var STAR_VIPER_MKII = {
      "name": "StarViper Mk.II",
   };

   var TWIN_ION_ENGINE_MKII = {
      "name": "Twin Ion Engine Mk. II",
   };

   QUnit.test("createEnumName", function(assert)
   {
      // Setup.

      // Run.
      for (var i = 0; i < NAMES.length; i++)
      {
         var name = NAMES[i];
         var enumName = EnumGenerator.createEnumName(name);
         assert.ok(enumName);
         assert.equal(enumName, ENUM_NAMES[i], enumName + " === " + ENUM_NAMES[i]);
      }

      // Verify.
   });

   QUnit.test("createEnumValue", function(assert)
   {
      // Setup.

      // Run.
      for (var i = 0; i < NAMES.length; i++)
      {
         var name = NAMES[i];
         var enumValue = EnumGenerator.createEnumValue(name);
         assert.ok(enumValue);
         assert.equal(enumValue, ENUM_VALUES[i], enumValue + " === " + ENUM_VALUES[i]);
      }

      // Verify.
   });

   QUnit.test("createPilotEnumName", function(assert)
   {
      // Run / Verify.
      assert.equal(EnumGenerator.createPilotEnumName(BOBA_FETT_IMPERIAL), "BOBA_FETT_IMPERIAL");
      assert.equal(EnumGenerator.createPilotEnumName(BOBA_FETT_SCUM), "BOBA_FETT_SCUM");
      assert.equal(EnumGenerator.createPilotEnumName(DALAN_OBEROS_KIMOGILA), "DALAN_OBEROS_M12_L_KIMOGILA_FIGHTER");
      assert.equal(EnumGenerator.createPilotEnumName(DALAN_OBEROS_STAR_VIPER), "DALAN_OBEROS_STAR_VIPER");
      assert.equal(EnumGenerator.createPilotEnumName(POE_DAMERON), "POE_DAMERON");
      assert.equal(EnumGenerator.createPilotEnumName(POE_DAMERON_HOTR), "POE_DAMERON_HOTR");
   });

   QUnit.test("createPilotEnumValue", function(assert)
   {
      // Run / Verify.
      assert.equal(EnumGenerator.createPilotEnumValue(BOBA_FETT_IMPERIAL), "\"bobaFett_imperial\"");
      assert.equal(EnumGenerator.createPilotEnumValue(BOBA_FETT_SCUM), "\"bobaFett_scum\"");
      assert.equal(EnumGenerator.createPilotEnumValue(DALAN_OBEROS_KIMOGILA), "\"dalanOberos_m12LKimogilaFighter\"");
      assert.equal(EnumGenerator.createPilotEnumValue(DALAN_OBEROS_STAR_VIPER), "\"dalanOberos_starViper\"");
      assert.equal(EnumGenerator.createPilotEnumValue(POE_DAMERON), "\"poeDameron\"");
      assert.equal(EnumGenerator.createPilotEnumValue(POE_DAMERON_HOTR), "\"poeDameron_hotr\"");
   });

   QUnit.test("createShipEnumName", function(assert)
   {
      // Run / Verify.
      assert.equal(EnumGenerator.createShipEnumName(JUMP_MASTER_5000), "JUMP_MASTER_5000");
      assert.equal(EnumGenerator.createShipEnumName(STAR_VIPER), "STAR_VIPER");
      assert.equal(EnumGenerator.createShipEnumName(X_WING), "X_WING");
   });

   QUnit.test("createShipEnumValue", function(assert)
   {
      // Run / Verify.
      assert.equal(EnumGenerator.createShipEnumValue(JUMP_MASTER_5000), "\"jumpmaster5000\"");
      assert.equal(EnumGenerator.createShipEnumValue(STAR_VIPER), "\"starviper\"");
      assert.equal(EnumGenerator.createShipEnumValue(X_WING), "\"xwing\"");
   });

   QUnit.test("createShipFactionEnumName", function(assert)
   {
      // Run / Verify.
      assert.equal(EnumGenerator.createShipFactionEnumName(JUMP_MASTER_5000, 0), "SCUM_JUMP_MASTER_5000");
      assert.equal(EnumGenerator.createShipFactionEnumName(STAR_VIPER, 0), "SCUM_STAR_VIPER");
      assert.equal(EnumGenerator.createShipFactionEnumName(X_WING, 0), "REBEL_X_WING");
      assert.equal(EnumGenerator.createShipFactionEnumName(Y_WING, 0), "REBEL_Y_WING");
   });

   QUnit.test("createShipFactionEnumValue", function(assert)
   {
      // Run / Verify.
      assert.equal(EnumGenerator.createShipFactionEnumValue(JUMP_MASTER_5000, 0), "\"scum_jumpmaster5000\"");
      assert.equal(EnumGenerator.createShipFactionEnumValue(STAR_VIPER, 0), "\"scum_starviper\"");
      assert.equal(EnumGenerator.createShipFactionEnumValue(X_WING, 0), "\"rebel_xwing\"");
      assert.equal(EnumGenerator.createShipFactionEnumValue(Y_WING, 0), "\"rebel_ywing\"");
   });

   QUnit.test("createUpgradeEnumName", function(assert)
   {
      // Run / Verify.
      assert.equal(EnumGenerator.createUpgradeEnumName(ADAPTABILITY_DECREASE), "ADAPTABILITY_DECREASE");
      assert.equal(EnumGenerator.createUpgradeEnumName(ADAPTABILITY_INCREASE), "ADAPTABILITY_INCREASE");
      assert.equal(EnumGenerator.createUpgradeEnumName(ARC_CASTER_RECHARGING), "ARC_CASTER_RECHARGING");
      assert.equal(EnumGenerator.createUpgradeEnumName(CHOPPER_ASTROMECH), "CHOPPER_ASTROMECH");
      assert.equal(EnumGenerator.createUpgradeEnumName(CHOPPER_CREW), "CHOPPER_CREW");
      assert.equal(EnumGenerator.createUpgradeEnumName(INTENSITY_EXHAUSTED), "INTENSITY_EXHAUSTED");
      assert.equal(EnumGenerator.createUpgradeEnumName(GHOST_PHANTOM_II), "GHOST_PHANTOM_II");
      assert.equal(EnumGenerator.createUpgradeEnumName(MILLENNIUM_FALCON_HOTR), "MILLENNIUM_FALCON_HOTR");
      assert.equal(EnumGenerator.createUpgradeEnumName(STAR_VIPER_MKII), "STAR_VIPER_MKII");
      assert.equal(EnumGenerator.createUpgradeEnumName(TWIN_ION_ENGINE_MKII), "TWIN_ION_ENGINE_MKII");
   });

   QUnit.test("createUpgradeEnumValue", function(assert)
   {
      // Run / Verify.
      assert.equal(EnumGenerator.createUpgradeEnumValue(ADAPTABILITY_DECREASE), "\"adaptabilityDecrease\"");
      assert.equal(EnumGenerator.createUpgradeEnumValue(ADAPTABILITY_INCREASE), "\"adaptabilityIncrease\"");
      assert.equal(EnumGenerator.createUpgradeEnumValue(ARC_CASTER_RECHARGING), "\"arcCasterRecharging\"");
      assert.equal(EnumGenerator.createUpgradeEnumValue(CHOPPER_ASTROMECH), "\"chopper_astromech\"");
      assert.equal(EnumGenerator.createUpgradeEnumValue(CHOPPER_CREW), "\"chopper_crew\"");
      assert.equal(EnumGenerator.createUpgradeEnumValue(INTENSITY_EXHAUSTED), "\"intensityExhausted\"");
      assert.equal(EnumGenerator.createUpgradeEnumValue(GHOST_PHANTOM_II), "\"ghost_phantomII\"");
      assert.equal(EnumGenerator.createUpgradeEnumValue(MILLENNIUM_FALCON_HOTR), "\"millenniumFalcon_hotr\"");
      assert.equal(EnumGenerator.createUpgradeEnumValue(STAR_VIPER_MKII), "\"starViperMkii\"");
      assert.equal(EnumGenerator.createUpgradeEnumValue(TWIN_ION_ENGINE_MKII), "\"twinIonEngineMkii\"");
   });

