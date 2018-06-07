import ShipState from "./ShipState.js";

QUnit.module("ShipState");

QUnit.test("ShipState properties Pilot Skill", function(assert)
{
   const shipStateKey = ShipState.PILOT_SKILL;
   const properties = ShipState.properties[shipStateKey];
   assert.equal(properties.name, "Pilot Skill");
   assert.equal(properties.key, shipStateKey);
});

QUnit.test("keys and values", function(assert)
{
   // Run.
   const result = ShipState.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(ShipState);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = ShipState[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(ShipState.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return ShipState[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = ShipState.keys();

   // Verify.
   assert.ok(result);
   const length = 7;
   assert.equal(result.length, length);
   assert.equal(result[0], "pilotSkill");
   assert.equal(result[length - 1], "shield");

   const properties = Object.getOwnPropertyNames(ShipState);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const ShipStateTest = {};
export default ShipStateTest;