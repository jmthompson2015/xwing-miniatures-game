"use strict";

define(["qunit", "artifact/js/Event"], function(QUnit, Event)
{
   QUnit.module("Event");

   QUnit.test("Event properties Target Lock Acquired", function(assert)
   {
      var event = Event.TARGET_LOCK_ACQUIRED;
      var properties = Event.properties[event];
      assert.equal(properties.name, "Target Lock Acquired");
      assert.equal(properties.key, "targetLockAcquired");
   });

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = Event.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(Event);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = Event[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(Event.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return Event[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = Event.keys();

      // Verify.
      assert.ok(result);
      var length = 9;
      assert.equal(result.length, length);
      assert.equal(result[0], Event.AFTER_EXECUTE_MANEUVER);
      assert.equal(result[length - 1], Event.TARGET_LOCK_ACQUIRED);

      var properties = Object.getOwnPropertyNames(Event);
      var count = properties.length - 1 - // properties
         1 - // createData
         1 - // keys
         1 - // toString
         1; // values
      assert.equal(result.length, count);
   });
});
