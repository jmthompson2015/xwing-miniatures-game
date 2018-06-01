import DefenseDiceValue from "./DefenseDiceValue.js";

QUnit.module("DefenseDiceValue");

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   var result = DefenseDiceValue.keys();
   var ownPropertyNames = Object.getOwnPropertyNames(DefenseDiceValue);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      var key2 = DefenseDiceValue[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(DefenseDiceValue.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      var p = ownPropertyNames.filter(function(key)
      {
         return DefenseDiceValue[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   var result = DefenseDiceValue.keys();

   // Verify.
   assert.ok(result);
   var length = 3;
   assert.equal(result.length, length);
   var i = 0;
   assert.equal(result[i++], DefenseDiceValue.EVADE);
   assert.equal(result[i++], DefenseDiceValue.FOCUS);
   assert.equal(result[i++], DefenseDiceValue.BLANK);

   var properties = Object.getOwnPropertyNames(DefenseDiceValue);
   var count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const DefenseDiceValueTest = {};
export default DefenseDiceValueTest;