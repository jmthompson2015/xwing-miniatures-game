import Logger from "../utility/Logger.js";

import ShipFaction from "../artifact/ShipFaction.js";

import ShipCardUI from "./ShipCardUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";

let element = React.createElement(ShipCardUI,
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