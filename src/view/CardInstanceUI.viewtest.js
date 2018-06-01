import Logger from "../utility/Logger.js";

import DamageCard from "../artifact/DamageCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Action from "../model/Action.js";
import CardAction from "../model/CardAction.js";
import CardInstance from "../model/CardInstance.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";
import TargetLock from "../model/TargetLock.js";

import CardInstanceUI from "./CardInstanceUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var environment = EnvironmentFactory.createCoreSetEnvironment();
var store = environment.store();
store.dispatch(Action.setResourceBase(resourceBase));

var pilotInstance0 = environment.pilotInstances()[0];
store.dispatch(CardAction.addUpgrade(pilotInstance0, new CardInstance(store, UpgradeCard.HULL_UPGRADE)));
var pilotInstance2 = environment.pilotInstances()[2];
var i = 1;
store.dispatch(CardAction.setCloakCount(pilotInstance0, i++));
store.dispatch(CardAction.setEnergyCount(pilotInstance0, i++));
store.dispatch(CardAction.setEvadeCount(pilotInstance0, i++));
store.dispatch(CardAction.setFocusCount(pilotInstance0, i++));
store.dispatch(CardAction.setIonCount(pilotInstance0, i++));
store.dispatch(CardAction.setReinforceCount(pilotInstance0, i++));
store.dispatch(CardAction.setShieldCount(pilotInstance0, i++));
store.dispatch(CardAction.setStressCount(pilotInstance0, i++));
store.dispatch(CardAction.setTractorBeamCount(pilotInstance0, i++));
store.dispatch(CardAction.setWeaponsDisabledCount(pilotInstance0, i++));
TargetLock.newInstance(store, pilotInstance0, pilotInstance2 /*, eventCallback*/ );
store.dispatch(CardAction.setOrdnanceCount(pilotInstance2.upgrades().get(0), 1));
var damage0 = new CardInstance(store, DamageCard.BLINDED_PILOT);
pilotInstance0.receiveDamage(damage0);
var critical0 = new CardInstance(store, DamageCard.CONSOLE_FIRE);
pilotInstance0.receiveCriticalDamage(critical0);
var critical1 = new CardInstance(store, DamageCard.DAMAGED_COCKPIT);
pilotInstance2.receiveCriticalDamage(critical1);
var critical2 = new CardInstance(store, DamageCard.DIRECT_HIT);
pilotInstance2.receiveCriticalDamage(critical2);

var cells = [];

addCardInstanceUI(cells, pilotInstance0);
addCardInstanceUI(cells, pilotInstance2);

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