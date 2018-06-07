import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Agent from "../model/Agent.js";
import CardInstance from "../model/CardInstance.js";
import Environment from "../model/Environment.js";
import Position from "../model/Position.js";
import Reducer from "../model/Reducer.js";
import Squad from "../model/Squad.js";

import WeaponAndDefenderChooser from "./WeaponAndDefenderChooser.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const store00 = Redux.createStore(Reducer.root);
const imperialAgent = new Agent(store00, "Imperial Agent");
const rebelAgent = new Agent(store00, "Rebel Agent");
let attacker = new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [UpgradeCard.OUTRIDER, UpgradeCard.CALCULATION, UpgradeCard.MANGLER_CANNON, UpgradeCard.CLUSTER_MISSILES, UpgradeCard.ENGINE_UPGRADE]);
const defender0 = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
const defender1 = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
const defender2 = new CardInstance(store00, PilotCard.OBSIDIAN_SQUADRON_PILOT, imperialAgent);
const defender3 = new CardInstance(store00, PilotCard.OBSIDIAN_SQUADRON_PILOT, imperialAgent);
const defender4 = new CardInstance(store00, PilotCard.BLACK_SQUADRON_PILOT, imperialAgent);
const defender5 = new CardInstance(store00, PilotCard.BLACK_SQUADRON_PILOT, imperialAgent);

const squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad #1", [defender0, defender1, defender2, defender3, defender4, defender5]);
const squad2 = new Squad(Faction.REBEL, "squad2", 2016, "squad #2", [attacker]);
const positions1 = [new Position(450, 845, 90), new Position(450, 795, 90), new Position(450, 745, 90), new Position(450, 695, 90), new Position(450, 645, 90), new Position(450, 595, 90)];
const positions2 = [new Position(458, 895, -90)];

const store = Redux.createStore(Reducer.root);
const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
const tokens = environment.pilotInstances();
attacker = tokens[6];
const choices = environment.createWeaponToRangeToDefenders(attacker);
const callback = function(weapon, defender)
{
   LOGGER.info("callback() start");
   LOGGER.info("weapon = " + weapon + " defender = " + defender);
   LOGGER.info("callback() end");
};

const element = React.createElement(WeaponAndDefenderChooser,
{
   attacker: attacker,
   choices: choices,
   callback: callback
});
ReactDOM.render(element, document.getElementById("inputArea"));