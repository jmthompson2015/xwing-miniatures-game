"use strict";

define(["redux", "common/js/InputValidator", "artifact/js/Faction",
  "model/js/Agent", "model/js/Environment", "model/js/EventObserver", "model/js/PhaseObserver", "model/js/Reducer", "model/js/SimpleAgentStrategy", "model/js/SquadBuilder"],
   function(Redux, InputValidator, Faction, Agent, Environment, EventObserver, PhaseObserver, Reducer, SimpleAgentStrategy, SquadBuilder)
   {
      var EnvironmentFactory = {};

      EnvironmentFactory.createCoreSetEnvironment = function(store, computerAgentType0, computerAgentType1, resourceBase)
      {
         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type0 = (computerAgentType0 ? computerAgentType0 : SimpleAgentStrategy);
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgentStrategy);
         var myImageBase = (resourceBase ? resourceBase : "../../../src/view/resource/");

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(myStore, type0, "First Agent", myImageBase);
         var firstSquad = SquadBuilder.CoreSetImperialSquadBuilder.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(myStore, type1, "Second Agent", myImageBase);
         var secondSquad = SquadBuilder.CoreSetRebelSquadBuilder.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      EnvironmentFactory.createTFACoreSetEnvironment = function(store, computerAgentType0, computerAgentType1, resourceBase)
      {
         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type0 = (computerAgentType0 ? computerAgentType0 : SimpleAgentStrategy);
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgentStrategy);
         var myImageBase = (resourceBase ? resourceBase : "../../../src/view/resource/");

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(myStore, type0, "First Agent", myImageBase);
         var firstSquad = SquadBuilder.CoreSetFirstOrderSquadBuilder.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(myStore, type1, "Second Agent", myImageBase);
         var secondSquad = SquadBuilder.CoreSetResistanceSquadBuilder.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      EnvironmentFactory.createHugeShipEnvironment = function(store, computerAgentType0, computerAgentType1, resourceBase)
      {
         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type0 = (computerAgentType0 ? computerAgentType0 : SimpleAgentStrategy);
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgentStrategy);
         var myImageBase = (resourceBase ? resourceBase : "../../../src/view/resource/");

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(myStore, type0, "First Agent", myImageBase);
         var firstSquad = SquadBuilder.HugeShipImperialSquadBuilder.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(myStore, type1, "Second Agent", myImageBase);
         var secondSquad = SquadBuilder.HugeShipRebelSquadBuilder.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      EnvironmentFactory.createAgent = function(store, type, name, resourceBase)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("type", type);
         InputValidator.validateNotNull("name", name);
         InputValidator.validateNotNull("resourceBase", resourceBase);

         return new Agent(store, name, undefined, type);
      };

      return EnvironmentFactory;
   });
