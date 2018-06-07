import Logger from "../utility/Logger.js";

import EnvironmentFactory from "../model/EnvironmentFactory.js";
import Reducer from "../model/Reducer.js";

import PlayAreaContainer from "./PlayAreaContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const store = Redux.createStore(Reducer.root);
EnvironmentFactory.createCoreSetEnvironment(store);

const element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(PlayAreaContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));