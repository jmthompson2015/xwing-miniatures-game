"use strict";

define(["immutable", "qunit", "redux",
  "artifact/js/Faction", "artifact/js/DamageCard", "artifact/js/Event", "artifact/js/Maneuver", "artifact/js/Phase", "artifact/js/PilotCard", "artifact/js/PlayFormat", "artifact/js/Range",
  "model/js/Action", "model/js/Agent", "model/js/AgentAction", "model/js/AttackDice", "model/js/DefenseDice", "model/js/Environment", "model/js/EnvironmentAction", "model/js/Position", "model/js/RangeRuler", "model/js/Reducer", "model/js/Token"],
   function(Immutable, QUnit, Redux,
      Faction, DamageCard, Event, Maneuver, Phase, PilotCard, PlayFormat, Range,
      Action, Agent, AgentAction, AttackDice, DefenseDice, Environment, EnvironmentAction, Position, RangeRuler, Reducer, Token)
   {
      QUnit.module("AgentReducer");

      QUnit.test("addPilot()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "agent1", Faction.REBEL);
         assert.equal(store.getState().agentPilots.size, 0);

         // Run.
         var token = new Token(store, PilotCard.LUKE_SKYWALKER, agent);

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
         var agent = new Agent(store, "agent1", Faction.REBEL);
         var token = new Token(store, PilotCard.LUKE_SKYWALKER, agent);
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
