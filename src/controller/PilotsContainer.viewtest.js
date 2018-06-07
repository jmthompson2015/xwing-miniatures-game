import Logger from "../utility/Logger.js";

import Action from "../model/Action.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";
import Reducer from "../model/Reducer.js";

import PilotsContainer from "./PilotsContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const store = Redux.createStore(Reducer.root);
store.dispatch(Action.setResourceBase(resourceBase));
const environment = EnvironmentFactory.createCoreSetEnvironment(store);
const agent1 = environment.firstAgent();

const element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(PilotsContainer,
{
   agent: agent1,
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));