import CardResolver from "./CardResolver.js";
import CardType from "./CardType.js";
import ConditionCard from "./ConditionCard.js";
import DamageCard from "./DamageCard.js";
import PilotCard from "./PilotCard.js";
import UpgradeCard from "./UpgradeCard.js";

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

const CardResolverTest = {};
export default CardResolverTest;