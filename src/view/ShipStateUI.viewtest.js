import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";
import ShipState from "../artifact/ShipState.js";

import ShipStateUI from "./ShipStateUI.js";

// require(["react", "react-dom", "react-dom-factories", "utility/Logger", "artifact/Faction", "artifact/ShipState", "view/ShipStateUI"],
// 	function(React, ReactDOM, ReactDOMFactories, Logger, Faction, ShipState, ShipStateUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var className0 = "ba b--black bg-dark-green white";
var className1 = "ba bg-near-white f6 tl";
var rows = [];
var cells = [];

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
   var shipState = ShipState.properties[shipStateKey];
   cells = [];
   var image0, image1;

   Faction.keys().forEach(function(factionKey)
   {
      var faction = Faction.properties[factionKey];

      if (shipStateKey === "Skill")
      {
         var label = 8;
         var labelClass = "pilotSkillValue";
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
            showName: true,
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
            showName: true,
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