"use strict";

define(["qunit", "artifact/Bearing"], function(QUnit, Bearing)
{
   QUnit.module("Bearing");

   QUnit.test("Bearing properties Straight", function(assert)
   {
      var bearing = Bearing.STRAIGHT;
      var properties = Bearing.properties[bearing];
      assert.equal(properties.name, "Straight");
      assert.equal(properties.headingChange, 0);
      assert.ok(!properties.isBank);
      assert.ok(!properties.isTurn);
      assert.equal(properties.key, bearing);
   });

   QUnit.test("Bearing properties Huge Bank Left", function(assert)
   {
      var bearing = Bearing.HUGE_BANK_LEFT;
      var properties = Bearing.properties[bearing];
      assert.equal(properties.name, "Huge Bank Left");
      assert.equal(properties.headingChange, -30);
      assert.ok(properties.isBank);
      assert.ok(!properties.isTurn);
      assert.equal(properties.key, bearing);
   });

   QUnit.test("isBank()", function(assert)
   {
      assert.ok(Bearing.properties[Bearing.HUGE_BANK_LEFT].isBank);
      assert.ok(!Bearing.properties[Bearing.TURN_LEFT].isBank);
      assert.ok(Bearing.properties[Bearing.BANK_LEFT].isBank);
      assert.ok(!Bearing.properties[Bearing.STRAIGHT].isBank);
      assert.ok(Bearing.properties[Bearing.BANK_RIGHT].isBank);
      assert.ok(!Bearing.properties[Bearing.TURN_RIGHT].isBank);
      assert.ok(Bearing.properties[Bearing.HUGE_BANK_RIGHT].isBank);
      assert.ok(!Bearing.properties[Bearing.KOIOGRAN_TURN].isBank);
      assert.ok(!Bearing.properties[Bearing.BARREL_ROLL_LEFT].isBank);
      assert.ok(!Bearing.properties[Bearing.BARREL_ROLL_RIGHT].isBank);
      assert.ok(Bearing.properties[Bearing.SEGNORS_LOOP_LEFT].isBank);
      assert.ok(Bearing.properties[Bearing.SEGNORS_LOOP_RIGHT].isBank);
      assert.ok(!Bearing.properties[Bearing.TALLON_ROLL_LEFT].isBank);
      assert.ok(!Bearing.properties[Bearing.TALLON_ROLL_RIGHT].isBank);
   });

   QUnit.test("isTurn()", function(assert)
   {
      assert.ok(!Bearing.properties[Bearing.HUGE_BANK_LEFT].isTurn);
      assert.ok(Bearing.properties[Bearing.TURN_LEFT].isTurn);
      assert.ok(!Bearing.properties[Bearing.BANK_LEFT].isTurn);
      assert.ok(!Bearing.properties[Bearing.STRAIGHT].isTurn);
      assert.ok(!Bearing.properties[Bearing.BANK_RIGHT].isTurn);
      assert.ok(Bearing.properties[Bearing.TURN_RIGHT].isTurn);
      assert.ok(!Bearing.properties[Bearing.HUGE_BANK_RIGHT].isTurn);
      assert.ok(!Bearing.properties[Bearing.KOIOGRAN_TURN].isTurn);
      assert.ok(!Bearing.properties[Bearing.BARREL_ROLL_LEFT].isTurn);
      assert.ok(!Bearing.properties[Bearing.BARREL_ROLL_RIGHT].isTurn);
      assert.ok(!Bearing.properties[Bearing.SEGNORS_LOOP_LEFT].isTurn);
      assert.ok(!Bearing.properties[Bearing.SEGNORS_LOOP_RIGHT].isTurn);
      assert.ok(Bearing.properties[Bearing.TALLON_ROLL_LEFT].isTurn);
      assert.ok(Bearing.properties[Bearing.TALLON_ROLL_RIGHT].isTurn);
   });

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = Bearing.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(Bearing);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = Bearing[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(Bearing.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return Bearing[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("required properties", function(assert)
   {
      Bearing.values().forEach(function(bearing)
      {
         assert.ok(bearing.name !== undefined, "Missing name for " + bearing.name);
         assert.ok(bearing.headingChange !== undefined, "Missing headingChange for " + bearing.name);
         assert.ok(bearing.key !== undefined, "Missing key for " + bearing.name);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = Bearing.keys();

      // Verify.
      assert.ok(result);
      assert.equal(result.length, 14);
      var i = 0;
      assert.equal(result[i++], Bearing.HUGE_BANK_LEFT);
      assert.equal(result[i++], Bearing.TURN_LEFT);
      assert.equal(result[i++], Bearing.BANK_LEFT);
      assert.equal(result[i++], Bearing.STRAIGHT);
      assert.equal(result[i++], Bearing.BANK_RIGHT);
      assert.equal(result[i++], Bearing.TURN_RIGHT);
      assert.equal(result[i++], Bearing.HUGE_BANK_RIGHT);
      assert.equal(result[i++], Bearing.BARREL_ROLL_LEFT);
      assert.equal(result[i++], Bearing.SEGNORS_LOOP_LEFT);
      assert.equal(result[i++], Bearing.TALLON_ROLL_LEFT);
      assert.equal(result[i++], Bearing.KOIOGRAN_TURN);
      assert.equal(result[i++], Bearing.BARREL_ROLL_RIGHT);
      assert.equal(result[i++], Bearing.SEGNORS_LOOP_RIGHT);
      assert.equal(result[i++], Bearing.TALLON_ROLL_RIGHT);

      var properties = Object.getOwnPropertyNames(Bearing);
      var count = properties.length - 1 - // properties
         1 - // keys
         1 - // toString
         1; // values
      assert.equal(result.length, count);
   });
});
