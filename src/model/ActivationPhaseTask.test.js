import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";

import Action from "./Action.js";
import ActivationPhaseTask from "./ActivationPhaseTask.js";
import Adjudicator from "./Adjudicator.js";
import Agent from "./Agent.js";
import Environment from "./Environment.js";
import EventObserver from "./EventObserver.js";
import PhaseObserver from "./PhaseObserver.js";
import Reducer from "./Reducer.js";
import SquadBuilder from "./SquadBuilder.js";
import CardAction from "./CardAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";

QUnit.module("ActivationPhaseTask");

const delay = 10;

QUnit.test("performActivationPhase()", function(assert)
{
   // Setup.
   const task = createTask();
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      done();
   };

   // Run.
   const done = assert.async();
   task.doIt(callback);
});

QUnit.test("performActivationPhase() Huge", function(assert)
{
   // Setup.
   const task = createTask(true);
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      done();
   };

   // Run.
   const done = assert.async();
   task.doIt(callback);
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
   const token0 = environment.pilotInstances()[0]; // TIE Phantom
   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);
   const pilotToManeuver = createPilotToManeuver(environment);
   store.dispatch(Action.addPilotToManeuver(pilotToManeuver));
   store.dispatch(CardAction.addCloakCount(token0));
   const task = new ActivationPhaseTask(store);
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
         assert.ok(false);
      }

      done();
   };
   assert.equal(token0.isCloaked(), true);
   assert.equal(token0.cloakCount(), 1);

   // Run.
   const done = assert.async();
   task.doIt(callback);
});

function createPilotToManeuver(environment)
{
   const answer = {};
   const pilotInstances = environment.pilotInstances();
   let maneuver;

   pilotInstances.forEach(function(cardInstance)
   {
      maneuver = (cardInstance.isHuge() ? Maneuver.STRAIGHT_1_3 : Maneuver.STRAIGHT_1_STANDARD);
      answer["" + cardInstance.id()] = maneuver;
   });

   return answer;
}

function createTask(isHuge)
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

   const pilotToManeuver = createPilotToManeuver(environment);

   const store = environment.store();
   const adjudicator = Adjudicator.create(store);
   store.dispatch(Action.setAdjudicator(adjudicator));
   store.dispatch(Action.setDelay(delay));
   store.dispatch(Action.addPilotToManeuver(pilotToManeuver));

   return new ActivationPhaseTask(store);
}

const ActivationPhaseTaskTest = {};
export default ActivationPhaseTaskTest;