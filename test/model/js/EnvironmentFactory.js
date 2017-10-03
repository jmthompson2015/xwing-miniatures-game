"use strict";

define(["redux", "common/js/InputValidator", "artifact/js/Faction",
  "model/js/Environment", "model/js/EventObserver", "model/js/PhaseObserver", "model/js/Reducer", "model/js/SimpleAgent", "model/js/SquadBuilder"],
   function(Redux, InputValidator, Faction, Environment, EventObserver, PhaseObserver, Reducer, SimpleAgent, SquadBuilder)
   {
      var EnvironmentFactory = {};

      EnvironmentFactory.createCoreSetEnvironment = function(store, computerAgentType0, computerAgentType1, resourceBase)
      {
         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type0 = (computerAgentType0 ? computerAgentType0 : SimpleAgent);
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgent);
         var myImageBase = (resourceBase ? resourceBase : "../../../src/view/resource/");

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(type0, "First Agent", Faction.IMPERIAL, myImageBase);
         var firstSquad = SquadBuilder.CoreSetImperialSquadBuilder.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(type1, "Second Agent", Faction.REBEL, myImageBase);
         var secondSquad = SquadBuilder.CoreSetRebelSquadBuilder.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      EnvironmentFactory.createTFACoreSetEnvironment = function(store, computerAgentType0, computerAgentType1, resourceBase)
      {
         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type0 = (computerAgentType0 ? computerAgentType0 : SimpleAgent);
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgent);
         var myImageBase = (resourceBase ? resourceBase : "../../../src/view/resource/");

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(type0, "First Agent", Faction.FIRST_ORDER, myImageBase);
         var firstSquad = SquadBuilder.CoreSetFirstOrderSquadBuilder.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(type1, "Second Agent", Faction.RESISTANCE, myImageBase);
         var secondSquad = SquadBuilder.CoreSetResistanceSquadBuilder.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      EnvironmentFactory.createHugeShipEnvironment = function(store, computerAgentType0, computerAgentType1, resourceBase)
      {
         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type0 = (computerAgentType0 ? computerAgentType0 : SimpleAgent);
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgent);
         var myImageBase = (resourceBase ? resourceBase : "../../../src/view/resource/");

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(type0, "First Agent", Faction.IMPERIAL, myImageBase);
         var firstSquad = SquadBuilder.HugeShipImperialSquadBuilder.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(type1, "Second Agent", Faction.REBEL, myImageBase);
         var secondSquad = SquadBuilder.HugeShipRebelSquadBuilder.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      EnvironmentFactory.createAgent = function(type, name, factionKey, resourceBase)
      {
         InputValidator.validateNotNull("type", type);
         InputValidator.validateNotNull("name", name);
         InputValidator.validateNotNull("factionKey", factionKey);
         InputValidator.validateNotNull("resourceBase", resourceBase);

         var inputAreaId = "inputArea";

         return new type(name, factionKey, inputAreaId, resourceBase);
      };

      return EnvironmentFactory;
   });
