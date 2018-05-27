"use strict";

define(["redux", "utility/InputValidator",
  "model/Agent", "model/Environment", "model/EventObserver", "model/PhaseObserver", "model/Reducer", "model/SimpleAgentStrategy", "model/SquadBuilder"],
   function(Redux, InputValidator, Agent, Environment, EventObserver, PhaseObserver, Reducer, SimpleAgentStrategy, SquadBuilder)
   {
      var EnvironmentFactory = {};

      EnvironmentFactory.createCoreSetEnvironment = function(store, computerAgentType1, computerAgentType2)
      {
         var squadBuilder1 = SquadBuilder.CoreSetImperialSquadBuilder;
         var squadBuilder2 = SquadBuilder.CoreSetRebelSquadBuilder;

         return EnvironmentFactory.createEnvironment(squadBuilder1, squadBuilder2, store, computerAgentType1, computerAgentType2);
      };

      EnvironmentFactory.createTFACoreSetEnvironment = function(store, computerAgentType1, computerAgentType2)
      {
         var squadBuilder1 = SquadBuilder.CoreSetFirstOrderSquadBuilder;
         var squadBuilder2 = SquadBuilder.CoreSetResistanceSquadBuilder;

         return EnvironmentFactory.createEnvironment(squadBuilder1, squadBuilder2, store, computerAgentType1, computerAgentType2);
      };

      EnvironmentFactory.createHugeShipEnvironment = function(store, computerAgentType1, computerAgentType2)
      {
         var squadBuilder1 = SquadBuilder.HugeShipImperialSquadBuilder;
         var squadBuilder2 = SquadBuilder.HugeShipRebelSquadBuilder;

         return EnvironmentFactory.createEnvironment(squadBuilder1, squadBuilder2, store, computerAgentType1, computerAgentType2);
      };

      EnvironmentFactory.createAgent = function(store, name, type)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("name", name);
         InputValidator.validateNotNull("type", type);

         return new Agent(store, name, undefined, type);
      };

      EnvironmentFactory.createEnvironment = function(squadBuilder1, squadBuilder2, store, computerAgentType1, computerAgentType2)
      {
         InputValidator.validateNotNull("squadBuilder1", squadBuilder1);
         InputValidator.validateNotNull("squadBuilder2", squadBuilder2);
         // store optional.
         // computerAgentType1 optional.
         // computerAgentType2 optional.

         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgentStrategy);
         var type2 = (computerAgentType2 ? computerAgentType2 : SimpleAgentStrategy);

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(myStore, "First Agent", type1);
         var firstSquad = squadBuilder1.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(myStore, "Second Agent", type2);
         var secondSquad = squadBuilder2.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      return EnvironmentFactory;
   });
