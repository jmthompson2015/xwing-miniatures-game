import MathUtilities from "../utility/MathUtilities.js";

import Path from "./Path.js";

QUnit.module("Path");

QUnit.test("Path properties", function(assert)
{
   // Setup.
   const result = new Path();
   result.add(20, -20);
   result.add(20, 20);
   result.add(-20, 20);
   result.add(-20, -20);
   result.close();

   // Run / Verify.
   assert.ok(result);
   assert.equal(result.points().length, 10);

   let i = 0;
   const points = result.points();
   assert.equal(points[i++], 20);
   assert.equal(points[i++], -20);
   assert.equal(points[i++], 20);
   assert.equal(points[i++], 20);
   assert.equal(points[i++], -20);
   assert.equal(points[i++], 20);
   assert.equal(points[i++], -20);
   assert.equal(points[i++], -20);
   assert.equal(points[i++], 20);
   assert.equal(points[i++], -20);
});

QUnit.test("boundingBox()", function(assert)
{
   // Setup.
   const path = new Path();
   path.add(10, -20);
   path.add(11, 21);
   path.add(-10, 20);
   path.add(-11, -21);
   path.close();

   // Run.
   const result = path.boundingBox();

   // Verify.
   assert.ok(result);
   assert.equal(result.minX, -11);
   assert.equal(result.minY, -21);
   assert.equal(result.maxX, 11);
   assert.equal(result.maxY, 21);
   assert.equal(result.area, 924);
});

QUnit.test("boundingBox() degenerate", function(assert)
{
   // Setup.
   const path = new Path();

   // Run.
   const result = path.boundingBox();

   // Verify.
   assert.ok(!result);
});

QUnit.test("rotate()", function(assert)
{
   // Setup.
   const path = new Path();
   path.add(10, -20);
   path.add(10, 20);
   path.add(-10, 20);
   path.add(-10, -20);
   path.close();

   // Run.
   path.rotate(30.0 * Math.PI / 180.0);

   // Verify.
   let i = 0;
   const points = path.points();
   assert.equal(MathUtilities.round(points[i++], 2), 18.66);
   assert.equal(MathUtilities.round(points[i++], 2), -12.32);
   assert.equal(MathUtilities.round(points[i++], 2), -1.34);
   assert.equal(MathUtilities.round(points[i++], 2), 22.32);
   assert.equal(MathUtilities.round(points[i++], 2), -18.66);
   assert.equal(MathUtilities.round(points[i++], 2), 12.32);
   assert.equal(MathUtilities.round(points[i++], 2), 1.34);
   assert.equal(MathUtilities.round(points[i++], 2), -22.32);
   assert.equal(MathUtilities.round(points[i++], 2), 18.66);
   assert.equal(MathUtilities.round(points[i++], 2), -12.32);
});

QUnit.test("toString()", function(assert)
{
   // Setup.
   const path = new Path();
   path.add(10, -20);
   path.add(10, 20);
   path.add(-10, 20);
   path.add(-10, -20);
   path.close();

   // Run.
   const result = path.toString();

   // Verify.
   assert.equal(result, "0 (10, -20)\n2 (10, 20)\n4 (-10, 20)\n6 (-10, -20)\n8 (10, -20)\n");
});

QUnit.test("translate()", function(assert)
{
   // Setup.
   const path = new Path();
   path.add(10, -20);
   path.add(11, 21);
   path.add(-10, 20);
   path.add(-11, -21);
   path.close();

   // Run.
   path.translate(5, 6);

   // Verify.
   let i = 0;
   const points = path.points();
   assert.equal(points[i++], 15);
   assert.equal(points[i++], -14);
   assert.equal(points[i++], 16);
   assert.equal(points[i++], 27);
   assert.equal(points[i++], -5);
   assert.equal(points[i++], 26);
   assert.equal(points[i++], -6);
   assert.equal(points[i++], -15);
   assert.equal(points[i++], 15);
   assert.equal(points[i++], -14);
});

const PathTest = {};
export default PathTest;