import Logger from "../../utility/Logger.js";

import PilotTableContainer from "./PilotTableContainer.js";
import Reducer from "./Reducer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger",
// 		"accessory/pilot-table/PilotTableContainer", "accessory/pilot-table/Reducer"
// 	],
// 	function(React, ReactDOM, ReactRedux, Redux, Logger, PilotTableContainer, Reducer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";
var store = Redux.createStore(Reducer.root);

var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(PilotTableContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));