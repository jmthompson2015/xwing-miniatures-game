import BasicManeuver from "./BasicManeuver.js";
import Bearing from "./Bearing.js";

QUnit.module("BasicManeuver");

QUnit.test("BasicManeuver properties Straight1", function(assert)
{
   var maneuver = BasicManeuver.STRAIGHT_1;
   var properties = BasicManeuver.properties[maneuver];
   assert.equal(properties.bearingKey, Bearing.STRAIGHT);
   assert.equal(properties.speed, 1);
   assert.equal(properties.energy, undefined);
   assert.equal(properties.key, maneuver);
});

QUnit.test("BasicManeuver properties Straight1_3", function(assert)
{
   var maneuver = BasicManeuver.STRAIGHT_1_3;
   var properties = BasicManeuver.properties[maneuver];
   assert.equal(properties.bearingKey, Bearing.STRAIGHT);
   assert.equal(properties.speed, 1);
   assert.equal(properties.energy, 3);
   assert.equal(properties.key, maneuver);
});

QUnit.test("BasicManeuver.find()", function(assert)
{
   assert.equal(BasicManeuver.find(Bearing.TURN_LEFT, 0), BasicManeuver.STRAIGHT_0);
   assert.equal(BasicManeuver.find(Bearing.BANK_LEFT, 0), BasicManeuver.STRAIGHT_0);
   assert.equal(BasicManeuver.find(Bearing.STRAIGHT, 0), BasicManeuver.STRAIGHT_0);

   assert.equal(BasicManeuver.find(Bearing.TURN_LEFT, 1), BasicManeuver.TURN_LEFT_1);
   assert.equal(BasicManeuver.find(Bearing.BANK_LEFT, 1), BasicManeuver.BANK_LEFT_1);
   assert.equal(BasicManeuver.find(Bearing.STRAIGHT, 1), BasicManeuver.STRAIGHT_1);
   assert.equal(BasicManeuver.find(Bearing.BANK_RIGHT, 1), BasicManeuver.BANK_RIGHT_1);
   assert.equal(BasicManeuver.find(Bearing.TURN_RIGHT, 1), BasicManeuver.TURN_RIGHT_1);
   assert.equal(BasicManeuver.find(Bearing.BARREL_ROLL_LEFT, 1), BasicManeuver.BARREL_ROLL_LEFT_1);
   assert.equal(BasicManeuver.find(Bearing.BARREL_ROLL_RIGHT, 1), BasicManeuver.BARREL_ROLL_RIGHT_1);

   assert.equal(BasicManeuver.find(Bearing.TURN_LEFT, 2), BasicManeuver.TURN_LEFT_2);
   assert.equal(BasicManeuver.find(Bearing.BANK_LEFT, 2), BasicManeuver.BANK_LEFT_2);
   assert.equal(BasicManeuver.find(Bearing.STRAIGHT, 2), BasicManeuver.STRAIGHT_2);
   assert.equal(BasicManeuver.find(Bearing.BANK_RIGHT, 2), BasicManeuver.BANK_RIGHT_2);
   assert.equal(BasicManeuver.find(Bearing.TURN_RIGHT, 2), BasicManeuver.TURN_RIGHT_2);
   assert.equal(BasicManeuver.find(Bearing.BARREL_ROLL_LEFT, 2), BasicManeuver.BARREL_ROLL_LEFT_2);
   assert.equal(BasicManeuver.find(Bearing.BARREL_ROLL_RIGHT, 2), BasicManeuver.BARREL_ROLL_RIGHT_2);
   assert.equal(BasicManeuver.find(Bearing.TALLON_ROLL_LEFT, 2), BasicManeuver.TALLON_ROLL_LEFT_2);
   assert.equal(BasicManeuver.find(Bearing.SEGNORS_LOOP_LEFT, 2), BasicManeuver.SEGNORS_LOOP_LEFT_2);
   assert.equal(BasicManeuver.find(Bearing.KOIOGRAN_TURN, 2), BasicManeuver.KOIOGRAN_TURN_2);
   assert.equal(BasicManeuver.find(Bearing.SEGNORS_LOOP_RIGHT, 2), BasicManeuver.SEGNORS_LOOP_RIGHT_2);
   assert.equal(BasicManeuver.find(Bearing.TALLON_ROLL_RIGHT, 2), BasicManeuver.TALLON_ROLL_RIGHT_2);
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   var result = BasicManeuver.keys();
   var ownPropertyNames = Object.getOwnPropertyNames(BasicManeuver);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      var key2 = BasicManeuver[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(BasicManeuver.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      var p = ownPropertyNames.filter(function(key)
      {
         return BasicManeuver[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("required properties", function(assert)
{
   BasicManeuver.values().forEach(function(maneuver)
   {
      assert.ok(maneuver.bearingKey !== undefined, "Missing bearingKey for " + maneuver.key);
      assert.ok(maneuver.speed !== undefined, "Missing speed for " + maneuver.key);
      assert.ok(maneuver.key !== undefined, "Missing key for " + maneuver.key);
   });
});

QUnit.test("BasicManeuver.toString()", function(assert)
{
   assert.equal(BasicManeuver.toString(BasicManeuver.TURN_LEFT_1), "Turn Left 1");
   assert.equal(BasicManeuver.toString(BasicManeuver.BANK_LEFT_1), "Bank Left 1");
   assert.equal(BasicManeuver.toString(BasicManeuver.STRAIGHT_1), "Straight 1");
   assert.equal(BasicManeuver.toString(BasicManeuver.BANK_RIGHT_1), "Bank Right 1");
   assert.equal(BasicManeuver.toString(BasicManeuver.TURN_RIGHT_1), "Turn Right 1");

   assert.equal(BasicManeuver.toString(BasicManeuver.TURN_LEFT_2), "Turn Left 2");
   assert.equal(BasicManeuver.toString(BasicManeuver.BANK_LEFT_2), "Bank Left 2");
   assert.equal(BasicManeuver.toString(BasicManeuver.STRAIGHT_2), "Straight 2");
   assert.equal(BasicManeuver.toString(BasicManeuver.BANK_RIGHT_2), "Bank Right 2");
   assert.equal(BasicManeuver.toString(BasicManeuver.TURN_RIGHT_2), "Turn Right 2");
});

QUnit.test("keys()", function(assert)
{
   // Run.
   var result = BasicManeuver.keys();

   // Verify.
   assert.ok(result);
   var length = 54;
   assert.equal(result.length, length);
   assert.equal(result[0], "bankLeft1");
   assert.equal(result[length - 1], "straight4_2");

   var properties = Object.getOwnPropertyNames(BasicManeuver);
   var count = properties.length - 1 - // properties
      1 - // find
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const BasicManeuverTest = {};
export default BasicManeuverTest;