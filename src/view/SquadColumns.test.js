import SquadColumns from "./SquadColumns.js";

QUnit.module("SquadColumns");

QUnit.test("properties", function(assert)
{
   assert.equal(Object.getOwnPropertyNames(SquadColumns).length, 10);
});

const SquadColumnsTest = {};
export default SquadColumnsTest;