"use strict";

define(["qunit", "accessory/xwingDataConverter/ShipConverter"],
   function(QUnit, ShipConverter)
   {
      QUnit.module("ShipConverter");

      var FIRESPRAY_31 = {
         "name": "Firespray-31",
         "maneuvers": [[0, 0, 0, 0, 0, 0],
           [0, 2, 2, 2, 0, 0],
           [1, 1, 2, 1, 1, 0],
           [1, 1, 1, 1, 1, 3],
           [0, 0, 1, 0, 0, 3]],
         "firing_arcs": ["Auxiliary Rear", "Front"],
      };

      var X_WING = {
         "name": "X-wing",
         "maneuvers": [[0, 0, 0, 0, 0, 0],
           [0, 2, 2, 2, 0, 0],
           [1, 1, 2, 1, 1, 0],
           [1, 1, 1, 1, 1, 0],
           [0, 0, 1, 0, 0, 3]],
         "firing_arcs": ["Front"],
      };

      var YV_666 = {
         "name": "YV-666",
         "maneuvers": [[0, 0, 3, 0, 0, 0],
           [0, 2, 2, 2, 0, 0],
           [3, 1, 2, 1, 3, 0],
           [1, 1, 2, 1, 1, 0],
           [0, 0, 1, 0, 0, 0]],
         "firing_arcs": ["Auxiliary 180", "Front"],
      };

      QUnit.test("determineAuxiliaryFiringArc()", function(assert)
      {
         // Run / Verify.
         assert.equal(ShipConverter.determineAuxiliaryFiringArc(X_WING), undefined);
         assert.equal(ShipConverter.determineAuxiliaryFiringArc(FIRESPRAY_31), "FiringArc.AFT");
         assert.equal(ShipConverter.determineAuxiliaryFiringArc(YV_666), "FiringArc.FULL_AFT");
      });

      QUnit.test("determineManeuverKeys() Firespray-31", function(assert)
      {
         // Run.
         var result = ShipConverter.determineManeuverKeys(FIRESPRAY_31);

         // Verify.
         assert.ok(result);
         assert.equal(result, "Maneuver.BANK_LEFT_1_EASY, Maneuver.STRAIGHT_1_EASY, Maneuver.BANK_RIGHT_1_EASY,<br/> Maneuver.TURN_LEFT_2_STANDARD, Maneuver.BANK_LEFT_2_STANDARD, Maneuver.STRAIGHT_2_EASY, Maneuver.BANK_RIGHT_2_STANDARD, Maneuver.TURN_RIGHT_2_STANDARD,<br/> Maneuver.TURN_LEFT_3_STANDARD, Maneuver.BANK_LEFT_3_STANDARD, Maneuver.STRAIGHT_3_STANDARD, Maneuver.BANK_RIGHT_3_STANDARD, Maneuver.TURN_RIGHT_3_STANDARD, Maneuver.KOIOGRAN_TURN_3_HARD,<br/> Maneuver.STRAIGHT_4_STANDARD, Maneuver.KOIOGRAN_TURN_4_HARD");
      });

      QUnit.test("determineManeuverKeys() X-Wing", function(assert)
      {
         // Run.
         var result = ShipConverter.determineManeuverKeys(X_WING);

         // Verify.
         assert.ok(result);
         assert.equal(result, "Maneuver.BANK_LEFT_1_EASY, Maneuver.STRAIGHT_1_EASY, Maneuver.BANK_RIGHT_1_EASY,<br/> Maneuver.TURN_LEFT_2_STANDARD, Maneuver.BANK_LEFT_2_STANDARD, Maneuver.STRAIGHT_2_EASY, Maneuver.BANK_RIGHT_2_STANDARD, Maneuver.TURN_RIGHT_2_STANDARD,<br/> Maneuver.TURN_LEFT_3_STANDARD, Maneuver.BANK_LEFT_3_STANDARD, Maneuver.STRAIGHT_3_STANDARD, Maneuver.BANK_RIGHT_3_STANDARD, Maneuver.TURN_RIGHT_3_STANDARD,<br/> Maneuver.STRAIGHT_4_STANDARD, Maneuver.KOIOGRAN_TURN_4_HARD");
      });

      QUnit.test("determineManeuverKeys() YV-666", function(assert)
      {
         // Run.
         var result = ShipConverter.determineManeuverKeys(YV_666);

         // Verify.
         assert.ok(result);
         assert.equal(result, "Maneuver.STATIONARY_0_HARD,<br/> Maneuver.BANK_LEFT_1_EASY, Maneuver.STRAIGHT_1_EASY, Maneuver.BANK_RIGHT_1_EASY,<br/> Maneuver.TURN_LEFT_2_HARD, Maneuver.BANK_LEFT_2_STANDARD, Maneuver.STRAIGHT_2_EASY, Maneuver.BANK_RIGHT_2_STANDARD, Maneuver.TURN_RIGHT_2_HARD,<br/> Maneuver.TURN_LEFT_3_STANDARD, Maneuver.BANK_LEFT_3_STANDARD, Maneuver.STRAIGHT_3_EASY, Maneuver.BANK_RIGHT_3_STANDARD, Maneuver.TURN_RIGHT_3_STANDARD,<br/> Maneuver.STRAIGHT_4_STANDARD");
      });

      QUnit.test("determinePrimaryFiringArc()", function(assert)
      {
         // Run / Verify.
         assert.equal(ShipConverter.determinePrimaryFiringArc(X_WING), "FiringArc.FORWARD");
         assert.equal(ShipConverter.determinePrimaryFiringArc(FIRESPRAY_31), "FiringArc.FORWARD");
         assert.equal(ShipConverter.determinePrimaryFiringArc(YV_666), "FiringArc.FORWARD");
      });
   });
