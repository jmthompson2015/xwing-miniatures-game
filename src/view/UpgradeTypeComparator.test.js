import ArrayUtilities from "../utility/ArrayUtilities.js";

import PilotCard from "../artifact/PilotCard.js";
import UpgradeType from "../artifact/UpgradeType.js";

import UpgradeTypeComparator from "./UpgradeTypeComparator.js";

QUnit.module("UpgradeTypeComparator");

QUnit.test("sort() All PilotCards", function(assert)
{
   const pilotKeys = PilotCard.keys();
   const pilots = [];

   pilotKeys.forEach(function(pilotKey)
   {
      const pilot = PilotCard.properties[pilotKey];

      if (pilot.fore)
      {
         pilots.push(pilot.fore);
         pilots.push(pilot.aft);
      }
      else
      {
         pilots.push(pilot);
      }
   });

   pilots.forEach(function(pilot)
   {
      const upgradeTypeKeys = pilot.upgradeTypeKeys;
      const result = upgradeTypeKeys.slice();
      ArrayUtilities.shuffle(result);
      result.sort(UpgradeTypeComparator);
      verifyResult(assert, upgradeTypeKeys, result, pilot);
   });
});

QUnit.test("sort() Aggressor IG-88A", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.CANNON, UpgradeType.BOMB, UpgradeType.ILLICIT];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() ARC-170 Norra Wexley", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.ASTROMECH];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() B-Wing Ibtisam", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.TORPEDO, UpgradeType.TORPEDO];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() CR90 Corvette (Fore)", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.CREW, UpgradeType.HARDPOINT, UpgradeType.HARDPOINT, UpgradeType.TEAM, UpgradeType.TEAM, UpgradeType.CARGO];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() E-Wing Corran Horn", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.ASTROMECH];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() Firespray-31 Boba Fett (Scum)", function(assert)
{
   // Setup.
   // Conflict: BOMB < MISSILE
   // const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.BOMB, UpgradeType.CREW, UpgradeType.MISSILE, UpgradeType.ILLICIT];
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.ILLICIT];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() G-1A Starfighter Zuckuss", function(assert)
{
   // Setup.
   // Conflict: CREW < SYSTEM
   // const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.CREW, UpgradeType.SYSTEM, UpgradeType.ILLICIT];
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CREW, UpgradeType.ILLICIT];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() HWK-290 (Rebel) Jan Ors", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.CREW];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() HWK-290 (Scum) Dace Bonearm", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.CREW, UpgradeType.ILLICIT];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() JumpMaster 5000 Dengar", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.SALVAGED_ASTROMECH, UpgradeType.ILLICIT];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() K-Wing Miranda Doni", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.BOMB];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() T-70 X-Wing Poe Dameron", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH, UpgradeType.TECH];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() TIE Bomber Captain Jonus", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() TIE Punisher Redline", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB, UpgradeType.BOMB];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() U-Wing Cassian Andor", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() VCX-100 Hera Syndulla", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.SYSTEM, UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() VT-49 Decimator", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.BOMB];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() X-Wing Luke Skywalker", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() Y-Wing (Scum) Drea Renthal", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.SALVAGED_ASTROMECH];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() YT-1300 Han Solo (HotR)", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() YT-2400 Dash Rendar", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

QUnit.test("sort() YV-666 Bossk", function(assert)
{
   // Setup.
   const upgradeTypeKeys = [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.ILLICIT];
   const result = upgradeTypeKeys.slice();
   ArrayUtilities.shuffle(result);

   // Run.
   result.sort(UpgradeTypeComparator);

   // Verify.
   verifyResult(assert, upgradeTypeKeys, result);
});

function verifyResult(assert, upgradeTypeKeys, result, pilot)
{
   // Verify.
   assert.ok(result);
   assert.equal(result.length, upgradeTypeKeys.length);

   for (let i = 0; i < upgradeTypeKeys.length; i++)
   {
      assert.equal(result[i], upgradeTypeKeys[i], (pilot ? pilot.name : ""));
   }
}

const UpgradeTypeComparatorTest = {};
export default UpgradeTypeComparatorTest;