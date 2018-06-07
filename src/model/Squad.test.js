import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Agent from "./Agent.js";
import CardInstance from "./CardInstance.js";
import Reducer from "./Reducer.js";
import Squad from "./Squad.js";
import SquadBuilder from "./SquadBuilder.js";

QUnit.module("Squad");

QUnit.test("Squad()", function(assert)
{
   // Setup.
   const factionKey = Faction.IMPERIAL;
   const name = "US Nationals #1";
   const year = 2014;
   const description = "Lambda Shuttle/TIE Interceptor/Phantom";
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "Agent1");
   const token0 = new CardInstance(store, PilotCard.WHISPER, agent, [UpgradeCard.VETERAN_INSTINCTS, UpgradeCard.FIRE_CONTROL_SYSTEM, UpgradeCard.GUNNER, UpgradeCard.ADVANCED_CLOAKING_DEVICE]);
   const token1 = new CardInstance(store, PilotCard.SOONTIR_FEL, agent, [UpgradeCard.PUSH_THE_LIMIT]);
   const token2 = new CardInstance(store, PilotCard.CAPTAIN_YORR, agent);
   const tokens = [token0, token1, token2];

   // Run.
   const result = new Squad(factionKey, name, year, description, tokens);

   // Verify.
   assert.ok(result);
   assert.equal(result.factionKey(), factionKey);
   assert.equal(result.name(), name);
   assert.equal(result.year(), year);
   assert.equal(result.description(), description);
   assert.ok(result.tokens());
   assert.equal(result.tokens().length, 3);
   assert.equal(result.tokens()[0], token0);
   assert.equal(result.tokens()[1], token1);
   assert.equal(result.tokens()[2], token2);
});

QUnit.test("pilotSkillValue()", function(assert)
{
   // Setup.
   const squad = createSquad0();

   // Run.
   const result = squad.pilotSkillValue();

   // Verify.
   assert.equal(result, 22);
});

QUnit.test("pilotSkillValue() Huge", function(assert)
{
   // Setup.
   const squad = createSquad1();

   // Run.
   const result = squad.pilotSkillValue();

   // Verify.
   assert.equal(result, 19);
});

QUnit.test("primaryWeaponValue()", function(assert)
{
   // Setup.
   const squad = createSquad0();

   // Run.
   const result = squad.primaryWeaponValue();

   // Verify.
   assert.equal(result, 10);
});

QUnit.test("primaryWeaponValue() Huge", function(assert)
{
   // Setup.
   const squad = createSquad1();

   // Run.
   const result = squad.primaryWeaponValue();

   // Verify.
   assert.equal(result, 7);
});

QUnit.test("energyValue()", function(assert)
{
   // Setup.
   const squad = createSquad0();

   // Run.
   const result = squad.energyValue();

   // Verify.
   assert.equal(result, 0);
});

QUnit.test("energyValue() Huge", function(assert)
{
   // Setup.
   const squad = createSquad1();

   // Run.
   const result = squad.energyValue();

   // Verify.
   assert.equal(result, 9);
});

QUnit.test("agilityValue()", function(assert)
{
   // Setup.
   const squad = createSquad0();

   // Run.
   const result = squad.agilityValue();

   // Verify.
   assert.equal(result, 6);
});

QUnit.test("agilityValue() Huge", function(assert)
{
   // Setup.
   const squad = createSquad1();

   // Run.
   const result = squad.agilityValue();

   // Verify.
   assert.equal(result, 2);
});

QUnit.test("hullValue()", function(assert)
{
   // Setup.
   const squad = createSquad0();

   // Run.
   const result = squad.hullValue();

   // Verify.
   assert.equal(result, 10);
});

QUnit.test("hullValue() Huge", function(assert)
{
   // Setup.
   const squad = createSquad1();

   // Run.
   const result = squad.hullValue();

   // Verify.
   assert.equal(result, 27);
});

QUnit.test("shieldValue()", function(assert)
{
   // Setup.
   const squad = createSquad0();

   // Run.
   const result = squad.shieldValue();

   // Verify.
   assert.equal(result, 7);
});

QUnit.test("shieldValue() Huge", function(assert)
{
   // Setup.
   const squad = createSquad1();

   // Run.
   const result = squad.shieldValue();

   // Verify.
   assert.equal(result, 14);
});

QUnit.test("squadPointCost()", function(assert)
{
   // Setup.
   const squad = createSquad0();

   // Run.
   const result = squad.squadPointCost();

   // Verify.
   assert.equal(result, 98);
});

QUnit.test("upgradeCount()", function(assert)
{
   // Setup.
   const squad = createSquad0();

   // Run.
   const result = squad.upgradeCount();

   // Verify.
   assert.equal(result, 5);
});

function createSquad0()
{
   const factionKey = Faction.IMPERIAL;
   const name = "US Nationals #1";
   const year = 2014;
   const description = "Lambda Shuttle/TIE Interceptor/Phantom";
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "Agent1");
   const token0 = new CardInstance(store, PilotCard.WHISPER, agent, [UpgradeCard.VETERAN_INSTINCTS, UpgradeCard.FIRE_CONTROL_SYSTEM, UpgradeCard.GUNNER, UpgradeCard.ADVANCED_CLOAKING_DEVICE]);
   const token1 = new CardInstance(store, PilotCard.SOONTIR_FEL, agent, [UpgradeCard.PUSH_THE_LIMIT]);
   const token2 = new CardInstance(store, PilotCard.CAPTAIN_YORR, agent);
   const tokens = [token0, token1, token2];

   return new Squad(factionKey, name, year, description, tokens);
}

function createSquad1()
{
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "Agent1");

   return SquadBuilder.HugeShipRebelSquadBuilder.buildSquad(agent);
}

const SquadTest = {};
export default SquadTest;