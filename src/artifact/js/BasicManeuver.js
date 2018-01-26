/*
 * Provides an enumeration of maneuvers. <p> Small ship base is 40mm x 40mm. </p>
 * <p> Bearing straight, speed one maneuver is 40mm long. Other straight maneuvers
 * are multiples of this. </p>
 */
"use strict";

define(["common/js/InputValidator", "artifact/js/Bearing"],
   function(InputValidator, Bearing)
   {
      var BasicManeuver = {
         // Bank.
         BANK_LEFT_1: "bankLeft1",
         BANK_LEFT_2: "bankLeft2",
         BANK_LEFT_3: "bankLeft3",
         BANK_RIGHT_1: "bankRight1",
         BANK_RIGHT_2: "bankRight2",
         BANK_RIGHT_3: "bankRight3",

         // Barrel Roll.
         BARREL_ROLL_LEFT_1: "barrelRollLeft1",
         BARREL_ROLL_LEFT_2: "barrelRollLeft2",
         BARREL_ROLL_RIGHT_1: "barrelRollRight1",
         BARREL_ROLL_RIGHT_2: "barrelRollRight2",

         // Koiogran turn.
         KOIOGRAN_TURN_1: "koiogranTurn1",
         KOIOGRAN_TURN_2: "koiogranTurn2",
         KOIOGRAN_TURN_3: "koiogranTurn3",
         KOIOGRAN_TURN_4: "koiogranTurn4",
         KOIOGRAN_TURN_5: "koiogranTurn5",

         // Reverse.
         REVERSE_BANK_LEFT_1: "reverseBankLeft1",
         REVERSE_BANK_RIGHT_1: "reverseBankRight1",
         REVERSE_STRAIGHT_1: "reverseStraight1",

         // Segnor's loop.
         SEGNORS_LOOP_LEFT_2: "segnorsLoopLeft2",
         SEGNORS_LOOP_LEFT_3: "segnorsLoopLeft3",
         SEGNORS_LOOP_RIGHT_2: "segnorsLoopRight2",
         SEGNORS_LOOP_RIGHT_3: "segnorsLoopRight3",

         // Straight.
         STRAIGHT_0: "straight0",
         STRAIGHT_1: "straight1",
         STRAIGHT_2: "straight2",
         STRAIGHT_3: "straight3",
         STRAIGHT_4: "straight4",
         STRAIGHT_5: "straight5",

         // Tallon Roll.
         TALLON_ROLL_LEFT_2: "tallonRollLeft2",
         TALLON_ROLL_LEFT_3: "tallonRollLeft3",
         TALLON_ROLL_RIGHT_2: "tallonRollRight2",
         TALLON_ROLL_RIGHT_3: "tallonRollRight3",

         // Turn.
         TURN_LEFT_1: "turnLeft1",
         TURN_LEFT_2: "turnLeft2",
         TURN_LEFT_3: "turnLeft3",
         TURN_RIGHT_1: "turnRight1",
         TURN_RIGHT_2: "turnRight2",
         TURN_RIGHT_3: "turnRight3",

         // Bank with energy.
         BANK_LEFT_1_2: "bankLeft1_2",
         BANK_LEFT_1_3: "bankLeft1_3",
         BANK_LEFT_2_1: "bankLeft2_1",
         BANK_LEFT_2_2: "bankLeft2_2",
         BANK_RIGHT_1_2: "bankRight1_2",
         BANK_RIGHT_1_3: "bankRight1_3",
         BANK_RIGHT_2_1: "bankRight2_1",
         BANK_RIGHT_2_2: "bankRight2_2",

         // Straight with energy.
         STRAIGHT_1_3: "straight1_3",
         STRAIGHT_2_2: "straight2_2",
         STRAIGHT_2_3: "straight2_3",
         STRAIGHT_3_1: "straight3_1",
         STRAIGHT_3_2: "straight3_2",
         STRAIGHT_4_0: "straight4_0",
         STRAIGHT_4_1: "straight4_1",
         STRAIGHT_4_2: "straight4_2",

         properties:
         {
            "bankLeft1":
            {
               bearingKey: Bearing.BANK_LEFT,
               speed: 1,
               radius: 82.6,
               key: "bankLeft1",
            },
            "bankLeft2":
            {
               bearingKey: Bearing.BANK_LEFT,
               speed: 2,
               radius: 127.0,
               key: "bankLeft2",
            },
            "bankLeft3":
            {
               bearingKey: Bearing.BANK_LEFT,
               speed: 3,
               radius: 177.8,
               key: "bankLeft3",
            },
            "bankRight1":
            {
               bearingKey: Bearing.BANK_RIGHT,
               speed: 1,
               radius: 82.6,
               key: "bankRight1",
            },
            "bankRight2":
            {
               bearingKey: Bearing.BANK_RIGHT,
               speed: 2,
               radius: 127.0,
               key: "bankRight2",
            },
            "bankRight3":
            {
               bearingKey: Bearing.BANK_RIGHT,
               speed: 3,
               radius: 177.8,
               key: "bankRight3",
            },
            "barrelRollLeft1":
            {
               bearingKey: Bearing.BARREL_ROLL_LEFT,
               speed: 1,
               key: "barrelRollLeft1",
            },
            "barrelRollLeft2":
            {
               bearingKey: Bearing.BARREL_ROLL_LEFT,
               speed: 2,
               key: "barrelRollLeft2",
            },
            "barrelRollRight1":
            {
               bearingKey: Bearing.BARREL_ROLL_RIGHT,
               speed: 1,
               key: "barrelRollRight1",
            },
            "barrelRollRight2":
            {
               bearingKey: Bearing.BARREL_ROLL_RIGHT,
               speed: 2,
               key: "barrelRollRight2",
            },
            "koiogranTurn1":
            {
               bearingKey: Bearing.KOIOGRAN_TURN,
               speed: 1,
               key: "koiogranTurn1",
            },
            "koiogranTurn2":
            {
               bearingKey: Bearing.KOIOGRAN_TURN,
               speed: 2,
               key: "koiogranTurn2",
            },
            "koiogranTurn3":
            {
               bearingKey: Bearing.KOIOGRAN_TURN,
               speed: 3,
               key: "koiogranTurn3",
            },
            "koiogranTurn4":
            {
               bearingKey: Bearing.KOIOGRAN_TURN,
               speed: 4,
               key: "koiogranTurn4",
            },
            "koiogranTurn5":
            {
               bearingKey: Bearing.KOIOGRAN_TURN,
               speed: 5,
               key: "koiogranTurn5",
            },
            "reverseBankLeft1":
            {
               bearingKey: Bearing.BANK_LEFT,
               speed: -1,
               radius: 82.6,
               key: "reverseBankLeft1",
            },
            "reverseBankRight1":
            {
               bearingKey: Bearing.BANK_RIGHT,
               speed: -1,
               radius: 82.6,
               key: "reverseBankRight1",
            },
            "reverseStraight1":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: -1,
               key: "reverseStraight1",
            },
            "segnorsLoopLeft2":
            {
               bearingKey: Bearing.SEGNORS_LOOP_LEFT,
               speed: 2,
               radius: 127.0,
               key: "segnorsLoopLeft2",
            },
            "segnorsLoopLeft3":
            {
               bearingKey: Bearing.SEGNORS_LOOP_LEFT,
               speed: 3,
               radius: 177.8,
               key: "segnorsLoopLeft3",
            },
            "segnorsLoopRight2":
            {
               bearingKey: Bearing.SEGNORS_LOOP_RIGHT,
               speed: 2,
               radius: 127.0,
               key: "segnorsLoopRight2",
            },
            "segnorsLoopRight3":
            {
               bearingKey: Bearing.SEGNORS_LOOP_RIGHT,
               speed: 3,
               radius: 177.8,
               key: "segnorsLoopRight3",
            },
            "straight0":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 0,
               key: "straight0",
            },
            "straight1":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 1,
               key: "straight1",
            },
            "straight2":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 2,
               key: "straight2",
            },
            "straight3":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 3,
               key: "straight3",
            },
            "straight4":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 4,
               key: "straight4",
            },
            "straight5":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 5,
               key: "straight5",
            },
            "tallonRollLeft2":
            {
               bearingKey: Bearing.TALLON_ROLL_LEFT,
               speed: 2,
               radius: 62.2,
               key: "tallonRollLeft2",
            },
            "tallonRollLeft3":
            {
               bearingKey: Bearing.TALLON_ROLL_LEFT,
               speed: 3,
               radius: 88.9,
               key: "tallonRollLeft3",
            },
            "tallonRollRight2":
            {
               bearingKey: Bearing.TALLON_ROLL_RIGHT,
               speed: 2,
               radius: 62.2,
               key: "tallonRollRight2",
            },
            "tallonRollRight3":
            {
               bearingKey: Bearing.TALLON_ROLL_RIGHT,
               speed: 3,
               radius: 88.9,
               key: "tallonRollRight3",
            },
            "turnLeft1":
            {
               bearingKey: Bearing.TURN_LEFT,
               speed: 1,
               radius: 34.3,
               key: "turnLeft1",
            },
            "turnLeft2":
            {
               bearingKey: Bearing.TURN_LEFT,
               speed: 2,
               radius: 62.2,
               key: "turnLeft2",
            },
            "turnLeft3":
            {
               bearingKey: Bearing.TURN_LEFT,
               speed: 3,
               radius: 88.9,
               key: "turnLeft3",
            },
            "turnRight1":
            {
               bearingKey: Bearing.TURN_RIGHT,
               speed: 1,
               radius: 34.3,
               key: "turnRight1",
            },
            "turnRight2":
            {
               bearingKey: Bearing.TURN_RIGHT,
               speed: 2,
               radius: 62.2,
               key: "turnRight2",
            },
            "turnRight3":
            {
               bearingKey: Bearing.TURN_RIGHT,
               speed: 3,
               radius: 88.9,
               key: "turnRight3",
            },

            ////////////////////////////////////////////////////////////////////
            // Bank with energy.
            "bankLeft1_2":
            {
               bearingKey: Bearing.HUGE_BANK_LEFT,
               speed: 1,
               energy: 2,
               radius: 82.6,
               key: "bankLeft1_2",
            },
            "bankLeft1_3":
            {
               bearingKey: Bearing.HUGE_BANK_LEFT,
               speed: 1,
               energy: 3,
               radius: 82.6,
               key: "bankLeft1_3",
            },
            "bankLeft2_1":
            {
               bearingKey: Bearing.HUGE_BANK_LEFT,
               speed: 2,
               energy: 1,
               radius: 127.0,
               key: "bankLeft2_1",
            },
            "bankLeft2_2":
            {
               bearingKey: Bearing.HUGE_BANK_LEFT,
               speed: 2,
               energy: 2,
               radius: 127.0,
               key: "bankLeft2_2",
            },
            "bankRight1_2":
            {
               bearingKey: Bearing.HUGE_BANK_RIGHT,
               speed: 1,
               energy: 2,
               radius: 82.6,
               key: "bankRight1_2",
            },
            "bankRight1_3":
            {
               bearingKey: Bearing.HUGE_BANK_RIGHT,
               speed: 1,
               energy: 3,
               radius: 82.6,
               key: "bankRight1_3",
            },
            "bankRight2_1":
            {
               bearingKey: Bearing.HUGE_BANK_RIGHT,
               speed: 2,
               energy: 1,
               radius: 127.0,
               key: "bankRight2_1",
            },
            "bankRight2_2":
            {
               bearingKey: Bearing.HUGE_BANK_RIGHT,
               speed: 2,
               energy: 2,
               radius: 127.0,
               key: "bankRight2_2",
            },

            ////////////////////////////////////////////////////////////////////
            // Straight with energy.
            "straight1_3":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 1,
               energy: 3,
               key: "straight1_3",
            },
            "straight2_2":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 2,
               energy: 2,
               key: "straight2_2",
            },
            "straight2_3":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 2,
               energy: 3,
               key: "straight2_3",
            },
            "straight3_1":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 3,
               energy: 1,
               key: "straight3_1",
            },
            "straight3_2":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 3,
               energy: 2,
               key: "straight3_2",
            },
            "straight4_0":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 4,
               energy: 0,
               key: "straight4_0",
            },
            "straight4_1":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 4,
               energy: 1,
               key: "straight4_1",
            },
            "straight4_2":
            {
               bearingKey: Bearing.STRAIGHT,
               speed: 4,
               energy: 2,
               key: "straight4_2",
            },
         },
      };

      BasicManeuver.keys = function()
      {
         return Object.keys(BasicManeuver.properties);
      };

      BasicManeuver.values = function()
      {
         return Object.values(BasicManeuver.properties);
      };

      BasicManeuver.keys().forEach(function(maneuverKey)
      {
         var maneuver = BasicManeuver.properties[maneuverKey];
         maneuver.bearing = Bearing.properties[maneuver.bearingKey];
      });

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      BasicManeuver.find = function(bearingKey, speed)
      {
         InputValidator.validateNotNull("bearingKey", bearingKey);
         InputValidator.validateIsNumber("speed", speed);

         LOGGER.info("find() " + bearingKey + " " + speed);

         var answer;

         if (speed === 0)
         {
            answer = BasicManeuver.STRAIGHT_0;
         }
         else
         {
            var keys = BasicManeuver.keys();

            for (var i = 0; i < keys.length; i++)
            {
               var maneuverKey = keys[i];
               var maneuver = BasicManeuver.properties[maneuverKey];

               if (maneuver.bearingKey === bearingKey && maneuver.speed === speed)
               {
                  LOGGER.info("maneuverKey = " + maneuverKey);
                  answer = maneuverKey;
                  break;
               }
            }
         }

         return answer;
      };

      BasicManeuver.toString = function(maneuverKey)
      {
         var answer = "BasicManeuver";

         if (maneuverKey)
         {
            var maneuver = BasicManeuver.properties[maneuverKey];
            var bearingName = maneuver.bearing.name;
            var speed = maneuver.speed;

            answer = bearingName + " " + speed;
         }

         return answer;
      };

      if (Object.freeze)
      {
         Object.freeze(BasicManeuver);
      }

      return BasicManeuver;
   });
