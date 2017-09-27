"use strict";

define(["qunit", "common/js/ArrayAugments"],
   /*jshint -W098 */
   function(QUnit, ArrayAugments)
   {
      QUnit.module("ArrayAugments");

      QUnit.test("xwingAddAll()", function(assert)
      {
         // Setup.
         var array1 = [1];
         var array2 = [2, 3, 4];

         // Run.
         array1.xwingAddAll(array2);

         // Verify.
         assert.equal(array1.length, 4);
         assert.equal(array1[0], 1);
         assert.equal(array1[1], 2);
         assert.equal(array1[2], 3);
         assert.equal(array1[3], 4);
      });

      QUnit.test("xwingIntersect()", function(assert)
      {
         // Setup.
         var array1 = [1, 2, 3];
         var array2 = [2, 3, 4, 5];

         // Run.
         var result = array1.xwingIntersect(array2);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result.join(","), "2,3");
         assert.equal(array1.length, 3);
         assert.equal(array1.join(","), "1,2,3");
         assert.equal(array2.length, 4);
         assert.equal(array2.join(","), "2,3,4,5");
      });

      QUnit.test("xwingRandomElement()", function(assert)
      {
         var array = [1, 2, 3, 4];

         for (var i = 0; i < 10; i++)
         {
            assert.ok(array.includes(array.xwingRandomElement()));
         }
      });

      QUnit.test("xwingRemove()", function(assert)
      {
         // Setup.
         var array = [1, 2, 3, 4];

         // Run.
         array.xwingRemove(2);

         // Verify.
         assert.equal(array.length, 3);
         assert.equal(array[0], 1);
         assert.equal(array[1], 3);
         assert.equal(array[2], 4);
      });

      QUnit.test("xwingShuffle()", function(assert)
      {
         var array = [1, 2, 3, 4];

         for (var i = 0; i < 10; i++)
         {
            array.xwingShuffle();
            assert.equal(array.length, 4);
            assert.ok(0 < array[0] && array[0] < 5);
         }
      });
   });
