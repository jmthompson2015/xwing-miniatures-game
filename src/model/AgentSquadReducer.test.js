import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import AgentSquadAction from "./AgentSquadAction.js";
import AgentSquadInitialState from "./AgentSquadInitialState.js";
import AgentSquadReducer from "./AgentSquadReducer.js";

QUnit.module("AgentSquadReducer");

QUnit.test("setDisplayItem()", function(assert)
{
   // Setup.
   const state = new AgentSquadInitialState();
   const displayItem = {};
   const action = AgentSquadAction.setDisplayItem(displayItem);

   // Run.
   const result = AgentSquadReducer.root(state, action);

   // Verify.
   assert.ok(result);
   assert.equal(result.displayItem, displayItem);
});

QUnit.test("setPilot()", function(assert)
{
   // Setup.
   const state = new AgentSquadInitialState();
   const pilot0 = PilotCard.properties[PilotCard.ACADEMY_PILOT];
   const index0 = 0;
   const action = AgentSquadAction.setPilot(pilot0, index0);

   // Run.
   const result = AgentSquadReducer.root(state, action);

   // Verify.
   assert.ok(result);
   assert.equal(result.pilots.size, 1);
   assert.equal(result.pilots.get(index0), pilot0);
});

QUnit.test("setPilot() Academy Pilot x2", function(assert)
{
   // Setup.
   const state = new AgentSquadInitialState();
   const pilot0 = PilotCard.properties[PilotCard.ACADEMY_PILOT];
   const index0 = 0;
   const action0 = AgentSquadAction.setPilot(pilot0, index0);

   // Run.
   const result0 = AgentSquadReducer.root(state, action0);

   // Verify.
   assert.ok(result0);
   assert.equal(result0.pilots.size, 1);
   assert.equal(result0.pilots.get(index0), pilot0);

   // Setup.
   const pilot1 = PilotCard.properties[PilotCard.ACADEMY_PILOT];
   const index1 = 1;
   const action1 = AgentSquadAction.setPilot(pilot1, index1);

   // Run.
   const result1 = AgentSquadReducer.root(result0, action1);

   // Verify.
   assert.ok(result1);
   assert.equal(result1.pilots.size, 2);
   assert.equal(result1.pilots.get(index1), pilot1);
});

QUnit.test("setPilot() Academy Pilot x2 with upgrades", function(assert)
{
   // Setup.
   const state = new AgentSquadInitialState();
   const pilot0 = PilotCard.properties[PilotCard.ACADEMY_PILOT];
   const pilotIndex0 = 0;
   const action00 = AgentSquadAction.setPilot(pilot0, pilotIndex0);
   const upgrade01 = UpgradeCard.properties[UpgradeCard.MARKSMANSHIP];
   const upgradeIndex01 = 0;
   const action01 = AgentSquadAction.setPilotUpgrade(pilotIndex0, upgrade01, upgradeIndex01);
   const upgrade02 = UpgradeCard.properties[UpgradeCard.VETERAN_INSTINCTS];
   const upgradeIndex02 = 1;
   const action02 = AgentSquadAction.setPilotUpgrade(pilotIndex0, upgrade02, upgradeIndex02);

   // Run.
   let result0 = AgentSquadReducer.root(state, action00);
   result0 = AgentSquadReducer.root(result0, action01);
   result0 = AgentSquadReducer.root(result0, action02);

   // Verify.
   assert.ok(result0);
   assert.equal(result0.pilots.size, 1);
   assert.equal(result0.pilots.get(pilotIndex0), pilot0);
   assert.equal(result0.pilotIndexToUpgrades.size, 1);
   let upgrades0 = result0.pilotIndexToUpgrades.get(pilotIndex0);
   assert.equal(upgrades0.size, 2);
   assert.equal(upgrades0.get(upgradeIndex01), upgrade01);
   assert.equal(upgrades0.get(upgradeIndex02), upgrade02);

   // Setup.
   const pilot1 = PilotCard.properties[PilotCard.ACADEMY_PILOT];
   const pilotIndex1 = 1;
   const action10 = AgentSquadAction.setPilot(pilot1, pilotIndex1);
   const upgrade11 = UpgradeCard.properties[UpgradeCard.DAREDEVIL];
   const upgradeIndex11 = 0;
   const action11 = AgentSquadAction.setPilotUpgrade(pilotIndex1, upgrade11, upgradeIndex11);
   const upgrade12 = UpgradeCard.properties[UpgradeCard.DETERMINATION];
   const upgradeIndex12 = 1;
   const action12 = AgentSquadAction.setPilotUpgrade(pilotIndex1, upgrade12, upgradeIndex12);

   // Run.
   let result1 = AgentSquadReducer.root(result0, action10);
   result1 = AgentSquadReducer.root(result1, action11);
   result1 = AgentSquadReducer.root(result1, action12);

   // Verify.
   assert.ok(result1);
   assert.equal(result1.pilots.size, 2);
   assert.equal(result1.pilots.get(pilotIndex0), pilot0, "pilots.get(0) === pilot0");
   assert.equal(result1.pilots.get(pilotIndex1), pilot1, "pilots.get(1) === pilot1");
   assert.equal(result1.pilotIndexToUpgrades.size, 2, "pilotIndexToUpgrades.size === 2");
   upgrades0 = result1.pilotIndexToUpgrades.get(pilotIndex0);
   assert.equal(upgrades0.size, 2, "upgrades0.size === 2");
   assert.equal(upgrades0.get(upgradeIndex01), upgrade01, "upgrades0.get(upgradeIndex01) === upgrade01");
   assert.equal(upgrades0.get(upgradeIndex02), upgrade02, "upgrades0.get(upgradeIndex02) === upgrade02");
   const upgrades1 = result1.pilotIndexToUpgrades.get(pilotIndex1);
   assert.equal(upgrades1.size, 2, "upgrades1.size === 2");
   assert.equal(upgrades1.get(upgradeIndex11), upgrade11);
   assert.equal(upgrades1.get(upgradeIndex12), upgrade12);
});

const AgentSquadReducerTest = {};
export default AgentSquadReducerTest;