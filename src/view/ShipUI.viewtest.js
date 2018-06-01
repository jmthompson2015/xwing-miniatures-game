import Logger from "../utility/Logger.js";

import ShipFaction from "../artifact/ShipFaction.js";

import Position from "../model/Position.js";

import ShipUI from "./ShipUI.js";

// require(["react", "react-dom", "react-dom-factories", "utility/Logger", "model/Position", "artifact/ShipFaction", "artifact/Faction",
// 		"view/ShipUI"
// 	],
// 	function(React, ReactDOM, ReactDOMFactories, Logger, Position, ShipFaction, Faction, ShipUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";

drawShip("tieDefenderPanel", ShipFaction.properties[ShipFaction.IMPERIAL_TIE_DEFENDER_V2]);
drawShip("firesprayPanel", ShipFaction.properties[ShipFaction.IMPERIAL_FIRESPRAY_31]);

drawShip("vcx100Panel", ShipFaction.properties[ShipFaction.REBEL_VCX_100]);

drawShip("firespray2Panel", ShipFaction.properties[ShipFaction.SCUM_FIRESPRAY_31]);
drawShip("yv666Panel", ShipFaction.properties[ShipFaction.SCUM_YV_666]);

drawShip("tiefoPanel", ShipFaction.properties[ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER]);

drawShip("yt1300Panel", ShipFaction.properties[ShipFaction.RESISTANCE_YT_1300]);

function drawShip(elementId, shipFaction)
{
   var shipBase = shipFaction.ship.shipBase;
   var position = new Position(shipBase.width / 2, shipBase.height / 2, 0);

   var element = React.createElement(ShipUI,
   {
      canvasId: shipFaction.name,
      resourceBase: resourceBase,
      position: position,
      shipFaction: shipFaction,
   });

   ReactDOM.render(element, document.getElementById(elementId));
}