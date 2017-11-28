"use strict";

define(["qunit", "redux", "artifact/js/Phase",
  "model/js/Action", "model/js/Agent", "model/js/Environment", "model/js/PhaseObserver", "model/js/Reducer", "model/js/SimpleAgent", "model/js/SquadBuilder"],
   function(QUnit, Redux, Phase,
      Action, Agent, Environment, PhaseObserver, Reducer, SimpleAgent, SquadBuilder)
   {
      QUnit.module("PhaseObserver");

      QUnit.test("onChange()", function(assert)
      {
         // Setup.
         var environment = createEnvironment();
         var store = environment.store();
         var token = environment.tokens()[2]; // X-Wing Luke Skywalker
         var phaseKey = Phase.ACTIVATION_REVEAL_DIAL;
         var phaseCallback = function(phaseData)
         {
            // Verify.
            assert.equal(store.getState().phaseQueue.size, 0);
            assert.ok(phaseData);
            assert.equal(phaseData.get("phaseKey"), phaseKey);
            assert.equal(phaseData.get("phaseToken"), token);
         };
         store.dispatch(Action.enqueuePhase(phaseKey, token, phaseCallback));
         assert.equal(store.getState().phaseQueue.size, 1);

         // Run.
         PhaseObserver.observeStore(store);
      });

      function createEnvironment()
      {
         var squadBuilder1 = SquadBuilder.CoreSetImperialSquadBuilder;
         var squadBuilder2 = SquadBuilder.CoreSetRebelSquadBuilder;
         var store = Redux.createStore(Reducer.root);
         var agent1 = new Agent(store, "1", squadBuilder1.factionKey());
         var agent2 = new Agent(store, "2", squadBuilder2.factionKey());
         var squad1 = squadBuilder1.buildSquad(agent1);
         var squad2 = squadBuilder2.buildSquad(agent2);
         var environment = new Environment(store, agent1, squad1, agent2, squad2);

         return environment;
      }
   });
