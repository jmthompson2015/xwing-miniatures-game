import Logger from "../../utility/Logger.js";

import AbilityCountContainer from "../../controller/AbilityCountContainer.js";

import Reducer from "./Reducer.js";
import UpgradeTableContainer from "./UpgradeTableContainer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger", "utility/MathUtilities", "artifact/UpgradeCard",
//     "controller/AbilityCountContainer", "accessory/upgrade-table/Reducer", "accessory/upgrade-table/UpgradeTableContainer"
//   ],
//   function(React, ReactDOM, ReactRedux, Redux, Logger, MathUtilities, UpgradeCard, AbilityCountContainer, Reducer, UpgradeTableContainer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";
var store = Redux.createStore(Reducer.root);

var element0 = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(AbilityCountContainer));

ReactDOM.render(element0, document.getElementById("implementedStatistics"));

var element1 = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(UpgradeTableContainer,
{
   resourceBase: resourceBase,
}));

ReactDOM.render(element1, document.getElementById("tableContainer"));