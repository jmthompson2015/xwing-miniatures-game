import Logger from "../utility/Logger.js";

import Agent from "../model/Agent.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import SquadUI from "./SquadUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const store = Redux.createStore(Reducer.root);
const resourceBase = "../resource/";
const agentName0 = "Imperial Agent";
const squadBuilder0 = SquadBuilder.CoreSetImperialSquadBuilder;
const agent0 = new Agent(store, agentName0);
const squad0 = squadBuilder0.buildSquad(agent0);

let element = React.createElement(SquadUI,
{
   resourceBase: resourceBase,
   squad: squad0,
});
ReactDOM.render(element, document.getElementById("squadPanel0"));

const agentName1 = "Rebel Agent";
const squadBuilder1 = SquadBuilder.CoreSetRebelSquadBuilder;
const agent1 = new Agent(store, agentName1);
const squad1 = squadBuilder1.buildSquad(agent1);

element = React.createElement(SquadUI,
{
   resourceBase: resourceBase,
   squad: squad1,
});
ReactDOM.render(element, document.getElementById("squadPanel1"));

const squadBuilder2 = SquadBuilder.HugeShipRebelSquadBuilder;
const squad2 = squadBuilder2.buildSquad(agent1);

element = React.createElement(SquadUI,
{
   resourceBase: resourceBase,
   squad: squad2,
});
ReactDOM.render(element, document.getElementById("squadPanel2"));