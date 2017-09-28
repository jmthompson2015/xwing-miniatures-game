"use strict";

define(["qunit", "artifact/js/DamageCard", "artifact/js/Event", "artifact/js/PilotCard", "artifact/js/UpgradeCard",
  "model/js/Ability", "model/js/DamageAbility0", "model/js/PilotAbility0", "model/js/UpgradeAbility0"],
   function(QUnit, DamageCard, Event, PilotCard, UpgradeCard,
      Ability, DamageAbility0, PilotAbility0, UpgradeAbility0)
   {
      QUnit.module("Ability");

      QUnit.test("Ability properties", function(assert)
      {
         // Setup.
         var source = UpgradeCard;
         var sourceKey = UpgradeCard.RECON_SPECIALIST;
         var type = UpgradeAbility0;
         var abilityKey = Event.SHIP_ACTION_PERFORMED;
         var ability = new Ability(source, sourceKey, type, abilityKey);

         // Run / Verify.
         assert.equal(ability.source(), source);
         assert.equal(ability.sourceKey(), sourceKey);
         assert.equal(ability.type(), type);
         assert.equal(ability.abilityKey(), abilityKey);

         assert.ok(ability.sourceObject());
         assert.ok(ability.ability());
         assert.ok(ability.condition());
         assert.ok(ability.consequent());
      });

      QUnit.test("isDamage()", function(assert)
      {
         // Setup.
         var ability = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility0, Event.SHIP_ACTION_PERFORMED);

         // Run / Verify.
         assert.ok(ability.isDamage());
         assert.ok(!ability.isPilotCard());
         assert.ok(!ability.isUpgrade());
      });

      QUnit.test("isPilotCard()", function(assert)
      {
         // Setup.
         var ability = new Ability(PilotCard, PilotCard.DASH_RENDAR, PilotAbility0, Event.SHIP_ACTION_PERFORMED);

         // Run / Verify.
         assert.ok(!ability.isDamage());
         assert.ok(ability.isPilotCard());
         assert.ok(!ability.isUpgrade());
      });

      QUnit.test("isUpgrade()", function(assert)
      {
         // Setup.
         var ability = new Ability(UpgradeCard, UpgradeCard.RECON_SPECIALIST, UpgradeAbility0, Event.SHIP_ACTION_PERFORMED);

         // Run / Verify.
         assert.ok(!ability.isDamage());
         assert.ok(!ability.isPilotCard());
         assert.ok(ability.isUpgrade());
      });

      QUnit.test("toString()", function(assert)
      {
         // Setup.
         var ability = new Ability(UpgradeCard, UpgradeCard.RECON_SPECIALIST, UpgradeAbility0, Event.SHIP_ACTION_PERFORMED);

         // Run.
         var result = ability.toString();

         // Verify.
         assert.ok(result);
         assert.equal(result, "Ability source=UpgradeCard,sourceKey=reconSpecialist,type=model/js/UpgradeAbility0,abilityKey=shipActionPerformed,context=undefined");
      });
   });
