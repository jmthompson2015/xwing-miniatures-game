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

var delay = 10;

QUnit.test("performActivationPhase()", function(assert)
{
   // Setup.
   var task = createTask();
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      done();
   };

   // Run.
   var done = assert.async();
   task.doIt(callback);
});

QUnit.test("performActivationPhase() Huge", function(assert)
{
   // Setup.
   var task = createTask(true);
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      done();
   };

   // Run.
   var done = assert.async();
   task.doIt(callback);
});

QUnit.test("performActivationPhase() decloak", function(assert)
{
   // Setup.
   var squadBuilder1 = SquadBuilder.findByNameAndYear("Worlds #2", 2014);
   var squadBuilder2 = SquadBuilder.findByNameAndYear("Worlds #1", 2015);
   var store = Redux.createStore(Reducer.root);
   var agent1 = new Agent(store, "1");
   var agent2 = new Agent(store, "2");
   var squad1 = squadBuilder1.buildSquad(agent1);
   var squad2 = squadBuilder2.buildSquad(agent2);
   var environment = new Environment(store, agent1, squad1, agent2, squad2);
   Adjudicator.create(store);
   store.dispatch(Action.setDelay(delay));
   var token0 = environment.pilotInstances()[0]; // TIE Phantom
   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);
   var pilotToManeuver = createPilotToManeuver(environment);
   store.dispatch(Action.addPilotToManeuver(pilotToManeuver));
   store.dispatch(CardAction.addCloakCount(token0));
   var task = new ActivationPhaseTask(store);
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");

      var token = environment.pilotInstances()[0]; // TIE Phantom
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
   var done = assert.async();
   task.doIt(callback);
});

function createPilotToManeuver(environment)
{
   var answer = {};
   var pilotInstances = environment.pilotInstances();
   var maneuver;

   pilotInstances.forEach(function(cardInstance)
   {
      maneuver = (cardInstance.isHuge() ? Maneuver.STRAIGHT_1_3 : Maneuver.STRAIGHT_1_STANDARD);
      answer["" + cardInstance.id()] = maneuver;
   });

   return answer;
}

function createTask(isHuge)
{
   var environment;

   if (isHuge)
   {
      environment = EnvironmentFactory.createHugeShipEnvironment();
   }
   else
   {
      environment = EnvironmentFactory.createCoreSetEnvironment();
   }

   var pilotToManeuver = createPilotToManeuver(environment);

   var store = environment.store();
   var adjudicator = Adjudicator.create(store);
   store.dispatch(Action.setAdjudicator(adjudicator));
   store.dispatch(Action.setDelay(delay));
   store.dispatch(Action.addPilotToManeuver(pilotToManeuver));

   return new ActivationPhaseTask(store);
}

const ActivationPhaseTaskTest = {};
export default ActivationPhaseTaskTest;