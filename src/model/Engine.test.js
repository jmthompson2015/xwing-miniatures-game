import DamageCard from "../artifact/DamageCard.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Action from "./Action.js";
import Adjudicator from "./Adjudicator.js";
import Agent from "./Agent.js";
import CardAction from "./CardAction.js";
import CardInstance from "./CardInstance.js";
import Engine from "./Engine.js";
import Environment from "./Environment.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import EventObserver from "./EventObserver.js";
import PhaseObserver from "./PhaseObserver.js";
import Position from "./Position.js";
import Reducer from "./Reducer.js";
import SquadBuilder from "./SquadBuilder.js";

QUnit.module("Engine");

const delay = 10;

QUnit.test("performActivationPhase()", function(assert)
{
   // Setup.
   const engine = createEngine();
   engine.performCombatPhase = function()
   {
      LOGGER.info("performCombatPhase() dummy");
   };
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      done();
   };

   // Run.
   const done = assert.async();
   engine.performPlanningPhase(callback);
});

QUnit.test("performActivationPhase() Huge", function(assert)
{
   // Setup.
   const engine = createEngine(true);
   engine.performCombatPhase = function()
   {
      LOGGER.info("performCombatPhase() dummy");
   };
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      done();
   };

   // Run.
   const done = assert.async();
   engine.performPlanningPhase(callback);
});

QUnit.test("performActivationPhase() decloak", function(assert)
{
   // Setup.
   const squadBuilder1 = SquadBuilder.findByNameAndYear("Worlds #2", 2014);
   const squadBuilder2 = SquadBuilder.findByNameAndYear("Worlds #1", 2015);
   const store = Redux.createStore(Reducer.root);
   const agent1 = new Agent(store, "1");
   const agent2 = new Agent(store, "2");
   const squad1 = squadBuilder1.buildSquad(agent1);
   const squad2 = squadBuilder2.buildSquad(agent2);
   const environment = new Environment(store, agent1, squad1, agent2, squad2);
   Adjudicator.create(store);
   store.dispatch(Action.setDelay(delay));
   const engine = new Engine(store);
   const token0 = environment.pilotInstances()[0]; // TIE Phantom
   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);
   store.dispatch(CardAction.addCloakCount(token0));
   engine.performCombatPhase = function()
   {
      LOGGER.info("performCombatPhase() dummy");
   };
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      const token = environment.pilotInstances()[0]; // TIE Phantom
      if (token.card().key === PilotCard.WHISPER)
      {
         if (token.isCloaked())
         {
            // Ship re-cloaked.
            console.log("ship re-cloaked");
            assert.equal(token.card().key, PilotCard.WHISPER);
            assert.equal(token.isCloaked(), true);
            assert.equal(token.cloakCount(), 1);
         }
         else
         {
            assert.equal(token.card().key, PilotCard.WHISPER);
            assert.equal(token.isCloaked(), false);
            assert.equal(token.cloakCount(), 0);
         }
      }
      else
      {
         // Ship fled the battlefield.
      }

      done();
   };
   assert.equal(token0.isCloaked(), true);
   assert.equal(token0.cloakCount(), 1);

   // Run.
   const done = assert.async();
   engine.performPlanningPhase(callback);
});

QUnit.test("performCombatPhase()", function(assert)
{
   // Setup.
   const engine = createEngine();
   const environment = engine.environment();
   const token0 = environment.pilotInstances()[0]; // TIE Fighter.
   const position0 = environment.getPositionFor(token0);
   const token2 = environment.pilotInstances()[2]; // X-Wing.
   const position2 = environment.getPositionFor(token2);
   const newPosition2 = new Position(position0.x(), position0.y() + 50, position2.heading());
   environment.moveToken(position2, newPosition2);
   engine.performEndPhase = function()
   {
      LOGGER.info("performEndPhase() dummy");
   };
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      done();
   };

   // Run.
   const done = assert.async();
   engine.performCombatPhase(callback);
});

