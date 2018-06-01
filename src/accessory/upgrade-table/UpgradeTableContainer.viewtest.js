import Logger from "../../utility/Logger.js";

import Reducer from "./Reducer.js";
import UpgradeTableContainer from "./UpgradeTableContainer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger",
// 		"accessory/upgrade-table/Reducer", "accessory/upgrade-table/UpgradeTableContainer"
// 	],
// 	function(React, ReactDOM, ReactRedux, Redux, Logger, Reducer, UpgradeTableContainer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";
var store = Redux.createStore(Reducer.root);

var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(UpgradeTableContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));