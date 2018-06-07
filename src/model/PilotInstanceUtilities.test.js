import Bearing from "../artifact/Bearing.js";
import DamageCard from "../artifact/DamageCard.js";
import Difficulty from "../artifact/Difficulty.js";
import Faction from "../artifact/Faction.js";
import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";
import Range from "../artifact/Range.js";
import Ship from "../artifact/Ship.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Agent from "./Agent.js";
import CardAction from "./CardAction.js";
import CardInstance from "./CardInstance.js";
import Environment from "./Environment.js";
import EnvironmentAction from "./EnvironmentAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import PilotInstanceUtilities from "./PilotInstanceUtilities.js";
import Position from "./Position.js";
import Reducer from "./Reducer.js";
import Squad from "./Squad.js";

QUnit.module("PilotInstanceUtilities");

QUnit.test("computeAttackDiceCount()", function(assert)
{
   const store00 = Redux.createStore(Reducer.root);
   const imperialAgent = new Agent(store00, "Imperial Agent");
   let token0 = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
   const rebelAgent = new Agent(store00, "Rebel Agent");
   let token1 = new CardInstance(store00, PilotCard.ROOKIE_PILOT, rebelAgent);

   const store = Redux.createStore(Reducer.root);
   const squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [token0]);
   const squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [token1]);
   const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2);
   const tokens = environment.pilotInstances();
   token0 = tokens[0];
   token1 = tokens[1];
   assert.equal(token0.id(), 34);
   assert.equal(token0.card().key, PilotCard.ACADEMY_PILOT);
   assert.equal(token0.card().shipFaction.shipKey, Ship.TIE_FIGHTER);
   assert.equal(token0.name(), "34 Academy Pilot (TIE Fighter)");
   assert.equal(token1.id(), 35);
   assert.equal(token1.card().key, PilotCard.ROOKIE_PILOT);
   assert.equal(token1.card().shipFaction.shipKey, Ship.X_WING);
   assert.equal(token1.name(), "35 Rookie Pilot (X-Wing)");

   assert.equal(token0.computeAttackDiceCount(environment, token0.primaryWeapon(), token1, Range.ONE), 3);
   assert.equal(token0.computeAttackDiceCount(environment, token0.primaryWeapon(), token1, Range.TWO), 2);
   assert.equal(token0.computeAttackDiceCount(environment, token0.primaryWeapon(), token1, Range.THREE), 2);

   assert.equal(token1.computeAttackDiceCount(environment, token1.primaryWeapon(), token0, Range.ONE), 4);
   assert.equal(token1.computeAttackDiceCount(environment, token1.primaryWeapon(), token0, Range.TWO), 3);
   assert.equal(token1.computeAttackDiceCount(environment, token1.primaryWeapon(), token0, Range.THREE), 3);
});

QUnit.test("computeAttackDiceCount() Dorsal Turret", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attacker = environment.pilotInstances()[1]; // Dark Curse
   const store = environment.store();
   const upgrade = new CardInstance(store, UpgradeCard.DORSAL_TURRET);
   store.dispatch(CardAction.addUpgrade(attacker, upgrade));
   const defender = environment.pilotInstances()[2]; // X-Wing
   assert.equal(attacker.name(), "36 \u2022 \"Dark Curse\" (TIE Fighter)");
   const weapon = attacker.primaryWeapon();

   // Run / Verify.
   assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.ONE), 3);
   assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.TWO), 2);
   assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.THREE), 2);
});

QUnit.test("computeAttackDiceCount() Mauler Mithel", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const attacker = environment.pilotInstances()[0]; // Mauler Mithel
   const defender = environment.pilotInstances()[2]; // X-Wing
   assert.equal(attacker.name(), "34 \u2022 \"Mauler Mithel\" (TIE Fighter)");
   const weapon = attacker.primaryWeapon();

   // Run / Verify.
   assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.ONE), 4);
   assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.TWO), 2);
   assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.THREE), 2);
});

