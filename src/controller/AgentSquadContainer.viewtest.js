import Logger from "../utility/Logger.js";

import Agent from "../model/Agent.js";
import AgentSquadAction from "../model/AgentSquadAction.js";
import AgentSquadReducer from "../model/AgentSquadReducer.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import AgentSquadContainer from "./AgentSquadContainer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger",
// 		"model/Agent", "model/AgentSquadAction", "model/AgentSquadReducer", "model/Reducer", "model/SquadBuilder",
// 		"controller/AgentSquadContainer"
// 	],
// 	function(React, ReactDOM, ReactRedux, Redux, Logger, Agent, AgentSquadAction, AgentSquadReducer, Reducer, SquadBuilder, AgentSquadContainer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var store = Redux.createStore(AgentSquadReducer.root);
var delegateStore = Redux.createStore(Reducer.root);
store.dispatch(AgentSquadAction.setDelegateStore(delegateStore));
var agentNumber = 1;
setAgentAndSquad(store, delegateStore, agentNumber);

var element = React.createElement(ReactRedux.Provider,
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
   var faction = store.getState().faction;
   var agentName = "Agent " + agentNumber;
   var agentType = store.getState().agentType;
   var agent = new Agent(delegateStore, agentName, undefined, agentType);
   var squadBuilders = SquadBuilder.findByFaction(faction.key);
   var squad = squadBuilders[0].buildSquad(agent);
   store.dispatch(AgentSquadAction.setAgentName(agentName));
   store.dispatch(AgentSquadAction.setAgentType(agentType));
   store.dispatch(AgentSquadAction.setSquad(squad));
}