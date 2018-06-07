import ReferenceCard from "./ReferenceCard.js";

QUnit.module("ReferenceCard");

QUnit.test("ReferenceCard properties Academy Pilot", function(assert)
{
   const reference = ReferenceCard.AUXILIARY_FIRING_ARC;
   const properties = ReferenceCard.properties[reference];
   assert.equal(properties.name, "Auxiliary Firing Arc");
   assert.equal(properties.image, "reference-cards/AuxiliaryFiringArc.png");
   assert.equal(properties.key, ReferenceCard.AUXILIARY_FIRING_ARC);
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = ReferenceCard.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(ReferenceCard);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = ReferenceCard[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(ReferenceCard.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return ReferenceCard[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = ReferenceCard.keys();

   // Verify.
   assert.ok(result);
   const length = 41;
   assert.equal(result.length, length);
   assert.equal(result[0], ReferenceCard.ACQUIRE_A_TARGET_LOCK_ACTION);
   assert.equal(result[length - 1], ReferenceCard.USING_CLUSTER_MINES);

   const properties = Object.getOwnPropertyNames(ReferenceCard);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

QUnit.test("required properties", function(assert)
{
   ReferenceCard.values().forEach(function(reference)
   {
      assert.ok(reference.name, "Missing name for " + reference.name);
      assert.ok(reference.image, "Missing image for " + reference.name);
      assert.ok(reference.key, "Missing key for " + reference.name);
   });
});

const ReferenceCardTest = {};
export default ReferenceCardTest;