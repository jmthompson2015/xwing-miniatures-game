import CardType from "./CardType.js";

QUnit.module("CardType");

QUnit.test("CardType properties Pilot", function(assert)
{
   const cardTypeKey = CardType.PILOT;
   const properties = CardType.properties[cardTypeKey];
   assert.equal(properties.name, "Pilot");
   assert.equal(properties.key, cardTypeKey);
});

QUnit.test("CardType properties Upgrade", function(assert)
{
   const cardTypeKey = CardType.UPGRADE;
   const properties = CardType.properties[cardTypeKey];
   assert.equal(properties.name, "Upgrade");
   assert.equal(properties.key, cardTypeKey);
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = CardType.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(CardType);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = CardType[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(CardType.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return CardType[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = CardType.keys();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 4);
   let i = 0;
   assert.equal(result[i++], CardType.CONDITION);
   assert.equal(result[i++], CardType.DAMAGE);
   assert.equal(result[i++], CardType.PILOT);
   assert.equal(result[i++], CardType.UPGRADE);

   const properties = Object.getOwnPropertyNames(CardType);
   const count = properties.length - 1 - // properties
      1 - // keys
      1; // values
   assert.equal(result.length, count);
});

const CardTypeTest = {};
export default CardTypeTest;