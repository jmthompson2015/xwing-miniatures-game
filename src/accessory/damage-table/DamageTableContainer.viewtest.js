import Logger from "../../utility/Logger.js";

import DamageTableContainer from "./DamageTableContainer.js";
import Reducer from "./Reducer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger",
// 		"accessory/damage-table/DamageTableContainer", "accessory/damage-table/Reducer"
// 	],
// 	function(React, ReactDOM, ReactRedux, Redux, Logger, DamageTableContainer, Reducer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";
var store = Redux.createStore(Reducer.root);

var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(DamageTableContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));