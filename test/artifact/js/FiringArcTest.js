"use strict";

define(["qunit", "artifact/js/FiringArc"], function(QUnit, FiringArc)
{
   QUnit.module("FiringArc");

   QUnit.test("FiringArc.isInFiringArc() Forward", function(assert)
   {
      var arc = FiringArc.FORWARD;
      var isInFiringArc = FiringArc.properties[arc].isInFiringArc;
      assert.ok(isInFiringArc(0));
      assert.ok(isInFiringArc(45));
      assert.ok(!isInFiringArc(46));
      assert.ok(!isInFiringArc(134));
      assert.ok(!isInFiringArc(135));
      assert.ok(!isInFiringArc(225));
      assert.ok(!isInFiringArc(226));
      assert.ok(!isInFiringArc(314));
      assert.ok(isInFiringArc(315));
   });

   QUnit.test("FiringArc.isInFiringArc() Aft", function(assert)
   {
      var arc = FiringArc.AFT;
      var isInFiringArc = FiringArc.properties[arc].isInFiringArc;
      assert.ok(!isInFiringArc(0));
      assert.ok(!isInFiringArc(45));
      assert.ok(!isInFiringArc(46));
      assert.ok(!isInFiringArc(134));
      assert.ok(isInFiringArc(135));
      assert.ok(isInFiringArc(225));
      assert.ok(!isInFiringArc(226));
      assert.ok(!isInFiringArc(314));
      assert.ok(!isInFiringArc(315));
   });

   QUnit.test("FiringArc.isInFiringArc() FullAft", function(assert)
   {
      var arc = FiringArc.FULL_AFT;
      var isInFiringArc = FiringArc.properties[arc].isInFiringArc;
      assert.ok(!isInFiringArc(0), "0 deg");
      assert.ok(!isInFiringArc(45), "45 deg");
      assert.ok(!isInFiringArc(46), "46 deg");
      assert.ok(!isInFiringArc(89), "89 deg");
      assert.ok(isInFiringArc(90), "90 deg");
      assert.ok(isInFiringArc(270), "270 deg");
      assert.ok(!isInFiringArc(271), "271 deg");
      assert.ok(!isInFiringArc(314), "314 deg");
      assert.ok(!isInFiringArc(315), "315 deg");
   });

   QUnit.test("keys and values", function(assert)
   {
      // Setup.

      // Run.
      var result = FiringArc.keys();
      var ownPropertyNames = Object.getOwnPropertyNames(FiringArc);

      // Verify.
      ownPropertyNames.forEach(function(key)
      {
         var key2 = FiringArc[key];

         if (key !== "properties" && typeof key2 === "string")
         {
            assert.ok(FiringArc.properties[key2], "Missing value for key = " + key);
         }
      });

      result.forEach(function(value)
      {
         var p = ownPropertyNames.filter(function(key)
         {
            return FiringArc[key] === value;
         });

         assert.equal(p.length, 1, "Missing key for value = " + value);
      });
   });

   QUnit.test("keys()", function(assert)
   {
      // Run.
      var result = FiringArc.keys();

      // Verify.
      assert.ok(result);
      assert.equal(result.length, 3);
      assert.equal(result[0], "forward");
      assert.equal(result[1], "aft");
      assert.equal(result[2], "fullAft");

      var properties = Object.getOwnPropertyNames(FiringArc);
      var count = properties.length - 1 - // properties
         1 - // keys
         1 - // toString
         1; // values
      assert.equal(result.length, count);
   });
});
