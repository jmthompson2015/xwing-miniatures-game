"use strict";

define(["qunit", "artifact/js/PilotCard", "artifact/js/UpgradeCard",
   "model/js/DamageDealer", "model/js/EnvironmentAction", "model/js/Position", "model/js/CardInstance", "model/js/CardAction",
  "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, PilotCard, UpgradeCard,
      DamageDealer, EnvironmentAction, Position, CardInstance, CardAction, EnvironmentFactory)
   {
      QUnit.module("DamageDealer");

      QUnit.test("DamageDealer()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var hitCount = 2;
         var criticalHitCount = 3;
         var defender = environment.tokens()[0]; // TIE Fighter
         var evadeCount = 1;

         // Run.
         var damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);

         // Verify.
         assert.equal(damageDealer.hits(), 1);
         assert.equal(damageDealer.criticalHits(), 3);
         assert.equal(damageDealer.remainingEvades(), 0);
      });

      QUnit.test("dealDamage()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var hitCount = 2;
         var criticalHitCount = 3;
         var defender = environment.tokens()[0]; // TIE Fighter
         var evadeCount = 1;
         var damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);
         assert.equal(defender.damageCount(), 0);
         assert.equal(defender.criticalDamageCount(), 0);

         // Run.
         damageDealer.dealDamage();

         // Verify.
         assert.equal(defender.damageCount() + defender.criticalDamageCount(), 4);
      });

      QUnit.test("dealDamage() shields", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var hitCount = 2;
         var criticalHitCount = 3;
         var defender = environment.tokens()[2]; // X-Wing
         var evadeCount = 1;
         var damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);
         assert.equal(defender.damageCount(), 0);
         assert.equal(defender.criticalDamageCount(), 0);

         // Run.
         damageDealer.dealDamage();

         // Verify.
         assert.equal(defender.damageCount() + defender.criticalDamageCount(), 2);
      });

      QUnit.test("dealDamage() Determination", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var hitCount = 2;
         var criticalHitCount = 1;
         var defender = environment.tokens()[2];
         store.dispatch(CardAction.addUpgrade(defender, UpgradeCard.DETERMINATION));
         var evadeCount = 0;
         var damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);
         assert.equal(defender.damageCount(), 0);
         assert.equal(defender.criticalDamageCount(), 0);

         // Run.
         damageDealer.dealDamage();

         // Verify.
         var sum = defender.damageCount() + defender.criticalDamageCount();
         assert.ok(0 <= sum && sum <= 1);
      });

      QUnit.test("dealDamage() Chewbacca", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var hitCount = 2;
         var criticalHitCount = 3;
         var rebelAgent = environment.tokens()[2].agent();
         var defender = new CardInstance(store, PilotCard.CHEWBACCA, rebelAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), defender));
         store.dispatch(CardAction.addShieldCount(defender, -3)); // two shields remaining
         var evadeCount = 1;
         var damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);
         assert.equal(defender.damageCount(), 0);
         assert.equal(defender.criticalDamageCount(), 0);

         // Run.
         damageDealer.dealDamage();

         // Verify.
         assert.equal(defender.damageCount(), 2);
         assert.equal(defender.criticalDamageCount(), 0);
      });
   });
