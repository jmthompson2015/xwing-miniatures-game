import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";
import Faction from "../artifact/Faction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Action from "./Action.js";
import ActivationAction from "./ActivationAction.js";
import Adjudicator from "./Adjudicator.js";
import Agent from "./Agent.js";
import CardAction from "./CardAction.js";
import CardInstance from "./CardInstance.js";
import Environment from "./Environment.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import EventObserver from "./EventObserver.js";
import PhaseObserver from "./PhaseObserver.js";
import Position from "./Position.js";
import Reducer from "./Reducer.js";
import Squad from "./Squad.js";
import SquadBuilder from "./SquadBuilder.js";

QUnit.module("ActivationAction");

const delay = 10;

QUnit.test("doIt() Adrenaline Rush", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.ADRENALINE_RUSH;
   const callback = function()
   {
      assert.ok(true, "test resumed from async operation");

      const token = action.token();
      assert.equal(token.upgradeKeys.length, 0);
      assert.ok(!token.isStressed());

      done();
   };
   const action = createActivationAction(upgradeKey, undefined, callback);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() Huge", function(assert)
{
   // Setup.
   const squadBuilder1 = SquadBuilder.HugeShipImperialSquadBuilder;
   const squadBuilder2 = SquadBuilder.HugeShipRebelSquadBuilder;
   const store = Redux.createStore(Reducer.root);
   const agent1 = new Agent(store, "1");
   const agent2 = new Agent(store, "2");
   const squad1 = squadBuilder1.buildSquad(agent1);
   const squad2 = squadBuilder2.buildSquad(agent2);
   store.dispatch(Action.setDelay(delay));
   const environment = new Environment(store, agent1, squad1, agent2, squad2);
   Adjudicator.create(store);
   const token = environment.pilotInstances()[0]; // Gozanti-class Cruiser
   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);
   const maneuverKey = Maneuver.STRAIGHT_1_3;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      // Execute maneuver.
      const position = environment.getPositionFor(token);
      assert.equal(position.x(), 458);
      assert.equal(position.y(), 96 + (1 * 40));
      assert.equal(position.heading(), 90);

      // Check pilot stress.
      assert.ok(!token.isStressed());
      assert.equal(token.stressCount(), 0);

      // Gain energy.
      assert.equal(token.energyCount(), 4);

      // Perform action.
      assert.equal(token.focusCount(), 0);

      done();
   };
   const action = ActivationAction.create(store, token.id(), callback);
   const maneuver = Maneuver.properties[maneuverKey];
   store.dispatch(Action.setTokenManeuver(token, maneuver));
   const position = environment.getPositionFor(token);
   assert.equal(position.x(), 458);
   assert.equal(position.y(), 96);
   assert.equal(position.heading(), 90);
   assert.equal(token.energyCount(), 4);
   store.dispatch(CardAction.addEnergyCount(token, -2));
   assert.equal(token.energyCount(), 2);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() Inertial Dampeners", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.INERTIAL_DAMPENERS;
   const callback = function()
   {
      assert.ok(true, "test resumed from async operation");

      const environment = action.environment();
      const token = action.token();
      assert.equal(token.upgradeKeys.length, 0);
      const position = environment.getPositionFor(token);
      assert.ok(position);
      assert.equal(position.x(), 400);
      assert.equal(position.y(), 800);
      assert.equal(position.heading(), 270);
      assert.ok(token.isStressed());

      done();
   };
   const action = createActivationAction(upgradeKey, undefined, callback);
   action.performAction = function()
   {
      // Skip the ship action.
      this.finishPerformAction();
   };

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() K4 Security Droid", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.K4_SECURITY_DROID;
   const callback = function()
   {
      assert.ok(true, "test resumed from async operation");

      assert.equal(store.getState().targetLocks.size, 1);

      done();
   };
   const action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_2_EASY, callback);
   const store = action.store();
   assert.equal(store.getState().targetLocks.size, 0);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() Lambda-class Shuttle stationary", function(assert)
{
   // Setup.
   const squadBuilder1 = SquadBuilder.findByNameAndYear("Worlds #4", 2015);
   const squadBuilder2 = SquadBuilder.findByNameAndYear("Worlds #1", 2015);
   const store = Redux.createStore(Reducer.root);
   const agent1 = new Agent(store, "1");
   const agent2 = new Agent(store, "2");
   const squad1 = squadBuilder1.buildSquad(agent1);
   const squad2 = squadBuilder2.buildSquad(agent2);
   store.dispatch(Action.setDelay(delay));
   const environment = new Environment(store, agent1, squad1, agent2, squad2);
   Adjudicator.create(store);
   const token = environment.pilotInstances()[2]; // Lambda-class Shuttle
   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);
   const maneuverKey = Maneuver.STATIONARY_0_HARD;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      // Execute maneuver.
      const position = environment.getPositionFor(token);
      assert.equal(position.x(), 686);
      assert.equal(position.y(), 40);
      assert.equal(position.heading(), 90);

      // Check pilot stress.
      assert.ok(token.isStressed());
      assert.equal(token.stressCount(), 1);

      // Perform action.
      assert.equal(token.focusCount(), 0);

      done();
   };
   const action = ActivationAction.create(store, token.id(), callback);
   action.performAction = function()
   {
      // Skip the ship action.
      this.finishPerformAction();
   };
   const maneuver = Maneuver.properties[maneuverKey];
   store.dispatch(Action.setTokenManeuver(token, maneuver));
   const position = environment.getPositionFor(token);
   assert.equal(position.x(), 686);
   assert.equal(position.y(), 40);
   assert.equal(position.heading(), 90);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() Lightning Reflexes", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.LIGHTNING_REFLEXES;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      const environment = action.environment();
      const token = action.token();
      assert.equal(token.upgradeKeys.length, 0);
      const position = environment.getPositionFor(token);
      assert.equal(position.x(), 400);
      assert.equal(position.y(), 600);
      assert.equal(position.heading(), 90);
      assert.ok(token.isStressed());

      done();
   };
   const action = createActivationAction(upgradeKey, undefined, callback);
   action.performAction = function()
   {
      // Skip the ship action.
      this.finishPerformAction();
   };

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() Maneuvering Fins", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.MANEUVERING_FINS;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      const environment = action.environment();
      const token = environment.activeCardInstance();
      const activationAction = ActivationAction.get(token.store(), token.id());
      assert.ok(activationAction);
      assert.equal(activationAction.maneuverKey(), Maneuver.BANK_LEFT_2_STANDARD);

      done();
   };
   const action = createActivationAction(upgradeKey, Maneuver.TURN_LEFT_2_STANDARD, callback);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() Outlaw Tech", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.OUTLAW_TECH;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      const token = action.token();
      assert.equal(token.focusCount(), 2);

      done();
   };
   const action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_4_HARD, callback);
   action.performAction = function()
   {
      // Skip the ship action.
      this.finishPerformAction();
   };
   assert.equal(action.token().focusCount(), 1);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() Push the Limit", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.PUSH_THE_LIMIT;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      assert.equal(token.isStressed(), true);

      done();
   };
   const action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_2_EASY, callback);
   const token = action.token();
   assert.equal(token.isStressed(), false);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() R2-D2", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.R2_D2_ASTROMECH;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      assert.equal(action.token().shieldCount(), 5);

      done();
   };
   const action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_2_EASY, callback);
   const store = action.environment().store();
   store.dispatch(CardAction.addShieldCount(action.token(), -1));
   assert.equal(action.token().shieldCount(), 4);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() R2-D2 at max", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.R2_D2_ASTROMECH;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      assert.equal(action.token().shieldCount(), 5);

      done();
   };
   const action = createActivationAction(upgradeKey, Maneuver.STRAIGHT_2_EASY, callback);
   assert.equal(action.token().shieldCount(), 5);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() TIE/x7", function(assert)
{
   // Setup.
   const upgradeKey = UpgradeCard.TIE_X7;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      const token = action.token();
      assert.ok(token.evadeCount(), 1);

      done();
   };
   const action = createActivationAction(upgradeKey, undefined, callback);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() X-Wing", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   store.dispatch(Action.setDelay(delay));
   const token = environment.pilotInstances()[2]; // X-Wing
   environment.setActiveToken(token);
   const maneuverKey = Maneuver.STRAIGHT_1_STANDARD;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      // Execute maneuver.
      const position = environment.getPositionFor(token);
      assert.ok(position, "position !== undefined");
      assert.equal(position.x(), 458);
      assert.equal(position.y(), 895 - (2 * 20 + 1 * 40));
      assert.equal(position.heading(), 270);

      // Check pilot stress.
      assert.ok(!token.isStressed());
      assert.equal(token.stressCount(), 0);

      // Perform action.
      assert.equal(token.focusCount(), 1);

      done();
   };
   const action = ActivationAction.create(store, token.id(), callback);
   const maneuver = Maneuver.properties[maneuverKey];
   store.dispatch(Action.setTokenManeuver(token, maneuver));
   const position = environment.getPositionFor(token);
   assert.equal(position.x(), 458);
   assert.equal(position.y(), 895);
   assert.equal(position.heading(), 270);

   // Run.
   const done = assert.async();
   action.doIt();
});

