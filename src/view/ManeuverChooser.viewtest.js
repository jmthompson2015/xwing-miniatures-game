import Logger from "../utility/Logger.js";

import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";

import Agent from "../model/Agent.js";
import CardInstance from "../model/CardInstance.js";
import Reducer from "../model/Reducer.js";

import ManeuverChooser from "./ManeuverChooser.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const store = Redux.createStore(Reducer.root);

const imperialAgent = new Agent(store, "Imperial Agent");
let token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
let maneuverKeys = token.maneuverKeys();
let maneuvers = maneuverKeys.map(function(maneuverKey)
{
   return Maneuver.properties[maneuverKey];
});
let element = React.createElement(ManeuverChooser,
{
   callback: myCallback,
   resourceBase: resourceBase,
   pilotName: token.name(true),
   shipName: token.shipName(),
   maneuvers: maneuvers,
   tokenId: token.id(),
});
ReactDOM.render(element, document.getElementById("inputArea0"));

token = new CardInstance(store, PilotCard.CAPTAIN_KAGI, imperialAgent);
maneuverKeys = token.maneuverKeys();
maneuvers = maneuverKeys.map(function(maneuverKey)
{
   return Maneuver.properties[maneuverKey];
});
element = React.createElement(ManeuverChooser,
{
   callback: myCallback,
   resourceBase: resourceBase,
   pilotName: token.name(true),
   shipName: token.shipName(),
   maneuvers: maneuvers,
   tokenId: token.id(),
});
ReactDOM.render(element, document.getElementById("inputArea1"));

const rebelAgent = new Agent(store, "Rebel Agent");
token = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);
maneuverKeys = token.maneuverKeys();
maneuvers = maneuverKeys.map(function(maneuverKey)
{
   return Maneuver.properties[maneuverKey];
});
element = React.createElement(ManeuverChooser,
{
   callback: myCallback,
   resourceBase: resourceBase,
   shipName: token.shipName(),
   maneuvers: maneuvers,
   tokenId: token.id(),
});
ReactDOM.render(element, document.getElementById("inputArea2"));

token = new CardInstance(store, PilotCard.POE_DAMERON, rebelAgent);
maneuverKeys = token.maneuverKeys();
maneuvers = maneuverKeys.map(function(maneuverKey)
{
   return Maneuver.properties[maneuverKey];
});
element = React.createElement(ManeuverChooser,
{
   callback: myCallback,
   resourceBase: resourceBase,
   pilotName: token.name(true),
   shipName: token.shipName(),
   maneuvers: maneuvers,
   tokenId: token.id(),
});
ReactDOM.render(element, document.getElementById("inputArea3"));

token = new CardInstance(store, PilotCard.GR_75_MEDIUM_TRANSPORT, rebelAgent);
maneuverKeys = token.maneuverKeys();
maneuvers = maneuverKeys.map(function(maneuverKey)
{
   return Maneuver.properties[maneuverKey];
});
element = React.createElement(ManeuverChooser,
{
   callback: myCallback,
   resourceBase: resourceBase,
   shipName: token.shipName(),
   maneuvers: maneuvers,
   tokenId: token.id(),
});
ReactDOM.render(element, document.getElementById("inputArea4"));

const scumAgent = new Agent(store, "Scum Agent");
token = new CardInstance(store, PilotCard.UNKAR_PLUTT, scumAgent);
maneuverKeys = token.maneuverKeys();
maneuvers = maneuverKeys.map(function(maneuverKey)
{
   return Maneuver.properties[maneuverKey];
});
element = React.createElement(ManeuverChooser,
{
   callback: myCallback,
   resourceBase: resourceBase,
   pilotName: token.name(true),
   shipName: token.shipName(),
   maneuvers: maneuvers,
   tokenId: token.id(),
});
ReactDOM.render(element, document.getElementById("inputArea5"));

function myCallback(tokenId, maneuverKey)
{
   LOGGER.info("myCallback() tokenId = " + tokenId + " maneuverKey = " + maneuverKey);
}