QUnit.test("performCombatPhase() Epsilon Leader", function(assert)
{
   // Setup.
   const engine = createEngineEpsilonLeader();
   const environment = engine.environment();
   const store = environment.store();
   const tokens = environment.pilotInstances();
   const token0 = tokens[0]; // TIE/fo Fighter.
   const position0 = environment.getPositionFor(token0);
   const token1 = tokens[1]; // TIE/fo Fighter.
   const position1 = environment.getPositionFor(token1);
   const newPosition1 = new Position(position0.x() + 50, position0.y(), position1.heading());
   environment.moveToken(position1, newPosition1);
   const token2 = tokens[2]; // T-70 X-Wing.
   const position2 = environment.getPositionFor(token2);
   const newPosition2 = new Position(position0.x(), position0.y() + 50, position2.heading());
   environment.moveToken(position2, newPosition2);
   engine.performEndPhase = function()
   {
      LOGGER.info("performEndPhase() dummy");
   };
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.ok([0, 1].includes(token0.stressCount()), "token0.stressCount() === 0 | 1 actual " + token0.stressCount());
      assert.equal(token1.stressCount(), 0, "token1.stressCount() === 0");
      assert.equal(token2.stressCount(), 1, "token2.stressCount() === 1");
      done();
   };
   store.dispatch(CardAction.addStressCount(token0));
   store.dispatch(CardAction.addStressCount(token1));
   store.dispatch(CardAction.addStressCount(token2));
   assert.equal(token0.stressCount(), 1, "token0.stressCount() === 1");
   assert.equal(token1.stressCount(), 1, "token1.stressCount() === 1");
   assert.equal(token2.stressCount(), 1, "token2.stressCount() === 1");

   // Run.
   const done = assert.async();
   engine.performCombatPhase(callback);
});

QUnit.test("performCombatPhase() Mara Jade", function(assert)
{
   // Setup.
   const engine = createEngine();
   const environment = engine.environment();
   const token0 = environment.pilotInstances()[0]; // TIE Fighter.
   const store = environment.store();
   const upgrade = new CardInstance(store, UpgradeCard.MARA_JADE);
   store.dispatch(CardAction.addUpgrade(token0, upgrade));
   const position0 = environment.getPositionFor(token0);
   const token1 = environment.pilotInstances()[1]; // TIE Fighter.
   const token2 = environment.pilotInstances()[2]; // X-Wing.
   const position2 = environment.getPositionFor(token2);
   const newPosition2 = new Position(position0.x(), position0.y() + 50, position2.heading());
   environment.moveToken(position2, newPosition2);
   engine.performEndPhase = function()
   {
      LOGGER.info("performEndPhase() dummy");
   };
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(token0.stressCount(), 0, "token0.stressCount() === 0");
      assert.equal(token1.stressCount(), 0, "token1.stressCount() === 0");
      const stressCount = (token0.isDestroyed() ? 0 : 1);
      assert.equal(token2.stressCount(), stressCount, "token2.stressCount() === " + stressCount);
      done();
   };

   // Run.
   const done = assert.async();
   engine.performCombatPhase(callback);
});

QUnit.test("performCombatPhase() R5-P9", function(assert)
{
   // Setup.
   const engine = createEngine();
   const environment = engine.environment();
   const store = environment.store();
   const token2 = environment.pilotInstances()[2]; // X-Wing.
   const upgrade = new CardInstance(store, UpgradeCard.R5_P9);
   store.dispatch(CardAction.addUpgrade(token2, upgrade));
   engine.performEndPhase = function()
   {
      LOGGER.info("performEndPhase() dummy");
   };
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(token2.focusCount(), 0, "token2.focusCount() === 0");
      assert.equal(token2.shieldCount(), 2, "token2.shieldCount() === 2");
      done();
   };
   store.dispatch(CardAction.addFocusCount(token2));
   store.dispatch(CardAction.addShieldCount(token2, -1));
   assert.equal(token2.focusCount(), 1, "token2.focusCount() === 1");
   assert.equal(token2.shieldCount(), 1, "token2.shieldCount() === 1");

   // Run.
   const done = assert.async();
   engine.performCombatPhase(callback);
});

