import DamageCard from "../artifact/DamageCard.js";
import DiceModification from "../artifact/DiceModification.js";
import Faction from "../artifact/Faction.js";
import Maneuver from "../artifact/Maneuver.js";
import Phase from "../artifact/Phase.js";
import PilotCard from "../artifact/PilotCard.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Ability from "./Ability.js";
import Action from "./Action.js";
import Adjudicator from "./Adjudicator.js";
import Agent from "./Agent.js";
import CardAction from "./CardAction.js";
import CardInstance from "./CardInstance.js";
import CombatAction from "./CombatAction.js";
import Environment from "./Environment.js";
import EnvironmentAction from "./EnvironmentAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import MockAttackDice from "./MockAttackDice.js";
import MockDefenseDice from "./MockDefenseDice.js";
import PilotAbility3 from "./PilotAbility3.js";
import Position from "./Position.js";
import Reducer from "./Reducer.js";
import ShipActionAbility from "./ShipActionAbility.js";
import Squad from "./Squad.js";

QUnit.module("SimpleAgent");

const delay = 10;

QUnit.test("properties", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const result = new Agent(store, "myAgent");

   // Run / Verify.
   assert.equal(result.name(), "myAgent");
});

QUnit.test("chooseAbility()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const name = "myAgent";
   const agent = new Agent(store, name);
   const tokens = environment.pilotInstances();
   const token2 = tokens[2];
   LOGGER.debug("token2 = " + token2);

   const damageAbilities = [];
   const pilotAbilities = [new Ability(PilotCard, PilotCard.LUKE_SKYWALKER, PilotAbility3, Phase.COMBAT_MODIFY_DEFENSE_DICE)];
   const upgradeAbilities = [];
   LOGGER.debug("damageAbilities = " + damageAbilities);
   LOGGER.debug("pilotAbilities = " + pilotAbilities);
   LOGGER.debug("upgradeAbilities = " + upgradeAbilities);

   function callback(ability, isAccepted)
   {
      LOGGER.debug("callback() ability = " + ability + " isAccepted ? " + isAccepted);

      // Verify.
      assert.ok(ability);
      assert.ok(ability.source(), PilotCard);
      assert.ok(ability.sourceKey(), PilotCard.LUKE_SKYWALKER);
      assert.ok(ability.abilityType(), PilotAbility3);
      assert.ok(ability.abilityKey(), Phase.COMBAT_MODIFY_DEFENSE_DICE);
      assert.equal(isAccepted, true);
   }

   // Run.
   agent.chooseAbility(damageAbilities, pilotAbilities, upgradeAbilities, callback);
});

QUnit.test("chooseWeaponAndDefender() Imperial", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const name = "myAgent";
   const agent = new Agent(store, name);

   const oldPosition0 = new Position(305, 20, 90);
   const token0 = environment.getTokenAt(oldPosition0);
   const position0 = new Position(458, 795, 90);
   environment.moveToken(oldPosition0, position0);

   const position1 = new Position(610, 20, 90);
   const token1 = environment.getTokenAt(position1);

   const position2 = new Position(458, 895, -90);
   const token2 = environment.getTokenAt(position2);

   LOGGER.debug("token0 = " + token0);
   LOGGER.debug("token1 = " + token1);
   LOGGER.debug("token2 = " + token2);

   function callback(weapon, defender)
   {
      LOGGER.debug("callback() weapon = " + weapon + " defender = " + defender);

      // Verify.
      assert.ok(weapon);
      assert.equal(weapon.equals(token0.primaryWeapon()), true);
      assert.ok(defender);
      assert.equal(defender.id(), token2.id());
   }

   // Run.
   agent.chooseWeaponAndDefender(token0, callback);
});

QUnit.test("determineValidManeuvers()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const token = environment.pilotInstances()[0]; // TIE Fighter.
   const agent = token.agent();

   // Run.
   const result = agent.determineValidManeuvers(token);

   // Validate.
   assert.ok(result);
   assert.equal(result.length, 16);
});

