"use strict";

define(["qunit", "redux", "artifact/js/Phase",
  "model/js/Action", "model/js/Agent", "model/js/Environment", "model/js/PhaseObserver", "model/js/Reducer", "model/js/SquadBuilder"],
   function(QUnit, Redux, Phase,
      Action, Agent, Environment, PhaseObserver, Reducer, SquadBuilder)
   {
      QUnit.module("PhaseObserver");

      QUnit.test("onChange()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.pilotInstances()[2]; // X-Wing Luke Skywalker
         var phaseKey = Phase.ACTIVATION_REVEAL_DIAL;
         var phaseCallback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.equal(store.getState().phaseQueue.size, 0);
            done();
         };
         store.dispatch(Action.enqueuePhase(phaseKey, token, phaseCallback));
         assert.equal(store.getState().phaseQueue.size, 1);

         // Run.
         var done = assert.async();
         PhaseObserver.observeStore(store);
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
