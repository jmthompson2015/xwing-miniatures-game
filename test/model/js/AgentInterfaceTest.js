"use strict";

define(["qunit", "artifact/js/Faction", "model/js/MediumAgent", "model/js/SimpleAgent"],
   function(QUnit, Faction, MediumAgent, SimpleAgent)
   {
      QUnit.module("AgentInterface");

      QUnit.test("Agent interface", function(assert)
      {
         // Setup.
         var name = "myAgent";
         var faction = Faction.IMPERIAL;

         var agent0 = new SimpleAgent(name + "0", faction);
         var agent1 = new MediumAgent(name + "1", faction);
         var agents = [agent0, agent1 /*, agent2 */ ];

         // Run / Verify.
         for (var i = 0; i < agents.length; i++)
         {
            var agent = agents[i];

            // Verify the functions exist.
            assert.ok(agent.name, agent.name() + ".name");
            assert.ok(agent.factionKey, agent.name() + ".factionKey");

            if (i === 2)
            {
               assert.ok(agent.inputAreaId, agent.name() + ".inputAreaId");
               assert.ok(agent.imageBase, agent.name() + ".imageBase");
            }

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
