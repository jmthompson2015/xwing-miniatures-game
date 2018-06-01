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

var store00 = Redux.createStore(Reducer.root);
var imperialAgent = new Agent(store00, "Imperial Agent");
var rebelAgent = new Agent(store00, "Rebel Agent");
var attacker = new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [UpgradeCard.OUTRIDER, UpgradeCard.CALCULATION, UpgradeCard.MANGLER_CANNON, UpgradeCard.CLUSTER_MISSILES, UpgradeCard.ENGINE_UPGRADE]);
var defender0 = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
var defender1 = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
var defender2 = new CardInstance(store00, PilotCard.OBSIDIAN_SQUADRON_PILOT, imperialAgent);
var defender3 = new CardInstance(store00, PilotCard.OBSIDIAN_SQUADRON_PILOT, imperialAgent);
var defender4 = new CardInstance(store00, PilotCard.BLACK_SQUADRON_PILOT, imperialAgent);
var defender5 = new CardInstance(store00, PilotCard.BLACK_SQUADRON_PILOT, imperialAgent);

var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad #1", [defender0, defender1, defender2, defender3, defender4, defender5]);
var squad2 = new Squad(Faction.REBEL, "squad2", 2016, "squad #2", [attacker]);
var positions1 = [new Position(450, 845, 90), new Position(450, 795, 90), new Position(450, 745, 90), new Position(450, 695, 90), new Position(450, 645, 90), new Position(450, 595, 90)];
var positions2 = [new Position(458, 895, -90)];

var store = Redux.createStore(Reducer.root);
var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
var tokens = environment.pilotInstances();
attacker = tokens[6];
var choices = environment.createWeaponToRangeToDefenders(attacker);
var callback = function(weapon, defender)
{
   LOGGER.info("callback() start");
   LOGGER.info("weapon = " + weapon + " defender = " + defender);
   LOGGER.info("callback() end");
};

var element = React.createElement(WeaponAndDefenderChooser,
{
   attacker: attacker,
   choices: choices,
   callback: callback
});
ReactDOM.render(element, document.getElementById("inputArea"));