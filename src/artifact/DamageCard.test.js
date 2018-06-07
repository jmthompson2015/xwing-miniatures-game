import DamageCard from "./DamageCard.js";
import DamageCardTrait from "./DamageCardTrait.js";

QUnit.module("DamageCard");

QUnit.test("DamageCard properties Blinded Pilot", function(assert)
{
   const damage = DamageCard.BLINDED_PILOT;
   const properties = DamageCard.properties[damage];
   assert.equal(properties.name, "Blinded Pilot");
   assert.equal(properties.trait, DamageCardTrait.PILOT);
   assert.equal(properties.description, "The next time you attack, do not roll any attack dice.<br /><br />Then flip this card facedown.");
   assert.ok(!properties.hasAction);
   assert.ok(!properties.actionDescription);
   assert.ok(!properties.actionShipState);
   assert.equal(properties.key, damage);
});

QUnit.test("DamageCard properties Console Fire", function(assert)
{
   const damage = DamageCard.CONSOLE_FIRE;
   const properties = DamageCard.properties[damage];
   assert.equal(properties.name, "Console Fire");
   assert.equal(properties.trait, DamageCardTrait.SHIP);
   assert.equal(properties.description, "At the start of each Combat phase, roll 1 attack die. On a [Hit] result, suffer 1 damage.<br /><br />");
   assert.ok(properties.hasAction);
   assert.equal(properties.actionDescription, "<strong>Action:</strong> Flip this card facedown.");
   assert.equal(properties.key, damage);
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = DamageCard.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(DamageCard);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = DamageCard[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(DamageCard.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return DamageCard[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("createDeckV1()", function(assert)
{
   const deck = DamageCard.createDeckV1();
   assert.equal(deck.length, 33);
   assert.ok(!deck[-1]);
   assert.ok(deck[0]);
   assert.ok(deck[32]);
   assert.ok(!deck[33]);

   // Count each damage card type.
   const damageToCount = {};
   let damage;
   for (let i = 0; i < deck.length; i++)
   {
      damage = deck[i];

      if (damageToCount[damage])
      {
         damageToCount[damage] += 1;
      }
      else
      {
         damageToCount[damage] = 1;
      }
   }

   // Verify.
   for (damage in damageToCount)
   {
      if (damage === DamageCard.DIRECT_HIT)
      {
         assert.equal(damageToCount[damage], 7);
      }
      else
      {
         assert.equal(damageToCount[damage], 2);
      }
   }
});

QUnit.test("createDeckV2()", function(assert)
{
   const deck = DamageCard.createDeckV2();
   assert.equal(deck.length, 33);
   assert.ok(!deck[-1]);
   assert.ok(deck[0]);
   assert.ok(deck[32]);
   assert.ok(!deck[33]);

   // Count each damage card type.
   const damageToCount = {};
   let damage;
   for (let i = 0; i < deck.length; i++)
   {
      damage = deck[i];

      if (damageToCount[damage])
      {
         damageToCount[damage] += 1;
      }
      else
      {
         damageToCount[damage] = 1;
      }
   }

   // Verify.
   for (damage in damageToCount)
   {
      if (damage === DamageCard.DIRECT_HIT_V2)
      {
         assert.equal(damageToCount[damage], 7);
      }
      else
      {
         assert.equal(damageToCount[damage], 2);
      }
   }
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = DamageCard.keys();

   // Verify.
   assert.equal(result.length, 28);
   assert.ok(!result[-1]);
   assert.equal(result[0], DamageCard.BLINDED_PILOT);
   assert.equal(result[27], DamageCard.WEAPONS_FAILURE_V2);
   assert.ok(!result[28]);

   const properties = Object.getOwnPropertyNames(DamageCard);
   const count = properties.length - 1 - // properties
      1 - // createDeckV1
      1 - // createDeckV2
      1 - // keys
      1 - // keysV1
      1 - // keysV2
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

QUnit.test("keysV1()", function(assert)
{
   const values = DamageCard.keysV1();
   assert.equal(values.length, 14);
   assert.ok(!values[-1]);
   assert.equal(values[0], DamageCard.BLINDED_PILOT);
   assert.equal(values[13], DamageCard.WEAPON_MALFUNCTION);
   assert.ok(!values[14]);
});

QUnit.test("keysV2()", function(assert)
{
   const values = DamageCard.keysV2();
   assert.equal(values.length, 14);
   assert.ok(!values[-1]);
   assert.equal(values[0], DamageCard.BLINDED_PILOT_V2);
   assert.equal(values[13], DamageCard.WEAPONS_FAILURE_V2);
   assert.ok(!values[14]);
});

const DamageCardTest = {};
export default DamageCardTest;