QUnit.test("performCombatPhase() Ysanne Isard", function(assert)
{
   // Setup.
   const engine = createEngine();
   const environment = engine.environment();
   const token0 = environment.pilotInstances()[0]; // TIE Fighter.
   const store = environment.store();
   const upgrade = new CardInstance(store, UpgradeCard.YSANNE_ISARD);
   store.dispatch(CardAction.addUpgrade(token0, upgrade));
   store.dispatch(CardAction.setShieldCount(token0));
   const damage = new CardInstance(store, DamageCard.BLINDED_PILOT);
   token0.receiveDamage(damage);
   const position0 = environment.getPositionFor(token0);
   const token2 = environment.pilotInstances()[2]; // X-Wing.
   const position2 = environment.getPositionFor(token2);
   const newPosition2 = new Position(position0.x(), position0.y() + 50, position2.heading());
   environment.moveToken(position2, newPosition2);
   engine.performEndPhase = function()
   {
      LOGGER.info("performEndPhase() dummy");
   };
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(token0.shieldCount(), 0, "token0.shieldCount() === 0");
      assert.ok([1, 2, 3, 4].includes(token0.damageCount()), "token0.damageCount() === 1 | 2 | 3 | 4 actual " + token0.damageCount());
      assert.equal(token0.evadeCount(), 0, "token0.evadeCount() === 0");
      done();
   };
   assert.equal(token0.shieldCount(), 0);
   assert.equal(token0.damageCount(), 1);
   assert.equal(token0.evadeCount(), 0, "token0.evadeCount() === 0");

   // Run.
   const done = assert.async();
   engine.performCombatPhase(callback);
});

QUnit.test("performEndPhase()", function(assert)
{
   // Setup.
   const engine = createEngine();
   const environment = engine.environment();
   const store = environment.store();
   const token0 = environment.pilotInstances()[0];
   store.dispatch(CardAction.addEvadeCount(token0));
   store.dispatch(CardAction.addFocusCount(token0));
   store.dispatch(CardAction.addWeaponsDisabledCount(token0));
   const token1 = environment.pilotInstances()[1];
   store.dispatch(CardAction.addEvadeCount(token1));
   store.dispatch(CardAction.addFocusCount(token1));
   store.dispatch(CardAction.addWeaponsDisabledCount(token1));
   const token2 = environment.pilotInstances()[2];
   store.dispatch(CardAction.addEvadeCount(token2));
   store.dispatch(CardAction.addFocusCount(token2));
   store.dispatch(CardAction.addWeaponsDisabledCount(token2));
   engine.performPlanningPhase = function()
   {
      LOGGER.info("performPlanningPhase() dummy");
   };
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(token0.evadeCount(), 0, token0.name());
      assert.equal(token0.focusCount(), 0);
      assert.equal(token0.weaponsDisabledCount(), 0);
      assert.equal(token1.evadeCount(), 0, token1.name());
      assert.equal(token1.focusCount(), 0);
      assert.equal(token1.weaponsDisabledCount(), 0);
      assert.equal(token2.evadeCount(), 0, token2.name());
      assert.equal(token2.focusCount(), 0);
      assert.equal(token2.weaponsDisabledCount(), 0);
      done();
   };

   // Run.
   const done = assert.async();
   engine.performEndPhase(callback);
});

QUnit.test("performPlanningPhase()", function(assert)
{
   // Setup.
   const engine = createEngine();
   engine.performActivationPhase = function()
   {
      LOGGER.info("performActivationPhase() dummy");
   };
   const store = engine.store();
   const environment = store.getState().environment;
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      const pilotInstances = environment.pilotInstances();
      const pilotToManeuver = store.getState().pilotToManeuver;
      assert.ok(pilotToManeuver);
      const keys = pilotToManeuver.keySeq().toArray();
      assert.ok(keys);
      assert.equal(keys.length, pilotInstances.length);
      keys.forEach(function(key)
      {
         assert.ok(pilotToManeuver.get(key));
      });

      done();
   };

   // Run.
   const done = assert.async();
   engine.performPlanningPhase(callback);
});

function createEngine(isHuge)
{
   let environment;

   if (isHuge)
   {
      environment = EnvironmentFactory.createHugeShipEnvironment();
   }
   else
   {
      environment = EnvironmentFactory.createCoreSetEnvironment();
   }

   const store = environment.store();
   const adjudicator = Adjudicator.create(store);
   store.dispatch(Action.setAdjudicator(adjudicator));
   store.dispatch(Action.setDelay(delay));

   return new Engine(store);
}

function createEngineEpsilonLeader()
{
   const environment = EnvironmentFactory.createTFACoreSetEnvironment();
   const store = environment.store();
   const adjudicator = Adjudicator.create(store);
   store.dispatch(Action.setAdjudicator(adjudicator));
   store.dispatch(Action.setDelay(delay));

   return new Engine(store);
}

const EngineTest = {};
export default EngineTest;