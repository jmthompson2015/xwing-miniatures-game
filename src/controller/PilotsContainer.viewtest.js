import Logger from "../utility/Logger.js";

import Action from "../model/Action.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";
import Reducer from "../model/Reducer.js";

import PilotsContainer from "./PilotsContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var store = Redux.createStore(Reducer.root);
store.dispatch(Action.setResourceBase(resourceBase));
var environment = EnvironmentFactory.createCoreSetEnvironment(store);
var agent1 = environment.firstAgent();

var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(PilotsContainer,
{
   agent: agent1,
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));