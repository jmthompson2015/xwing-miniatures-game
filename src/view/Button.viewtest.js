import Logger from "../utility/Logger.js";

// import Faction from "../artifact/Faction.js";

import Button from "./Button.js";

// require(["react", "react-dom", "react-dom-factories", "utility/Logger", "view/Button"],
// 	function(React, ReactDOM, ReactDOMFactories, Logger, Button)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

// var resourceBase = "../resource/";
var rows = [];
var cells = [];

var button0 = ReactDOMFactories.button(
{
   onClick: myOk,
}, "OK");
var button1 = ReactDOMFactories.button(
{
   disabled: true,
}, "Disabled");
var button2 = ReactDOMFactories.button(
{
   onClick: myCancel,
}, "Cancel");

var i = 0;
cells.push(ReactDOMFactories.td(
{
   key: "title" + i,
   className: "f6",
}, "Standard"));
cells.push(ReactDOMFactories.td(
{
   key: "ok" + i,
   className: "f6",
}, button0));
cells.push(ReactDOMFactories.td(
{
   key: "disabled" + i,
   className: "f6",
}, button1));
cells.push(ReactDOMFactories.td(
{
   key: "cancel" + i,
   className: "f6",
}, button2));

rows.push(ReactDOMFactories.tr(
{
   key: rows.length,
}, cells));

i++;
cells = [];
var button0 = React.createElement(Button,
{
   name: "OK",
   onClick: myOk,
});
var button1 = React.createElement(Button,
{
   disabled: true,
   name: "Disabled",
});
var button2 = React.createElement(Button,
{
   name: "Cancel",
   onClick: myCancel,
});
cells.push(ReactDOMFactories.td(
{
   key: "title" + i,
}, "Custom"));
cells.push(ReactDOMFactories.td(
{
   key: "ok" + i,
}, button0));
cells.push(ReactDOMFactories.td(
{
   key: "disabled" + i,
}, button1));
cells.push(ReactDOMFactories.td(
{
   key: "cancel" + i,
}, button2));

rows.push(ReactDOMFactories.tr(
{
   key: rows.length,
}, cells));

ReactDOM.render(ReactDOMFactories.table(
{
   className: "bg-light-gray center pa4 mv4",
}, ReactDOMFactories.tbody(
{}, rows)), document.getElementById("panel"));

function myOk( /* event */ )
{
   LOGGER.info("myOk()");
}

function myCancel( /* event */ )
{
   LOGGER.info("myCancel()");
}