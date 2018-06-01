/*
 * Provides an enumeration of maneuvers. <p> Small ship base is 40mm x 40mm. </p>
 * <p> Bearing straight, speed one maneuver is 40mm long. Other straight maneuvers
 * are multiples of this. </p>
 */
import InputValidator from "../utility/InputValidator.js";

import BasicManeuver from "./BasicManeuver.js";
import Bearing from "./Bearing.js";
import Difficulty from "./Difficulty.js";

var Maneuver = {
   // Bank.
   BANK_LEFT_1_EASY: "bankLeft1Easy",
   BANK_LEFT_1_STANDARD: "bankLeft1Standard",
   BANK_LEFT_2_EASY: "bankLeft2Easy",
   BANK_LEFT_2_STANDARD: "bankLeft2Standard",
   BANK_LEFT_3_EASY: "bankLeft3Easy",
   BANK_LEFT_3_HARD: "bankLeft3Hard",
   BANK_LEFT_3_STANDARD: "bankLeft3Standard",
   BANK_RIGHT_1_EASY: "bankRight1Easy",
   BANK_RIGHT_1_STANDARD: "bankRight1Standard",
   BANK_RIGHT_2_EASY: "bankRight2Easy",
   BANK_RIGHT_2_STANDARD: "bankRight2Standard",
   BANK_RIGHT_3_EASY: "bankRight3Easy",
   BANK_RIGHT_3_HARD: "bankRight3Hard",
   BANK_RIGHT_3_STANDARD: "bankRight3Standard",

   // Barrel Roll.
   BARREL_ROLL_LEFT_1_STANDARD: "barrelRollLeft1Standard",
   BARREL_ROLL_LEFT_2_STANDARD: "barrelRollLeft2Standard",
   BARREL_ROLL_RIGHT_1_STANDARD: "barrelRollRight1Standard",
   BARREL_ROLL_RIGHT_2_STANDARD: "barrelRollRight2Standard",

   // Koiogran turn.
   KOIOGRAN_TURN_1_EASY: "koiogranTurn1Easy",
   KOIOGRAN_TURN_1_HARD: "koiogranTurn1Hard",
   KOIOGRAN_TURN_1_STANDARD: "koiogranTurn1Standard",
   KOIOGRAN_TURN_2_EASY: "koiogranTurn2Easy",
   KOIOGRAN_TURN_2_HARD: "koiogranTurn2Hard",
   KOIOGRAN_TURN_2_STANDARD: "koiogranTurn2Standard",
   KOIOGRAN_TURN_3_EASY: "koiogranTurn3Easy",
   KOIOGRAN_TURN_3_HARD: "koiogranTurn3Hard",
   KOIOGRAN_TURN_3_STANDARD: "koiogranTurn3Standard",
   KOIOGRAN_TURN_4_EASY: "koiogranTurn4Easy",
   KOIOGRAN_TURN_4_HARD: "koiogranTurn4Hard",
   KOIOGRAN_TURN_4_STANDARD: "koiogranTurn4Standard",
   KOIOGRAN_TURN_5_EASY: "koiogranTurn5Easy",
   KOIOGRAN_TURN_5_HARD: "koiogranTurn5Hard",
   KOIOGRAN_TURN_5_STANDARD: "koiogranTurn5Standard",

   // Reverse.
   REVERSE_BANK_LEFT_1_HARD: "reverseBankLeft1Hard",
   REVERSE_BANK_RIGHT_1_HARD: "reverseBankRight1Hard",
   REVERSE_STRAIGHT_1_HARD: "reverseStraight1Hard",

   // Segnor's loop.
   SEGNORS_LOOP_LEFT_2_HARD: "segnorsLoopLeft2Hard",
   SEGNORS_LOOP_LEFT_2_STANDARD: "segnorsLoopLeft2Standard",
   SEGNORS_LOOP_LEFT_3_HARD: "segnorsLoopLeft3Hard",
   SEGNORS_LOOP_RIGHT_2_HARD: "segnorsLoopRight2Hard",
   SEGNORS_LOOP_RIGHT_3_HARD: "segnorsLoopRight3Hard",

   // Stationary.
   STATIONARY_0_HARD: "stationary0Hard",
   STATIONARY_0_STANDARD: "stationary0Standard",

   // Straight.
   STRAIGHT_1_EASY: "straight1Easy",
   STRAIGHT_1_STANDARD: "straight1Standard",
   STRAIGHT_2_EASY: "straight2Easy",
   STRAIGHT_2_STANDARD: "straight2Standard",
   STRAIGHT_3_EASY: "straight3Easy",
   STRAIGHT_3_STANDARD: "straight3Standard",
   STRAIGHT_4_EASY: "straight4Easy",
   STRAIGHT_4_HARD: "straight4Hard",
   STRAIGHT_4_STANDARD: "straight4Standard",
   STRAIGHT_5_EASY: "straight5Easy",
   STRAIGHT_5_STANDARD: "straight5Standard",
   STRAIGHT_5_HARD: "straight5Hard",

   // Tallon Roll.
   TALLON_ROLL_LEFT_2_HARD: "tallonRollLeft2Hard",
   TALLON_ROLL_LEFT_2_STANDARD: "tallonRollLeft2Standard",
   TALLON_ROLL_LEFT_3_HARD: "tallonRollLeft3Hard",
   TALLON_ROLL_LEFT_3_STANDARD: "tallonRollLeft3Standard",
   TALLON_ROLL_RIGHT_2_HARD: "tallonRollRight2Hard",
   TALLON_ROLL_RIGHT_2_STANDARD: "tallonRollRight2Standard",
   TALLON_ROLL_RIGHT_3_HARD: "tallonRollRight3Hard",
   TALLON_ROLL_RIGHT_3_STANDARD: "tallonRollRight3Standard",

   // Turn.
   TURN_LEFT_1_EASY: "turnLeft1Easy",
   TURN_LEFT_1_HARD: "turnLeft1Hard",
   TURN_LEFT_1_STANDARD: "turnLeft1Standard",
   TURN_LEFT_2_EASY: "turnLeft2Easy",
   TURN_LEFT_2_HARD: "turnLeft2Hard",
   TURN_LEFT_2_STANDARD: "turnLeft2Standard",
   TURN_LEFT_3_EASY: "turnLeft3Easy",
   TURN_LEFT_3_HARD: "turnLeft3Hard",
   TURN_LEFT_3_STANDARD: "turnLeft3Standard",
   TURN_RIGHT_1_EASY: "turnRight1Easy",
   TURN_RIGHT_1_HARD: "turnRight1Hard",
   TURN_RIGHT_1_STANDARD: "turnRight1Standard",
   TURN_RIGHT_2_EASY: "turnRight2Easy",
   TURN_RIGHT_2_HARD: "turnRight2Hard",
   TURN_RIGHT_2_STANDARD: "turnRight2Standard",
   TURN_RIGHT_3_EASY: "turnRight3Easy",
   TURN_RIGHT_3_HARD: "turnRight3Hard",
   TURN_RIGHT_3_STANDARD: "turnRight3Standard",

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
      "bankLeft1Easy":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_1,
         difficultyKey: Difficulty.EASY,
         key: "bankLeft1Easy",
      },
      "bankLeft1Standard":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_1,
         difficultyKey: Difficulty.STANDARD,
         key: "bankLeft1Standard",
      },
      "bankLeft2Easy":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_2,
         difficultyKey: Difficulty.EASY,
         key: "bankLeft2Easy",
      },
      "bankLeft2Standard":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "bankLeft2Standard",
      },
      "bankLeft3Easy":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_3,
         difficultyKey: Difficulty.EASY,
         key: "bankLeft3Easy",
      },
      "bankLeft3Hard":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_3,
         difficultyKey: Difficulty.HARD,
         key: "bankLeft3Hard",
      },
      "bankLeft3Standard":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_3,
         difficultyKey: Difficulty.STANDARD,
         key: "bankLeft3Standard",
      },
      "bankRight1Easy":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_1,
         difficultyKey: Difficulty.EASY,
         key: "bankRight1Easy",
      },
      "bankRight1Standard":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_1,
         difficultyKey: Difficulty.STANDARD,
         key: "bankRight1Standard",
      },
      "bankRight2Easy":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_2,
         difficultyKey: Difficulty.EASY,
         key: "bankRight2Easy",
      },
      "bankRight2Standard":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "bankRight2Standard",
      },
      "bankRight3Easy":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_3,
         difficultyKey: Difficulty.EASY,
         key: "bankRight3Easy",
      },
      "bankRight3Hard":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_3,
         difficultyKey: Difficulty.HARD,
         key: "bankRight3Hard",
      },
      "bankRight3Standard":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_3,
         difficultyKey: Difficulty.STANDARD,
         key: "bankRight3Standard",
      },
      "barrelRollLeft1Standard":
      {
         basicManeuverKey: BasicManeuver.BARREL_ROLL_LEFT_1,
         difficultyKey: Difficulty.STANDARD,
         key: "barrelRollLeft1Standard",
      },
      "barrelRollLeft2Standard":
      {
         basicManeuverKey: BasicManeuver.BARREL_ROLL_LEFT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "barrelRollLeft2Standard",
      },
      "barrelRollRight1Standard":
      {
         basicManeuverKey: BasicManeuver.BARREL_ROLL_RIGHT_1,
         difficultyKey: Difficulty.STANDARD,
         key: "barrelRollRight1Standard",
      },
      "barrelRollRight2Standard":
      {
         basicManeuverKey: BasicManeuver.BARREL_ROLL_RIGHT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "barrelRollRight2Standard",
      },
      "koiogranTurn1Easy":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_1,
         difficultyKey: Difficulty.EASY,
         key: "koiogranTurn1Easy",
      },
      "koiogranTurn1Hard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_1,
         difficultyKey: Difficulty.HARD,
         key: "koiogranTurn1Hard",
      },
      "koiogranTurn1Standard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_1,
         difficultyKey: Difficulty.STANDARD,
         key: "koiogranTurn1Standard",
      },
      "koiogranTurn2Easy":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_2,
         difficultyKey: Difficulty.EASY,
         key: "koiogranTurn2Easy",
      },
      "koiogranTurn2Hard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_2,
         difficultyKey: Difficulty.HARD,
         key: "koiogranTurn2Hard",
      },
      "koiogranTurn2Standard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_2,
         difficultyKey: Difficulty.STANDARD,
         key: "koiogranTurn2Standard",
      },
      "koiogranTurn3Easy":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_3,
         difficultyKey: Difficulty.EASY,
         key: "koiogranTurn3Easy",
      },
      "koiogranTurn3Hard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_3,
         difficultyKey: Difficulty.HARD,
         key: "koiogranTurn3Hard",
      },
      "koiogranTurn3Standard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_3,
         difficultyKey: Difficulty.STANDARD,
         key: "koiogranTurn3Standard",
      },
      "koiogranTurn4Easy":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_4,
         difficultyKey: Difficulty.EASY,
         key: "koiogranTurn4Easy",
      },
      "koiogranTurn4Hard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_4,
         difficultyKey: Difficulty.HARD,
         key: "koiogranTurn4Hard",
      },
      "koiogranTurn4Standard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_4,
         difficultyKey: Difficulty.STANDARD,
         key: "koiogranTurn4Standard",
      },
      "koiogranTurn5Easy":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_5,
         difficultyKey: Difficulty.EASY,
         key: "koiogranTurn5Easy",
      },
      "koiogranTurn5Hard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_5,
         difficultyKey: Difficulty.HARD,
         key: "koiogranTurn5Hard",
      },
      "koiogranTurn5Standard":
      {
         basicManeuverKey: BasicManeuver.KOIOGRAN_TURN_5,
         difficultyKey: Difficulty.STANDARD,
         key: "koiogranTurn5Standard",
      },
      "reverseBankLeft1Hard":
      {
         basicManeuverKey: BasicManeuver.REVERSE_BANK_LEFT_1,
         difficultyKey: Difficulty.HARD,
         key: "reverseBankLeft1Hard",
      },
      "reverseBankRight1Hard":
      {
         basicManeuverKey: BasicManeuver.REVERSE_BANK_RIGHT_1,
         difficultyKey: Difficulty.HARD,
         key: "reverseBankRight1Hard",
      },
      "reverseStraight1Hard":
      {
         basicManeuverKey: BasicManeuver.REVERSE_STRAIGHT_1,
         difficultyKey: Difficulty.HARD,
         key: "reverseStraight1Hard",
      },
      "segnorsLoopLeft2Hard":
      {
         basicManeuverKey: BasicManeuver.SEGNORS_LOOP_LEFT_2,
         difficultyKey: Difficulty.HARD,
         key: "segnorsLoopLeft2Hard",
      },
      "segnorsLoopLeft2Standard":
      {
         basicManeuverKey: BasicManeuver.SEGNORS_LOOP_LEFT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "segnorsLoopLeft2Standard",
      },
      "segnorsLoopLeft3Hard":
      {
         basicManeuverKey: BasicManeuver.SEGNORS_LOOP_LEFT_3,
         difficultyKey: Difficulty.HARD,
         key: "segnorsLoopLeft3Hard",
      },
      "segnorsLoopRight2Hard":
      {
         basicManeuverKey: BasicManeuver.SEGNORS_LOOP_RIGHT_2,
         difficultyKey: Difficulty.HARD,
         key: "segnorsLoopRight2Hard",
      },
      "segnorsLoopRight3Hard":
      {
         basicManeuverKey: BasicManeuver.SEGNORS_LOOP_RIGHT_3,
         difficultyKey: Difficulty.HARD,
         key: "segnorsLoopRight3Hard",
      },
      "stationary0Hard":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_0,
         difficultyKey: Difficulty.HARD,
         key: "stationary0Hard",
      },
      "stationary0Standard":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_0,
         difficultyKey: Difficulty.STANDARD,
         key: "stationary0Standard",
      },
      "straight1Easy":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_1,
         difficultyKey: Difficulty.EASY,
         key: "straight1Easy",
      },
      "straight1Standard":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_1,
         difficultyKey: Difficulty.STANDARD,
         key: "straight1Standard",
      },
      "straight2Easy":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_2,
         difficultyKey: Difficulty.EASY,
         key: "straight2Easy",
      },
      "straight2Standard":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "straight2Standard",
      },
      "straight3Easy":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_3,
         difficultyKey: Difficulty.EASY,
         key: "straight3Easy",
      },
      "straight3Standard":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_3,
         difficultyKey: Difficulty.STANDARD,
         key: "straight3Standard",
      },
      "straight4Easy":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_4,
         difficultyKey: Difficulty.EASY,
         key: "straight4Easy",
      },
      "straight4Hard":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_4,
         difficultyKey: Difficulty.HARD,
         key: "straight4Hard",
      },
      "straight4Standard":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_4,
         difficultyKey: Difficulty.STANDARD,
         key: "straight4Standard",
      },
      "straight5Easy":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_5,
         difficultyKey: Difficulty.EASY,
         key: "straight5Easy",
      },
      "straight5Standard":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_5,
         difficultyKey: Difficulty.STANDARD,
         key: "straight5Standard",
      },
      "straight5Hard":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_5,
         difficultyKey: Difficulty.HARD,
         key: "straight5Hard",
      },
      "tallonRollLeft2Hard":
      {
         basicManeuverKey: BasicManeuver.TALLON_ROLL_LEFT_2,
         difficultyKey: Difficulty.HARD,
         key: "tallonRollLeft2Hard",
      },
      "tallonRollLeft2Standard":
      {
         basicManeuverKey: BasicManeuver.TALLON_ROLL_LEFT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "tallonRollLeft2Standard",
      },
      "tallonRollLeft3Hard":
      {
         basicManeuverKey: BasicManeuver.TALLON_ROLL_LEFT_3,
         difficultyKey: Difficulty.HARD,
         key: "tallonRollLeft3Hard",
      },
      "tallonRollLeft3Standard":
      {
         basicManeuverKey: BasicManeuver.TALLON_ROLL_LEFT_3,
         difficultyKey: Difficulty.STANDARD,
         key: "tallonRollLeft3Standard",
      },
      "tallonRollRight2Hard":
      {
         basicManeuverKey: BasicManeuver.TALLON_ROLL_RIGHT_2,
         difficultyKey: Difficulty.HARD,
         key: "tallonRollRight2Hard",
      },
      "tallonRollRight2Standard":
      {
         basicManeuverKey: BasicManeuver.TALLON_ROLL_RIGHT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "tallonRollRight2Standard",
      },
      "tallonRollRight3Hard":
      {
         basicManeuverKey: BasicManeuver.TALLON_ROLL_RIGHT_3,
         difficultyKey: Difficulty.HARD,
         key: "tallonRollRight3Hard",
      },
      "tallonRollRight3Standard":
      {
         basicManeuverKey: BasicManeuver.TALLON_ROLL_RIGHT_3,
         difficultyKey: Difficulty.STANDARD,
         key: "tallonRollRight3Standard",
      },
      "turnLeft1Easy":
      {
         basicManeuverKey: BasicManeuver.TURN_LEFT_1,
         difficultyKey: Difficulty.EASY,
         key: "turnLeft1Easy",
      },
      "turnLeft1Hard":
      {
         basicManeuverKey: BasicManeuver.TURN_LEFT_1,
         difficultyKey: Difficulty.HARD,
         key: "turnLeft1Hard",
      },
      "turnLeft1Standard":
      {
         basicManeuverKey: BasicManeuver.TURN_LEFT_1,
         difficultyKey: Difficulty.STANDARD,
         key: "turnLeft1Standard",
      },
      "turnLeft2Easy":
      {
         basicManeuverKey: BasicManeuver.TURN_LEFT_2,
         difficultyKey: Difficulty.EASY,
         key: "turnLeft2Easy",
      },
      "turnLeft2Hard":
      {
         basicManeuverKey: BasicManeuver.TURN_LEFT_2,
         difficultyKey: Difficulty.HARD,
         key: "turnLeft2Hard",
      },
      "turnLeft2Standard":
      {
         basicManeuverKey: BasicManeuver.TURN_LEFT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "turnLeft2Standard",
      },
      "turnLeft3Easy":
      {
         basicManeuverKey: BasicManeuver.TURN_LEFT_3,
         difficultyKey: Difficulty.EASY,
         key: "turnLeft3Easy",
      },
      "turnLeft3Hard":
      {
         basicManeuverKey: BasicManeuver.TURN_LEFT_3,
         difficultyKey: Difficulty.HARD,
         key: "turnLeft3Hard",
      },
      "turnLeft3Standard":
      {
         basicManeuverKey: BasicManeuver.TURN_LEFT_3,
         difficultyKey: Difficulty.STANDARD,
         key: "turnLeft3Standard",
      },
      "turnRight1Easy":
      {
         basicManeuverKey: BasicManeuver.TURN_RIGHT_1,
         difficultyKey: Difficulty.EASY,
         key: "turnRight1Easy",
      },
      "turnRight1Hard":
      {
         basicManeuverKey: BasicManeuver.TURN_RIGHT_1,
         difficultyKey: Difficulty.HARD,
         key: "turnRight1Hard",
      },
      "turnRight1Standard":
      {
         basicManeuverKey: BasicManeuver.TURN_RIGHT_1,
         difficultyKey: Difficulty.STANDARD,
         key: "turnRight1Standard",
      },
      "turnRight2Easy":
      {
         basicManeuverKey: BasicManeuver.TURN_RIGHT_2,
         difficultyKey: Difficulty.EASY,
         key: "turnRight2Easy",
      },
      "turnRight2Hard":
      {
         basicManeuverKey: BasicManeuver.TURN_RIGHT_2,
         difficultyKey: Difficulty.HARD,
         key: "turnRight2Hard",
      },
      "turnRight2Standard":
      {
         basicManeuverKey: BasicManeuver.TURN_RIGHT_2,
         difficultyKey: Difficulty.STANDARD,
         key: "turnRight2Standard",
      },
      "turnRight3Easy":
      {
         basicManeuverKey: BasicManeuver.TURN_RIGHT_3,
         difficultyKey: Difficulty.EASY,
         key: "turnRight3Easy",
      },
      "turnRight3Hard":
      {
         basicManeuverKey: BasicManeuver.TURN_RIGHT_3,
         difficultyKey: Difficulty.HARD,
         key: "turnRight3Hard",
      },
      "turnRight3Standard":
      {
         basicManeuverKey: BasicManeuver.TURN_RIGHT_3,
         difficultyKey: Difficulty.STANDARD,
         key: "turnRight3Standard",
      },

      ////////////////////////////////////////////////////////////////////
      // Bank with energy.
      "bankLeft1_2":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_1_2,
         difficultyKey: Difficulty.STANDARD,
         key: "bankLeft1_2",
      },
      "bankLeft1_3":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_1_3,
         difficultyKey: Difficulty.STANDARD,
         key: "bankLeft1_3",
      },
      "bankLeft2_1":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_2_1,
         difficultyKey: Difficulty.STANDARD,
         key: "bankLeft2_1",
      },
      "bankLeft2_2":
      {
         basicManeuverKey: BasicManeuver.BANK_LEFT_2_2,
         difficultyKey: Difficulty.STANDARD,
         key: "bankLeft2_2",
      },
      "bankRight1_2":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_1_2,
         difficultyKey: Difficulty.STANDARD,
         key: "bankRight1_2",
      },
      "bankRight1_3":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_1_3,
         difficultyKey: Difficulty.STANDARD,
         key: "bankRight1_3",
      },
      "bankRight2_1":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_2_1,
         difficultyKey: Difficulty.STANDARD,
         key: "bankRight2_1",
      },
      "bankRight2_2":
      {
         basicManeuverKey: BasicManeuver.BANK_RIGHT_2_2,
         difficultyKey: Difficulty.STANDARD,
         key: "bankRight2_2",
      },

      ////////////////////////////////////////////////////////////////////
      // Straight with energy.
      "straight1_3":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_1_3,
         difficultyKey: Difficulty.STANDARD,
         key: "straight1_3",
      },
      "straight2_2":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_2_2,
         difficultyKey: Difficulty.STANDARD,
         key: "straight2_2",
      },
      "straight2_3":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_2_3,
         difficultyKey: Difficulty.STANDARD,
         key: "straight2_3",
      },
      "straight3_1":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_3_1,
         difficultyKey: Difficulty.STANDARD,
         key: "straight3_1",
      },
      "straight3_2":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_3_2,
         difficultyKey: Difficulty.STANDARD,
         key: "straight3_2",
      },
      "straight4_0":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_4_0,
         difficultyKey: Difficulty.STANDARD,
         key: "straight4_0",
      },
      "straight4_1":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_4_1,
         difficultyKey: Difficulty.STANDARD,
         key: "straight4_1",
      },
      "straight4_2":
      {
         basicManeuverKey: BasicManeuver.STRAIGHT_4_2,
         difficultyKey: Difficulty.STANDARD,
         key: "straight4_2",
      },
   },
};

