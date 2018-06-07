import Logger from "../utility/Logger.js";

import Agent from "../model/Agent.js";
import AgentSquadAction from "../model/AgentSquadAction.js";
import AgentSquadReducer from "../model/AgentSquadReducer.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import AgentSquadContainer from "./AgentSquadContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const store = Redux.createStore(AgentSquadReducer.root);
const delegateStore = Redux.createStore(Reducer.root);
store.dispatch(AgentSquadAction.setDelegateStore(delegateStore));
const agentNumber = 1;
setAgentAndSquad(store, delegateStore, agentNumber);

const element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(AgentSquadContainer,
{
   agentNumber: agentNumber,
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("inputArea"));

function setAgentAndSquad(store, delegateStore, agentNumber)
{
   const faction = store.getState().faction;
   const agentName = "Agent " + agentNumber;
   const agentType = store.getState().agentType;
   const agent = new Agent(delegateStore, agentName, undefined, agentType);
   const squadBuilders = SquadBuilder.findByFaction(faction.key);
   const squad = squadBuilders[0].buildSquad(agent);
   store.dispatch(AgentSquadAction.setAgentName(agentName));
   store.dispatch(AgentSquadAction.setAgentType(agentType));
   store.dispatch(AgentSquadAction.setSquad(squad));
}