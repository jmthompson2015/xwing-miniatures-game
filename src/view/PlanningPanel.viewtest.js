import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";

import Agent from "../model/Agent.js";
import CardInstance from "../model/CardInstance.js";
import Environment from "../model/Environment.js";
import Reducer from "../model/Reducer.js";
import Squad from "../model/Squad.js";

import PlanningPanel from "./PlanningPanel.js";

// require(["react", "react-dom", "react-dom-factories", "redux", "utility/Logger", "artifact/PilotCard", "artifact/Faction",
// 		"model/Agent", "model/Environment", "model/Reducer", "model/Squad", "model/SquadBuilder", "model/CardInstance",
// 		"view/PlanningPanel"
// 	],
// 	function(React, ReactDOM, ReactDOMFactories, Redux, Logger, PilotCardCard, Faction,
// 		Agent, Environment, Reducer, Squad, SquadBuilder, CardInstance,
// 		PlanningPanel)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var store = Redux.createStore(Reducer.root);
var teamKey1 = Faction.IMPERIAL;
var teamKey2 = Faction.REBEL;

var imperialAgent = new Agent(store, "Imperial Agent");
var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
var token1 = new CardInstance(store, PilotCard.TEMPEST_SQUADRON_PILOT, imperialAgent);
var token2 = new CardInstance(store, PilotCard.ALPHA_SQUADRON_PILOT, imperialAgent);
var rebelAgent = new Agent(store, "Rebel Agent");
var tokens1 = [token0, token1, token2];
var squad1 = new Squad(teamKey1, "Squad #1", 2017, "squad1", tokens1);
var squad2 = new Squad(teamKey2, "Squad #2", 2016, "squad2", []);
var positions1, positions2;
var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);

token0 = environment.pilotInstances()[0];
token1 = environment.pilotInstances()[1];
token2 = environment.pilotInstances()[2];
tokens1 = [token0, token1, token2];

var myCallback = function(tokenToManeuver)
{
   LOGGER.info("myCallback() start");

   tokens1.forEach(function(token)
   {
      var maneuver = tokenToManeuver[token.id()];
      LOGGER.info(token + ": " + maneuver);
   });

   LOGGER.info("myCallback() end");
};

var element = React.createElement(PlanningPanel,
{
   agent: imperialAgent,
   callback: myCallback,
   environment: environment,
   resourceBase: resourceBase,
   tokens: tokens1,
});
ReactDOM.render(element, document.getElementById("inputArea"));