QUnit.test("computeAttackDiceCount() Talonbane Cobra", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const agent = environment.pilotInstances()[0].agent(); // Mauler Mithel
   const token = new CardInstance(environment.store(), PilotCard.TALONBANE_COBRA, agent);
   const weapon = token.primaryWeapon();
   const defender = environment.pilotInstances()[2]; // X-Wing

   // Run / Verify.
   assert.equal(token.computeAttackDiceCount(environment, weapon, defender, Range.ONE), 5);
   assert.equal(token.computeAttackDiceCount(environment, weapon, defender, Range.TWO), 3);
   assert.equal(token.computeAttackDiceCount(environment, weapon, defender, Range.THREE), 3);
});

QUnit.test("computeAttackDiceCount() Blinded Pilot", function(assert)
{
   const store00 = Redux.createStore(Reducer.root);
   const imperialAgent = new Agent(store00, "Imperial Agent");
   let token = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
   const rebelAgent = new Agent(store00, "Rebel Agent");
   let defender = new CardInstance(store00, PilotCard.ROOKIE_PILOT, rebelAgent);

   const store = Redux.createStore(Reducer.root);
   //  store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
   const squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [token]);
   const squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [defender]);
   const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, [new Position(10, 20, 30)]);
   const tokens = environment.pilotInstances();
   token = tokens[0];
   defender = tokens[1];

   assert.equal(token.damageCount(), 0);
   assert.equal(token.criticalDamageCount(), 0);
   assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.ONE), 3);
   assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.TWO), 2);
   assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.THREE), 2);

   const damage = new CardInstance(store, DamageCard.BLINDED_PILOT);
   token.receiveCriticalDamage(damage);
   assert.equal(token.damageCount(), 0);
   assert.equal(token.criticalDamageCount(), 1);
   assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.ONE), 0);
   assert.equal(token.damageCount(), 1);
   assert.equal(token.criticalDamageCount(), 0);
   // Subsequent calls work normally.
   assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.TWO), 2);
   assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.THREE), 2);
});

QUnit.test("computeDefenseDiceCount()", function(assert)
{
   const store = Redux.createStore(Reducer.root);
   const imperialAgent = new Agent(store, "Imperial Agent");
   const token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
   assert.equal(token0.id(), 1);
   assert.equal(token0.card().key, PilotCard.ACADEMY_PILOT);
   assert.equal(token0.card().shipFaction.shipKey, Ship.TIE_FIGHTER);
   assert.equal(token0.name(), "1 Academy Pilot (TIE Fighter)");
   const environment = {};
   assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.ONE), 3);
   assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.TWO), 3);
   assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.THREE), 4);
   assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.FOUR), 4);
   assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.FIVE), 4);

   const rebelAgent = new Agent(store, "Rebel Agent");
   const token1 = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);
   assert.equal(token1.id(), 2);
   assert.equal(token1.card().key, PilotCard.ROOKIE_PILOT);
   assert.equal(token1.card().shipFaction.shipKey, Ship.X_WING);
   assert.equal(token1.name(), "2 Rookie Pilot (X-Wing)");
   assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.ONE), 2);
   assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.TWO), 2);
   assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.THREE), 3);
   assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.FOUR), 3);
   assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.FIVE), 3);
});

QUnit.test("computeDefenseDiceCount() Talonbane Cobra", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const agent = environment.pilotInstances()[0].agent(); // Mauler Mithel
   const token = new CardInstance(environment.store(), PilotCard.TALONBANE_COBRA, agent);
   const weapon = token.primaryWeapon();

   // Run / Verify.
   assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.ONE), 2);
   assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.TWO), 2);
   assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.THREE), 4);
   assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.FOUR), 4);
   assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.FIVE), 4);
});

QUnit.test("maneuverKeys()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const imperialAgent = new Agent(store, "Imperial Agent");
   const pilotInstance = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);

   // Run.
   const result = PilotInstanceUtilities.maneuverKeys(pilotInstance);

   // Verify.
   assert.equal(result.length, 16);
});

