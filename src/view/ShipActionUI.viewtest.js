import Logger from "../utility/Logger.js";

import ShipAction from "../artifact/ShipAction.js";

import ShipActionUI from "./ShipActionUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const keys = ShipAction.keys();
const resourceBase = "../resource/";
const className = "ba bg-near-white f6 tl";
const rows = [];

keys.forEach(function(shipActionKey)
{
   const shipAction = ShipAction.properties[shipActionKey];
   const image0 = React.createElement(ShipActionUI,
   {
      shipAction: shipAction,
      resourceBase: resourceBase,
   });
   const image1 = React.createElement(ShipActionUI,
   {
      shipAction: shipAction,
      resourceBase: resourceBase,
      showLabel: true,
   });

   const cells = [];

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