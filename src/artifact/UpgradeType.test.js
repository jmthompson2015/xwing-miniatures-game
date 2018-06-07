import UpgradeType from "./UpgradeType.js";

QUnit.module("UpgradeType");

QUnit.test("UpgradeType properties Astromech", function(assert)
{
   const typeKey = UpgradeType.ASTROMECH;
   const properties = UpgradeType.properties[typeKey];
   assert.equal(properties.name, "Astromech");
   assert.equal(properties.key, "astromech");
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = UpgradeType.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(UpgradeType);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = UpgradeType[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(UpgradeType.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return UpgradeType[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = UpgradeType.keys();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 17);
   let i = 0;
   assert.equal(result[i++], UpgradeType.ASTROMECH);
   assert.equal(result[i++], UpgradeType.BOMB);
   assert.equal(result[i++], UpgradeType.CANNON);
   assert.equal(result[i++], UpgradeType.CARGO);
   assert.equal(result[i++], UpgradeType.CREW);
   assert.equal(result[i++], UpgradeType.ELITE);
   assert.equal(result[i++], UpgradeType.HARDPOINT);
   assert.equal(result[i++], UpgradeType.ILLICIT);
   assert.equal(result[i++], UpgradeType.MISSILE);
   assert.equal(result[i++], UpgradeType.MODIFICATION);
   assert.equal(result[i++], UpgradeType.SALVAGED_ASTROMECH);
   assert.equal(result[i++], UpgradeType.SYSTEM);
   assert.equal(result[i++], UpgradeType.TEAM);
   assert.equal(result[i++], UpgradeType.TECH);
   assert.equal(result[i++], UpgradeType.TITLE);
   assert.equal(result[i++], UpgradeType.TORPEDO);
   assert.equal(result[i++], UpgradeType.TURRET);

   const properties = Object.getOwnPropertyNames(UpgradeType);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // findByName
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const UpgradeTypeTest = {};
export default UpgradeTypeTest;