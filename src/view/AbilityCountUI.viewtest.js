import Logger from "../utility/Logger.js";

import AbilityCountUI from "./AbilityCountUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var abilityCounts = [];
var rows = [];
var cells = [];

abilityCounts.push(React.createElement(AbilityCountUI,
{
   implementedCount: 1,
   abilityCount: 2,
}));
abilityCounts.push(React.createElement(AbilityCountUI,
{
   implementedCount: 17,
   abilityCount: 50,
}));
abilityCounts.push(React.createElement(AbilityCountUI,
{
   implementedCount: 34,
   abilityCount: 0,
}));
abilityCounts.push(React.createElement(AbilityCountUI,
{
   implementedCount: 0,
   abilityCount: 0,
}));

var cells = abilityCounts.map(function(abilityCount)
{
   return ReactDOMFactories.div(
   {
      className: "dtc pa2",
   }, abilityCount);
});

var rows = cells.map(function(cell, i)
{
   return ReactDOMFactories.div(
   {
      key: i,
      className: "dt-row",
   }, cell);
});

ReactDOM.render(ReactDOMFactories.div(
{
   className: "bg-light-gray center dt",
}, rows), document.getElementById("panel"));