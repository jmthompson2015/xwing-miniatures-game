"use strict";

define(["qunit", "artifact/js/Faction", "artifact/js/PilotCard", "artifact/js/Ship", "artifact/js/ShipFaction"],
   function(QUnit, Faction, PilotCard, Ship, ShipFaction)
   {
      QUnit.module("PilotCard");

      QUnit.test("PilotCard properties Academy Pilot", function(assert)
      {
         var pilot = PilotCard.ACADEMY_PILOT;
         var properties = PilotCard.properties[pilot];
         assert.equal(properties.name, "Academy Pilot");
         assert.equal(properties.shipFactionKey, ShipFaction.IMPERIAL_TIE_FIGHTER);
         assert.equal(properties.pilotSkillValue, 1);
         assert.equal(properties.squadPointCost, 12);
         assert.equal(properties.key, PilotCard.ACADEMY_PILOT);
      });

      QUnit.test("PilotCard properties Bounty Hunter", function(assert)
      {
         var pilot = PilotCard.BOUNTY_HUNTER;
         var properties = PilotCard.properties[pilot];
         assert.equal(properties.name, "Bounty Hunter");
         assert.equal(properties.shipFactionKey, ShipFaction.IMPERIAL_FIRESPRAY_31);
         assert.equal(properties.pilotSkillValue, 3);
         assert.equal(properties.squadPointCost, 33);
         assert.equal(properties.key, "bountyHunter");
      });

      QUnit.test("PilotCard properties Dutch Vander", function(assert)
      {
         var pilot = PilotCard.DUTCH_VANDER;
         var properties = PilotCard.properties[pilot];
         assert.equal(properties.name, "\"Dutch\" Vander");
         assert.equal(properties.shipFactionKey, ShipFaction.REBEL_Y_WING);
         assert.equal(properties.pilotSkillValue, 6);
         assert.equal(properties.squadPointCost, 23);
         assert.equal(properties.key, "dutchVander");
      });

      QUnit.test("PilotCard properties Rookie Pilot", function(assert)
      {
         var pilot = PilotCard.ROOKIE_PILOT;
         var properties = PilotCard.properties[pilot];
         assert.equal(properties.name, "Rookie Pilot");
         assert.equal(properties.shipFactionKey, ShipFaction.REBEL_X_WING);
         assert.equal(properties.pilotSkillValue, 2);
         assert.equal(properties.squadPointCost, 21);
         assert.equal(properties.key, "rookiePilot");
      });

      QUnit.test("getName()", function(assert)
      {
         assert.equal(PilotCard.getName(PilotCard.ACADEMY_PILOT), "Academy Pilot");
         assert.equal(PilotCard.getName(PilotCard.LUKE_SKYWALKER), "\u2022 Luke Skywalker");
      });

      QUnit.test("keys and values", function(assert)
      {
         // Setup.

         // Run.
         var result = PilotCard.keys();
         var ownPropertyNames = Object.getOwnPropertyNames(PilotCard);

         // Verify.
         ownPropertyNames.forEach(function(key)
         {
            var key2 = PilotCard[key];

            if (key !== "properties" && typeof key2 === "string")
            {
               assert.ok(PilotCard.properties[key2], "Missing value for key = " + key);
            }
         });

         result.forEach(function(value)
         {
            var p = ownPropertyNames.filter(function(key)
            {
               return PilotCard[key] === value;
            });

            assert.equal(p.length, 1, "Missing key for value = " + value);
         });
      });

      QUnit.test("keys()", function(assert)
      {
         // Run.
         var result = PilotCard.keys();

         // Verify.
         assert.ok(result);
         var length = 232;
         assert.equal(result.length, length);
         assert.equal(result[0], PilotCard.ACADEMY_PILOT);
         assert.equal(result[length - 1], PilotCard.ZUCKUSS);

         var properties = Object.getOwnPropertyNames(PilotCard);
         var count = properties.length - 1 - // properties
            1 - // getName
            1 - // keys
            1 - // keysByShipAndFaction
            1 - // keysByShipFaction
            1 - // toString
            1 - // values
            1; // keysByFaction
         assert.equal(result.length, count);
      });

      QUnit.test("keysByShipAndFaction() TIE Fighter", function(assert)
      {
         // Run.
         var result = PilotCard.keysByShipAndFaction(Ship.TIE_FIGHTER, Faction.IMPERIAL);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 13);
         assert.equal(result[0], PilotCard.ACADEMY_PILOT);
         assert.equal(result[11], PilotCard.WINGED_GUNDARK);
      });

      QUnit.test("keysByShipAndFaction() X-Wing", function(assert)
      {
         // Run.
         var result = PilotCard.keysByShipAndFaction(Ship.X_WING, Faction.REBEL);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 10);
         assert.equal(result[0], PilotCard.BIGGS_DARKLIGHTER);
         assert.equal(result[9], PilotCard.WES_JANSON);
      });

      QUnit.test("keysByShipAndFaction() Y-Wing Rebel", function(assert)
      {
         // Run.
         var result = PilotCard.keysByShipAndFaction(Ship.Y_WING, Faction.REBEL);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 4);
         assert.equal(result[0], PilotCard.DUTCH_VANDER);
         assert.equal(result[3], PilotCard.HORTON_SALM);
      });

      QUnit.test("keysByShipAndFaction() Y-Wing Scum", function(assert)
      {
         // Run.
         var result = PilotCard.keysByShipAndFaction(Ship.Y_WING, Faction.SCUM);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 4);
         assert.equal(result[0], PilotCard.DREA_RENTHAL);
         assert.equal(result[3], PilotCard.SYNDICATE_THUG);
      });

      QUnit.test("keysByShipFaction() TIE Fighter", function(assert)
      {
         // Run.
         var result = PilotCard.keysByShipFaction(ShipFaction.IMPERIAL_TIE_FIGHTER);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 13);
         assert.equal(result[0], PilotCard.ACADEMY_PILOT);
         assert.equal(result[12], PilotCard.YOUNGSTER);
      });

      QUnit.test("keysByShipFaction() X-Wing", function(assert)
      {
         // Run.
         var result = PilotCard.keysByShipFaction(ShipFaction.REBEL_X_WING);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 10);
         assert.equal(result[0], PilotCard.BIGGS_DARKLIGHTER);
         assert.equal(result[9], PilotCard.WES_JANSON);
      });

      QUnit.test("keysByFaction() First Order", function(assert)
      {
         // Run.
         var result = PilotCard.keysByFaction(Faction.FIRST_ORDER);

         // Verify.
         assert.ok(result);
         var length = 89;
         assert.equal(result.length, length);
         assert.equal(result[length - 1], PilotCard.ZERTIK_STROM);
      });

      QUnit.test("keysByFaction() First Order strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = PilotCard.keysByFaction(Faction.FIRST_ORDER, isStrict);

         // Verify.
         assert.ok(result);
         var length = 17;
         assert.equal(result.length, length);
         assert.equal(result[0], PilotCard.BACKDRAFT);
         assert.equal(result[length - 1], PilotCard.ZETA_SQUADRON_PILOT);
      });

      QUnit.test("keysByFaction() Imperial", function(assert)
      {
         // Run.
         var result = PilotCard.keysByFaction(Faction.IMPERIAL);

         // Verify.
         assert.ok(result);
         var length = 89;
         assert.equal(result.length, length);
         assert.equal(result[0], PilotCard.ACADEMY_PILOT);
         assert.equal(result[length - 1], PilotCard.ZETA_SQUADRON_PILOT);
      });

      QUnit.test("keysByFaction() Imperial strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = PilotCard.keysByFaction(Faction.IMPERIAL, isStrict);

         // Verify.
         assert.ok(result);
         var length = 72;
         assert.equal(result.length, length);
         assert.equal(result[0], PilotCard.ACADEMY_PILOT);
         assert.equal(result[length - 1], PilotCard.ZERTIK_STROM);
      });

      QUnit.test("keysByFaction() Rebel", function(assert)
      {
         // Run.
         var result = PilotCard.keysByFaction(Faction.REBEL);

         // Verify.
         assert.ok(result);
         var length = 83;
         assert.equal(result.length, length);
         assert.equal(result[0], PilotCard.AIREN_CRACKEN);
         assert.equal(result[length - 1], PilotCard.SNAP_WEXLEY);
      });

      QUnit.test("keysByFaction() Rebel strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = PilotCard.keysByFaction(Faction.REBEL, isStrict);

         // Verify.
         assert.ok(result);
         var length = 69;
         assert.equal(result.length, length);
         assert.equal(result[0], PilotCard.AIREN_CRACKEN);
         assert.equal(result[length - 1], PilotCard.ZEB_ORRELIOS);
      });

      QUnit.test("keysByFaction() Resistance", function(assert)
      {
         // Run.
         var result = PilotCard.keysByFaction(Faction.RESISTANCE);

         // Verify.
         assert.ok(result);
         var length = 83;
         assert.equal(result.length, length);
         assert.equal(result[0], PilotCard.BLUE_ACE);
         assert.equal(result[length - 1], PilotCard.ZEB_ORRELIOS);
      });

      QUnit.test("keysByFaction() Resistance strict", function(assert)
      {
         // Setup.
         var isStrict = true;

         // Run.
         var result = PilotCard.keysByFaction(Faction.RESISTANCE, isStrict);

         // Verify.
         assert.ok(result);
         var length = 14;
         assert.equal(result.length, length);
         assert.equal(result[0], PilotCard.BLUE_ACE);
         assert.equal(result[length - 1], PilotCard.SNAP_WEXLEY);
      });

      QUnit.test("keysByFaction() Scum", function(assert)
      {
         // Run.
         var result = PilotCard.keysByFaction(Faction.SCUM);

         // Verify.
         assert.ok(result);
         var length = 60;
         assert.equal(result.length, length);
         assert.equal(result[0], PilotCard.ASAJJ_VENTRESS);
         assert.equal(result[length - 1], PilotCard.ZUCKUSS);
      });
   });