QUnit.test("doIt() X-Wing K-turn", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);
   store.dispatch(Action.setDelay(delay));
   const token = environment.pilotInstances()[2]; // X-Wing
   const maneuverKey = Maneuver.KOIOGRAN_TURN_4_HARD;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      // Execute maneuver.
      const position = environment.getPositionFor(token);
      assert.equal(position.x(), 458);
      assert.equal(position.y(), 895 - (2 * 20 + 4 * 40));
      assert.equal(position.heading(), 90);

      // Check pilot stress.
      assert.ok(token.isStressed());
      assert.equal(token.stressCount(), 1);

      // Perform action.
      assert.equal(token.focusCount(), 0);

      done();
   };
   const action = ActivationAction.create(store, token.id(), callback);
   action.performAction = function()
   {
      // Skip the ship action.
      this.finishPerformAction();
   };
   const maneuver = Maneuver.properties[maneuverKey];
   store.dispatch(Action.setTokenManeuver(token, maneuver));
   const position = environment.getPositionFor(token);
   assert.equal(position.x(), 458);
   assert.equal(position.y(), 895);
   assert.equal(position.heading(), 270);

   // Run.
   const done = assert.async();
   action.doIt();
});

function createActivationAction(upgradeKey, maneuverKey, callback0)
{
   const store00 = Redux.createStore(Reducer.root);
   const rebelAgent = new Agent(store00, "Rebel Agent");
   const imperialAgent = new Agent(store00, "Imperial Agent");
   const squad1 = new Squad(Faction.IMPERIAL, "squad1", 2016, "squad1", [new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent)]);
   const squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [upgradeKey])]);
   const positions1 = [new Position(400, 500, 90)];
   const positions2 = [new Position(400, 800, -90)];

   const store = Redux.createStore(Reducer.root);
   Adjudicator.create(store);
   const environment = new Environment(store, rebelAgent, squad1, imperialAgent, squad2, positions1, positions2);
   const token = environment.pilotInstances()[1];
   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);
   environment.setActiveToken(token);
   store.dispatch(CardAction.addFocusCount(token));

   const myManeuverKey = (maneuverKey !== undefined ? maneuverKey : Maneuver.STRAIGHT_3_STANDARD);

   const callback = (callback0 !== undefined ? callback0 : function()
   {
      LOGGER.info("callback() start");
   });

   store.dispatch(Action.setDelay(delay));
   const answer = ActivationAction.create(store, token.id(), callback);
   const maneuver = Maneuver.properties[myManeuverKey];
   store.dispatch(Action.setTokenManeuver(token, maneuver));
   return answer;
}

const ActivationActionTest = {};
export default ActivationActionTest;