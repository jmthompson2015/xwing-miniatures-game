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
import DefenseDice from "../model/DefenseDice.js";
import Environment from "../model/Environment.js";
import MockAttackDice from "../model/MockAttackDice.js";
import MockDefenseDice from "../model/MockDefenseDice.js";
import ModifyDiceAbility from "../model/ModifyDiceAbility.js";
import Position from "../model/Position.js";
import Reducer from "../model/Reducer.js";
import Squad from "../model/Squad.js";

import CombatUI from "./CombatUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";

const store00 = Redux.createStore(Reducer.root);
const imperialAgent = new Agent(store00, "Imperial Agent");
const rebelAgent = new Agent(store00, "Rebel Agent");
const squad1 = new Squad(Faction.IMPERIAL, "squad1", 2016, "squad1", [new CardInstance(store00, PilotCard.CAPTAIN_OICUNN, imperialAgent, [UpgradeCard.YSANNE_ISARD])]);
const squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.LUKE_SKYWALKER, rebelAgent, [UpgradeCard.PROTON_TORPEDOES,
					UpgradeCard.R2_D2_ASTROMECH
				])]);
const positions1 = [new Position(305, 20, 90)];
const positions2 = [new Position(458, 895, 270)];

const store = Redux.createStore(Reducer.root);
const environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
// const adjudicator = new Adjudicator(store);
const tokens = environment.pilotInstances();
const attacker = tokens[1]; // X-Wing.
const defender = tokens[0]; // VT-49 Decimator.

const attackDice = new AttackDice(store, attacker.id(), 5);
const defenseDice = new DefenseDice(store, attacker.id(), 0);
store.dispatch(CardAction.addEvadeCount(defender));
environment.setActiveToken(attacker);
const weapon = attacker.primaryWeapon();
const callback = function() {};
store.dispatch(Action.setDelay(10));
const combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
store.dispatch(Action.setTokenCombatAction(attacker, combatAction));
const modifications1 = [new Ability(DiceModification, DiceModification.DEFENSE_SPEND_EVADE, ModifyDiceAbility, ModifyDiceAbility.DEFENSE_KEY)];

const element1 = React.createElement(CombatUI,
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