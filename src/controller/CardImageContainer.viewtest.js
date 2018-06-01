import Logger from "../utility/Logger.js";

import CardType from "../artifact/CardType.js";
import DamageCard from "../artifact/DamageCard.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Action from "../model/Action.js";
import Agent from "../model/Agent.js";
import CardInstance from "../model/CardInstance.js";
import Reducer from "../model/Reducer.js";

import CardImageContainer from "./CardImageContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var store = Redux.createStore(Reducer.root);
store.dispatch(Action.setResourceBase(resourceBase));
var agent = new Agent(store, "Imperial Agent");

var cells = [];
addCardImage(cells, new CardInstance(store, DamageCard.BLINDED_PILOT));
addCardImage(cells, new CardInstance(store, DamageCard.CONSOLE_FIRE));
addCardImage(cells, new CardInstance(store, PilotCard.DARTH_VADER, agent));
addCardImage(cells, new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent));
addCardImage(cells, new CardInstance(store, UpgradeCard.A_WING_TEST_PILOT));
addCardImage(cells, new CardInstance(store, UpgradeCard.BACKUP_SHIELD_GENERATOR));

ReactDOM.render(ReactDOMFactories.div(
{}, cells), document.getElementById("panel"));

function addCardImage(cells, cardInstance)
{
   var element = React.createElement(ReactRedux.Provider,
   {
      store: store,
   }, React.createElement(CardImageContainer,
   {
      cardInstance: cardInstance,
      width: (cardInstance.card().cardTypeKey === CardType.PILOT ? 200 : 142),
   }));

   cells.push(ReactDOMFactories.div(
   {
      key: "card" + cells.length,
      className: "bg-lotr-light fl v-top",
   }, element));
}