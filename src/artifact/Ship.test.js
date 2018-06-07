import FiringArc from "./FiringArc.js";
import Ship from "./Ship.js";
import ShipBase from "./ShipBase.js";

QUnit.module("Ship");

QUnit.test("Ship properties Firespray-31", function(assert)
{
   const ship = Ship.FIRESPRAY_31;
   const properties = Ship.properties[ship];
   assert.equal(properties.name, "Firespray-31");
   assert.equal(properties.primaryWeaponValue, 3);
   assert.equal(properties.agilityValue, 2);
   assert.equal(properties.hullValue, 6);
   assert.equal(properties.shieldValue, 4);
   assert.equal(properties.key, ship);
   assert.equal(properties.primaryFiringArcKey, FiringArc.FORWARD);
   assert.equal(properties.auxiliaryFiringArcKey, FiringArc.AFT);
   assert.equal(properties.shipBaseKey, ShipBase.LARGE);
   assert.ok(properties.maneuverKeys);
   assert.equal(properties.maneuverKeys.length, 16);
   assert.ok(properties.shipActionKeys);
   assert.equal(properties.shipActionKeys.length, 3);
});

QUnit.test("Ship properties TIE Fighter", function(assert)
{
   const ship = Ship.TIE_FIGHTER;
   const properties = Ship.properties[ship];
   assert.equal(properties.name, "TIE Fighter");
   assert.equal(properties.primaryWeaponValue, 2);
   assert.equal(properties.agilityValue, 3);
   assert.equal(properties.hullValue, 3);
   assert.equal(properties.shieldValue, 0);
   assert.equal(properties.key, ship);
   assert.equal(properties.primaryFiringArcKey, FiringArc.FORWARD);
   assert.equal(properties.shipBaseKey, ShipBase.SMALL);
   assert.ok(properties.maneuverKeys);
   assert.equal(properties.maneuverKeys.length, 16);
   assert.ok(properties.shipActionKeys);
   assert.equal(properties.shipActionKeys.length, 3);
});

QUnit.test("Ship properties X-Wing", function(assert)
{
   const ship = Ship.X_WING;
   const properties = Ship.properties[ship];
   assert.equal(properties.name, "X-Wing");
   assert.equal(properties.primaryWeaponValue, 3);
   assert.equal(properties.agilityValue, 2);
   assert.equal(properties.hullValue, 3);
   assert.equal(properties.shieldValue, 2);
   assert.equal(properties.key, ship);
   assert.equal(properties.primaryFiringArcKey, FiringArc.FORWARD);
   assert.equal(properties.shipBaseKey, ShipBase.SMALL);
   assert.ok(properties.maneuverKeys);
   assert.equal(properties.maneuverKeys.length, 15);
   assert.ok(properties.shipActionKeys);
   assert.equal(properties.shipActionKeys.length, 2);
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = Ship.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(Ship);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = Ship[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(Ship.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return Ship[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("required properties", function(assert)
{
   Ship.values().forEach(function(ship)
   {
      assert.ok(ship.name, "Missing name for " + ship.name);
      assert.ok(ship.shipBaseKey, "Missing shipBaseKey for " + ship.name);
      assert.ok(ship.maneuverKeys, "Missing maneuverKeys for " + ship.name);
      ship.maneuverKeys.forEach(function(maneuverKey)
      {
         assert.ok(maneuverKey, "Missing maneuverKey for " + ship.name);
      });
      assert.ok(ship.key, "Missing key for " + ship.name);

      if (!ShipBase.isHuge(ship.shipBaseKey))
      {
         assert.equal(ship.primaryWeaponValue !== undefined, true, "Missing primaryWeaponValue for " + ship.name);
         assert.equal(ship.agilityValue !== undefined, true, "Missing agilityValue for " + ship.name);
         assert.equal(ship.hullValue !== undefined, true, "Missing hullValue for " + ship.name);
         assert.equal(ship.shieldValue !== undefined, true, "Missing shieldValue for " + ship.name);
         assert.ok(ship.primaryFiringArcKey, "Missing primaryFiringArcKey for " + ship.name);
         assert.ok(ship.shipActionKeys, "Missing shipActionKeys for " + ship.name);
         ship.shipActionKeys.forEach(function(shipActionKey)
         {
            assert.ok(shipActionKey, "Missing shipActionKey for " + ship.name);
         });
      }
   });
});

QUnit.test("values()", function(assert)
{
   // Run.
   const result = Ship.keys();

   // Verify.
   assert.ok(result);
   const length = 53;
   assert.equal(result.length, length);
   assert.equal(result[0], "aggressor");
   assert.equal(result[length - 1], "raiderClassCorvette");

   const properties = Object.getOwnPropertyNames(Ship);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const ShipTest = {};
export default ShipTest;