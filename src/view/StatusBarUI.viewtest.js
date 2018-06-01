import Logger from "../utility/Logger.js";

import Phase from "../artifact/Phase.js";

import StatusBarUI from "./StatusBarUI.js";

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