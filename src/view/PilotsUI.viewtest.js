import Logger from "../utility/Logger.js";

import Action from "../model/Action.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";

import PilotsUI from "./PilotsUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const environment = EnvironmentFactory.createCoreSetEnvironment();
const store = environment.store();
store.dispatch(Action.setResourceBase(resourceBase));
const agent = environment.firstAgent();
const tokens = agent.pilotInstances();
const element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(PilotsUI,
{
   tokens: tokens,
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("pilots"));