import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";

import FactionUI from "./FactionUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const factionKeys = Faction.keys();
const className = "ba bg-near-white f6 tl";
const rows = [];

factionKeys.forEach(function(factionKey)
{
   const faction = Faction.properties[factionKey];

   const image0 = React.createElement(FactionUI,
   {
      faction: faction,
      resourceBase: resourceBase,
   });
   const image1 = React.createElement(FactionUI,
   {
      faction: faction,
      resourceBase: resourceBase,
      showName: true,
   });
   const image2 = React.createElement(FactionUI,
   {
      faction: faction,
      resourceBase: resourceBase,
      isSmall: true,
   });
   const image3 = React.createElement(FactionUI,
   {
      faction: faction,
      resourceBase: resourceBase,
      isSmall: true,
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