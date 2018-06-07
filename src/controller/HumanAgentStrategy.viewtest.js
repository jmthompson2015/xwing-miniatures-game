import Logger from "../utility/Logger.js";

import Action from "../model/Action.js";
import Adjudicator from "../model/Adjudicator.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";
import Reducer from "../model/Reducer.js";

import HumanAgentStrategy from "./HumanAgentStrategy.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const store = Redux.createStore(Reducer.root);
store.dispatch(Action.setResourceBase(resourceBase));
const environment = EnvironmentFactory.createCoreSetEnvironment(store, HumanAgentStrategy);
const adjudicator = new Adjudicator(store);
store.dispatch(Action.setAdjudicator(adjudicator));
const token = environment.pilotInstances()[0]; // TIE Fighter.
environment.setActiveToken(token);
const agent = token.agent();

// Run.
agent.getShipAction(token, myCallback);

function myCallback(shipAction)
{
   LOGGER.info("myCallback() shipAction = " + shipAction);
}