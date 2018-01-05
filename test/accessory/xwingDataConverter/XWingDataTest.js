"use strict";

define(["qunit", "accessory/xwingDataConverter/XWingData", "accessory/xwingDataConverter/XWingType"],
   function(QUnit, XWingData, XWingType)
   {
      QUnit.module("XWingData");

      QUnit.test("XWingData()", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Verify.
            assert.ok(xwingData);
            assert.equal(xwingData.dataByType(XWingType.CONDITIONS).length, 8);
            assert.equal(xwingData.dataByType(XWingType.DAMAGES).length, 14);
            assert.equal(xwingData.dataByType(XWingType.DAMAGES_TFA).length, 14);
            assert.equal(xwingData.dataByType(XWingType.PILOTS).length, 285);
            assert.equal(xwingData.dataByType(XWingType.SHIPS).length, 55);
            assert.equal(xwingData.dataByType(XWingType.SOURCES).length, 61);
            assert.equal(xwingData.dataByType(XWingType.UPGRADES).length, 354);
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("findById() X-Wing", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.findById(XWingType.SHIPS, 0);

            // Verify.
            assert.ok(result);
            assert.equal(result.id, 0);
            assert.equal(result.name, "X-wing");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("findByName() Y-Wing", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.findByName(XWingType.SHIPS, "Y-wing");

            // Verify.
            assert.ok(result);
            assert.equal(result.id, 1);
            assert.equal(result.name, "Y-wing");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("findShip() Dengar", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.findShip(161);

            // Verify.
            assert.ok(result);
            assert.equal(result.id, 34);
            assert.equal(result.name, "JumpMaster 5000");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("findShip() Luke Skywalker", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.findShip(5);

            // Verify.
            assert.ok(result);
            assert.equal(result.id, 0);
            assert.equal(result.name, "X-wing");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("findSources() Luke Skywalker", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.findSources(XWingType.PILOTS, 5);

            // Verify.
            assert.ok(result);
            assert.ok(Array.isArray(result));
            assert.equal(result.length, 1);
            var result0 = result[0];
            assert.ok(result0);
            assert.equal(result0.id, 0);
            assert.equal(result0.name, "Core Set");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("findSources() StarViper", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.findSources(XWingType.SHIPS, 21);

            // Verify.
            assert.ok(result);
            assert.ok(Array.isArray(result));
            assert.equal(result.length, 2);
            var result0 = result[0];
            assert.ok(result0);
            assert.equal(result0.id, 24);
            assert.equal(result0.name, "StarViper Expansion Pack");
            var result1 = result[1];
            assert.ok(result1);
            assert.equal(result1.id, 55);
            assert.equal(result1.name, "Guns for Hire Expansion Pack");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("findSources() TIE/fo Fighter", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.findSources(XWingType.SHIPS, 31);

            // Verify.
            assert.ok(result);
            assert.ok(Array.isArray(result));
            assert.equal(result.length, 2);
            var result0 = result[0];
            assert.ok(result0);
            assert.equal(result0.id, 32);
            assert.equal(result0.name, "The Force Awakens Core Set");
            var result1 = result[1];
            assert.ok(result1);
            assert.equal(result1.id, 34);
            assert.equal(result1.name, "TIE/fo Fighter Expansion Pack");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("findSources() X-Wing", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.findSources(XWingType.SHIPS, 0);

            // Verify.
            assert.ok(result);
            assert.ok(Array.isArray(result));
            assert.equal(result.length, 3);
            var result0 = result[0];
            assert.ok(result0);
            assert.equal(result0.id, 0);
            assert.equal(result0.name, "Core Set");
            var result1 = result[1];
            assert.ok(result1);
            assert.equal(result1.id, 1);
            assert.equal(result1.name, "X-wing Expansion Pack");
            var result2 = result[2];
            assert.ok(result2);
            assert.equal(result2.id, 20);
            assert.equal(result2.name, "Rebel Transport Expansion Pack");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("firstSource() StarViper", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.firstSource(XWingType.SHIPS, 21);

            // Verify.
            assert.ok(result);
            assert.equal(result.id, 24);
            assert.equal(result.name, "StarViper Expansion Pack");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });

      QUnit.test("firstSource() TIE/fo Fighter", function(assert)
      {
         // Setup.
         var callback = function()
         {
            // Run.
            var result = xwingData.firstSource(XWingType.SHIPS, 31);

            // Verify.
            assert.ok(result);
            assert.equal(result.id, 34);
            assert.equal(result.name, "TIE/fo Fighter Expansion Pack");
            done();
         };

         // Run.
         var done = assert.async();
         var xwingData = new XWingData();
         xwingData.load(callback);
      });
   });
