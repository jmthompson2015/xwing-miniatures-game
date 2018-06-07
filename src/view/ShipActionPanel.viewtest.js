import Logger from "../utility/Logger.js";

import Ship from "../artifact/Ship.js";

import ShipActionPanel from "./ShipActionPanel.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const shipKeys = [Ship.A_WING, Ship.B_WING, Ship.E_WING, Ship.M3_A_INTERCEPTOR, Ship.STAR_VIPER,
					Ship.TIE_FIGHTER, Ship.TIE_INTERCEPTOR, Ship.VT_49_DECIMATOR, Ship.X_WING, Ship.YT_1300
				];
const rows = shipKeys.map(function(shipKey, i)
{
   const ship = Ship.properties[shipKey];
   const cells = [];
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