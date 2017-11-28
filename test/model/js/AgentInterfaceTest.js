"use strict";

define(["qunit", "redux", "artifact/js/Faction", "model/js/Agent", "model/js/MediumAgent", "model/js/Reducer", "model/js/SimpleAgent"],
   function(QUnit, Redux, Faction, Agent, MediumAgent, Reducer, SimpleAgent)
   {
      QUnit.module("AgentInterface");

      QUnit.test("Agent interface", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var name = "myAgent";
         var faction = Faction.IMPERIAL;

         var agent0 = new SimpleAgent(name + "0", faction);
         var agent1 = new MediumAgent(name + "1", faction);
         var agent2 = new Agent(store, name + "2", faction);
         var agents = [agent0, agent1, agent2];

         // Run / Verify.
         for (var i = 0; i < agents.length; i++)
         {
            var agent = agents[i];

            // Verify the functions exist.
            assert.ok(agent.name, agent.name() + ".name");
            assert.ok(agent.factionKey, agent.name() + ".factionKey");

            assert.ok(agent.getPlanningAction, agent.name() + ".getPlanningAction");
            assert.ok(agent.getDecloakAction, agent.name() + ".getDecloakAction");
            assert.ok(agent.getShipAction, agent.name() + ".getShipAction");
            assert.ok(agent.chooseWeaponAndDefender, agent.name() + ".chooseWeaponAndDefender");
            assert.ok(agent.getModifyAttackDiceAction, agent.name() + ".getModifyAttackDiceAction");
            assert.ok(agent.getModifyDefenseDiceAction, agent.name() + ".getModifyDefenseDiceAction");
            assert.ok(agent.dealDamage, agent.name() + ".dealDamage");
         }
      });
   });
