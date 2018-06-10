import Logger from "../utility/Logger.js";

import Ship from "../artifact/Ship.js";

import ShipSilhouetteUI from "./ShipSilhouetteUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const className0 = "ba bg-near-white tl";
const className1 = "ba bg-near-white f6 tl";
const rows = [];

Ship.keys().forEach(function(shipKey)
{
   const ship = Ship.properties[shipKey];

   const image0 = React.createElement(ShipSilhouetteUI,
   {
      ship: ship,
      resourceBase: resourceBase,
   });
   const image1 = React.createElement(ShipSilhouetteUI,
   {
      ship: ship,
      resourceBase: resourceBase,
      showLabel: true,
   });

   const cells = [];

   cells.push(ReactDOMFactories.td(
   {
      key: cells.length,
      className: className0,
   }, image0));
   cells.push(ReactDOMFactories.td(
   {
      key: cells.length,
      className: className1,
   }, image1));

   rows.push(ReactDOMFactories.tr(
   {
      key: rows.length,
   }, cells));
});

ReactDOM.render(ReactDOMFactories.table(
{}, ReactDOMFactories.tbody(
{}, rows)), document.getElementById("panel"));