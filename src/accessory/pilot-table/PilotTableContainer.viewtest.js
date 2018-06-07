import Logger from "../../utility/Logger.js";

import PilotTableContainer from "./PilotTableContainer.js";
import Reducer from "./Reducer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../../../src/resource/";
const store = Redux.createStore(Reducer.root);

const element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(PilotTableContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));