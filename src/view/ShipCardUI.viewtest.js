import Logger from "../utility/Logger.js";

import ShipFaction from "../artifact/ShipFaction.js";

import ShipCardUI from "./ShipCardUI.js";

// require(["react", "react-dom", "utility/Logger", "artifact/ShipFaction", "view/ShipCardUI"],
// 	function(React, ReactDOM, Logger, ShipFaction, ShipCardUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";

var element = React.createElement(ShipCardUI,
{
   resourceBase: resourceBase,
   shipFaction: ShipFaction.properties[ShipFaction.IMPERIAL_TIE_FIGHTER],
});
ReactDOM.render(element, document.getElementById("imperialShip"));

element = React.createElement(ShipCardUI,
{
   resourceBase: resourceBase,
   shipFaction: ShipFaction.properties[ShipFaction.REBEL_X_WING],
});
ReactDOM.render(element, document.getElementById("rebelShip"));

element = React.createElement(ShipCardUI,
{
   resourceBase: resourceBase,
   shipFaction: ShipFaction.properties[ShipFaction.REBEL_GR_75_MEDIUM_TRANSPORT],
});
ReactDOM.render(element, document.getElementById("gr75Ship"));

element = React.createElement(ShipCardUI,
{
   resourceBase: resourceBase,
   shipFaction: ShipFaction.properties[ShipFaction.REBEL_CR90_CORVETTE],
});
ReactDOM.render(element, document.getElementById("cr90Ship"));