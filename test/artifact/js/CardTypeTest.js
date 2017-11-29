"use strict";

define(["qunit", "artifact/js/CardType"], function(QUnit, CardType)
{
   QUnit.module("CardType");

   QUnit.test("CardType properties Pilot", function(assert)
   {
      var cardTypeKey = CardType.PILOT;
      var properties = CardType.properties[cardTypeKey];
      assert.equal(properties.name, "Pilot");
      assert.equal(properties.key, cardTypeKey);
   });

   QUnit.test("CardType properties Upgrade", function(assert)
   {
      var cardTypeKey = CardType.UPGRADE;
      var properties = CardType.properties[cardTypeKey];
      assert.equal(properties.name, "Upgrade");
      assert.equal(properties.key, cardTypeKey);
   });

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = CardType.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(CardType);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = CardType[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(CardType.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return CardType[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = CardType.keys();

      // Verify.
      assert.ok(result);
      assert.equal(result.length, 4);
      var i = 0;
      assert.equal(result[i++], CardType.CONDITION);
      assert.equal(result[i++], CardType.DAMAGE);
      assert.equal(result[i++], CardType.PILOT);
      assert.equal(result[i++], CardType.UPGRADE);

      var properties = Object.getOwnPropertyNames(CardType);
      var count = properties.length - 1 - // properties
         1 - // keys
         1; // values
      assert.equal(result.length, count);
   });
});
