import Logger from "../utility/Logger.js";

import UpgradeType from "../artifact/UpgradeType.js";

import UpgradeTypeUI from "./UpgradeTypeUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var values = UpgradeType.keys();
var resourceBase = "../resource/";
var className = "ba b--silver bg-near-white f6 tl";
var rows = [];

values.forEach(function(upgradeTypeKey)
{
   var upgradeType = UpgradeType.properties[upgradeTypeKey];

   var image0 = React.createElement(UpgradeTypeUI,
   {
      upgradeType: upgradeType,
      resourceBase: resourceBase,
   });

   var image1 = React.createElement(UpgradeTypeUI,
   {
      upgradeType: upgradeType,
      resourceBase: resourceBase,
      showName: true,
   });

   var cells = [];

   cells.push(ReactDOMFactories.td(
   {
      key: "standard",
      className: className,
   }, image0));
   cells.push(ReactDOMFactories.td(
   {
      key: "standard+name",
      className: className,
   }, image1));

   rows.push(ReactDOMFactories.tr(
   {
      key: rows.length,
   }, cells));
});

ReactDOM.render(ReactDOMFactories.table(
{}, ReactDOMFactories.tbody(
{}, rows)), document.getElementById("upgradeTypePanel"));