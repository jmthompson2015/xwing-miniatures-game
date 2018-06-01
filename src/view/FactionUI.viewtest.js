import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";

import FactionUI from "./FactionUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var factionKeys = Faction.keys();
var className = "ba bg-near-white f6 tl";
var rows = [];

factionKeys.forEach(function(factionKey)
{
   var faction = Faction.properties[factionKey];

   var image0 = React.createElement(FactionUI,
   {
      faction: faction,
      resourceBase: resourceBase,
   });
   var image1 = React.createElement(FactionUI,
   {
      faction: faction,
      resourceBase: resourceBase,
      showName: true,
   });
   var image2 = React.createElement(FactionUI,
   {
      faction: faction,
      resourceBase: resourceBase,
      isSmall: true,
   });
   var image3 = React.createElement(FactionUI,
   {
      faction: faction,
      resourceBase: resourceBase,
      isSmall: true,
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
   cells.push(ReactDOMFactories.td(
   {
      key: "small",
      className: className,
   }, image2));
   cells.push(ReactDOMFactories.td(
   {
      key: "small+name",
      className: className,
   }, image3));

   rows.push(ReactDOMFactories.tr(
   {
      key: rows.length,
   }, cells));
});

ReactDOM.render(ReactDOMFactories.table(
{}, ReactDOMFactories.tbody(
{}, rows)), document.getElementById("panel"));