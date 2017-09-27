"use strict";

define(["qunit", "artifact/js/PilotCard", "artifact/js/UpgradeCard", "artifact/js/UpgradeRestriction", "artifact/js/UpgradeType"],
   function(QUnit, PilotCard, UpgradeCard, UpgradeRestriction, UpgradeType)
   {
      QUnit.module("UpgradeCard");

      QUnit.test("UpgradeCard properties Adrenaline Rush", function(assert)
      {
         var upgrade = UpgradeCard.ADRENALINE_RUSH;
         var properties = UpgradeCard.properties[upgrade];
         assert.equal(properties.name, "Adrenaline Rush");
         assert.equal(properties.typeKey, UpgradeType.ELITE);
         assert.ok(properties.type);
         assert.ok(!properties.restrictionKeys);
         assert
            .equal(
               properties.description,
               "When you reveal a red maneuver, you may discard this card to treat that maneuver as a white maneuver until the end of the Activation phase.");
         assert.equal(properties.squadPointCost, 1);
         assert.equal(properties.key, "adrenalineRush");
      });

      QUnit.test("UpgradeCard properties C-3PO", function(assert)
      {
         // Setup.
         var upgradeCard = UpgradeCard.C_3PO;

         // Run.
         var result = UpgradeCard.properties[upgradeCard];

         // Verify.
         assert.ok(result);
         assert.equal(result.name, "C-3PO");
         assert.equal(result.typeKey, UpgradeType.CREW);
         assert.ok(result.type);
         assert.ok(result.restrictionKeys);
         assert.equal(result.restrictionKeys.length, 1);
         assert.equal(result.restrictionKeys[0], UpgradeRestriction.REBEL_ONLY);
         assert
            .equal(
               result.description,
               "Once per round, before you roll 1 or more defense dice, you may guess aloud a number of Evade results. If you roll that many Evade results (before modifying dice), add 1 Evade result.");
         assert.equal(result.squadPointCost, 3);
         assert.equal(result.key, upgradeCard);
      });

      QUnit.test("getName()", function(assert)
      {
         assert.equal(UpgradeCard.getName(UpgradeCard.DETERMINATION), "Determination");
         assert.equal(UpgradeCard.getName(UpgradeCard.R2_D2), "\u2022 R2-D2");
      });

      QUnit.test("keys and values", function(assert)
      {
         // Setup.

         // Run.
         var result = UpgradeCard.keys();
         var ownPropertyNames = Object.getOwnPropertyNames(UpgradeCard);

         // Verify.
         ownPropertyNames.forEach(function(key)
         {
            var key2 = UpgradeCard[key];

            if (key !== "properties" && typeof key2 === "string")
            {
               assert.ok(UpgradeCard.properties[key2], "Missing value for key = " + key);
            }
         });

         result.forEach(function(value)
         {
            var p = ownPropertyNames.filter(function(key)
            {
               return UpgradeCard[key] === value;
            });

            assert.equal(p.length, 1, "Missing key for value = " + value);
         });
      });

      QUnit.test("keys()", function(assert)
      {
         // Run.
         var result = UpgradeCard.keys();

         // Verify.
         assert.ok(result);
         var length = 299;
         assert.equal(result.length, length);
         assert.equal(result[0], UpgradeCard.A_WING_TEST_PILOT);
         assert.equal(result[length - 1], UpgradeCard.ZUCKUSS);

         var properties = Object.getOwnPropertyNames(UpgradeCard);
         var count = properties.length - 1 - // properties
            1 - // getName
            1 - // keys
            1 - // keysByPilotAndType
            1 - // keysByType
            1 - // toString
            1; // values
         assert.equal(result.length, count);
      });

      QUnit.test("keysByPilotAndType() Astromech", function(assert)
      {
         // Run.
         var result = UpgradeCard.keysByPilotAndType(PilotCard.LUKE_SKYWALKER, UpgradeType.ASTROMECH);

         // Verify.
         assert.ok(result);
         var length = 17;
         assert.equal(result.length, length);
         assert.equal(result[0], UpgradeCard.BB_8);
         assert.equal(result[length - 1], UpgradeCard.TARGETING_ASTROMECH);
      });

      QUnit.test("keysByPilotAndType() Boba Fett Modification", function(assert)
      {
         // Run.
         var result = UpgradeCard.keysByPilotAndType(PilotCard.BOBA_FETT_IMPERIAL, UpgradeType.MODIFICATION);

         // Verify.
         assert.ok(result);
         var length = 16;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], UpgradeCard.ADVANCED_SLAM);
         assert.equal(result[i++], UpgradeCard.ANTI_PURSUIT_LASERS);
         assert.equal(result[i++], UpgradeCard.AUTOTHRUSTERS);
         assert.equal(result[i++], UpgradeCard.COUNTERMEASURES);
         assert.equal(result[i++], UpgradeCard.ENGINE_UPGRADE);
         assert.equal(result[i++], UpgradeCard.EXPERIMENTAL_INTERFACE);
         assert.equal(result[i++], UpgradeCard.GUIDANCE_CHIPS);
         assert.equal(result[i++], UpgradeCard.HULL_UPGRADE);
         assert.equal(result[i++], UpgradeCard.ION_PROJECTOR);
         assert.equal(result[i++], UpgradeCard.LONG_RANGE_SCANNERS);
         assert.equal(result[i++], UpgradeCard.MUNITIONS_FAILSAFE);
         assert.equal(result[i++], UpgradeCard.SHIELD_UPGRADE);
         assert.equal(result[i++], UpgradeCard.STEALTH_DEVICE);
         assert.equal(result[i++], UpgradeCard.STYGIUM_PARTICLE_ACCELERATOR);
         assert.equal(result[i++], UpgradeCard.TACTICAL_JAMMER);
         assert.equal(result[i++], UpgradeCard.TARGETING_COMPUTER);
      });

      QUnit.test("keysByPilotAndType() Boba Fett Title", function(assert)
      {
         // Run.
         var result = UpgradeCard.keysByPilotAndType(PilotCard.BOBA_FETT_IMPERIAL, UpgradeType.TITLE);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         var i = 0;
         assert.equal(result[i++], UpgradeCard.ANDRASTA);
         assert.equal(result[i++], UpgradeCard.SLAVE_I);
      });

      QUnit.test("keysByPilotAndType() Elite", function(assert)
      {
         // Run.
         var result = UpgradeCard.keysByPilotAndType(PilotCard.DARTH_VADER, UpgradeType.ELITE);

         // Verify.
         assert.ok(result);
         var length = 33;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], UpgradeCard.ADAPTABILITY);
         assert.equal(result[i++], UpgradeCard.ADRENALINE_RUSH);
         assert.equal(result[i++], UpgradeCard.CALCULATION);
         assert.equal(result[i++], UpgradeCard.COOL_HAND);
         assert.equal(result[i++], UpgradeCard.CRACK_SHOT);
         assert.equal(result[i++], UpgradeCard.DAREDEVIL);
         assert.equal(result[i++], UpgradeCard.DEADEYE);
         assert.equal(result[i++], UpgradeCard.DECOY);
         assert.equal(result[i++], UpgradeCard.DETERMINATION);
         assert.equal(result[i++], UpgradeCard.DRAW_THEIR_FIRE);
         assert.equal(result[i++], UpgradeCard.ELUSIVENESS);
         assert.equal(result[i++], UpgradeCard.EXPERT_HANDLING);
         assert.equal(result[i++], UpgradeCard.EXPERTISE);
         assert.equal(result[i++], UpgradeCard.EXPOSE);
         assert.equal(result[i++], UpgradeCard.INTIMIDATION);
         assert.equal(result[i++], UpgradeCard.JUKE);
         assert.equal(result[i++], UpgradeCard.LIGHTNING_REFLEXES);
         assert.equal(result[i++], UpgradeCard.LONE_WOLF);
         assert.equal(result[i++], UpgradeCard.MARKSMANSHIP);
         assert.equal(result[i++], UpgradeCard.OPPORTUNIST);
         assert.equal(result[i++], UpgradeCard.OUTMANEUVER);
         assert.equal(result[i++], UpgradeCard.PREDATOR);
         assert.equal(result[i++], UpgradeCard.PUSH_THE_LIMIT);
         assert.equal(result[i++], UpgradeCard.RAGE);
         assert.equal(result[i++], UpgradeCard.RUTHLESSNESS);
         assert.equal(result[i++], UpgradeCard.SNAP_SHOT);
         assert.equal(result[i++], UpgradeCard.SQUAD_LEADER);
         assert.equal(result[i++], UpgradeCard.STAY_ON_TARGET);
         assert.equal(result[i++], UpgradeCard.SWARM_TACTICS);
         assert.equal(result[i++], UpgradeCard.TRICK_SHOT);
         assert.equal(result[i++], UpgradeCard.VETERAN_INSTINCTS);
         assert.equal(result[i++], UpgradeCard.WINGMAN);
         assert.equal(result[i++], UpgradeCard.WIRED);
      });

      QUnit.test("valuesByType() Astromech", function(assert)
      {
         // Run.
         var result = UpgradeCard.keysByType(UpgradeType.ASTROMECH);

         // Verify.
         assert.ok(result);
         var length = 17;
         assert.equal(result.length, length);
         assert.equal(result[0], UpgradeCard.BB_8);
         assert.equal(result[length - 1], UpgradeCard.TARGETING_ASTROMECH);
      });

      QUnit.test("valuesByType() Elite", function(assert)
      {
         // Run.
         var result = UpgradeCard.keysByType(UpgradeType.ELITE);

         // Verify.
         assert.ok(result);
         var length = 36;
         assert.equal(result.length, length);
         assert.equal(result[0], UpgradeCard.ADAPTABILITY);
         assert.equal(result[length - 1], UpgradeCard.WIRED);
      });
   });
