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

const resourceBase = "../resource/";
const store = Redux.createStore(AgentSquadReducer.root);
const delegateStore = Redux.createStore(Reducer.root);
store.dispatch(AgentSquadAction.setDelegateStore(delegateStore));
let faction = Faction.properties[Faction.IMPERIAL];
const agent = new Agent(delegateStore, "Placeholder");
const factionToSquadBuilders = {};
				[Faction.IMPERIAL, Faction.REBEL, Faction.SCUM].forEach(function(factionKey)
{
   factionToSquadBuilders[factionKey] = SquadBuilder.findByFaction(factionKey);
});
const squadBuilder = factionToSquadBuilders[faction.key][0];
const squad = squadBuilder.buildSquad(agent);

// store.dispatch(AgentSquadAction.setAgent(agent));
store.dispatch(AgentSquadAction.setAgentName(agent.name()));
store.dispatch(AgentSquadAction.setAgentType(agent._strategy()));
store.dispatch(AgentSquadAction.setSquad(squad));

const agentNameChanged = function(agentName)
{
   store.dispatch(AgentSquadAction.setAgentName(agentName));
   renderAgentSquadUI();
};
const agentTypeChanged = function(agentType)
{
   store.dispatch(AgentSquadAction.setAgentType(agentType));
   renderAgentSquadUI();
};
const factionChanged = function(factionIn)
{
   faction = factionIn;
   store.dispatch(AgentSquadAction.setFaction(faction));
   renderAgentSquadUI();
};
const squadBuilderTypeChanged = function(squadBuilderType)
{
   store.dispatch(AgentSquadAction.setSquadBuilderType(squadBuilderType));
   renderAgentSquadUI();
};
const squadChanged = function(squad)
{
   store.dispatch(AgentSquadAction.setSquad(squad));
   renderAgentSquadUI();
};

function renderAgentSquadUI()
{
   const element = React.createElement(ReactRedux.Provider,
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