QUnit.test("determineValidManeuvers() corner", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const token = environment.pilotInstances()[0]; // TIE Fighter.
   const agent = token.agent();
   const position0 = environment.getPositionFor(token);
   LOGGER.debug("before position0 = " + position0);
   const position = new Position(21, position0.y(), position0.heading());
   environment.moveToken(position0, position);

   // Run.
   const result = agent.determineValidManeuvers(token);

   // Validate.
   assert.ok(result);
   assert.equal(result.length, 11);
   result.forEach(function(maneuver, i)
   {
      LOGGER.debug(i + " maneuver = " + maneuver);
   });
});

QUnit.test("determineValidModifyDefenseDiceActions() Captain Oicunn", function(assert)
{
   // Setup.
   const store00 = Redux.createStore(Reducer.root);
   let imperialAgent = new Agent(store00, "Imperial Agent");
   let rebelAgent = new Agent(store00, "Rebel Agent");
   const squad1 = new Squad(Faction.REBEL, "squad1", 2016, "squad1", [new CardInstance(store00, PilotCard.CAPTAIN_OICUNN, imperialAgent, [UpgradeCard.YSANNE_ISARD])]);
   const squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.LUKE_SKYWALKER, rebelAgent, [UpgradeCard.PROTON_TORPEDOES, UpgradeCard.R2_D2_ASTROMECH])]);
   const positions1 = [new Position(305, 20, 90)];
   const positions2 = [new Position(458, 895, 270)];

   const store = Redux.createStore(Reducer.root);
   const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
   imperialAgent = environment.firstAgent();
   rebelAgent = environment.secondAgent();
   const attacker = environment.pilotInstances()[1]; // X-Wing.
   const defender = environment.pilotInstances()[0]; // VT-49 Decimator.
   store.dispatch(CardAction.addEvadeCount(defender));
   environment.setActiveToken(attacker);
   const weapon = attacker.primaryWeapon();
   const callback = function() {};
   store.dispatch(Action.setDelay(delay));
   const combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
   store.dispatch(Action.setTokenCombatAction(attacker, combatAction));

   // Run.
   const result = rebelAgent.determineValidModifyDefenseDiceActions(attacker, defender);

   // Validate.
   assert.ok(result);
   assert.equal(result.length, 1);
   assert.equal(result[0].sourceKey(), DiceModification.DEFENSE_SPEND_EVADE);
});

QUnit.test("determineValidShipActions() Mauler Mithel", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const token = environment.pilotInstances()[0]; // TIE Fighter.
   const agent = token.agent();

   // Run.
   const result = agent.determineValidShipActions(token);

   // Validate.
   assert.ok(result);
   assert.equal(result.length, 4);
   result.forEach(function(maneuver, i)
   {
      LOGGER.debug(i + " maneuver = " + maneuver);
   });
});

QUnit.test("determineValidShipActions() Luke Skywalker", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const token = environment.pilotInstances()[2]; // X-Wing.
   const agent = token.agent();
   const upgrade = new CardInstance(store, UpgradeCard.properties[UpgradeCard.LANDO_CALRISSIAN]);
   store.dispatch(CardAction.addUpgrade(token, upgrade));
   const damage = new CardInstance(store, DamageCard.CONSOLE_FIRE);
   token.receiveCriticalDamage(damage);
   environment.setActiveToken(token);

   // Run.
   const result = agent.determineValidShipActions(token);

   // Validate.
   assert.ok(result);
   assert.equal(result.length, 3);
   result.forEach(function(ability, i)
   {
      LOGGER.debug(i + " ability = " + ability);
   });
   assert.equal(result[0].sourceKey(), ShipAction.FOCUS);

   assert.ok(result[1]);
   assert.equal(result[1].source(), UpgradeCard);
   assert.equal(result[1].sourceKey(), UpgradeCard.LANDO_CALRISSIAN);

   assert.ok(result[2]);
   assert.equal(result[2].source(), DamageCard);
   assert.equal(result[2].sourceKey(), DamageCard.CONSOLE_FIRE);
});

