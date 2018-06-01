import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";

import Agent from "../model/Agent.js";
import AgentSquadAction from "../model/AgentSquadAction.js";
import AgentSquadReducer from "../model/AgentSquadReducer.js";
import MediumAgentStrategy from "../model/MediumAgentStrategy.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import AgentSquadUI from "./AgentSquadUI.js";

import SquadBuilderContainer from "../controller/SquadBuilderContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var store = Redux.createStore(AgentSquadReducer.root);
var delegateStore = Redux.createStore(Reducer.root);
store.dispatch(AgentSquadAction.setDelegateStore(delegateStore));
var faction = Faction.properties[Faction.IMPERIAL];
var agent = new Agent(delegateStore, "Placeholder");
var factionToSquadBuilders = {};
				[Faction.IMPERIAL, Faction.REBEL, Faction.SCUM].forEach(function(factionKey)
{
   factionToSquadBuilders[factionKey] = SquadBuilder.findByFaction(factionKey);
});
var squadBuilder = factionToSquadBuilders[faction.key][0];
var squad = squadBuilder.buildSquad(agent);

// store.dispatch(AgentSquadAction.setAgent(agent));
store.dispatch(AgentSquadAction.setAgentName(agent.name()));
store.dispatch(AgentSquadAction.setAgentType(agent._strategy()));
store.dispatch(AgentSquadAction.setSquad(squad));

var agentNameChanged = function(agentName)
{
   store.dispatch(AgentSquadAction.setAgentName(agentName));
   renderAgentSquadUI();
};
var agentTypeChanged = function(agentType)
{
   store.dispatch(AgentSquadAction.setAgentType(agentType));
   renderAgentSquadUI();
};
var factionChanged = function(factionIn)
{
   faction = factionIn;
   store.dispatch(AgentSquadAction.setFaction(faction));
   renderAgentSquadUI();
};
var squadBuilderTypeChanged = function(squadBuilderType)
{
   store.dispatch(AgentSquadAction.setSquadBuilderType(squadBuilderType));
   renderAgentSquadUI();
};
var squadChanged = function(squad)
{
   store.dispatch(AgentSquadAction.setSquad(squad));
   renderAgentSquadUI();
};

function renderAgentSquadUI()
{
   var element = React.createElement(ReactRedux.Provider,
   {
      store: store,
   }, React.createElement(AgentSquadUI,
   {
      agent: store.getState().agent,
      agentName: "Agent 1",
      agentNumber: 1,
      agentType: store.getState().agentType,
      agentTypes: [MediumAgentStrategy],
      faction: store.getState().faction,
      squadBuilders: factionToSquadBuilders[faction.key],
      inputAreaId: "inputArea",
      resourceBase: resourceBase,
      squad: store.getState().squad,
      squadBuilderClass: SquadBuilderContainer,
      squadBuilderType: store.getState().squadBuilderType,

      agentNameChanged: agentNameChanged,
      agentTypeChanged: agentTypeChanged,
      factionChanged: factionChanged,
      squadBuilderTypeChanged: squadBuilderTypeChanged,
      squadChanged: squadChanged,
   }));
   ReactDOM.render(element, document.getElementById("inputArea"));
}

renderAgentSquadUI();