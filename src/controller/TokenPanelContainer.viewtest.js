import Logger from "../utility/Logger.js";

import DamageCard from "../artifact/DamageCard.js";
import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Action from "../model/Action.js";
import Agent from "../model/Agent.js";
import CardAction from "../model/CardAction.js";
import CardInstance from "../model/CardInstance.js";
import Environment from "../model/Environment.js";
import Reducer from "../model/Reducer.js";
import Squad from "../model/Squad.js";
import TargetLock from "../model/TargetLock.js";

import TokenPanelContainer from "./TokenPanelContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const store00 = Redux.createStore(Reducer.root);
const imperialAgent = new Agent(store00, "Imperial Agent");
let imperialToken = new CardInstance(store00, PilotCard.MAULER_MITHEL, imperialAgent, [UpgradeCard.MARKSMANSHIP]);
const rebelAgent = new Agent(store00, "Rebel Agent");
let rebelToken = new CardInstance(store00, PilotCard.LUKE_SKYWALKER, rebelAgent, [UpgradeCard.PROTON_TORPEDOES, UpgradeCard.R2_D2_ASTROMECH]);

const squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad #1", [imperialToken]);
const squad2 = new Squad(Faction.REBEL, "squad2", 2016, "squad #2", [rebelToken]);

const store = Redux.createStore(Reducer.root);
store.dispatch(Action.setResourceBase(resourceBase));
const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2);
const pilotInstances = environment.pilotInstances();
imperialToken = pilotInstances[0];
rebelToken = pilotInstances[1];

let i = 1;
store.dispatch(CardAction.setCloakCount(imperialToken, i++));
imperialToken.receiveDamage(new CardInstance(store, DamageCard.BLINDED_PILOT));
imperialToken.receiveDamage(new CardInstance(store, DamageCard.CONSOLE_FIRE));
i++;
store.dispatch(CardAction.setEnergyCount(imperialToken, i++));
store.dispatch(CardAction.setEvadeCount(imperialToken, i++));
store.dispatch(CardAction.setFocusCount(imperialToken, i++));
store.dispatch(CardAction.setIonCount(imperialToken, i++));
store.dispatch(CardAction.setOrdnanceCount(imperialToken, i++));
store.dispatch(CardAction.setReinforceCount(imperialToken, i++));
store.dispatch(CardAction.setShieldCount(imperialToken, i++));
store.dispatch(CardAction.setStressCount(imperialToken, i++));
store.dispatch(CardAction.setTractorBeamCount(imperialToken, i++));
store.dispatch(CardAction.setWeaponsDisabledCount(imperialToken, i++));

TargetLock.newInstance(store, imperialToken, rebelToken);
TargetLock.newInstance(store, rebelToken, imperialToken);

const element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(TokenPanelContainer,
{
   cardInstance: imperialToken,
}));
ReactDOM.render(element, document.getElementById("panel"));