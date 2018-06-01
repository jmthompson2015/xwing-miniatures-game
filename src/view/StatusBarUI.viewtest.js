import Logger from "../utility/Logger.js";

import Phase from "../artifact/Phase.js";

import StatusBarUI from "./StatusBarUI.js";

// require(["react", "react-dom", "react-dom-factories", "utility/Logger", "artifact/Phase", "view/StatusBarUI"],
// 	function(React, ReactDOM, ReactDOMFactories, Logger, Phase, StatusBarUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var element = React.createElement(StatusBarUI,
{
   activeShipName: "Bob's Fighter",
   phase: Phase.properties[Phase.COMBAT_ROLL_ATTACK_DICE],
   round: 12,
   userMessage: "Somebody attacked someone.",
});
ReactDOM.render(element, document.getElementById("statusBarPanel"));