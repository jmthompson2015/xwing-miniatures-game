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
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing Luke Skywalker
   const eventKey = Event.AFTER_EXECUTE_MANEUVER;
   const eventCallback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(store.getState().eventQueue.size, 0);
      done();
   };
   store.dispatch(Action.enqueueEvent(eventKey, token, eventCallback));
   assert.equal(store.getState().eventQueue.size, 1);

   // Run.
   const done = assert.async();
   EventObserver.observeStore(store);
});

function createEnvironment()
{
   const squadBuilder1 = SquadBuilder.CoreSetImperialSquadBuilder;
   const squadBuilder2 = SquadBuilder.CoreSetRebelSquadBuilder;
   const store = Redux.createStore(Reducer.root);
   const agent1 = new Agent(store, "1");
   const agent2 = new Agent(store, "2");
   const squad1 = squadBuilder1.buildSquad(agent1);
   const squad2 = squadBuilder2.buildSquad(agent2);
   const environment = new Environment(store, agent1, squad1, agent2, squad2);

   return environment;
}

const EventObserverTest = {};
export default EventObserverTest;