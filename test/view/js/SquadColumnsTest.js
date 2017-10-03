"use strict";

define(["qunit", "view/js/SquadColumns"], function(QUnit, SquadColumns)
{
   QUnit.module("SquadColumns");

   QUnit.test("properties", function(assert)
   {
      assert.equal(Object.getOwnPropertyNames(SquadColumns).length, 10);
   });
});
