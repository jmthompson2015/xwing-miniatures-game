import Logger from "../utility/Logger.js";

import Agent from "../model/Agent.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import SquadUI from "./SquadUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var store = Redux.createStore(Reducer.root);
var resourceBase = "../resource/";
var agentName0 = "Imperial Agent";
var squadBuilder0 = SquadBuilder.CoreSetImperialSquadBuilder;
var agent0 = new Agent(store, agentName0);
var squad0 = squadBuilder0.buildSquad(agent0);

var element = React.createElement(SquadUI,
{
   resourceBase: resourceBase,
   squad: squad0,
});
ReactDOM.render(element, document.getElementById("squadPanel0"));

var agentName1 = "Rebel Agent";
var squadBuilder1 = SquadBuilder.CoreSetRebelSquadBuilder;
var agent1 = new Agent(store, agentName1);
var squad1 = squadBuilder1.buildSquad(agent1);

var element = React.createElement(SquadUI,
{
   resourceBase: resourceBase,
   squad: squad1,
});
ReactDOM.render(element, document.getElementById("squadPanel1"));

var squadBuilder2 = SquadBuilder.HugeShipRebelSquadBuilder;
var squad2 = squadBuilder2.buildSquad(agent1);

var element = React.createElement(SquadUI,
{
   resourceBase: resourceBase,
   squad: squad2,
});
ReactDOM.render(element, document.getElementById("squadPanel2"));