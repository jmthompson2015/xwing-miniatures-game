"use strict";

define(["qunit", "artifact/js/CardResolver", "artifact/js/CardType", "artifact/js/ConditionCard", "artifact/js/DamageCard", "artifact/js/PilotCard", "artifact/js/UpgradeCard"],
   function(QUnit, CardResolver, CardType, ConditionCard, DamageCard, PilotCard, UpgradeCard)
   {
      QUnit.module("CardResolver");

      QUnit.test("resolve() Condition", function(assert)
      {
         assert.equal(CardResolver.resolve(CardType.CONDITION, ConditionCard.FANATICAL_DEVOTION), ConditionCard.properties[ConditionCard.FANATICAL_DEVOTION]);
         assert.equal(CardResolver.resolve(CardType.CONDITION, ConditionCard.ILL_SHOW_YOU_THE_DARK_SIDE), ConditionCard.properties[ConditionCard.ILL_SHOW_YOU_THE_DARK_SIDE]);
      });

      QUnit.test("resolve() Damage", function(assert)
      {
         assert.equal(CardResolver.resolve(CardType.DAMAGE, DamageCard.BLINDED_PILOT), DamageCard.properties[DamageCard.BLINDED_PILOT]);
      });

      QUnit.test("resolve() Pilot", function(assert)
      {
         assert.equal(CardResolver.resolve(CardType.PILOT, PilotCard.LUKE_SKYWALKER), PilotCard.properties[PilotCard.LUKE_SKYWALKER]);
         assert.equal(CardResolver.resolve(CardType.PILOT, PilotCard.KYLE_KATARN), PilotCard.properties[PilotCard.KYLE_KATARN]);
      });

      QUnit.test("resolve() Upgrade", function(assert)
      {
         assert.equal(CardResolver.resolve(CardType.UPGRADE, UpgradeCard.ADRENALINE_RUSH), UpgradeCard.properties[UpgradeCard.ADRENALINE_RUSH]);
      });
   });
