import AttackDiceValue from "./AttackDiceValue.js";

QUnit.module("AttackDiceValue");

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = AttackDiceValue.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(AttackDiceValue);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = AttackDiceValue[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(AttackDiceValue.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return AttackDiceValue[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = AttackDiceValue.keys();

   // Verify.
   assert.ok(result);
   const length = 4;
   assert.equal(result.length, length);
   let i = 0;
   assert.equal(result[i++], AttackDiceValue.HIT);
   assert.equal(result[i++], AttackDiceValue.CRITICAL_HIT);
   assert.equal(result[i++], AttackDiceValue.FOCUS);
   assert.equal(result[i++], AttackDiceValue.BLANK);

   const properties = Object.getOwnPropertyNames(AttackDiceValue);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const AttackDiceValueTest = {};
export default AttackDiceValueTest;