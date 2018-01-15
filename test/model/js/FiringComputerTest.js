"use strict";

define(["qunit", "redux", "artifact/js/FiringArc", "artifact/js/ShipBase", "model/js/Position", "model/js/FiringComputer", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Redux, FiringArc, ShipBase, Position, FiringComputer, EnvironmentFactory)
   {
      QUnit.module("FiringComputer");

      QUnit.test("isInFiringArc() aft", function(assert)
      {
         // Setup.
         var attackerPosition = new Position(500, 400, 0);
         var defenderPosition = new Position(400, 400, 180);
         var defenderShipBase = ShipBase.properties[ShipBase.SMALL];

         // Run / Verify.
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT_180], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.BULLSEYE], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD_180], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.PORT], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.STARBOARD], defenderPosition, defenderShipBase), false);
      });

      QUnit.test("isInFiringArc() forward", function(assert)
      {
         // Setup.
         var attackerPosition = new Position(400, 400, 0);
         var defenderPosition = new Position(500, 400, 180);
         var defenderShipBase = ShipBase.properties[ShipBase.SMALL];

         // Run / Verify.
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT_180], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.BULLSEYE], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD_180], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.PORT], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.STARBOARD], defenderPosition, defenderShipBase), false);
      });

      QUnit.test("isInFiringArc() forward port", function(assert)
      {
         // Setup.
         var attackerPosition = new Position(400, 400, 0);
         var defenderPosition = new Position(500, 300, 180);
         var defenderShipBase = ShipBase.properties[ShipBase.SMALL];

         // Run / Verify.
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT_180], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.BULLSEYE], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD_180], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.PORT], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.STARBOARD], defenderPosition, defenderShipBase), false);
      });

      QUnit.test("isInFiringArc() port", function(assert)
      {
         // Setup.
         var attackerPosition = new Position(400, 500, 0);
         var defenderPosition = new Position(400, 400, 180);
         var defenderShipBase = ShipBase.properties[ShipBase.SMALL];

         // Run / Verify.
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT_180], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.BULLSEYE], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD_180], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.PORT], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.STARBOARD], defenderPosition, defenderShipBase), false);
      });

      QUnit.test("isInFiringArc() starboard", function(assert)
      {
         // Setup.
         var attackerPosition = new Position(400, 400, 0);
         var defenderPosition = new Position(400, 500, 180);
         var defenderShipBase = ShipBase.properties[ShipBase.SMALL];

         // Run / Verify.
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.AFT_180], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.BULLSEYE], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.FORWARD_180], defenderPosition, defenderShipBase), true);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.PORT], defenderPosition, defenderShipBase), false);
         assert.equal(FiringComputer.isInFiringArc(attackerPosition, FiringArc.properties[FiringArc.STARBOARD], defenderPosition, defenderShipBase), true);
      });

      QUnit.test("isInFiringArc() rotated", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attackerPosition0 = new Position(458, 895, -90);
         var attacker = environment.getTokenAt(attackerPosition0);
         assert.ok(attacker);
         var defenderPosition = new Position(305, 20, 90);
         var defender = environment.getTokenAt(defenderPosition);
         var attackerPosition = new Position(defenderPosition.x(), defenderPosition.y() + 50, 0);
         environment.moveToken(attackerPosition0, attackerPosition);
         var defenderShipBase = defender.card().shipFaction.ship.shipBase;

         // Run.
         var result = FiringComputer.isInFiringArc(attackerPosition, attacker.primaryWeapon().primaryFiringArc(), defenderPosition, defenderShipBase);

         // Verify.
         assert.ok(!result);
      });
   });
