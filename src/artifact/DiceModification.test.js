import DiceModification from "./DiceModification.js";

QUnit.module("DiceModification");

QUnit.test("DiceModification properties Target Lock Acquired", function(assert)
{
   const modificationKey = DiceModification.ATTACK_SPEND_FOCUS;
   const properties = DiceModification.properties[modificationKey];
   assert.equal(properties.name, "Spend a Focus token");
   assert.equal(properties.key, modificationKey);
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = DiceModification.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(DiceModification);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = DiceModification[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(DiceModification.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return DiceModification[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = DiceModification.keys();

   // Verify.
   assert.ok(result);
   const length = 4;
   assert.equal(result.length, length);
   let i = 0;
   assert.equal(result[i++], DiceModification.ATTACK_SPEND_FOCUS);
   assert.equal(result[i++], DiceModification.ATTACK_SPEND_TARGET_LOCK);
   assert.equal(result[i++], DiceModification.DEFENSE_SPEND_EVADE);
   assert.equal(result[length - 1], DiceModification.DEFENSE_SPEND_FOCUS);

   const properties = Object.getOwnPropertyNames(DiceModification);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const DiceModificationTest = {};
export default DiceModificationTest;