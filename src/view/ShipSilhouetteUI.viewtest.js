import Logger from "../utility/Logger.js";

import Ship from "../artifact/Ship.js";

import ShipSilhouetteUI from "./ShipSilhouetteUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var className0 = "ba bg-near-white tl";
var className1 = "ba bg-near-white f6 tl";
var rows = [];

Ship.keys().forEach(function(shipKey)
{
   var ship = Ship.properties[shipKey];

   var image0 = React.createElement(ShipSilhouetteUI,
   {
      ship: ship,
      resourceBase: resourceBase,
   });
   var image1 = React.createElement(ShipSilhouetteUI,
   {
      ship: ship,
      resourceBase: resourceBase,
      showName: true,
   });

   var cells = [];

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