"use strict";

define(["qunit", "redux", "artifact/js/Event", "model/js/Action", "model/js/Agent", "model/js/EventObserver", "model/js/Environment", "model/js/Reducer", "model/js/SquadBuilder"],
   function(QUnit, Redux, Event, Action, Agent, EventObserver, Environment, Reducer, SquadBuilder)
   {
      QUnit.module("EventObserver");

      QUnit.test("onChange()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.pilotInstances()[2]; // X-Wing Luke Skywalker
         var eventKey = Event.AFTER_EXECUTE_MANEUVER;
         var eventCallback = function(eventData)
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.equal(store.getState().eventQueue.size, 0);
            assert.ok(eventData);
            assert.equal(eventData.get("eventKey"), eventKey);
            assert.equal(eventData.get("eventToken"), token);
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
   });
