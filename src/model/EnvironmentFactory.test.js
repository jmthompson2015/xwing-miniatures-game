import EnvironmentFactory from "./EnvironmentFactory.js";

QUnit.module("EnvironmentFactory");

QUnit.test("createCoreSetEnvironment()", function(assert)
{
   // Run.
   var result = EnvironmentFactory.createCoreSetEnvironment();

   // Verify.
   assert.ok(result);
   assert.equal(result.pilotInstances().length, 3);
   var token0 = result.pilotInstances()[0]; // TIE Fighter.
   assert.equal(token0.card().key, "maulerMithel");
   var token1 = result.pilotInstances()[1]; // TIE Fighter.
   assert.equal(token1.card().key, "darkCurse");
   var token2 = result.pilotInstances()[2]; // X-Wing.
   assert.equal(token2.card().key, "lukeSkywalker");
});

QUnit.test("createTFACoreSetEnvironment()", function(assert)
{
   // Run.
   var result = EnvironmentFactory.createTFACoreSetEnvironment();

   // Verify.
   assert.ok(result);
   assert.equal(result.pilotInstances().length, 3);
   var token0 = result.pilotInstances()[0]; // TIE Fighter.
   assert.equal(token0.card().key, "epsilonLeader");
   var token1 = result.pilotInstances()[1]; // TIE Fighter.
   assert.equal(token1.card().key, "zetaAce");
   var token2 = result.pilotInstances()[2]; // X-Wing.
   assert.equal(token2.card().key, "poeDameron");
});

QUnit.test("createHugeShipEnvironment()", function(assert)
{
   // Run.
   var result = EnvironmentFactory.createHugeShipEnvironment();

   // Verify.
   assert.ok(result);
   var tokens = result.pilotInstances();
   assert.equal(tokens.length, 6);
   var i = 0;
   assert.equal(tokens[i++].card().key, "gozantiClassCruiser");
   assert.equal(tokens[i++].card().key, "junoEclipse");
   assert.equal(tokens[i++].card().key, "raiderClassCorvette");
   assert.equal(tokens[i++].card().key, "cr90Corvette");
   assert.equal(tokens[i++].card().key, "wesJanson");
   assert.equal(tokens[i++].card().key, "gr75MediumTransport");
});

const EnvironmentFactoryTest = {};
export default EnvironmentFactoryTest;