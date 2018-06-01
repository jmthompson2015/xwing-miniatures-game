import PlayFormat from "./PlayFormat.js";

QUnit.module("PlayFormat");

QUnit.test("PlayFormat properties Standard", function(assert)
{
   var type = PlayFormat.STANDARD;
   var properties = PlayFormat.properties[type];
   assert.equal(properties.name, "Standard");
   assert.equal(properties.key, "standard");
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   var result = PlayFormat.keys();
   var ownPropertyNames = Object.getOwnPropertyNames(PlayFormat);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      var key2 = PlayFormat[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(PlayFormat.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      var p = ownPropertyNames.filter(function(key)
      {
         return PlayFormat[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("PlayFormat.isPointInPlayArea()", function(assert)
{
   assert.ok(PlayFormat.isPointInPlayArea(PlayFormat.STANDARD, 3, 4));
   assert.ok(!PlayFormat.isPointInPlayArea(PlayFormat.STANDARD, -1, 4));
   assert.ok(!PlayFormat.isPointInPlayArea(PlayFormat.STANDARD, 3, -1));
   assert.ok(!PlayFormat.isPointInPlayArea(PlayFormat.STANDARD, 915, 4));
   assert.ok(!PlayFormat.isPointInPlayArea(PlayFormat.STANDARD, 3, 915));

   assert.ok(PlayFormat.isPointInPlayArea(PlayFormat.EPIC, 3, 4));
   assert.ok(!PlayFormat.isPointInPlayArea(PlayFormat.EPIC, -1, 4));
   assert.ok(!PlayFormat.isPointInPlayArea(PlayFormat.EPIC, 3, -1));
   assert.ok(!PlayFormat.isPointInPlayArea(PlayFormat.EPIC, 1830, 4));
   assert.ok(!PlayFormat.isPointInPlayArea(PlayFormat.EPIC, 3, 915));
});

QUnit.test("keys()", function(assert)
{
   // Run.
   var result = PlayFormat.keys();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 3);
   var i = 0;
   assert.equal(result[i++], PlayFormat.STANDARD);
   assert.equal(result[i++], PlayFormat.CINEMATIC);
   assert.equal(result[i++], PlayFormat.EPIC);

   var properties = Object.getOwnPropertyNames(PlayFormat);
   var count = properties.length - 1 - // properties
      1 - // isPathInPlayArea
      1 - // isPointInPlayArea
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const PlayFormatTest = {};
export default PlayFormatTest;