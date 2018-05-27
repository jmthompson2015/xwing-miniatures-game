"use strict";

define(["immutable", "qunit", "redux", "artifact/PilotCard",
   "model/Agent", "model/AgentAction", "model/CardInstance", "model/Reducer"],
   function(Immutable, QUnit, Redux, PilotCard,
      Agent, AgentAction, CardInstance, Reducer)
   {
      QUnit.module("AgentReducer");

      QUnit.test("addPilot()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "agent1");
         assert.equal(store.getState().agentPilots.size, 0);

         // Run.
         var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);

         // Verify.
         assert.equal(store.getState().agentPilots.size, 1);
         assert.equal(store.getState().agentPilots.get(agent.id()).size, 1);
         assert.equal(store.getState().agentPilots.get(agent.id()).get(0), token.id());
      });

      QUnit.test("incrementNextAgentId()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         assert.equal(store.getState().nextAgentId, 1);

         // Run.
         store.dispatch(AgentAction.incrementNextAgentId());

         // Verify.
         assert.equal(store.getState().nextAgentId, 2);

         // Run.
         store.dispatch(AgentAction.incrementNextAgentId());

         // Verify.
         assert.equal(store.getState().nextAgentId, 3);
      });

      QUnit.test("removePilot()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "agent1");
         var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);
         assert.equal(store.getState().agentPilots.size, 1);
         assert.equal(store.getState().agentPilots.get(agent.id()).size, 1);
         assert.equal(store.getState().agentPilots.get(agent.id()).get(0), token.id());

         // Run.
         store.dispatch(AgentAction.removePilot(agent, token));

         // Verify.
         assert.equal(store.getState().agentPilots.size, 1);
         assert.equal(store.getState().agentPilots.get(agent.id()).size, 0);
         //  assert.equal(store.getState().agentPilots.get(agent.id()).get(0), token.id());
      });
   });
