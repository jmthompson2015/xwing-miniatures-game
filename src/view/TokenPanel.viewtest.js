import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Agent from "../model/Agent.js";
import CardInstance from "../model/CardInstance.js";
import Environment from "../model/Environment.js";
import Reducer from "../model/Reducer.js";
import Squad from "../model/Squad.js";
import TargetLock from "../model/TargetLock.js";

import TokenPanel from "./TokenPanel.js";

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
const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2);
const pilotInstances = environment.pilotInstances();
imperialToken = pilotInstances[0];
rebelToken = pilotInstances[1];

TargetLock.newInstance(store, imperialToken, rebelToken);
TargetLock.newInstance(store, rebelToken, imperialToken);

let i = 1;
let j = 1;

const element = React.createElement(TokenPanel,
{
   resourceBase: resourceBase,

   attackerTargetLocks: imperialToken.attackerTargetLocks(),
   bonusPilotSkill: j++,
   bonusPrimaryWeapon: j++,
   bonusEnergy: j++,
   bonusAgility: j++,
   bonusHull: j++,
   bonusShield: j++,
   cloakCount: i++,
   damageCount: i++,
   defenderTargetLocks: imperialToken.defenderTargetLocks(),
   energyCount: i++,
   evadeCount: i++,
   focusCount: i++,
   ionCount: i++,
   ordnanceCount: i++,
   reinforceCount: i++,
   shieldCount: i++,
   stressCount: i++,
   tractorBeamCount: i++,
   weaponsDisabledCount: i++,
});

ReactDOM.render(element, document.getElementById("panel"));