import ShipAction from "./ShipAction.js";

QUnit.module("ShipAction");

QUnit.test("ShipAction properties Barrel Roll", function(assert)
{
   const shipAction = ShipAction.BARREL_ROLL;
   const properties = ShipAction.properties[shipAction];
   assert.equal(properties.name, "Barrel Roll");
});

QUnit.test("ShipAction properties Evade", function(assert)
{
   const shipAction = ShipAction.EVADE;
   const properties = ShipAction.properties[shipAction];
   assert.equal(properties.name, "Evade");
});

QUnit.test("ShipAction properties Focus", function(assert)
{
   const shipAction = ShipAction.FOCUS;
   const properties = ShipAction.properties[shipAction];
   assert.equal(properties.name, "Focus");
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = ShipAction.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(ShipAction);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = ShipAction[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(ShipAction.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return ShipAction[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = ShipAction.keys();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 14);
   let i = 0;
   assert.equal(result[i++], ShipAction.BARREL_ROLL);
   assert.equal(result[i++], ShipAction.BOOST);
   assert.equal(result[i++], ShipAction.CLOAK);
   assert.equal(result[i++], ShipAction.COORDINATE);
   assert.equal(result[i++], ShipAction.DECLOAK);
   assert.equal(result[i++], ShipAction.EVADE);
   assert.equal(result[i++], ShipAction.FOCUS);
   assert.equal(result[i++], ShipAction.JAM);
   assert.equal(result[i++], ShipAction.RECOVER);
   assert.equal(result[i++], ShipAction.REINFORCE);
   assert.equal(result[i++], ShipAction.RELOAD);
   assert.equal(result[i++], ShipAction.ROTATE_ARC);
   assert.equal(result[i++], ShipAction.SLAM);
   assert.equal(result[i++], ShipAction.TARGET_LOCK);

   const properties = Object.getOwnPropertyNames(ShipAction);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1 - // findByName
      1; // values
   assert.equal(result.length, count);
});

const ShipActionTest = {};
export default ShipActionTest;