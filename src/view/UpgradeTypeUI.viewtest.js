import Logger from "../utility/Logger.js";

import UpgradeType from "../artifact/UpgradeType.js";

import UpgradeTypeUI from "./UpgradeTypeUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const values = UpgradeType.keys();
const resourceBase = "../resource/";
const className = "ba b--silver bg-near-white f6 tl";
const rows = [];

values.forEach(function(upgradeTypeKey)
{
   const upgradeType = UpgradeType.properties[upgradeTypeKey];

   const image0 = React.createElement(UpgradeTypeUI,
   {
      upgradeType: upgradeType,
      resourceBase: resourceBase,
   });

   const image1 = React.createElement(UpgradeTypeUI,
   {
      upgradeType: upgradeType,
      resourceBase: resourceBase,
      showName: true,
   });

   const cells = [];

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