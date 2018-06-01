import Logger from "../utility/Logger.js";

import Action from "../model/Action.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";

import PilotsUI from "./PilotsUI.js";

// require(["react", "react-dom", "react-dom-factories", "react-redux", "utility/Logger", "artifact/PilotCard", "model/Position", "artifact/Faction",
// 		"model/Action", "model/CardInstance", "model/CardAction", "model/EnvironmentFactory", "view/PilotsUI"
// 	],
// 	function(React, ReactDOM, ReactDOMFactories, ReactRedux, Logger, PilotCard, Position, Faction, Action, CardInstance, CardAction, EnvironmentFactory, PilotsUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var environment = EnvironmentFactory.createCoreSetEnvironment();
var store = environment.store();
store.dispatch(Action.setResourceBase(resourceBase));
const agent = environment.firstAgent();
const tokens = agent.pilotInstances();
var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(PilotsUI,
{
   tokens: tokens,
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("pilots"));