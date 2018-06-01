import Logger from "../utility/Logger.js";

// import Faction from "../artifact/Faction.js";

import Agent from "../model/Agent.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import SquadUI from "./SquadUI.js";

// require(["react", "react-dom", "react-dom-factories", "redux", "utility/Logger", "artifact/Faction",
// 		"model/Agent", "model/Reducer", "model/SquadBuilder",
// 		"view/SquadUI"
// 	],
// 	function(React, ReactDOM, ReactDOMFactories, Redux, Logger, Faction, Agent, Reducer, SquadBuilder, SquadUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var store = Redux.createStore(Reducer.root);
var resourceBase = "../resource/";
// var team0 = Faction.IMPERIAL;
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

// var team1 = Faction.REBEL;
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