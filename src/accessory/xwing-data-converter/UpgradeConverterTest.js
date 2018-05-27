"use strict";

define(["qunit", "accessory/xwing-data-converter/UpgradeConverter"],
   function(QUnit, UpgradeConverter)
   {
      QUnit.module("UpgradeConverter");

      var INTEGRATED_ASTROMECH = {
         "name": "Integrated Astromech",
         "id": 193,
         "slot": "Modification",
         "points": 0,
         "ship": ["X-wing", "T-70 X-wing"],
         "text": "When you are dealt a Damage card, you may discard 1 of your [Astromech] Upgrade cards to discard that Damage card (without resolving its effect).",
         "image": "upgrades/Modification/integrated-astromech.png",
         "xws": "integratedastromech"
      };

      var LIGHTWEIGHT_FRAME = {
         "image": "upgrades/Modification/lightweight-frame.png",
         "text": "When defending, after rolling defense dice, if there are more attack dice than defense dice, roll 1 additional defense die.<br /><br />You cannot equip this card if your agility value is \"3\" or higher.",
         "name": "Lightweight Frame",
         "xws": "lightweightframe",
         "points": 2,
         "slot": "Modification",
         "ship": [
            "TIE Adv. Prototype",
            "TIE Advanced",
            "TIE Bomber",
            "TIE Defender",
            "TIE Fighter",
            "TIE Interceptor",
            "TIE Phantom",
            "TIE Punisher",
            "TIE Silencer",
            "TIE Striker",
            "TIE/fo Fighter",
            "TIE/sf Fighter"
          ],
         "id": 296
      };

      var NAVIGATOR = {
         "name": "Navigator",
         "id": 48,
         "slot": "Crew",
         "points": 3,
         "text": "When you reveal a maneuver, you may rotate your dial to another maneuver with the same bearing.<br /><br />You cannot rotate to a red maneuver if you have any stress tokens.",
         "size": ["small", "large"],
         "image": "upgrades/Crew/navigator.png",
         "xws": "navigator"
      };

      var QUICK_RELEASE_CARGO_LOCKS = {
         "image": "upgrades/Cargo/quick-release-cargo-locks.png",
         "text": "At the end of the Activation phase, you may discard this card to <strong>place</strong> 1 container token.",
         "name": "Quick-release Cargo Locks",
         "xws": "quickreleasecargolocks",
         "limited": true,
         "points": 2,
         "slot": "Cargo",
         "ship": ["C-ROC Cruiser", "GR-75 Medium Transport"],
         "id": 308
      };

      var R2_ASTROMECH = {
         "name": "R2 Astromech",
         "id": 2,
         "slot": "Astromech",
         "points": 1,
         "text": "You may treat all 1- and 2-speed maneuvers as green maneuvers.",
         "image": "upgrades/Astromech/r2-astromech.png",
         "xws": "r2astromech"
      };

      var SMUGGLING_COMPARTMENT = {
         "image": "upgrades/Modification/smuggling-compartment.png",
         "text": "Your upgrade bar gains the [Illicit] upgrade icon.<br /><br />You may equip 1 additional Modification upgrade that costs 3 or fewer squad points.",
         "name": "Smuggling Compartment",
         "xws": "smugglingcompartment",
         "limited": true,
         "points": 0,
         "slot": "Modification",
         "ship": ["YT-1300", "YT-2400"],
         "id": 273,
         "grants": [
            {
               "type": "slot",
               "name": "Illicit"
            }
         ]
      };

      var TWIN_ION_ENGINE_MKII = {
         "name": "Twin Ion Engine Mk. II",
         "id": 190,
         "slot": "Modification",
         "points": 1,
         "ship": [
            "TIE Adv. Prototype",
            "TIE Advanced",
            "TIE Aggressor",
            "TIE Bomber",
            "TIE Defender",
            "TIE Fighter",
            "TIE Interceptor",
            "TIE Phantom",
            "TIE Punisher",
            "TIE Silencer",
            "TIE Striker",
            "TIE/fo Fighter",
            "TIE/sf Fighter"
          ],
         "image": "upgrades/Modification/twin-ion-engine-mkii.png",
         "text": "You may treat all bank maneuvers ([Bank Left] or [Bank Right]) as green maneuvers.",
         "xws": "twinionenginemkii"
      };

      QUnit.test("determineRestrictionKeys() R2 Astromech", function(assert)
      {
         // Run / Verify.
         assert.equal(UpgradeConverter.determineRestrictionKeys(R2_ASTROMECH), undefined);
      });

      QUnit.test("determineRestrictionKeys() Integrated Astromech", function(assert)
      {
         // Run / Verify.
         assert.equal(UpgradeConverter.determineRestrictionKeys(INTEGRATED_ASTROMECH), "[UpgradeRestriction.X_WING_ONLY]");
      });

      QUnit.test("determineRestrictionKeys() Lightweight Frame", function(assert)
      {
         // Run / Verify.
         assert.equal(UpgradeConverter.determineRestrictionKeys(LIGHTWEIGHT_FRAME), "[UpgradeRestriction.TIE_ONLY]");
      });

      QUnit.test("determineRestrictionKeys() Navigator", function(assert)
      {
         // Run / Verify.
         assert.equal(UpgradeConverter.determineRestrictionKeys(NAVIGATOR), "[UpgradeRestriction.SMALL_AND_LARGE_SHIP_ONLY]");
      });

      QUnit.test("determineRestrictionKeys() Quick-release Cargo Locks", function(assert)
      {
         // Run / Verify.
         assert.equal(UpgradeConverter.determineRestrictionKeys(QUICK_RELEASE_CARGO_LOCKS), "[UpgradeRestriction.C_ROC_CRUISER_AND_GR_75_ONLY, UpgradeRestriction.LIMITED]");
      });

      QUnit.test("determineRestrictionKeys() Smuggling Compartment", function(assert)
      {
         // Run / Verify.
         assert.equal(UpgradeConverter.determineRestrictionKeys(SMUGGLING_COMPARTMENT), "[UpgradeRestriction.LIMITED, UpgradeRestriction.YT_1300_AND_YT_2400_ONLY]");
      });

      QUnit.test("determineRestrictionKeys() Twin Ion Engine Mk. II", function(assert)
      {
         // Run / Verify.
         assert.equal(UpgradeConverter.determineRestrictionKeys(TWIN_ION_ENGINE_MKII), "[UpgradeRestriction.TIE_ONLY]");
      });
   });
