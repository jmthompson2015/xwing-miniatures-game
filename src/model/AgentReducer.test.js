import PilotCard from "../artifact/PilotCard.js";

import Agent from "./Agent.js";
import AgentAction from "./AgentAction.js";
import CardInstance from "./CardInstance.js";
import Reducer from "./Reducer.js";

QUnit.module("AgentReducer");

QUnit.test("addPilot()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "agent1");
   assert.equal(store.getState().agentPilots.size, 0);

   // Run.
   const token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);

   // Verify.
   assert.equal(store.getState().agentPilots.size, 1);
   assert.equal(store.getState().agentPilots.get(agent.id()).size, 1);
   assert.equal(store.getState().agentPilots.get(agent.id()).get(0), token.id());
});

QUnit.test("incrementNextAgentId()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
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
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "agent1");
   const token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);
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

const AgentReducerTest = {};
export default AgentReducerTest;