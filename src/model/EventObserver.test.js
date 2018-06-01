import Event from "../artifact/Event.js";

import Action from "./Action.js";
import Agent from "./Agent.js";
import EventObserver from "./EventObserver.js";
import Environment from "./Environment.js";
import Reducer from "./Reducer.js";
import SquadBuilder from "./SquadBuilder.js";

QUnit.module("EventObserver");

QUnit.test("onChange()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing Luke Skywalker
   var eventKey = Event.AFTER_EXECUTE_MANEUVER;
   var eventCallback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(store.getState().eventQueue.size, 0);
      done();
   };
   store.dispatch(Action.enqueueEvent(eventKey, token, eventCallback));
   assert.equal(store.getState().eventQueue.size, 1);

   // Run.
   var done = assert.async();
   EventObserver.observeStore(store);
});

function createEnvironment()
{
   var squadBuilder1 = SquadBuilder.CoreSetImperialSquadBuilder;
   var squadBuilder2 = SquadBuilder.CoreSetRebelSquadBuilder;
   var store = Redux.createStore(Reducer.root);
   var agent1 = new Agent(store, "1");
   var agent2 = new Agent(store, "2");
   var squad1 = squadBuilder1.buildSquad(agent1);
   var squad2 = squadBuilder2.buildSquad(agent2);
   var environment = new Environment(store, agent1, squad1, agent2, squad2);

   return environment;
}

const EventObserverTest = {};
export default EventObserverTest;