Maneuver.keys = function()
{
   return Object.keys(Maneuver.properties);
};

Maneuver.values = function()
{
   return Object.values(Maneuver.properties);
};

Maneuver.keys().forEach(function(maneuverKey)
{
   var maneuver = Maneuver.properties[maneuverKey];
   maneuver.basicManeuver = BasicManeuver.properties[maneuver.basicManeuverKey];
   maneuver.difficulty = Difficulty.properties[maneuver.difficultyKey];

   maneuver.bearingKey = maneuver.basicManeuver.bearingKey;
   maneuver.bearing = Bearing.properties[maneuver.bearingKey];
   maneuver.energy = maneuver.basicManeuver.energy;
   maneuver.radius = maneuver.basicManeuver.radius;
   maneuver.speed = maneuver.basicManeuver.speed;
});

//////////////////////////////////////////////////////////////////////////
// Utility methods.

Maneuver.find = function(bearingKey, speed, difficultyKey)
{
   InputValidator.validateNotNull("bearingKey", bearingKey);
   InputValidator.validateIsNumber("speed", speed);
   InputValidator.validateIsString("difficultyKey", difficultyKey);

   var answer;

   var keys = Maneuver.keys();

   for (var i = 0; i < keys.length; i++)
   {
      var maneuverKey = keys[i];
      var maneuver = Maneuver.properties[maneuverKey];

      if ((maneuver.bearingKey === bearingKey) && (maneuver.speed === speed) && (maneuver.difficultyKey === difficultyKey))
      {
         answer = maneuverKey;
         break;
      }
   }

   return answer;
};

Maneuver.toString = function(maneuverKey)
{
   var answer = "Maneuver";

   if (maneuverKey)
   {
      var maneuver = Maneuver.properties[maneuverKey];
      var bearingName = maneuver.bearing.name;
      var speed = maneuver.speed;
      var difficultyName = maneuver.difficulty.name;

      answer = bearingName + " " + speed + " " + difficultyName;
   }

   return answer;
};

if (Object.freeze)
{
   Object.freeze(Maneuver);
}

export default Maneuver;