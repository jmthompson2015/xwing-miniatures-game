import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";

import Agent from "../model/Agent.js";
import CardInstance from "../model/CardInstance.js";
import Environment from "../model/Environment.js";
import Reducer from "../model/Reducer.js";
import Squad from "../model/Squad.js";

import PlanningPanel from "./PlanningPanel.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const store = Redux.createStore(Reducer.root);
const teamKey1 = Faction.IMPERIAL;
const teamKey2 = Faction.REBEL;

const imperialAgent = new Agent(store, "Imperial Agent");
let token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
let token1 = new CardInstance(store, PilotCard.TEMPEST_SQUADRON_PILOT, imperialAgent);
let token2 = new CardInstance(store, PilotCard.ALPHA_SQUADRON_PILOT, imperialAgent);
const rebelAgent = new Agent(store, "Rebel Agent");
let tokens1 = [token0, token1, token2];
const squad1 = new Squad(teamKey1, "Squad #1", 2017, "squad1", tokens1);
const squad2 = new Squad(teamKey2, "Squad #2", 2016, "squad2", []);
let positions1, positions2;
const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);

token0 = environment.pilotInstances()[0];
token1 = environment.pilotInstances()[1];
token2 = environment.pilotInstances()[2];
tokens1 = [token0, token1, token2];

const myCallback = function(tokenToManeuver)
{
   LOGGER.info("myCallback() start");

   tokens1.forEach(function(token)
   {
      const maneuver = tokenToManeuver[token.id()];
      LOGGER.info(token + ": " + maneuver);
   });

   LOGGER.info("myCallback() end");
};

const element = React.createElement(PlanningPanel,
{
   agent: imperialAgent,
   callback: myCallback,
   environment: environment,
   resourceBase: resourceBase,
   tokens: tokens1,
});
ReactDOM.render(element, document.getElementById("inputArea"));