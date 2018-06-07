import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import CardAction from "./CardAction.js";
import CardInstance from "./CardInstance.js";
import DamageDealer from "./DamageDealer.js";
import EnvironmentAction from "./EnvironmentAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import Position from "./Position.js";

QUnit.module("DamageDealer");

QUnit.test("DamageDealer()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const hitCount = 2;
   const criticalHitCount = 3;
   const defender = environment.pilotInstances()[0]; // TIE Fighter
   const evadeCount = 1;

   // Run.
   const damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);

   // Verify.
   assert.equal(damageDealer.hits(), 1);
   assert.equal(damageDealer.criticalHits(), 3);
   assert.equal(damageDealer.remainingEvades(), 0);
});

QUnit.test("dealDamage()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const hitCount = 2;
   const criticalHitCount = 3;
   const defender = environment.pilotInstances()[0]; // TIE Fighter
   const evadeCount = 1;
   const damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);
   assert.equal(defender.damageCount(), 0);
   assert.equal(defender.criticalDamageCount(), 0);

   // Run.
   damageDealer.dealDamage();

   // Verify.
   assert.ok([4, 5].includes(defender.damageCount() + defender.criticalDamageCount()));
});

QUnit.test("dealDamage() shields", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const hitCount = 2;
   const criticalHitCount = 3;
   const defender = environment.pilotInstances()[2]; // X-Wing
   const evadeCount = 1;
   const damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);
   assert.equal(defender.damageCount(), 0);
   assert.equal(defender.criticalDamageCount(), 0);

   // Run.
   damageDealer.dealDamage();

   // Verify.
   assert.ok([2, 3].includes(defender.damageCount() + defender.criticalDamageCount()));
});

QUnit.test("dealDamage() Determination", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const hitCount = 2;
   const criticalHitCount = 1;
   const defender = environment.pilotInstances()[2];
   const upgrade = new CardInstance(store, UpgradeCard.DETERMINATION);
   store.dispatch(CardAction.addUpgrade(defender, upgrade));
   const evadeCount = 0;
   const damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);
   assert.equal(defender.damageCount(), 0);
   assert.equal(defender.criticalDamageCount(), 0);

   // Run.
   damageDealer.dealDamage();

   // Verify.
   const sum = defender.damageCount() + defender.criticalDamageCount();
   assert.ok([0, 1, 2].includes(sum), "sum = " + sum);
});

QUnit.test("dealDamage() Chewbacca", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const hitCount = 2;
   const criticalHitCount = 3;
   const rebelAgent = environment.pilotInstances()[2].agent();
   const defender = new CardInstance(store, PilotCard.CHEWBACCA_REBEL, rebelAgent);
   store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), defender));
   store.dispatch(CardAction.addShieldCount(defender, -3)); // two shields remaining
   const evadeCount = 1;
   const damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);
   assert.equal(defender.damageCount(), 0);
   assert.equal(defender.criticalDamageCount(), 0);

   // Run.
   damageDealer.dealDamage();

   // Verify.
   assert.equal(defender.damageCount(), 2);
   assert.equal(defender.criticalDamageCount(), 0);
});

const DamageDealerTest = {};
export default DamageDealerTest;