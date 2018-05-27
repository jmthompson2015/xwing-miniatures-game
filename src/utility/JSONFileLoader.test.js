"use strict";

define(["qunit", "utility/JSONFileLoader"],
   function(QUnit, JSONFileLoader)
   {
      QUnit.module("JSONFileLoader");

      QUnit.test("loadFile()", function(assert)
      {
         // Setup.
         var filepath = "../../lib/xwing-data/data/ships.js";
         var callback = function(content)
         {
            assert.ok(content);
            assert.ok(Array.isArray(content));
            assert.equal(content.length, 55);
            done();
         };

         // Run.
         var done = assert.async();
         JSONFileLoader.loadFile(filepath, callback);
      });
   });