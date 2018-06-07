import Event from "./Event.js";

QUnit.module("Event");

QUnit.test("Event properties Target Lock Acquired", function(assert)
{
   const event = Event.TARGET_LOCK_ACQUIRED;
   const properties = Event.properties[event];
   assert.equal(properties.name, "Target Lock Acquired");
   assert.equal(properties.key, "targetLockAcquired");
});

QUnit.test("keys and values", function(assert)
{
   // Setup.

   // Run.
   const result = Event.keys();
   const ownPropertyNames = Object.getOwnPropertyNames(Event);

   // Verify.
   ownPropertyNames.forEach(function(key)
   {
      const key2 = Event[key];

      if (key !== "properties" && typeof key2 === "string")
      {
         assert.ok(Event.properties[key2], "Missing value for key = " + key);
      }
   });

   result.forEach(function(value)
   {
      const p = ownPropertyNames.filter(function(key)
      {
         return Event[key] === value;
      });

      assert.equal(p.length, 1, "Missing key for value = " + value);
   });
});

QUnit.test("keys()", function(assert)
{
   // Run.
   const result = Event.keys();

   // Verify.
   assert.ok(result);
   const length = 11;
   assert.equal(result.length, length);
   assert.equal(result[0], Event.AFTER_EXECUTE_MANEUVER);
   assert.equal(result[length - 1], Event.TARGET_LOCK_ACQUIRED);

   const properties = Object.getOwnPropertyNames(Event);
   const count = properties.length - 1 - // properties
      1 - // keys
      1 - // toString
      1; // values
   assert.equal(result.length, count);
});

const EventTest = {};
export default EventTest;