QUnit.test("determineValidShipActions() Miranda Doni", function(assert)
{
   // Setup.
   const store00 = Redux.createStore(Reducer.root);
   let imperialAgent = new Agent(store00, "Imperial Agent");
   let rebelAgent = new Agent(store00, "Rebel Agent");
   const squad1 = new Squad(Faction.REBEL, "squad1", 2016, "squad1", [new CardInstance(store00, PilotCard.MAULER_MITHEL, imperialAgent, [UpgradeCard.MARKSMANSHIP]), new CardInstance(store00, PilotCard.DARK_CURSE, imperialAgent)]);
   const squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.LUKE_SKYWALKER, rebelAgent, [UpgradeCard.PROTON_TORPEDOES, UpgradeCard.R2_D2_ASTROMECH]), new CardInstance(store00, PilotCard.MIRANDA_DONI, rebelAgent)]);
   const positions1 = [new Position(305, 20, 90), new Position(610, 20, 90)];
   const positions2 = [new Position(458, 895, 270), new Position(400, 400, 0)];

   const store = Redux.createStore(Reducer.root);
   const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
   Adjudicator.create(store);
   imperialAgent = environment.firstAgent();
   rebelAgent = environment.secondAgent();
   const token = environment.pilotInstances()[3]; // K-Wing.
   const previousManeuver = Maneuver.properties[Maneuver.STRAIGHT_2_EASY];
   store.dispatch(Action.setTokenManeuver(token, previousManeuver));

   // Run.
   const result = rebelAgent.determineValidShipActions(token);

   // Validate.
   assert.ok(result);
   assert.equal(result.length, 6);
   assert.equal(result[0].sourceKey(), ShipAction.FOCUS);
   assert.ok(result[1]);
   assert.equal(result[1].sourceKey(), ShipAction.SLAM);
   assert.equal(result[1].context().maneuverKey, Maneuver.TURN_LEFT_2_STANDARD);

   assert.ok(result[2]);
   assert.equal(result[2].sourceKey(), ShipAction.SLAM);
   assert.equal(result[2].context().maneuverKey, Maneuver.BANK_LEFT_2_STANDARD);

   assert.ok(result[3]);
   assert.equal(result[3].sourceKey(), ShipAction.SLAM);
   assert.equal(result[3].context().maneuverKey, Maneuver.STRAIGHT_2_EASY);

   assert.ok(result[4]);
   assert.equal(result[4].sourceKey(), ShipAction.SLAM);
   assert.equal(result[4].context().maneuverKey, Maneuver.BANK_RIGHT_2_STANDARD);

   assert.ok(result[5]);
   assert.equal(result[5].sourceKey(), ShipAction.SLAM);
   assert.equal(result[5].context().maneuverKey, Maneuver.TURN_RIGHT_2_STANDARD);
});

QUnit.test("getDecloakAction()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const agent = new Agent(store, "Imperial Agent");
   const token = new CardInstance(store, PilotCard.SIGMA_SQUADRON_PILOT, agent);
   store.dispatch(EnvironmentAction.placeToken(new Position(200, 200, 0), token));
   store.dispatch(CardAction.addCloakCount(token));

   let result;

   function callback(token, maneuverAction)
   {
      LOGGER.debug("callback()");
      result = maneuverAction;

      // Verify.
      if (result)
      {
         assert.ok(result);
         assert.ok(result.context().maneuverKey);
      }
      else
      {
         assert.ok(!result);
      }
   }

   // Run.
   result = agent.getDecloakAction(token, callback);
});

QUnit.test("getModifyAttackDiceAction() focus", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const attacker = environment.pilotInstances()[0]; // TIE Fighter
   const defender = environment.pilotInstances()[2]; // X-Wing
   const weapon = attacker.primaryWeapon();
   const caCallback = function() {};
   store.dispatch(Action.setDelay(delay));
   const combatAction = new CombatAction(store, attacker, weapon, defender, caCallback, MockAttackDice, MockDefenseDice);
   const agent = attacker.agent();
   environment.setActiveToken(attacker);
   store.dispatch(Action.setTokenCombatAction(attacker, combatAction));
   store.dispatch(CardAction.addFocusCount(attacker));

   function callback(modifyAbility)
   {
      LOGGER.debug("callback() modifyAbility = " + modifyAbility);

      // Verify.
      assert.ok(modifyAbility);
      assert.equal(modifyAbility.sourceKey(), DiceModification.ATTACK_SPEND_FOCUS);
   }

   // Run.
   agent.getModifyAttackDiceAction(attacker, defender, callback);
});

