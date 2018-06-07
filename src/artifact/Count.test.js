import Count from "./Count.js";

QUnit.module("Count");

QUnit.test("Count properties Cloak", function(assert)
{
   const property = Count.CLOAK;
   const properties = Count.properties[property];
   assert.equal(properties.name, "Cloak");
   assert.equal(properties.image, "token/CloakToken32.png");
   assert.equal(properties.key, "cloak");
});

QUnit.test("Count properties Energy", function(assert)
{
   const property = Count.ENERGY;
   const properties = Count.properties[property];
   assert.equal(properties.name, "Energy");
   assert.equal(properties.image, "token/EnergyToken32.png");
   assert.equal(properties.key, "energy");
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = Count.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(Count);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = Count[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(Count.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return Count[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = Count.keys();

   // Verify.
   assert.ok(result);
   const length = 11;
   assert.equal(result.length, length);
   let i = 0;
   assert.equal(result[i++], Count.CLOAK);
   assert.equal(result[i++], Count.ENERGY);
   assert.equal(result[i++], Count.EVADE);
   assert.equal(result[i++], Count.FOCUS);
   assert.equal(result[i++], Count.ION);
   assert.equal(result[i++], Count.ORDNANCE);
   assert.equal(result[i++], Count.REINFORCE);
   assert.equal(result[i++], Count.SHIELD);
   assert.equal(result[i++], Count.STRESS);
   assert.equal(result[i++], Count.TRACTOR_BEAM);
   assert.equal(result[i++], Count.WEAPONS_DISABLED);

   const properties = Object.getOwnPropertyNames(Count);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const CountTest = {};
export default CountTest;