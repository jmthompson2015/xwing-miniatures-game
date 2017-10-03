"use strict";

define(["immutable", "artifact/js/Faction", "model/js/SimpleAgent"],
   function(Immutable, Faction, SimpleAgent)
   {
      function AgentSquadInitialState()
      {
         // AgentSquadUI
         this.agent = undefined;
         this.agentName = "Agent";
         this.agentType = SimpleAgent;
         this.faction = Faction.properties[Faction.IMPERIAL];
         this.inputAreaId = "inputArea";
         this.resourceBase = "view/resource";
         this.squadBuilderType = "Prefabricated";

         // SquadBuilderUI
         this.delegateStore = undefined;
         this.displayItem = undefined;
         this.pilots = Immutable.List();
         this.pilotIndexToUpgrades = Immutable.Map();
         this.ships = Immutable.List();
         this.squad = undefined;
      }

      if (Object.freeze)
      {
         Object.freeze(AgentSquadInitialState);
      }

      return AgentSquadInitialState;
   });
