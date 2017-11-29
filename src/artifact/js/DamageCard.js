"use strict";

define(["common/js/ArrayAugments", "artifact/js/CardType", "artifact/js/DamageCardTrait"],
   function(ArrayAugments, CardType, DamageCardTrait)
   {
      var DamageCard = {
         BLINDED_PILOT: "blindedPilot",
         CONSOLE_FIRE: "consoleFire",
         DAMAGED_COCKPIT: "damagedCockpit",
         DAMAGED_ENGINE: "damagedEngine",
         DAMAGED_SENSOR_ARRAY: "damagedSensorArray",
         DIRECT_HIT: "directHit",
         INJURED_PILOT: "injuredPilot",
         MINOR_EXPLOSION: "minorExplosion",
         MINOR_HULL_BREACH: "minorHullBreach",
         MUNITIONS_FAILURE: "munitionsFailure",
         STRUCTURAL_DAMAGE: "structuralDamage",
         STUNNED_PILOT: "stunnedPilot",
         THRUST_CONTROL_FIRE: "thrustControlFire",
         WEAPON_MALFUNCTION: "weaponMalfunction",

         BLINDED_PILOT_V2: "blindedPilotV2",
         CONSOLE_FIRE_V2: "consoleFireV2",
         DAMAGED_COCKPIT_V2: "damagedCockpitV2",
         DAMAGED_ENGINE_V2: "damagedEngineV2",
         DAMAGED_SENSOR_ARRAY_V2: "damagedSensorArrayV2",
         DIRECT_HIT_V2: "directHitV2",
         LOOSE_STABILIZER_V2: "looseStablizerV2",
         MAJOR_EXPLOSION_V2: "majorExplosionV2",
         MAJOR_HULL_BREACH_V2: "majorHullBreachV2",
         SHAKEN_PILOT_V2: "shakenPilotV2",
         STRUCTURAL_DAMAGE_V2: "structuralDamageV2",
         STUNNED_PILOT_V2: "stunnedPilotV2",
         THRUST_CONTROL_FIRE_V2: "thrustControlFireV2",
         WEAPONS_FAILURE_V2: "weaponsFailureV2",
         properties:
         {
            "blindedPilot":
            {
               name: "Blinded Pilot",
               trait: DamageCardTrait.PILOT,
               description: "The next time you attack, do not roll any attack dice. Then flip this card facedown.",
               isImplemented: true,
               key: "blindedPilot",
            },
            "consoleFire":
            {
               name: "Console Fire",
               trait: DamageCardTrait.SHIP,
               description: "At the start of each Combat phase, roll 1 attack die. On a Hit result, suffer 1 damage.",
               hasAction: true,
               actionDescription: "Flip this card facedown.",
               isImplemented: true,
               key: "consoleFire",
            },
            "damagedCockpit":
            {
               name: "Damaged Cockpit",
               trait: DamageCardTrait.PILOT,
               description: "After the round in which you receive this card, treat your pilot skill value as \"0.\"",
               key: "damagedCockpit",
            },
            "damagedEngine":
            {
               name: "Damaged Engine",
               trait: DamageCardTrait.SHIP,
               description: "Treat all turn maneuvers (left turn or right turn) as red maneuvers.",
               isImplemented: true,
               key: "damagedEngine",
            },
            "damagedSensorArray":
            {
               name: "Damaged Sensor Array",
               trait: DamageCardTrait.SHIP,
               description: "You cannot perform the actions listed in your action bar.",
               hasAction: true,
               actionDescription: "Roll 1 attack die. On a Hit result, flip this card facedown.",
               isImplemented: true,
               key: "damagedSensorArray",
            },
            "directHit":
            {
               name: "Direct Hit!",
               trait: DamageCardTrait.SHIP,
               description: "This card counts as 2 damage against your hull.",
               isImplemented: true,
               key: "directHit",
            },
            "injuredPilot":
            {
               name: "Injured Pilot",
               trait: DamageCardTrait.PILOT,
               description: "All players must ignore your pilot ability and all of your Elite Upgrade cards.",
               key: "injuredPilot",
            },
            "minorExplosion":
            {
               name: "Minor Explosion",
               trait: DamageCardTrait.SHIP,
               description: "Immediately roll 1 attack die. On a Hit result, suffer 1 damage. Then flip this card facedown.",
               isImplemented: true,
               key: "minorExplosion",
            },
            "minorHullBreach":
            {
               name: "Minor Hull Breach",
               trait: DamageCardTrait.SHIP,
               description: "After executing a red maneuver, roll 1 attack die. On a Hit result, suffer 1 damage.",
               isImplemented: true,
               key: "minorHullBreach",
            },
            "munitionsFailure":
            {
               name: "Munitions Failure",
               trait: DamageCardTrait.SHIP,
               description: "Immediately choose 1 of your secondary weapon Upgrade cards and discard it. Then flip this Damage card facedown.",
               key: "munitionsFailure",
            },
            "structuralDamage":
            {
               name: "Structural Damage",
               trait: DamageCardTrait.SHIP,
               description: "Reduce your agility value by 1 (to a minimum of \"0\").",
               agilityValue: -1,
               hasAction: true,
               actionDescription: "Roll 1 attack die. On a Hit result, flip this card facedown.",
               isImplemented: true,
               key: "structuralDamage",
            },
            "stunnedPilot":
            {
               name: "Stunned Pilot",
               trait: DamageCardTrait.PILOT,
               description: "After you execute a maneuver that causes you to overlap either another ship or an obstacle token, suffer 1 damage.",
               key: "stunnedPilot",
            },
            "thrustControlFire":
            {
               name: "Thrust Control Fire",
               trait: DamageCardTrait.SHIP,
               description: "Immediately receive 1 stress token. Then flip this card facedown.",
               isImplemented: true,
               key: "thrustControlFire",
            },
            "weaponMalfunction":
            {
               name: "Weapon Malfunction",
               trait: DamageCardTrait.SHIP,
               description: "Reduce your primary weapon value by 1 (to a minimum of \"0\").",
               primaryWeaponValue: -1,
               hasAction: true,
               actionDescription: "Roll 1 attack die. On a Hit or Critical Hit result, flip this card facedown.",
               isImplemented: true,
               key: "weaponMalfunction",
            },

            "blindedPilotV2":
            {
               name: "Blinded Pilot",
               trait: DamageCardTrait.PILOT,
               description: "You cannot perform attacks. After your next opportunity to attack (even if there was no target for an attack), flip this card facedown.",
               key: "blindedPilotV2",
            },
            "consoleFireV2":
            {
               name: "Console Fire",
               trait: DamageCardTrait.SHIP,
               description: "At the start of each Combat phase, roll 1 attack die. On a Hit result, suffer 1 damage.",
               hasAction: true,
               actionDescription: "Flip this card facedown.",
               isImplemented: true,
               key: "consoleFireV2",
            },
            "damagedCockpitV2":
            {
               name: "Damaged Cockpit",
               trait: DamageCardTrait.PILOT,
               description: "Starting the round after you receive this card, treat your pilot skill value as \"0.\"",
               key: "damagedCockpitV2",
            },
            "damagedEngineV2":
            {
               name: "Damaged Engine",
               trait: DamageCardTrait.SHIP,
               description: "Treat all turn maneuvers (left turn or right turn) as red maneuvers.",
               isImplemented: true,
               key: "damagedEngineV2",
            },
            "damagedSensorArrayV2":
            {
               name: "Damaged Sensor Array",
               trait: DamageCardTrait.SHIP,
               description: "You cannot perform any actions except actions listed on Damage cards.",
               hasAction: true,
               actionDescription: "Roll 1 attack die. On a Hit or Critical Hit result, flip this card facedown.",
               isImplemented: true,
               key: "damagedSensorArrayV2",
            },
            "directHitV2":
            {
               name: "Direct Hit!",
               trait: DamageCardTrait.SHIP,
               description: "This card counts as 2 damage against your hull.",
               isImplemented: true,
               key: "directHitV2",
            },
            "looseStablizerV2":
            {
               name: "Loose Stabilizer",
               trait: DamageCardTrait.SHIP,
               description: "After you execute a white maneuver, receive 1 stress token.",
               hasAction: true,
               actionDescription: "Flip this card facedown.",
               isImplemented: true,
               key: "looseStablizerV2",
            },
            "majorExplosionV2":
            {
               name: "Major Explosion",
               trait: DamageCardTrait.SHIP,
               description: "Roll 1 attack die. On a Hit result, suffer 1 critical damage. Then flip this card facedown.",
               isImplemented: true,
               key: "majorExplosionV2",
            },
            "majorHullBreachV2":
            {
               name: "Major Hull Breach",
               trait: DamageCardTrait.SHIP,
               description: "Starting the round after you receive this card, all Damage cards dealt to you are dealt faceup.",
               hasAction: true,
               actionDescription: "Flip this card facedown.",
               key: "majorHullBreachV2",
            },
            "shakenPilotV2":
            {
               name: "Shaken Pilot",
               trait: DamageCardTrait.PILOT,
               description: "During the Planning phase, you cannot be assigned straight maneuvers. When you reveal a maneuver, flip this card facedown.",
               isImplemented: true,
               key: "shakenPilotV2",
            },
            "structuralDamageV2":
            {
               name: "Structural Damage",
               trait: DamageCardTrait.SHIP,
               description: "Reduce your agility value by 1 (to a minimum of \"0\").",
               agilityValue: -1,
               hasAction: true,
               actionDescription: "Roll 1 attack die. On a Hit or Critical Hit result, flip this card facedown.",
               isImplemented: true,
               key: "structuralDamageV2",
            },
            "stunnedPilotV2":
            {
               name: "Stunned Pilot",
               trait: DamageCardTrait.PILOT,
               description: "After you execute a maneuver, if you are touching another ship or overlapping an obstacle token, suffer 1 damage.",
               key: "stunnedPilotV2",
            },
            "thrustControlFireV2":
            {
               name: "Thrust Control Fire",
               trait: DamageCardTrait.SHIP,
               description: "Receive 1 stress token. Then flip this card facedown.",
               isImplemented: true,
               key: "thrustControlFireV2",
            },
            "weaponsFailureV2":
            {
               name: "Weapons Failure",
               trait: DamageCardTrait.SHIP,
               description: "When attacking, roll 1 fewer attack die.",
               hasAction: true,
               actionDescription: "Roll 1 attack die. On a Hit or Critical Hit result, flip this card facedown.",
               isImplemented: true,
               key: "weaponsFailureV2",
            },
         },
      };

      DamageCard.keys = function()
      {
         return Object.keys(DamageCard.properties);
      };

      DamageCard.values = function()
      {
         return Object.values(DamageCard.properties);
      };

      DamageCard.keys().forEach(function(damageKey)
      {
         var damage = DamageCard.properties[damageKey];
         damage.cardTypeKey = CardType.DAMAGE;
         damage.xwingType = DamageCard;

         if (damage.hasAction)
         {
            damage.oncePerRound = true;
         }
      });

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      DamageCard.createDeckV1 = function()
      {
         // There are two of each, except seven of Direct Hit!
         var keys = DamageCard.keysV1();

         var answer = keys.reduce(function(accumulator, damageKey)
         {
            accumulator.push(damageKey);
            accumulator.push(damageKey);
            return accumulator;
         }, []);

         for (var i = 0; i < 5; i++)
         {
            answer.push(DamageCard.DIRECT_HIT);
         }

         answer.xwingShuffle();

         return answer;
      };

      DamageCard.createDeckV2 = function()
      {
         // There are two of each, except seven of Direct Hit!
         var keys = DamageCard.keysV2();

         var answer = keys.reduce(function(accumulator, damageKey)
         {
            accumulator.push(damageKey);
            accumulator.push(damageKey);
            return accumulator;
         }, []);

         for (var i = 0; i < 5; i++)
         {
            answer.push(DamageCard.DIRECT_HIT_V2);
         }

         answer.xwingShuffle();

         return answer;
      };

      DamageCard.keysV1 = function()
      {
         var values = this.keys();

         return values.filter(function(damageKey)
         {
            return !damageKey.endsWith("V2");
         });
      };

      DamageCard.keysV2 = function()
      {
         var values = this.keys();

         return values.filter(function(damageKey)
         {
            return damageKey.endsWith("V2");
         });
      };

      DamageCard.toString = function()
      {
         return "DamageCard";
      };

      if (Object.freeze)
      {
         Object.freeze(DamageCard);
      }

      return DamageCard;
   });
