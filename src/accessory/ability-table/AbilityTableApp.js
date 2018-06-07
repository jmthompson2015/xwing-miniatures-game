import Logger from "../../utility/Logger.js";

import AbilityCountContainer from "../../controller/AbilityCountContainer.js";

import AbilityTableContainer from "./AbilityTableContainer.js";
import Reducer from "./Reducer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../../../src/resource/";
const store = Redux.createStore(Reducer.root);

const element0 = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(AbilityCountContainer));

ReactDOM.render(element0, document.getElementById("implementedStatistics"));

const element1 = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(AbilityTableContainer,
{
   resourceBase: resourceBase,
}));

ReactDOM.render(element1, document.getElementById("tableContainer"));