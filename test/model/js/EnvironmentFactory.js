"use strict";

define(["common/js/InputValidator", "redux", "artifact/js/Faction",
  "model/js/Environment", "model/js/EventObserver", "model/js/PhaseObserver", "model/js/Reducer", "model/js/SimpleAgent", "model/js/SquadBuilder"],
   function(InputValidator, Redux, Faction,
      Environment, EventObserver, PhaseObserver, Reducer, SimpleAgent, SquadBuilder)
   {
      var EnvironmentFactory = {};

      EnvironmentFactory.createCoreSetEnvironment = function(store, computerAgentType0, computerAgentType1, iconBase, imageBase)
      {
         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type0 = (computerAgentType0 ? computerAgentType0 : SimpleAgent);
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgent);
         var myIconBase = (iconBase ? iconBase : "../../../main/resources/icons/");
         var myImageBase = (imageBase ? imageBase : "../../../main/resources/images/");

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(type0, "First Agent", Faction.IMPERIAL, myIconBase, myImageBase);
         var firstSquad = SquadBuilder.CoreSetImperialSquadBuilder.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(type1, "Second Agent", Faction.REBEL, myIconBase, myImageBase);
         var secondSquad = SquadBuilder.CoreSetRebelSquadBuilder.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      EnvironmentFactory.createTFACoreSetEnvironment = function(store, computerAgentType0, computerAgentType1, iconBase, imageBase)
      {
         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type0 = (computerAgentType0 ? computerAgentType0 : SimpleAgent);
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgent);
         var myIconBase = (iconBase ? iconBase : "../../../main/resources/icons/");
         var myImageBase = (imageBase ? imageBase : "../../../main/resources/images/");

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(type0, "First Agent", Faction.FIRST_ORDER, myIconBase, myImageBase);
         var firstSquad = SquadBuilder.CoreSetFirstOrderSquadBuilder.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(type1, "Second Agent", Faction.RESISTANCE, myIconBase, myImageBase);
         var secondSquad = SquadBuilder.CoreSetResistanceSquadBuilder.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      EnvironmentFactory.createHugeShipEnvironment = function(store, computerAgentType0, computerAgentType1, iconBase, imageBase)
      {
         var myStore = (store ? store : Redux.createStore(Reducer.root));
         var type0 = (computerAgentType0 ? computerAgentType0 : SimpleAgent);
         var type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgent);
         var myIconBase = (iconBase ? iconBase : "../../../main/resources/icons/");
         var myImageBase = (imageBase ? imageBase : "../../../main/resources/images/");

         // Create initial agents and tokens.
         var firstAgent = EnvironmentFactory.createAgent(type0, "First Agent", Faction.IMPERIAL, myIconBase, myImageBase);
         var firstSquad = SquadBuilder.HugeShipImperialSquadBuilder.buildSquad(firstAgent);
         var secondAgent = EnvironmentFactory.createAgent(type1, "Second Agent", Faction.REBEL, myIconBase, myImageBase);
         var secondSquad = SquadBuilder.HugeShipRebelSquadBuilder.buildSquad(secondAgent);

         var answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

         EventObserver.observeStore(myStore);
         PhaseObserver.observeStore(myStore);

         return answer;
      };

      EnvironmentFactory.createAgent = function(type, name, factionKey, iconBase, imageBase)
      {
         InputValidator.validateNotNull("type", type);
         InputValidator.validateNotNull("name", name);
         InputValidator.validateNotNull("factionKey", factionKey);
         InputValidator.validateNotNull("iconBase", iconBase);
         InputValidator.validateNotNull("imageBase", imageBase);

         var inputAreaId = "inputArea";

         return new type(name, factionKey, inputAreaId, iconBase, imageBase);
      };

      return EnvironmentFactory;
   });
