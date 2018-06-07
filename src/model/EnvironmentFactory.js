import InputValidator from "../utility/InputValidator.js";

import Agent from "./Agent.js";
import Environment from "./Environment.js";
import EventObserver from "./EventObserver.js";
import PhaseObserver from "./PhaseObserver.js";
import Reducer from "./Reducer.js";
import SimpleAgentStrategy from "./SimpleAgentStrategy.js";
import SquadBuilder from "./SquadBuilder.js";

const EnvironmentFactory = {};

EnvironmentFactory.createCoreSetEnvironment = function(store, computerAgentType1, computerAgentType2)
{
   const squadBuilder1 = SquadBuilder.CoreSetImperialSquadBuilder;
   const squadBuilder2 = SquadBuilder.CoreSetRebelSquadBuilder;

   return EnvironmentFactory.createEnvironment(squadBuilder1, squadBuilder2, store, computerAgentType1, computerAgentType2);
};

EnvironmentFactory.createTFACoreSetEnvironment = function(store, computerAgentType1, computerAgentType2)
{
   const squadBuilder1 = SquadBuilder.CoreSetFirstOrderSquadBuilder;
   const squadBuilder2 = SquadBuilder.CoreSetResistanceSquadBuilder;

   return EnvironmentFactory.createEnvironment(squadBuilder1, squadBuilder2, store, computerAgentType1, computerAgentType2);
};

EnvironmentFactory.createHugeShipEnvironment = function(store, computerAgentType1, computerAgentType2)
{
   const squadBuilder1 = SquadBuilder.HugeShipImperialSquadBuilder;
   const squadBuilder2 = SquadBuilder.HugeShipRebelSquadBuilder;

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

   const myStore = (store ? store : Redux.createStore(Reducer.root));
   const type1 = (computerAgentType1 ? computerAgentType1 : SimpleAgentStrategy);
   const type2 = (computerAgentType2 ? computerAgentType2 : SimpleAgentStrategy);

   // Create initial agents and tokens.
   const firstAgent = EnvironmentFactory.createAgent(myStore, "First Agent", type1);
   const firstSquad = squadBuilder1.buildSquad(firstAgent);
   const secondAgent = EnvironmentFactory.createAgent(myStore, "Second Agent", type2);
   const secondSquad = squadBuilder2.buildSquad(secondAgent);

   const answer = new Environment(myStore, firstAgent, firstSquad, secondAgent, secondSquad);

   EventObserver.observeStore(myStore);
   PhaseObserver.observeStore(myStore);

   return answer;
};

export default EnvironmentFactory;