import Logger from "../utility/Logger.js";

import ShipFaction from "../artifact/ShipFaction.js";

import Position from "../model/Position.js";

import ShipImage from "./ShipImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
let id = 1;

drawShip(id++, "firesprayCanvas", ShipFaction.properties[ShipFaction.IMPERIAL_FIRESPRAY_31]);
drawShip(id++, "tieDefenderCanvas", ShipFaction.properties[ShipFaction.IMPERIAL_TIE_DEFENDER_V2]);

drawShip(id++, "arc170Canvas", ShipFaction.properties[ShipFaction.REBEL_ARC_170]);
drawShip(id++, "vcx100Canvas", ShipFaction.properties[ShipFaction.REBEL_VCX_100]);

drawShip(id++, "firespray2Canvas", ShipFaction.properties[ShipFaction.SCUM_FIRESPRAY_31]);
drawShip(id++, "yv666Canvas", ShipFaction.properties[ShipFaction.SCUM_YV_666]);

drawShip(id++, "tieSfFighterCanvas", ShipFaction.properties[ShipFaction.FIRST_ORDER_TIE_SF_FIGHTER]);

function drawShip(id, elementId, shipFaction)
{
   const canvas = document.getElementById(elementId);
   const context = canvas.getContext("2d");
   const scale = 1.0;
   const position = new Position(50, 50, 0);
   const image = new Image();
   image.onload = function()
   {
      ShipImage.draw(context, scale, id, image, position, shipFaction);
   };
   image.src = resourceBase + "ship/" + shipFaction.image;
}