QUnit.test("getModifyDefenseDiceAction() evade", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const attacker = environment.pilotInstances()[2]; // X-Wing
   const defender = environment.pilotInstances()[0]; // TIE Fighter
   const weapon = attacker.primaryWeapon();
   const caCallback = function() {};
   store.dispatch(Action.setDelay(delay));
   const combatAction = new CombatAction(store, attacker, weapon, defender, caCallback, MockAttackDice, MockDefenseDice);
   const agent = defender.agent();
   environment.setActiveToken(attacker);
   store.dispatch(Action.setTokenCombatAction(attacker, combatAction));
   store.dispatch(CardAction.addEvadeCount(defender));

   function callback(modifyAbility)
   {
      LOGGER.debug("callback() modifyAbility = " + modifyAbility);

      // Verify.
      assert.ok(modifyAbility);
      assert.equal(modifyAbility.sourceKey(), DiceModification.DEFENSE_SPEND_EVADE);
   }

   // Run.
   agent.getModifyDefenseDiceAction(attacker, defender, callback);
});

QUnit.test("getPlanningAction() Imperial", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const agent = environment.firstAgent();

   const position0 = new Position(305, 20, 90);
   const token0 = environment.getTokenAt(position0);

   const position1 = new Position(610, 20, 90);
   const token1 = environment.getTokenAt(position1);

   const position2 = new Position(458, 895, -90);
   const token2 = environment.getTokenAt(position2);

   let result;

   function callback(planningAction)
   {
      LOGGER.debug("callback()");
      result = planningAction;

      // Verify.
      assert.ok(result);
      assert.ok(result[token0.id()]);
      assert.ok(result[token1.id()]);
      assert.ok(!result[token2.id()]);
   }

   // Run.
   agent.getPlanningAction(callback);
});

QUnit.test("getPlanningAction() Rebel", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const agent = environment.secondAgent();

   const position0 = new Position(305, 20, 90);
   const token0 = environment.getTokenAt(position0);

   const position1 = new Position(610, 20, 90);
   const token1 = environment.getTokenAt(position1);

   const position2 = new Position(458, 895, -90);
   const token2 = environment.getTokenAt(position2);
   const maneuver2 = Maneuver.STRAIGHT_1_STANDARD;

   let result;

   function callback(planningAction)
   {
      LOGGER.debug("callback()");
      result = planningAction;

      // Verify.
      assert.ok(result);
      assert.ok(!result[token0.id()]);
      assert.ok(!result[token1.id()]);
      assert.ok(result[token2.id()], maneuver2);
   }

   // Run.
   agent.getPlanningAction(callback);
});

QUnit.test("getPlanningAction() Rebel 2", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const agent = environment.secondAgent();

   const oldPosition = new Position(458, 895, -90);
   const newPosition = new Position(20, 110, -90);
   const token = environment.getTokenAt(oldPosition);
   environment.moveToken(oldPosition, newPosition);

   function callback(planningAction)
   {
      // Verify.
      assert.ok(planningAction);
      assert.ok(planningAction[token.id()]);
      const maneuver = planningAction[token.id()];
      assert.ok(maneuver === Maneuver.STRAIGHT_1_EASY || maneuver === Maneuver.TURN_RIGHT_2_STANDARD);
   }

   // Run.
   agent.getPlanningAction(callback);
});

QUnit.test("getShipAction()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   const name = "myAgent";
   const agent = new Agent(store, name);
   const tokens = environment.pilotInstances();
   const token2 = tokens[2];
   LOGGER.debug("token2 = " + token2);
   environment.setActiveToken(token2);

   function callback(shipAction, isAccepted)
   {
      LOGGER.debug("callback() shipAction = " + shipAction + " isAccepted ? " + isAccepted);

      // Verify.
      assert.ok(shipAction);
      assert.ok(shipAction.source(), ShipAction);
      assert.ok(shipAction.sourceKey(), ShipAction.FOCUS);
      assert.ok(shipAction.abilityType(), ShipActionAbility);
      assert.ok(shipAction.abilityKey(), ShipActionAbility.ABILITY_KEY);
      assert.equal(isAccepted, true);
   }

   // Run.
   agent.getShipAction(token2, callback);
});

QUnit.test("toString()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "myAgent");

   // Run.
   const result = agent.toString();

   // Verify.
   assert.ok(result);
   assert.equal(result, "myAgent, SimpleAgent");
});

const SimpleAgentTest = {};
export default SimpleAgentTest;