import FiringArc from "./FiringArc.js";

QUnit.module("FiringArc");

QUnit.test("required properties", function(assert)
{
   FiringArc.values().forEach(function(firingArc)
   {
      assert.ok(firingArc.name !== undefined, "Missing name for " + firingArc.name);
      assert.ok(firingArc.key !== undefined, "Missing key for " + firingArc.name);
   });
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   var result = FiringArc.keys();
   var ownPropertyNames = Object.getOwnPropertyNames(FiringArc);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      var key2 = FiringArc[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(FiringArc.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      var p = ownPropertyNames.filter(function(key)
      {
         return FiringArc[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   var result = FiringArc.keys();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 12);
   var i = 0;
   assert.equal(result[i++], "aft");
   assert.equal(result[i++], "aft180");
   assert.equal(result[i++], "bullseye");
   assert.equal(result[i++], "forward");
   assert.equal(result[i++], "forward106");
   assert.equal(result[i++], "forward136");
   assert.equal(result[i++], "forward180");
   assert.equal(result[i++], "port");
   assert.equal(result[i++], "portAndStarboardAft");
   assert.equal(result[i++], "portAndStarboardAftSkewed");
   assert.equal(result[i++], "portAndStarboardFore");
   assert.equal(result[i++], "starboard");

   var properties = Object.getOwnPropertyNames(FiringArc);
   var count = properties.length - 1 - // properties
      1 - // keys
      1 - // offsetKeys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const FiringArcTest = {};
export default FiringArcTest;