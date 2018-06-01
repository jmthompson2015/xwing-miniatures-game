import Logger from "../utility/Logger.js";

import AbilityCountContainer from "./AbilityCountContainer.js";

import Reducer from "../accessory/ability-table/Reducer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var store = Redux.createStore(Reducer.root);

var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(AbilityCountContainer));
ReactDOM.render(element, document.getElementById("inputArea"));