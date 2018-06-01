import Logger from "../utility/Logger.js";

import DiceModification from "../artifact/DiceModification.js";
import Faction from "../artifact/Faction.js";
import Phase from "../artifact/Phase.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Ability from "../model/Ability.js";
import Action from "../model/Action.js";
import Agent from "../model/Agent.js";
import AttackDice from "../model/AttackDice.js";
import CardAction from "../model/CardAction.js";
import CardInstance from "../model/CardInstance.js";
import CombatAction from "../model/CombatAction.js";
// import DamageDealer from "../model/DamageDealer.js";
import DefenseDice from "../model/DefenseDice.js";
import Environment from "../model/Environment.js";
// import EnvironmentFactory from "../model/EnvironmentFactory.js";
import MockAttackDice from "../model/MockAttackDice.js";
import MockDefenseDice from "../model/MockDefenseDice.js";
import ModifyDiceAbility from "../model/ModifyDiceAbility.js";
import Position from "../model/Position.js";
import Reducer from "../model/Reducer.js";
import Squad from "../model/Squad.js";
// import TargetLock from "../model/TargetLock.js";

import CombatUI from "./CombatUI.js";

// require(["react", "react-dom", "react-dom-factories", "redux", "utility/Logger", "model/Ability", "artifact/DiceModification", "artifact/Phase",
// 		"artifact/PilotCard", "model/Position", "artifact/Faction", "artifact/UpgradeCard", "model/Action", "model/Adjudicator",
// 		"model/Agent", "model/AttackDice", "model/CombatAction", "model/DefenseDice", "model/Environment", "model/ModifyDiceAbility", "model/Reducer",
// 		"model/Squad", "model/CardInstance", "model/CardAction", "view/CombatUI", "model/MockAttackDice",
// 		"model/MockDefenseDice"
// 	],
// 	function(React, ReactDOM, ReactDOMFactories, Redux, Logger, Ability, DiceModification, Phase, PilotCardCard, Position, Faction, UpgradeCard, Action, Adjudicator, Agent,
// 		AttackDice,
// 		CombatAction, DefenseDice, Environment, ModifyDiceAbility, Reducer, Squad, CardInstance, CardAction, CombatUI, MockAttackDice, MockDefenseDice)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";

var store00 = Redux.createStore(Reducer.root);
var imperialAgent = new Agent(store00, "Imperial Agent");
var rebelAgent = new Agent(store00, "Rebel Agent");
var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2016, "squad1", [new CardInstance(store00, PilotCard.CAPTAIN_OICUNN, imperialAgent, [UpgradeCard.YSANNE_ISARD])]);
var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.LUKE_SKYWALKER, rebelAgent, [UpgradeCard.PROTON_TORPEDOES,
					UpgradeCard.R2_D2_ASTROMECH
				])]);
var positions1 = [new Position(305, 20, 90)];
var positions2 = [new Position(458, 895, 270)];

var store = Redux.createStore(Reducer.root);
var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
// var adjudicator = new Adjudicator(store);
var tokens = environment.pilotInstances();
var attacker = tokens[1]; // X-Wing.
var defender = tokens[0]; // VT-49 Decimator.

var attackDice = new AttackDice(store, attacker.id(), 5);
var defenseDice = new DefenseDice(store, attacker.id(), 0);
store.dispatch(CardAction.addEvadeCount(defender));
environment.setActiveToken(attacker);
var weapon = attacker.primaryWeapon();
var callback = function() {};
store.dispatch(Action.setDelay(10));
var combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
store.dispatch(Action.setTokenCombatAction(attacker, combatAction));
var modifications1 = [new Ability(DiceModification, DiceModification.DEFENSE_SPEND_EVADE, ModifyDiceAbility, ModifyDiceAbility.DEFENSE_KEY)];

var element1 = React.createElement(CombatUI,
{
   attacker: attacker,
   attackDice: attackDice,
   defender: defender,
   defenseDice: defenseDice,
   resourceBase: resourceBase,
   modifications: modifications1,
   okFunction: myOK1,
   phase: Phase.properties[Phase.COMBAT_MODIFY_DEFENSE_DICE],
   weapon: weapon,
});
ReactDOM.render(element1, document.getElementById("inputArea1"));

function myOK1(modification)
{
   LOGGER.info("myOK1() modification = " + modification);
}