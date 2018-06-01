import Logger from "../utility/Logger.js";

import ShipAction from "../artifact/ShipAction.js";

import ShipActionUI from "./ShipActionUI.js";

// require(["react", "react-dom", "react-dom-factories", "utility/Logger", "artifact/ShipAction", "view/ShipActionUI"],
// 	function(React, ReactDOM, ReactDOMFactories, Logger, ShipAction, ShipActionUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var keys = ShipAction.keys();
var resourceBase = "../resource/";
var className = "ba bg-near-white f6 tl";
var rows = [];

keys.forEach(function(shipActionKey)
{
   var shipAction = ShipAction.properties[shipActionKey];
   var image0 = React.createElement(ShipActionUI,
   {
      shipAction: shipAction,
      resourceBase: resourceBase,
   });
   var image1 = React.createElement(ShipActionUI,
   {
      shipAction: shipAction,
      resourceBase: resourceBase,
      showName: true,
   });

   var cells = [];

   cells.push(ReactDOMFactories.td(
   {
      key: cells.length,
      className: className,
   }, image0));
   cells.push(ReactDOMFactories.td(
   {
      key: cells.length,
      className: className,
   }, image1));

   rows.push(ReactDOMFactories.tr(
   {
      key: rows.length,
   }, cells));
});

ReactDOM.render(ReactDOMFactories.table(
{}, ReactDOMFactories.tbody(
{}, rows)), document.getElementById("panel"));