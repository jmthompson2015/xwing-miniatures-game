import UpgradeHeader from "./UpgradeHeader.js";

QUnit.module("UpgradeHeader");

QUnit.test("UpgradeHeader properties Attack (Focus)", function(assert)
{
   const headerKey = UpgradeHeader.ATTACK_FOCUS;
   const properties = UpgradeHeader.properties[headerKey];
   assert.equal(properties.name, "Attack [Focus]");
   assert.equal(properties.key, "attackFocus");
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = UpgradeHeader.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(UpgradeHeader);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = UpgradeHeader[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(UpgradeHeader.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return UpgradeHeader[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   const result = UpgradeHeader.keys();
   assert.ok(result);
   assert.equal(result.length, 6);
   let i = 0;
   assert.equal(result[i++], UpgradeHeader.ACTION);
   assert.equal(result[i++], UpgradeHeader.ATTACK);
   assert.equal(result[i++], UpgradeHeader.ATTACK_ENERGY);
   assert.equal(result[i++], UpgradeHeader.ATTACK_FOCUS);
   assert.equal(result[i++], UpgradeHeader.ATTACK_TARGET_LOCK);
   assert.equal(result[i++], UpgradeHeader.ENERGY);

   const properties = Object.getOwnPropertyNames(UpgradeHeader);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const UpgradeHeaderTest = {};
export default UpgradeHeaderTest;