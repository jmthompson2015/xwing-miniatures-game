import Logger from "../../utility/Logger.js";

import Reducer from "./Reducer.js";
import SquadTableContainer from "./SquadTableContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../../../src/resource/";
const store = Redux.createStore(Reducer.root);

const element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(SquadTableContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));