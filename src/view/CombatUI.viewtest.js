import Logger from "../utility/Logger.js";

import DiceModification from "../artifact/DiceModification.js";
import Phase from "../artifact/Phase.js";

import Ability from "../model/Ability.js";
import Action from "../model/Action.js";
import AttackDice from "../model/AttackDice.js";
import CardAction from "../model/CardAction.js";
import CombatAction from "../model/CombatAction.js";
import DamageDealer from "../model/DamageDealer.js";
import DefenseDice from "../model/DefenseDice.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";
import ModifyDiceAbility from "../model/ModifyDiceAbility.js";
import TargetLock from "../model/TargetLock.js";

import CombatUI from "./CombatUI.js";

// require(["react", "react-dom", "react-dom-factories", "utility/Logger", "model/Ability", "artifact/DiceModification", "artifact/Phase",
// 		"artifact/UpgradeCard",
// 		"model/Action", "model/Adjudicator", "model/AttackDice", "model/CombatAction", "model/DefenseDice", "model/DamageDealer",
// 		"model/ModifyDiceAbility", "model/TargetLock", "model/CardAction", "model/EnvironmentFactory",
// 		"view/CombatUI"
// 	],
// 	function(React, ReactDOM, ReactDOMFactories, Logger, Ability, DiceModification, Phase, UpgradeCard, Action, Adjudicator, AttackDice, CombatAction, DefenseDice,
// 		DamageDealer,
// 		ModifyDiceAbility, TargetLock, CardAction, EnvironmentFactory,
// 		CombatUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var environment = EnvironmentFactory.createCoreSetEnvironment();
var store = environment.store();
// var adjudicator = new Adjudicator(store);
var attacker = environment.pilotInstances()[0];
LOGGER.debug("attacker = " + attacker);
store.dispatch(CardAction.addFocusCount(attacker));
var weapon = attacker.primaryWeapon();
var attackDice = new AttackDice(store, attacker.id(), 5);
var defender = environment.pilotInstances()[2];
LOGGER.debug("defender = " + defender);
store.dispatch(CardAction.addFocusCount(defender));
store.dispatch(CardAction.addEvadeCount(defender));
var targetLock = TargetLock.newInstance(store, attacker, defender);
var callback = function()
{
   LOGGER.info("callback() start");
};
var combatAction = new CombatAction(store, attacker, weapon, defender, callback);
store.dispatch(Action.setTokenCombatAction(attacker, combatAction));
var modificationKeys0 = [DiceModification.ATTACK_SPEND_FOCUS, DiceModification.ATTACK_SPEND_TARGET_LOCK];
var modifications0 = modificationKeys0.map(function(modificationKey)
{
   return new Ability(DiceModification, modificationKey, ModifyDiceAbility, ModifyDiceAbility.ATTACK_KEY);
});

var element0 = React.createElement(CombatUI,
{
   attacker: attacker,
   attackDice: attackDice,
   defender: defender,
   resourceBase: resourceBase,
   modifications: modifications0,
   okFunction: myOK0,
   phase: Phase.properties[Phase.COMBAT_MODIFY_ATTACK_DICE],
   weapon: weapon,
});
ReactDOM.render(element0, document.getElementById("inputArea0"));

var defenseDice = new DefenseDice(store, attacker.id(), 4);
// var modificationKeys1 = [ModifyDefenseDiceAction.Modification.SPEND_EVADE, ModifyDefenseDiceAction.Modification.SPEND_FOCUS];
var modificationKeys1 = [DiceModification.DEFENSE_SPEND_EVADE, DiceModification.DEFENSE_SPEND_FOCUS];
var modifications1 = modificationKeys1.map(function(modificationKey)
{
   // 	var pilotKey;
   // 	var upgradeKey;
   // 	return new ModifyDefenseDiceAction(store, attacker, defender, modificationKey, pilotKey, upgradeKey);
   return new Ability(DiceModification, modificationKey, ModifyDiceAbility, ModifyDiceAbility.DEFENSE_KEY);
});

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

var hitCount = attackDice.hitCount();
var criticalHitCount = attackDice.criticalHitCount();
var evadeCount = defenseDice.evadeCount();
var damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount);

var element2 = React.createElement(CombatUI,
{
   attacker: attacker,
   attackDice: attackDice,
   criticalHitCount: damageDealer.criticalHits(),
   defender: defender,
   defenseDice: defenseDice,
   hitCount: damageDealer.hits(),
   resourceBase: resourceBase,
   okFunction: myOK2,
   phase: Phase.properties[Phase.COMBAT_NOTIFY_DAMAGE],
   weapon: weapon,
});
ReactDOM.render(element2, document.getElementById("inputArea2"));

function myOK0(modification)
{
   LOGGER.info("myOK0() modification = " + modification);
}

function myOK1(modification)
{
   LOGGER.info("myOK1() modification = " + modification);
}

function myOK2()
{
   LOGGER.info("myOK2()");
}