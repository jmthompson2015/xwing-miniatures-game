import Logger from "../../utility/Logger.js";

import AbilityTableContainer from "./AbilityTableContainer.js";
import Reducer from "./Reducer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger",
// 		"accessory/ability-table/AbilityTableContainer", "accessory/ability-table/Reducer"
// 	],
// 	function(React, ReactDOM, ReactRedux, Redux, Logger, AbilityTableContainer, Reducer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";
var store = Redux.createStore(Reducer.root);

var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(AbilityTableContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));