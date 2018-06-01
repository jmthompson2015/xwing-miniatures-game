import Faction from "./Faction.js";

QUnit.module("Faction");

QUnit.test("Faction properties Imperial", function(assert)
{
   var faction = Faction.IMPERIAL;
   var properties = Faction.properties[faction];
   assert.equal(properties.name, "Imperial");
   assert.equal(properties.description, "Imperial faction");
   assert.equal(properties.key, "imperial");
});

QUnit.test("Faction properties Rebel", function(assert)
{
   var faction = Faction.REBEL;
   var properties = Faction.properties[faction];
   assert.equal(properties.name, "Rebel");
   assert.equal(properties.description, "Rebel faction");
   assert.equal(properties.key, "rebel");
});

QUnit.test("Faction properties Scum", function(assert)
{
   var faction = Faction.SCUM;
   var properties = Faction.properties[faction];
   assert.equal(properties.name, "Scum & Villainy");
   assert.equal(properties.description, "Scum & Villainy faction");
   assert.equal(properties.key, "scum");
});

QUnit.test("friend()", function(assert)
{
   assert.equal(Faction.friend(Faction.FIRST_ORDER), Faction.IMPERIAL);
   assert.equal(Faction.friend(Faction.IMPERIAL), Faction.FIRST_ORDER);
   assert.equal(Faction.friend(Faction.REBEL), Faction.RESISTANCE);
   assert.equal(Faction.friend(Faction.RESISTANCE), Faction.REBEL);
   assert.ok(!Faction.friend(Faction.SCUM));
});

QUnit.test("isFriendly()", function(assert)
{
   assert.ok(Faction.isFriendly(Faction.FIRST_ORDER, Faction.FIRST_ORDER));
   assert.ok(Faction.isFriendly(Faction.IMPERIAL, Faction.IMPERIAL));
   assert.ok(Faction.isFriendly(Faction.REBEL, Faction.REBEL));
   assert.ok(Faction.isFriendly(Faction.RESISTANCE, Faction.RESISTANCE));
   assert.ok(Faction.isFriendly(Faction.SCUM, Faction.SCUM));

   assert.ok(Faction.isFriendly(Faction.IMPERIAL, Faction.FIRST_ORDER));
   assert.ok(Faction.isFriendly(Faction.REBEL, Faction.RESISTANCE));

   assert.ok(!Faction.isFriendly(Faction.IMPERIAL, Faction.REBEL));
   assert.ok(!Faction.isFriendly(Faction.FIRST_ORDER, Faction.RESISTANCE));
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   var result = Faction.keys();
   var ownPropertyNames = Object.getOwnPropertyNames(Faction);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      var key2 = Faction[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(Faction.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      var p = ownPropertyNames.filter(function(key)
      {
         return Faction[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   var result = Faction.keys();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 5);
   var i = 0;
   assert.equal(result[i++], Faction.IMPERIAL);
   assert.equal(result[i++], Faction.FIRST_ORDER);
   assert.equal(result[i++], Faction.REBEL);
   assert.equal(result[i++], Faction.RESISTANCE);
   assert.equal(result[i++], Faction.SCUM);

   var properties = Object.getOwnPropertyNames(Faction);
   var count = properties.length - 1 - // properties
      1 - // friend
      1 - // isFriendly
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const FactionTest = {};
export default FactionTest;