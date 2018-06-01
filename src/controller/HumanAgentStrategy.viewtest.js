import Logger from "../utility/Logger.js";

import Action from "../model/Action.js";
import Adjudicator from "../model/Adjudicator.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";
import Reducer from "../model/Reducer.js";

import HumanAgentStrategy from "./HumanAgentStrategy.js";

// require(["redux", "utility/Logger", "model/Action", "model/Adjudicator", "model/EnvironmentFactory", "model/Reducer", "controller/HumanAgentStrategy"],
// 	function(Redux, Logger, Action, Adjudicator, EnvironmentFactory, Reducer, HumanAgentStrategy)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var store = Redux.createStore(Reducer.root);
store.dispatch(Action.setResourceBase(resourceBase));
var environment = EnvironmentFactory.createCoreSetEnvironment(store, HumanAgentStrategy);
var adjudicator = new Adjudicator(store);
store.dispatch(Action.setAdjudicator(adjudicator));
var token = environment.pilotInstances()[0]; // TIE Fighter.
environment.setActiveToken(token);
var agent = token.agent();

// Run.
agent.getShipAction(token, myCallback);

function myCallback(shipAction)
{
   LOGGER.info("myCallback() shipAction = " + shipAction);
}