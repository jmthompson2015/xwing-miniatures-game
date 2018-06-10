import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";
import ShipState from "../artifact/ShipState.js";

import ShipStateUI from "./ShipStateUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const className0 = "ba b--black bg-dark-green white";
const className1 = "ba bg-near-white f6 tl";
const rows = [];
let cells = [];

Faction.keys().forEach(function(factionKey)
{
   cells.push(ReactDOMFactories.th(
   {
      key: cells.length,
      className: className0,
      colSpan: "2",
   }, Faction.properties[factionKey].name));
});
rows.push(ReactDOMFactories.tr(
{
   key: rows.length,
}, cells));

ShipState.keys().forEach(function(shipStateKey)
{
   const shipState = ShipState.properties[shipStateKey];
   cells = [];
   let image0, image1;

   Faction.keys().forEach(function(factionKey)
   {
      const faction = Faction.properties[factionKey];

      if (shipStateKey === "Skill")
      {
         const label = 8;
         const labelClass = "pilotSkillValue";
         image0 = React.createElement(ShipStateUI,
         {
            shipState: shipState,
            faction: faction,
            resourceBase: resourceBase,
            label: label,
            labelClass: labelClass,
         });
         image1 = React.createElement(ShipStateUI,
         {
            shipState: shipState,
            faction: faction,
            resourceBase: resourceBase,
            label: label,
            labelClass: labelClass,
            showLabel: true,
         });
      }
      else
      {
         image0 = React.createElement(ShipStateUI,
         {
            shipState: shipState,
            faction: faction,
            resourceBase: resourceBase,
         });
         image1 = React.createElement(ShipStateUI,
         {
            shipState: shipState,
            faction: faction,
            resourceBase: resourceBase,
            showLabel: true,
         });
      }

      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: className1,
      }, image0));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: className1,
      }, image1));
   });

   rows.push(ReactDOMFactories.tr(
   {
      key: rows.length,
   }, cells));
});

ReactDOM.render(ReactDOMFactories.table(
{}, ReactDOMFactories.tbody(
{}, rows)), document.getElementById("panel"));