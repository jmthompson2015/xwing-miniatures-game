"use strict";

define(["qunit", "artifact/js/Faction", "artifact/js/Ship", "artifact/js/ShipFaction"],
   function(QUnit, Faction, Ship, ShipFaction)
   {
      QUnit.module("ShipFaction");

      QUnit.test("ShipFaction properties Imperial Firespray-31", function(assert)
      {
         var shipFaction = ShipFaction.IMPERIAL_FIRESPRAY_31;
         var properties = ShipFaction.properties[shipFaction];
         assert.equal(properties.name, "Firespray-31 (Imperial)");
         assert.equal(properties.shipKey, Ship.FIRESPRAY_31);
         assert.equal(properties.factionKey, Faction.IMPERIAL);
         assert.equal(properties.key, shipFaction);
      });

      QUnit.test("ShipFaction properties Imperial TIE Fighter", function(assert)
      {
         var shipFaction = ShipFaction.IMPERIAL_TIE_FIGHTER;
         var properties = ShipFaction.properties[shipFaction];
         assert.equal(properties.name, "TIE Fighter (Imperial)");
         assert.equal(properties.shipKey, Ship.TIE_FIGHTER);
         assert.equal(properties.factionKey, Faction.IMPERIAL);
         assert.equal(properties.key, shipFaction);
      });

      QUnit.test("ShipFaction properties Rebel X-Wing", function(assert)
      {
         var shipFaction = ShipFaction.REBEL_X_WING;
         var properties = ShipFaction.properties[shipFaction];
         assert.equal(properties.name, "X-Wing");
         assert.equal(properties.shipKey, Ship.X_WING);
         assert.equal(properties.factionKey, Faction.REBEL);
         assert.equal(properties.key, shipFaction);
      });

      QUnit.test("ShipFaction properties Scum Firespray-31", function(assert)
      {
         var shipFaction = ShipFaction.SCUM_FIRESPRAY_31;
         var properties = ShipFaction.properties[shipFaction];
         assert.equal(properties.name, "Firespray-31 (Scum)");
         assert.equal(properties.shipKey, Ship.FIRESPRAY_31);
         assert.equal(properties.factionKey, Faction.SCUM);
         assert.equal(properties.key, shipFaction);
      });

      QUnit.test("keys and values", function(assert)
      {
         // Setup.

         // Run.
         var result = ShipFaction.keys();
         var ownPropertyNames = Object.getOwnPropertyNames(ShipFaction);

         // Verify.
         ownPropertyNames.forEach(function(key)
         {
            var key2 = ShipFaction[key];

            if (key !== "properties" && typeof key2 === "string")
            {
               assert.ok(ShipFaction.properties[key2], "Missing value for key = " + key);
            }
         });

         result.forEach(function(value)
         {
            var p = ownPropertyNames.filter(function(key)
            {
               return ShipFaction[key] === value;
            });

            assert.equal(p.length, 1, "Missing key for value = " + value);
         });
      });

      QUnit.test("keys()", function(assert)
      {
         // Run.
         var result = ShipFaction.keys();

         // Verify.
         assert.ok(result);
         var length = 70;
         assert.equal(result.length, length);
         assert.equal(result[0], "firstOrder_tiefofighter");
         assert.equal(result[length - 1], "scum_cRocCruiser");

         var properties = Object.getOwnPropertyNames(ShipFaction);
         var count = properties.length - 1 - // properties
            1 - // keys
            1 - // keysByFaction
            1 - // keysByShipAndFaction
            1 - // shipKeysByFaction
            1 - // toString
            1; // values
         assert.equal(result.length, count);
      });

      QUnit.test("keysByShipAndFaction() Imperial", function(assert)
      {
         // Run.
         var result = ShipFaction.keysByShipAndFaction(Ship.TIE_INTERCEPTOR, Faction.IMPERIAL);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 3);
         var i = 0;
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3);
      });

      QUnit.test("keysByShipAndFaction() Rebel", function(assert)
      {
         // Run.
         var result = ShipFaction.keysByShipAndFaction(Ship.A_WING, Faction.REBEL);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         var i = 0;
         assert.equal(result[i++], ShipFaction.REBEL_A_WING);
         assert.equal(result[i++], ShipFaction.REBEL_A_WING_V2);
      });

      QUnit.test("keysByFaction() First Order", function(assert)
      {
         // Run.
         var result = ShipFaction.keysByFaction(Faction.FIRST_ORDER);

         // Verify.
         assert.ok(result);
         var length = 24;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_TIE_SF_FIGHTER);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_TIE_SILENCER);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_UPSILON_CLASS_SHUTTLE);
         assert.equal(result[i++], ShipFaction.IMPERIAL_ALPHA_CLASS_STAR_WING);
         assert.equal(result[i++], ShipFaction.IMPERIAL_FIRESPRAY_31);
         assert.equal(result[i++], ShipFaction.IMPERIAL_LAMBDA_CLASS_SHUTTLE);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_ADVANCED);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_ADVANCED_PROTOTYPE);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_AGGRESSOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_BOMBER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_BOMBER_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_DEFENDER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_DEFENDER_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_FIGHTER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_PHANTOM);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_PUNISHER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_STRIKER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_VT_49_DECIMATOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_GOZANTI_CLASS_CRUISER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE);
      });

      QUnit.test("keysByFaction() First Order strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = ShipFaction.keysByFaction(Faction.FIRST_ORDER, isStrict);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 4);
         var i = 0;
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_TIE_SF_FIGHTER);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_TIE_SILENCER);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_UPSILON_CLASS_SHUTTLE);
      });

      QUnit.test("keysByFaction() Imperial", function(assert)
      {
         // Run.
         var result = ShipFaction.keysByFaction(Faction.IMPERIAL);

         // Verify.
         assert.ok(result);
         var length = 24;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], ShipFaction.IMPERIAL_ALPHA_CLASS_STAR_WING);
         assert.equal(result[i++], ShipFaction.IMPERIAL_FIRESPRAY_31);
         assert.equal(result[i++], ShipFaction.IMPERIAL_LAMBDA_CLASS_SHUTTLE);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_ADVANCED);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_ADVANCED_PROTOTYPE);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_AGGRESSOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_BOMBER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_BOMBER_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_DEFENDER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_DEFENDER_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_FIGHTER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_PHANTOM);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_PUNISHER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_STRIKER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_VT_49_DECIMATOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_GOZANTI_CLASS_CRUISER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_TIE_SF_FIGHTER);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_TIE_SILENCER);
         assert.equal(result[i++], ShipFaction.FIRST_ORDER_UPSILON_CLASS_SHUTTLE);
      });

      QUnit.test("keysByFaction() Imperial strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = ShipFaction.keysByFaction(Faction.IMPERIAL, isStrict);

         // Verify.
         assert.ok(result);
         var length = 20;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], ShipFaction.IMPERIAL_ALPHA_CLASS_STAR_WING);
         assert.equal(result[i++], ShipFaction.IMPERIAL_FIRESPRAY_31);
         assert.equal(result[i++], ShipFaction.IMPERIAL_LAMBDA_CLASS_SHUTTLE);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_ADVANCED);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_ADVANCED_PROTOTYPE);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_AGGRESSOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_BOMBER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_BOMBER_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_DEFENDER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_DEFENDER_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_FIGHTER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_PHANTOM);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_PUNISHER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_TIE_STRIKER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_VT_49_DECIMATOR);
         assert.equal(result[i++], ShipFaction.IMPERIAL_GOZANTI_CLASS_CRUISER);
         assert.equal(result[i++], ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE);
      });

      QUnit.test("keysByFaction() Rebel", function(assert)
      {
         // Run.
         var result = ShipFaction.keysByFaction(Faction.REBEL);

         // Verify.
         assert.ok(result);
         var length = 26;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], ShipFaction.REBEL_ARC_170);
         assert.equal(result[i++], ShipFaction.REBEL_ATTACK_SHUTTLE);
         assert.equal(result[i++], ShipFaction.REBEL_AUZITUCK_GUNSHIP);
         assert.equal(result[i++], ShipFaction.REBEL_A_WING);
         assert.equal(result[i++], ShipFaction.REBEL_A_WING_V2);
         assert.equal(result[i++], ShipFaction.REBEL_B_WING);
         assert.equal(result[i++], ShipFaction.REBEL_B_WING_V2);
         assert.equal(result[i++], ShipFaction.REBEL_E_WING);
         assert.equal(result[i++], ShipFaction.REBEL_HWK_290);
         assert.equal(result[i++], ShipFaction.REBEL_K_WING);
         assert.equal(result[i++], ShipFaction.REBEL_SCURRG_H_6_BOMBER);
         assert.equal(result[i++], ShipFaction.REBEL_SHEATHIPEDE_CLASS_SHUTTLE);
         assert.equal(result[i++], ShipFaction.REBEL_TIE_FIGHTER);
         assert.equal(result[i++], ShipFaction.REBEL_U_WING);
         assert.equal(result[i++], ShipFaction.REBEL_VCX_100);
         assert.equal(result[i++], ShipFaction.REBEL_X_WING);
         assert.equal(result[i++], ShipFaction.REBEL_YT_1300);
         assert.equal(result[i++], ShipFaction.REBEL_YT_2400);
         assert.equal(result[i++], ShipFaction.REBEL_Y_WING);
         assert.equal(result[i++], ShipFaction.REBEL_Z_95_HEADHUNTER);
         assert.equal(result[i++], ShipFaction.REBEL_CR90_CORVETTE);
         assert.equal(result[i++], ShipFaction.REBEL_GR_75_MEDIUM_TRANSPORT);
         assert.equal(result[i++], ShipFaction.RESISTANCE_B_SF_17_BOMBER);
         assert.equal(result[i++], ShipFaction.RESISTANCE_T_70_X_WING);
         assert.equal(result[i++], ShipFaction.RESISTANCE_T_70_X_WING_V2);
         assert.equal(result[i++], ShipFaction.RESISTANCE_YT_1300);
      });

      QUnit.test("keysByFaction() Rebel strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = ShipFaction.keysByFaction(Faction.REBEL, isStrict);

         // Verify.
         assert.ok(result);
         var length = 22;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], ShipFaction.REBEL_ARC_170);
         assert.equal(result[i++], ShipFaction.REBEL_ATTACK_SHUTTLE);
         assert.equal(result[i++], ShipFaction.REBEL_AUZITUCK_GUNSHIP);
         assert.equal(result[i++], ShipFaction.REBEL_A_WING);
         assert.equal(result[i++], ShipFaction.REBEL_A_WING_V2);
         assert.equal(result[i++], ShipFaction.REBEL_B_WING);
         assert.equal(result[i++], ShipFaction.REBEL_B_WING_V2);
         assert.equal(result[i++], ShipFaction.REBEL_E_WING);
         assert.equal(result[i++], ShipFaction.REBEL_HWK_290);
         assert.equal(result[i++], ShipFaction.REBEL_K_WING);
         assert.equal(result[i++], ShipFaction.REBEL_SCURRG_H_6_BOMBER);
         assert.equal(result[i++], ShipFaction.REBEL_SHEATHIPEDE_CLASS_SHUTTLE);
         assert.equal(result[i++], ShipFaction.REBEL_TIE_FIGHTER);
         assert.equal(result[i++], ShipFaction.REBEL_U_WING);
         assert.equal(result[i++], ShipFaction.REBEL_VCX_100);
         assert.equal(result[i++], ShipFaction.REBEL_X_WING);
         assert.equal(result[i++], ShipFaction.REBEL_YT_1300);
         assert.equal(result[i++], ShipFaction.REBEL_YT_2400);
         assert.equal(result[i++], ShipFaction.REBEL_Y_WING);
         assert.equal(result[i++], ShipFaction.REBEL_Z_95_HEADHUNTER);
         assert.equal(result[i++], ShipFaction.REBEL_CR90_CORVETTE);
         assert.equal(result[i++], ShipFaction.REBEL_GR_75_MEDIUM_TRANSPORT);
      });

      QUnit.test("keysByFaction() Resistance", function(assert)
      {
         // Run.
         var result = ShipFaction.keysByFaction(Faction.RESISTANCE);

         // Verify.
         assert.ok(result);
         var length = 26;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], ShipFaction.RESISTANCE_B_SF_17_BOMBER);
         assert.equal(result[i++], ShipFaction.RESISTANCE_T_70_X_WING);
         assert.equal(result[i++], ShipFaction.RESISTANCE_T_70_X_WING_V2);
         assert.equal(result[i++], ShipFaction.RESISTANCE_YT_1300);
         assert.equal(result[i++], ShipFaction.REBEL_ARC_170);
         assert.equal(result[i++], ShipFaction.REBEL_ATTACK_SHUTTLE);
         assert.equal(result[i++], ShipFaction.REBEL_AUZITUCK_GUNSHIP);
         assert.equal(result[i++], ShipFaction.REBEL_A_WING);
         assert.equal(result[i++], ShipFaction.REBEL_A_WING_V2);
         assert.equal(result[i++], ShipFaction.REBEL_B_WING);
         assert.equal(result[i++], ShipFaction.REBEL_B_WING_V2);
         assert.equal(result[i++], ShipFaction.REBEL_E_WING);
         assert.equal(result[i++], ShipFaction.REBEL_HWK_290);
         assert.equal(result[i++], ShipFaction.REBEL_K_WING);
         assert.equal(result[i++], ShipFaction.REBEL_SCURRG_H_6_BOMBER);
         assert.equal(result[i++], ShipFaction.REBEL_SHEATHIPEDE_CLASS_SHUTTLE);
         assert.equal(result[i++], ShipFaction.REBEL_TIE_FIGHTER);
         assert.equal(result[i++], ShipFaction.REBEL_U_WING);
         assert.equal(result[i++], ShipFaction.REBEL_VCX_100);
         assert.equal(result[i++], ShipFaction.REBEL_X_WING);
         assert.equal(result[i++], ShipFaction.REBEL_YT_1300);
         assert.equal(result[i++], ShipFaction.REBEL_YT_2400);
         assert.equal(result[i++], ShipFaction.REBEL_Y_WING);
         assert.equal(result[i++], ShipFaction.REBEL_Z_95_HEADHUNTER);
         assert.equal(result[i++], ShipFaction.REBEL_CR90_CORVETTE);
         assert.equal(result[i++], ShipFaction.REBEL_GR_75_MEDIUM_TRANSPORT);
      });

      QUnit.test("keysByFaction() Resistance strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = ShipFaction.keysByFaction(Faction.RESISTANCE, isStrict);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 4);
         var i = 0;
         assert.equal(result[i++], ShipFaction.RESISTANCE_B_SF_17_BOMBER);
         assert.equal(result[i++], ShipFaction.RESISTANCE_T_70_X_WING);
         assert.equal(result[i++], ShipFaction.RESISTANCE_T_70_X_WING_V2);
         assert.equal(result[i++], ShipFaction.RESISTANCE_YT_1300);
      });

      QUnit.test("keysByFaction() Scum", function(assert)
      {
         // Run.
         var result = ShipFaction.keysByFaction(Faction.SCUM);

         // Verify.
         assert.ok(result);
         var length = 20;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], ShipFaction.SCUM_AGGRESSOR);
         assert.equal(result[i++], ShipFaction.SCUM_FIRESPRAY_31);
         assert.equal(result[i++], ShipFaction.SCUM_G_1A_STARFIGHTER);
         assert.equal(result[i++], ShipFaction.SCUM_HWK_290);
         assert.equal(result[i++], ShipFaction.SCUM_JUMP_MASTER_5000);
         assert.equal(result[i++], ShipFaction.SCUM_KIHRAXZ_FIGHTER);
         assert.equal(result[i++], ShipFaction.SCUM_KIHRAXZ_FIGHTER_V2);
         assert.equal(result[i++], ShipFaction.SCUM_LANCER_CLASS_PURSUIT_CRAFT);
         assert.equal(result[i++], ShipFaction.SCUM_M12_L_KIMOGILA_FIGHTER);
         assert.equal(result[i++], ShipFaction.SCUM_M3_A_INTERCEPTOR);
         assert.equal(result[i++], ShipFaction.SCUM_M3_A_INTERCEPTOR_V2);
         assert.equal(result[i++], ShipFaction.SCUM_PROTECTORATE_STARFIGHTER);
         assert.equal(result[i++], ShipFaction.SCUM_QUADJUMPER);
         assert.equal(result[i++], ShipFaction.SCUM_SCURRG_H_6_BOMBER);
         assert.equal(result[i++], ShipFaction.SCUM_STAR_VIPER);
         assert.equal(result[i++], ShipFaction.SCUM_STAR_VIPER_V2);
         assert.equal(result[i++], ShipFaction.SCUM_YV_666);
         assert.equal(result[i++], ShipFaction.SCUM_Y_WING);
         assert.equal(result[i++], ShipFaction.SCUM_Z_95_HEADHUNTER);
         assert.equal(result[i++], ShipFaction.SCUM_C_ROC_CRUISER);
      });

      QUnit.test("required properties", function(assert)
      {
         ShipFaction.values().forEach(function(shipFaction)
         {
            assert.ok(shipFaction.name, "Missing name for " + shipFaction.name);
            assert.ok(shipFaction.shipKey, "Missing shipKey for " + shipFaction.name);
            assert.ok(shipFaction.factionKey, "Missing factionKey for " + shipFaction.name);
            assert.ok(shipFaction.image, "Missing image for " + shipFaction.name);
            assert.ok(shipFaction.wave, "Missing wave for " + shipFaction.name);
            assert.ok(shipFaction.key, "Missing key for " + shipFaction.name);
         });
      });

      QUnit.test("shipKeysByFaction() First Order strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = ShipFaction.shipKeysByFaction(Faction.FIRST_ORDER, isStrict);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 4);
         var i = 0;
         assert.equal(result[i++], Ship.TIE_FO_FIGHTER);
         assert.equal(result[i++], Ship.TIE_SF_FIGHTER);
         assert.equal(result[i++], Ship.TIE_SILENCER);
         assert.equal(result[i++], Ship.UPSILON_CLASS_SHUTTLE);
      });

      QUnit.test("shipKeysByFaction() Imperial", function(assert)
      {
         // Run.
         var result = ShipFaction.shipKeysByFaction(Faction.IMPERIAL);

         // Verify.
         assert.ok(result);
         var length = 20;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], Ship.ALPHA_CLASS_STAR_WING);
         assert.equal(result[i++], Ship.FIRESPRAY_31);
         assert.equal(result[i++], Ship.LAMBDA_CLASS_SHUTTLE);
         assert.equal(result[i++], Ship.TIE_ADVANCED);
         assert.equal(result[i++], Ship.TIE_ADVANCED_PROTOTYPE);
         assert.equal(result[i++], Ship.TIE_AGGRESSOR);
         assert.equal(result[i++], Ship.TIE_BOMBER);
         assert.equal(result[i++], Ship.TIE_DEFENDER);
         assert.equal(result[i++], Ship.TIE_FIGHTER);
         assert.equal(result[i++], Ship.TIE_INTERCEPTOR);
         assert.equal(result[i++], Ship.TIE_PHANTOM);
         assert.equal(result[i++], Ship.TIE_PUNISHER);
         assert.equal(result[i++], Ship.TIE_STRIKER);
         assert.equal(result[i++], Ship.VT_49_DECIMATOR);
         assert.equal(result[i++], Ship.GOZANTI_CLASS_CRUISER);
         assert.equal(result[i++], Ship.RAIDER_CLASS_CORVETTE);
         assert.equal(result[i++], Ship.TIE_FO_FIGHTER);
         assert.equal(result[i++], Ship.TIE_SF_FIGHTER);
         assert.equal(result[i++], Ship.TIE_SILENCER);
         assert.equal(result[i++], Ship.UPSILON_CLASS_SHUTTLE);
      });

      QUnit.test("shipKeysByFaction() Rebel", function(assert)
      {
         // Run.
         var result = ShipFaction.shipKeysByFaction(Faction.REBEL);

         // Verify.
         assert.ok(result);
         var length = 22;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], Ship.ARC_170);
         assert.equal(result[i++], Ship.ATTACK_SHUTTLE);
         assert.equal(result[i++], Ship.AUZITUCK_GUNSHIP);
         assert.equal(result[i++], Ship.A_WING);
         assert.equal(result[i++], Ship.B_WING);
         assert.equal(result[i++], Ship.E_WING);
         assert.equal(result[i++], Ship.HWK_290);
         assert.equal(result[i++], Ship.K_WING);
         assert.equal(result[i++], Ship.SCURRG_H_6_BOMBER);
         assert.equal(result[i++], Ship.SHEATHIPEDE_CLASS_SHUTTLE);
         assert.equal(result[i++], Ship.TIE_FIGHTER);
         assert.equal(result[i++], Ship.U_WING);
         assert.equal(result[i++], Ship.VCX_100);
         assert.equal(result[i++], Ship.X_WING);
         assert.equal(result[i++], Ship.YT_1300);
         assert.equal(result[i++], Ship.YT_2400);
         assert.equal(result[i++], Ship.Y_WING);
         assert.equal(result[i++], Ship.Z_95_HEADHUNTER);
         assert.equal(result[i++], Ship.CR90_CORVETTE);
         assert.equal(result[i++], Ship.GR_75_MEDIUM_TRANSPORT);
         assert.equal(result[i++], Ship.B_SF_17_BOMBER);
         assert.equal(result[i++], Ship.T_70_X_WING);
      });

      QUnit.test("shipKeysByFaction() Resistance strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = ShipFaction.shipKeysByFaction(Faction.RESISTANCE, isStrict);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 3);
         var i = 0;
         assert.equal(result[i++], Ship.B_SF_17_BOMBER);
         assert.equal(result[i++], Ship.T_70_X_WING);
         assert.equal(result[i++], Ship.YT_1300);
      });
   });