QUnit.test("maneuverKeys() stressed", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const imperialAgent = new Agent(store, "Imperial Agent");
   const pilotInstance = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
   store.dispatch(CardAction.addStressCount(pilotInstance));

   // Run.
   const result = PilotInstanceUtilities.maneuverKeys(pilotInstance);

   // Verify.
   assert.equal(result.length, 14);
});

QUnit.test("maneuverKeys() Damaged Engine", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const imperialAgent = new Agent(store, "Imperial Agent");
   const pilotInstance = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
   store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), pilotInstance));
   pilotInstance.receiveCriticalDamage(new CardInstance(store, DamageCard.DAMAGED_ENGINE));

   // Run.
   const result = PilotInstanceUtilities.maneuverKeys(pilotInstance);

   // Verify.
   assert.equal(result.length, 16);
   result.forEach(function(maneuver)
   {
      const maneuverProps = Maneuver.properties[maneuver];
      if (maneuverProps.bearing === Bearing.TURN_LEFT || maneuverProps.bearing === Bearing.TURN_RIGHT)
      {
         assert.equal(maneuverProps.difficulty, Difficulty.HARD);
      }
   });
});

QUnit.test("maneuverKeys() Nien Nunb crew", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "Rebel Agent");
   const pilotInstance = new CardInstance(store, PilotCard.CHEWBACCA_REBEL, agent, [UpgradeCard.NIEN_NUNB]);

   // Run.
   const result = PilotInstanceUtilities.maneuverKeys(pilotInstance);

   // Verify.
   assert.equal(result.length, 16);
   result.forEach(function(maneuver)
   {
      const maneuverProps = Maneuver.properties[maneuver];
      if (maneuverProps.bearing === Bearing.STRAIGHT)
      {
         assert.equal(maneuverProps.difficulty, Difficulty.EASY);
      }
   });
});

QUnit.test("maneuverKeys() R2 Astromech", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "Rebel Agent");
   const pilotInstance = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent, [UpgradeCard.R2_ASTROMECH]);

   // Run.
   const result = PilotInstanceUtilities.maneuverKeys(pilotInstance);

   // Verify.
   assert.equal(result.length, 15);
   result.forEach(function(maneuver)
   {
      const maneuverProps = Maneuver.properties[maneuver];
      if (maneuverProps.speed === 1 || maneuverProps.speed === 2)
      {
         assert.equal(maneuverProps.difficultyKey, Difficulty.EASY);
      }
   });
});

QUnit.test("maneuverKeys() Twin Ion Engine Mk. II", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "Imperial Agent");
   const pilotInstance = new CardInstance(store, PilotCard.ACADEMY_PILOT, agent, [UpgradeCard.TWIN_ION_ENGINE_MKII]);

   // Run.
   const result = PilotInstanceUtilities.maneuverKeys(pilotInstance);

   // Verify.
   assert.equal(result.length, 16);
   result.forEach(function(maneuver)
   {
      const maneuverProps = Maneuver.properties[maneuver];
      if (maneuverProps.bearing === Bearing.BANK_LEFT || maneuverProps.bearing === Bearing.BANK_RIGHT)
      {
         assert.equal(maneuverProps.difficultyKey, Difficulty.EASY);
      }
   });
});

QUnit.test("maneuverKeys() Unhinged Astromech", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "Scum Agent");
   const pilotInstance = new CardInstance(store, PilotCard.DREA_RENTHAL, agent, [UpgradeCard.UNHINGED_ASTROMECH]);

   // Run.
   const result = PilotInstanceUtilities.maneuverKeys(pilotInstance);

   // Verify.
   assert.equal(result.length, 15);
   result.forEach(function(maneuver)
   {
      const maneuverProps = Maneuver.properties[maneuver];
      if (!maneuverProps)
      {
         throw "Unknown maneuver: " + maneuver;
      }
      if (maneuverProps.speed === 3)
      {
         assert.equal(maneuverProps.difficultyKey, Difficulty.EASY);
      }
   });
});

