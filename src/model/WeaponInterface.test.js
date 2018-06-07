import FiringArc from "../artifact/FiringArc.js";
import Range from "../artifact/Range.js";

import Weapon from "./Weapon.js";

QUnit.module("WeaponInterface");

QUnit.test("Weapon interface", function(assert)
{
   // Setup.
   const name = "myWeapon";
   const weaponValue = 12;
   const ranges = [Range.TWO, Range.THREE];
   const firingArc = FiringArc.FORWARD;

   const weapon0 = new Weapon(name, weaponValue, ranges, firingArc);
   const weapons = [weapon0];

   // Run / Verify.
   for (let i = 0; i < weapons.length; i++)
   {
      const weapon = weapons[i];

      // Verify the functions exist.
      assert.ok(weapon.name);
      assert.ok(weapon.weaponValue);
      assert.ok(weapon.rangeKeys);
      assert.ok(weapon.primaryFiringArcKey);
      assert.ok(weapon.auxiliaryFiringArcKey);
      assert.ok(weapon.upgradeKey);
      assert.ok(weapon.isDefenderInFiringArc);
      assert.ok(weapon.isDefenderInRange);
      assert.ok(weapon.isDefenderTargetable);
      assert.ok(weapon.isPrimary);
      assert.ok(weapon.toString);
   }
});

const WeaponInterfaceTest = {};
export default WeaponInterfaceTest;