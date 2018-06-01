import Logger from "../utility/Logger.js";

import Ship from "../artifact/Ship.js";

import ShipActionPanel from "./ShipActionPanel.js";

// require(["react", "react-dom", "react-dom-factories", "utility/Logger", "artifact/Ship", "view/ShipActionPanel"],
// 	function(React, ReactDOM, ReactDOMFactories, Logger, Ship, ShipActionPanel)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var shipKeys = [Ship.A_WING, Ship.B_WING, Ship.E_WING, Ship.M3_A_INTERCEPTOR, Ship.STAR_VIPER,
					Ship.TIE_FIGHTER, Ship.TIE_INTERCEPTOR, Ship.VT_49_DECIMATOR, Ship.X_WING, Ship.YT_1300
				];
var rows = shipKeys.map(function(shipKey, i)
{
   var ship = Ship.properties[shipKey];
   var cells = [];
   cells.push(ReactDOMFactories.td(
   {
      key: cells.length,
   }, ship.name));
   cells.push(ReactDOMFactories.td(
   {
      key: cells.length,
   }, React.createElement(ShipActionPanel,
   {
      shipActionKeys: ship.shipActionKeys,
      resourceBase: resourceBase,
   })));

   return ReactDOMFactories.tr(
   {
      key: i,
   }, cells);
});

ReactDOM.render(ReactDOMFactories.table(
{}, ReactDOMFactories.tbody(
{}, rows)), document.getElementById("panel"));