QUnit.test("pilotName()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();

   // Run / Verify.
   assert.equal(environment.pilotInstances().length, 3);
   let i = 0;
   assert.equal(environment.pilotInstances()[i++].name(), "34 \u2022 \"Mauler Mithel\" (TIE Fighter)");
   assert.equal(environment.pilotInstances()[i++].name(), "36 \u2022 \"Dark Curse\" (TIE Fighter)");
   assert.equal(environment.pilotInstances()[i++].name(), "37 \u2022 Luke Skywalker (X-Wing)");
});

QUnit.test("primaryWeapon()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const rebelAgent = new Agent(store, "Rebel Agent");
   const token = new CardInstance(store, PilotCard.DASH_RENDAR, rebelAgent, [UpgradeCard.OUTRIDER, UpgradeCard.CALCULATION, UpgradeCard.MANGLER_CANNON, UpgradeCard.CLUSTER_MISSILES, UpgradeCard.ENGINE_UPGRADE]);

   // Run.
   const result = token.primaryWeapon();

   // Verify.
   assert.ok(result);
   assert.equal(result.name(), "Primary Weapon");
   assert.equal(result.weaponValue(), 2);
});

QUnit.test("secondaryWeapons()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const rebelAgent = new Agent(store, "Rebel Agent");
   const token = new CardInstance(store, PilotCard.DASH_RENDAR, rebelAgent, [UpgradeCard.OUTRIDER, UpgradeCard.CALCULATION, UpgradeCard.MANGLER_CANNON, UpgradeCard.CLUSTER_MISSILES, UpgradeCard.ENGINE_UPGRADE]);

   // Run.
   const result = token.secondaryWeapons();

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
   assert.equal(result[0].name(), "\"Mangler\" Cannon");
   assert.equal(result[1].name(), "Cluster Missiles");
});

QUnit.test("ship() Rookie Pilot", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const rebelAgent = new Agent(store, "Rebel Agent");
   const pilotInstance = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);

   // Run.
   const result = PilotInstanceUtilities.ship(pilotInstance);

   // Verify.
   assert.ok(result);
   assert.equal(result.key, Ship.X_WING);
});

QUnit.test("ship() CR90", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const rebelAgent = new Agent(store, "Rebel Agent");
   const pilotInstance0 = new CardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent);
   const children = pilotInstance0.children();
   const pilotInstance1 = children[0];
   const pilotInstance2 = children[1];

   // Run.
   let result = PilotInstanceUtilities.ship(pilotInstance0);

   // Verify.
   assert.ok(result);
   assert.equal(result.key, Ship.CR90_CORVETTE);

   // Run.
   result = PilotInstanceUtilities.ship(pilotInstance1);

   // Verify.
   assert.ok(result);
   assert.equal(result.key, Ship.CR90_CORVETTE + ".fore");

   // Run.
   result = PilotInstanceUtilities.ship(pilotInstance2);

   // Verify.
   assert.ok(result);
   assert.equal(result.key, Ship.CR90_CORVETTE + ".aft");
});

QUnit.test("shipActions() Rookie Pilot", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const rebelAgent = new Agent(store, "Rebel Agent");
   const pilotInstance = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);

   // Run.
   const result = PilotInstanceUtilities.shipActions(pilotInstance);

   // Verify.
   assert.ok(result);
   assert.equal(result.length, 2);
   assert.equal(result[0], "focus");
   assert.equal(result[1], "targetLock");
});

QUnit.test("shipName() Rookie Pilot", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const rebelAgent = new Agent(store, "Rebel Agent");
   const pilotInstance = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);

   // Run.
   const result = PilotInstanceUtilities.shipName(pilotInstance);

   // Verify.
   assert.ok(result);
   assert.equal(result, "X-Wing");
});

const PilotInstanceUtilitiesTest = {};
export default PilotInstanceUtilitiesTest;