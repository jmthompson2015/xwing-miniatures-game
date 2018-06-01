import Value from "./Value.js";

QUnit.module("Value");

QUnit.test("Value properties Agility", function(assert)
{
   var property = Value.AGILITY;
   var properties = Value.properties[property];
   assert.equal(properties.name, "Agility");
   assert.equal(properties.key, "agility");
});

QUnit.test("Value properties Energy", function(assert)
{
   var property = Value.ENERGY;
   var properties = Value.properties[property];
   assert.equal(properties.name, "Energy");
   assert.equal(properties.key, "energy");
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   var result = Value.keys();
   var ownPropertyNames = Object.getOwnPropertyNames(Value);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      var key2 = Value[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(Value.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      var p = ownPropertyNames.filter(function(key)
      {
         return Value[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   var result = Value.keys();

   // Verify.
   assert.ok(result);
   var length = 6;
   assert.equal(result.length, length);
   var i = 0;
   assert.equal(result[i++], Value.AGILITY);
   assert.equal(result[i++], Value.ENERGY);
   assert.equal(result[i++], Value.HULL);
   assert.equal(result[i++], Value.PILOT_SKILL);
   assert.equal(result[i++], Value.PRIMARY_WEAPON);
   assert.equal(result[i++], Value.SHIELD);

   var properties = Object.getOwnPropertyNames(Value);
   var count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const ValueTest = {};
export default ValueTest;