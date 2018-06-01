import JSONFileLoader from "./JSONFileLoader.js";

QUnit.module("JSONFileLoader");

QUnit.test("loadFile()", function(assert)
{
   // Setup.
   var filepath = "https://cdn.jsdelivr.net/npm/xwing-data@0.65.0/data/ships.js";
   var callback = function(content)
   {
      assert.ok(content);
      assert.ok(Array.isArray(content));
      assert.equal(content.length, 56);
      done();
   };

   // Run.
   var done = assert.async();
   JSONFileLoader.loadFile(filepath, callback);
});

const JSONFileLoaderTest = {};
export default JSONFileLoaderTest;