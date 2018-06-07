import Difficulty from "./Difficulty.js";

QUnit.module("Difficulty");

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = Difficulty.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(Difficulty);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = Difficulty[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(Difficulty.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return Difficulty[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = Difficulty.keys();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 3);
   let i = 0;
   assert.equal(result[i++], Difficulty.EASY);
   assert.equal(result[i++], Difficulty.STANDARD);
   assert.equal(result[i++], Difficulty.HARD);

   const properties = Object.getOwnPropertyNames(Difficulty);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const DifficultyTest = {};
export default DifficultyTest;