import Position from "./Position.js";

QUnit.module("Position");

QUnit.test("Position()", function(assert)
{
   const position = new Position(1, 2, 3);

   assert.equal(position.x(), 1);
   assert.equal(position.y(), 2);
   assert.equal(position.heading(), 3);
});

QUnit.test("Position() over 360", function(assert)
{
   const position = new Position(1, 2, 363);

   assert.equal(position.x(), 1);
   assert.equal(position.y(), 2);
   assert.equal(position.heading(), 3);
});

QUnit.test("Position() constants", function(assert)
{
   const position = Position.ZERO;

   assert.equal(position.x(), 0);
   assert.equal(position.y(), 0);
   assert.equal(position.heading(), 0);
});

QUnit.test("Position.computeBearing()", function(assert)
{
   // Setup.
   const x = 10;
   const y = 10;
   const position = new Position(x, y, 0);

   // Run / Verify.
   assert.equal(position.computeBearing(x + 1, y + 0), 0);
   assert.equal(position.computeBearing(x + 1, y + 1), 45);
   assert.equal(position.computeBearing(x - 0, y + 1), 90);
   assert.equal(position.computeBearing(x - 1, y + 1), 135);
   assert.equal(position.computeBearing(x - 1, y - 0), 180);
   assert.equal(position.computeBearing(x - 1, y - 1), 225);
   assert.equal(position.computeBearing(x + 0, y - 1), 270);
   assert.equal(position.computeBearing(x + 1, y - 1), 315);
});

QUnit.test("Position.computeDistance()", function(assert)
{
   // Setup.
   const position0 = new Position(100, 200, 0);
   const position1 = new Position(position0.x() + 100, position0.y() + 1, 0);
   const position2 = new Position(position0.x() - 50, position0.y() + 10, 0);
   const position3 = new Position(position0.x() - 10, position0.y() - 50, 0);
   const position4 = new Position(position0.x() + 1, position0.y() - 100, 0);

   // Run / Verify.
   assert.equal(position0.computeDistance(position1), 100);
   assert.equal(position0.computeDistance(position2), 51);
   assert.equal(position0.computeDistance(position3), 51);
   assert.equal(position0.computeDistance(position4), 100);
});

QUnit.test("Position.computeHeading()", function(assert)
{
   const x = 10;
   const y = 10;

   assert.equal(Position.computeHeading(x, y, x + 1, y + 0), 0);
   assert.equal(Position.computeHeading(x, y, x + 1, y + 1), 45);
   assert.equal(Position.computeHeading(x, y, x - 0, y + 1), 90);
   assert.equal(Position.computeHeading(x, y, x - 1, y + 1), 135);
   assert.equal(Position.computeHeading(x, y, x - 1, y - 0), 180);
   assert.equal(Position.computeHeading(x, y, x - 1, y - 1), 225);
   assert.equal(Position.computeHeading(x, y, x + 0, y - 1), 270);
   assert.equal(Position.computeHeading(x, y, x + 1, y - 1), 315);
});

QUnit.test("Position.normalizeAngle()", function(assert)
{
   assert.equal(Position.normalizeAngle(3), 3);
   assert.equal(Position.normalizeAngle(363), 3);
   assert.equal(Position.normalizeAngle(-357), 3);
});

QUnit.test("Position().toString()", function(assert)
{
   // Setup.
   const position0 = new Position(1, 2, 363);

   // Run / Verify.
   assert.equal(position0.toString(), "(1, 2, 3)");
});

const PositionTest = {};
export default PositionTest;