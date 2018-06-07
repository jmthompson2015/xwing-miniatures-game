import DamageCardTrait from "./DamageCardTrait.js";

QUnit.module("DamageCardTrait");

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = DamageCardTrait.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(DamageCardTrait);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = DamageCardTrait[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(DamageCardTrait.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return DamageCardTrait[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = DamageCardTrait.keys();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
   let i = 0;
   assert.equal(result[i++], DamageCardTrait.PILOT);
   assert.equal(result[i++], DamageCardTrait.SHIP);

   const properties = Object.getOwnPropertyNames(DamageCardTrait);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // findByName
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const DamageCardTraitTest = {};
export default DamageCardTraitTest;