import ConditionCard from "./ConditionCard.js";

QUnit.module("ConditionCard");

QUnit.test("ConditionCard properties Fanatical Devotion", function(assert)
{
   const upgrade = ConditionCard.FANATICAL_DEVOTION;
   const properties = ConditionCard.properties[upgrade];
   assert.equal(properties.name, "Fanatical Devotion");
   assert.equal(properties.description, "When defending, you cannot spend focus tokens.<br /><br />When attacking, if you spend a focus token to change all [Focus] results to [Hit] results, set aside the first [Focus] result that you change. The set-aside [Hit] result cannot be canceled by defense dice, but the defender may cancel [Critical Hit] results before it.<br /><br />During the End phase, remove this card.");
   assert.equal(properties.key, "fanaticalDevotion");
});

QUnit.test("getName()", function(assert)
{
   assert.equal(ConditionCard.getName(ConditionCard.A_DEBT_TO_PAY), "\u2022 A Debt to Pay");
   assert.equal(ConditionCard.getName(ConditionCard.FANATICAL_DEVOTION), "\u2022 Fanatical Devotion");
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = ConditionCard.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(ConditionCard);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = ConditionCard[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(ConditionCard.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return ConditionCard[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = ConditionCard.keys();

   // Verify.
   assert.ok(result);
   const length = 8;
   assert.equal(result.length, length);
   let i = 0;
   assert.equal(result[i++], ConditionCard.A_DEBT_TO_PAY);
   assert.equal(result[i++], ConditionCard.FANATICAL_DEVOTION);
   assert.equal(result[i++], ConditionCard.HARPOONED);
   assert.equal(result[i++], ConditionCard.ILL_SHOW_YOU_THE_DARK_SIDE);
   assert.equal(result[i++], ConditionCard.MIMICKED);
   assert.equal(result[i++], ConditionCard.RATTLED);
   assert.equal(result[i++], ConditionCard.SHADOWED);
   assert.equal(result[i++], ConditionCard.SUPPRESSIVE_FIRE);

   const properties = Object.getOwnPropertyNames(ConditionCard);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // getName
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const ConditionCardTest = {};
export default ConditionCardTest;