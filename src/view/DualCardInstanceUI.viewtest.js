import Logger from "../utility/Logger.js";

import Action from "../model/Action.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";

import CardInstanceUI from "./CardInstanceUI.js";

// require(["react", "react-dom", "react-dom-factories", "react-redux", "redux", "utility/Logger", "artifact/DamageCard", "artifact/Faction",
//     "artifact/PilotCard", "artifact/UpgradeCard", "model/Action", "model/CardAction", "model/CardInstance", "model/Reducer",
//     "model/TargetLock", "view/CardInstanceUI", "model/EnvironmentFactory"
//   ],
//   function(React, ReactDOM, ReactDOMFactories, ReactRedux, Redux, Logger, DamageCard, Faction, PilotCard, UpgradeCard, Action, CardAction, CardInstance, Reducer,
//     TargetLock, CardInstanceUI, EnvironmentFactory)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var environment = EnvironmentFactory.createHugeShipEnvironment();
var store = environment.store();
store.dispatch(Action.setResourceBase(resourceBase));

var pilotInstance2 = environment.pilotInstances()[2];
var pilotInstance2Fore = pilotInstance2.tokenFore();
var pilotInstance2Aft = pilotInstance2.tokenAft();
var pilotInstance3 = environment.pilotInstances()[3];
var pilotInstance3Fore = pilotInstance3.tokenFore();
var pilotInstance3Aft = pilotInstance3.tokenAft();

var cells = [];

addCardInstanceUI(cells, pilotInstance2Fore);
addCardInstanceUI(cells, pilotInstance2Aft);
addCardInstanceUI(cells, pilotInstance3Fore);
addCardInstanceUI(cells, pilotInstance3Aft);

ReactDOM.render(ReactDOMFactories.div(
{}, cells), document.getElementById("panel"));

function addCardInstanceUI(cells, cardInstance)
{
   var element = React.createElement(ReactRedux.Provider,
   {
      store: store,
   }, React.createElement(CardInstanceUI,
   {
      cardInstance: cardInstance,
   }));

   cells.push(ReactDOMFactories.div(
   {
      key: "card" + cells.length,
      className: "v-top",
   }, element));
}