import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";

import AgentSquadAction from "../model/AgentSquadAction.js";
import AgentSquadReducer from "../model/AgentSquadReducer.js";
import MediumAgentStrategy from "../model/MediumAgentStrategy.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import NewGamePanel from "./NewGamePanel.js";

import AgentSquadContainer from "../controller/AgentSquadContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const store1 = Redux.createStore(AgentSquadReducer.root);
const delegateStore1 = Redux.createStore(Reducer.root);
store1.dispatch(AgentSquadAction.setDelegateStore(delegateStore1));
store1.dispatch(AgentSquadAction.setAgentName("Agent 1"));
setSquad(store1);

const store2 = Redux.createStore(AgentSquadReducer.root);
const delegateStore2 = Redux.createStore(Reducer.root);
store2.dispatch(AgentSquadAction.setDelegateStore(delegateStore2));
store2.dispatch(AgentSquadAction.setFaction(Faction.properties[Faction.REBEL]));
store2.dispatch(AgentSquadAction.setAgentName("Agent 2"));
store2.dispatch(AgentSquadAction.setAgentType(MediumAgentStrategy));
setSquad(store2);

const element = React.createElement(NewGamePanel,
{
   agentSquadClass: AgentSquadContainer,
   callback: myOnChange,
   resourceBase: resourceBase,
   store1: store1,
   store2: store2,
});
ReactDOM.render(element, document.getElementById("inputArea"));

function myOnChange(agent1, squad1, agent2, squad2)
{
   LOGGER.info("myOnChange() agent1 = " + agent1);
   LOGGER.info("myOnChange() squad1 = " + squad1);
   LOGGER.info("myOnChange() agent2 = " + agent2);
   LOGGER.info("myOnChange() squad2 = " + squad2);
}

function setSquad(store)
{
   const faction = store.getState().faction;
   const agent = store.getState().agent;
   const squadBuilders = SquadBuilder.findByFaction(faction.key);
   const squad = squadBuilders[0].buildSquad(agent);
   store.dispatch(AgentSquadAction.setSquad(squad));
}