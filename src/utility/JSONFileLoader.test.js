import JSONFileLoader from "./JSONFileLoader.js";

QUnit.module("JSONFileLoader");

QUnit.test("loadFile()", function(assert)
{
   // Setup.
   const filepath = "https://cdn.jsdelivr.net/npm/xwing-data@0.65.0/data/ships.js";
   const callback = function(content)
   {
      assert.ok(content);
      assert.ok(Array.isArray(content));
      assert.equal(content.length, 56);
      done();
   };

   // Run.
   const done = assert.async();
   JSONFileLoader.loadFile(filepath, callback);
});

const JSONFileLoaderTest = {};
export default JSONFileLoaderTest;