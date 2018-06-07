import DamageCard from "../artifact/DamageCard.js";
import Event from "../artifact/Event.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Ability from "./Ability.js";
import DamageAbility0 from "./DamageAbility0.js";
import PilotAbility0 from "./PilotAbility0.js";
import UpgradeAbility0 from "./UpgradeAbility0.js";

QUnit.module("Ability");

QUnit.test("Ability properties", function(assert)
{
   // Setup.
   const source = UpgradeCard;
   const sourceKey = UpgradeCard.RECON_SPECIALIST;
   const type = UpgradeAbility0;
   const abilityKey = Event.SHIP_ACTION_PERFORMED;
   const ability = new Ability(source, sourceKey, type, abilityKey);

   // Run / Verify.
   assert.equal(ability.source(), source);
   assert.equal(ability.sourceKey(), sourceKey);
   assert.equal(ability.abilityType(), type);
   assert.equal(ability.abilityKey(), abilityKey);

   assert.ok(ability.sourceObject());
   assert.ok(ability.ability());
   assert.ok(ability.condition());
   assert.ok(ability.consequent());
});

QUnit.test("isDamage()", function(assert)
{
   // Setup.
   const ability = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility0, Event.SHIP_ACTION_PERFORMED);

   // Run / Verify.
   assert.ok(ability.isDamage());
   assert.ok(!ability.isPilotCard());
   assert.ok(!ability.isUpgrade());
});

QUnit.test("isPilotCard()", function(assert)
{
   // Setup.
   const ability = new Ability(PilotCard, PilotCard.DASH_RENDAR, PilotAbility0, Event.SHIP_ACTION_PERFORMED);

   // Run / Verify.
   assert.ok(!ability.isDamage());
   assert.ok(ability.isPilotCard());
   assert.ok(!ability.isUpgrade());
});

QUnit.test("isUpgrade()", function(assert)
{
   // Setup.
   const ability = new Ability(UpgradeCard, UpgradeCard.RECON_SPECIALIST, UpgradeAbility0, Event.SHIP_ACTION_PERFORMED);

   // Run / Verify.
   assert.ok(!ability.isDamage());
   assert.ok(!ability.isPilotCard());
   assert.ok(ability.isUpgrade());
});

QUnit.test("toString()", function(assert)
{
   // Setup.
   const ability = new Ability(UpgradeCard, UpgradeCard.RECON_SPECIALIST, UpgradeAbility0, Event.SHIP_ACTION_PERFORMED);

   // Run.
   const result = ability.toString();

   // Verify.
   assert.ok(result);
   assert.equal(result, "Ability source=UpgradeCard,sourceKey=reconSpecialist,abilityType=model/UpgradeAbility0,abilityKey=shipActionPerformed,context=undefined");
});

const AbilityTest = {};
export default AbilityTest;