import InputValidator from "../utility/InputValidator.js";

import Phase from "../artifact/Phase.js";

import AttackDice from "../model/AttackDice.js";
import DefenseDice from "../model/DefenseDice.js";
import Selector from "../model/Selector.js";

import AbilityChooser from "../view/AbilityChooser.js";
import CombatUI from "../view/CombatUI.js";
import PlanningPanel from "../view/PlanningPanel.js";
import WeaponAndDefenderChooser from "../view/WeaponAndDefenderChooser.js";

const HumanAgentStrategy = {};

HumanAgentStrategy.chooseAbility = function(agent, damageAbilities, pilotAbilities, upgradeAbilities, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("damageAbilities", damageAbilities);
   InputValidator.validateNotNull("pilotAbilities", pilotAbilities);
   InputValidator.validateNotNull("upgradeAbilities", upgradeAbilities);
   InputValidator.validateIsFunction("callback", callback);

   const finishCallback = this.finishChooseAbility;
   const myCallback = function(ability, isAccepted)
   {
      finishCallback(agent, ability, isAccepted, callback);
   };

   const store = agent.store();
   const resourceBase = store.getState().resourceBase;
   const environment = store.getState().environment;

   if (damageAbilities.length > 0 || pilotAbilities.length > 0 || upgradeAbilities.length > 0)
   {
      const element = React.createElement(AbilityChooser,
      {
         damages: damageAbilities,
         resourceBase: resourceBase,
         onChange: myCallback,
         pilots: pilotAbilities,
         shipActions: [],
         token: environment.activeCardInstance(),
         upgrades: upgradeAbilities,
      });
      ReactDOM.render(element, document.getElementById(inputAreaId(agent)));
      window.dispatchEvent(new Event('resize'));

      // Wait for the user to respond.
   }
   else
   {
      setTimeout(myCallback, 100);
   }
};

HumanAgentStrategy.finishChooseAbility = function(agent, ability, isAccepted, callback)
{
   LOGGER.trace("HumanAgent.finishChooseAbility() start");

   // Handle the user response.
   const element = document.getElementById(inputAreaId(agent));
   ReactDOM.unmountComponentAtNode(element);
   window.dispatchEvent(new Event('resize'));
   LOGGER.trace("HumanAgent.finishChooseAbility() end");

   callback(ability, isAccepted);
};

HumanAgentStrategy.chooseDecloakAction = function(agent, token, decloakActions, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("decloakActions", decloakActions);
   InputValidator.validateIsFunction("callback", callback);

   const store = agent.store();
   const resourceBase = store.getState().resourceBase;
   const attacker = token;

   const callback2 = function(decloakAbility)
   {
      this.finishDecloakAction(agent, token, decloakAbility, callback);
   };
   const element = React.createElement(AbilityChooser,
   {
      damages: [],
      resourceBase: resourceBase,
      onChange: callback2.bind(this),
      pilots: [],
      shipActions: decloakActions,
      token: attacker,
      upgrades: [],
   });
   ReactDOM.render(element, document.getElementById(inputAreaId(agent)));
   window.dispatchEvent(new Event('resize'));

   // Wait for the user to respond.
};

HumanAgentStrategy.finishDecloakAction = function(agent, token, decloakAbility, callback)
{
   LOGGER.trace("HumanAgent.finishDecloakAction() start");
   LOGGER.debug("decloakAbility = " + decloakAbility);
   LOGGER.debug("decloakAbility.context().maneuverKey = " + decloakAbility.context().maneuverKey);

   // Handle the user response.
   const element = document.getElementById(inputAreaId(agent));
   ReactDOM.unmountComponentAtNode(element);
   window.dispatchEvent(new Event('resize'));
   LOGGER.trace("HumanAgent.finishDecloakAction() end");

   callback(token, decloakAbility);
};

HumanAgentStrategy.chooseModifyAttackDiceAction = function(agent, attacker, defender, modifications, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("modifications", modifications);
   InputValidator.validateIsFunction("callback", callback);

   const finishCallback = this.finishModifyAttackDice;
   const myCallback = function(modification)
   {
      finishCallback(modification, callback);
   };

   const store = agent.store();
   const resourceBase = store.getState().resourceBase;
   const combatAction = Selector.combatAction(store.getState(), attacker);

   if (combatAction)
   {
      const weapon = combatAction.weapon();
      const attackDice = AttackDice.get(store, attacker.id());

      if (modifications.length > 0)
      {
         const element = React.createElement(CombatUI,
         {
            attacker: attacker,
            attackDice: attackDice,
            defender: defender,
            resourceBase: resourceBase,
            modifications: modifications,
            okFunction: myCallback,
            phase: Phase.properties[store.getState().phaseKey],
            weapon: weapon,
         });
         ReactDOM.render(element, document.getElementById(inputAreaId(agent)));
         window.dispatchEvent(new Event('resize'));

         // Wait for the user to respond.
      }
      else
      {
         callback();
      }
   }
   else
   {
      callback();
   }
};

HumanAgentStrategy.finishModifyAttackDice = function(modification, callback)
{
   let answer;

   if (modification && modification !== null && modification !== "null")
   {
      answer = modification;
   }

   const isAccepted = (answer !== undefined && answer !== null);

   callback(answer, isAccepted);
};

HumanAgentStrategy.chooseModifyDefenseDiceAction = function(agent, attacker, defender, modifications, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("modifications", modifications);
   InputValidator.validateIsFunction("callback", callback);

   const finishCallback = this.finishModifyDefenseDice;
   const myCallback = function(modification)
   {
      finishCallback(modification, callback);
   };

   const store = agent.store();
   const resourceBase = store.getState().resourceBase;
   const combatAction = Selector.combatAction(store.getState(), attacker);

   if (combatAction !== undefined)
   {
      const weapon = combatAction.weapon();
      const attackDice = AttackDice.get(store, attacker.id());
      const defenseDice = DefenseDice.get(store, attacker.id());

      if (modifications.length > 0)
      {
         const element = React.createElement(CombatUI,
         {
            attacker: attacker,
            attackDice: attackDice,
            defender: defender,
            defenseDice: defenseDice,
            resourceBase: resourceBase,
            modifications: modifications,
            okFunction: myCallback,
            phase: Phase.properties[store.getState().phaseKey],
            weapon: weapon,
         });
         ReactDOM.render(element, document.getElementById(inputAreaId(agent)));
         window.dispatchEvent(new Event('resize'));

         // Wait for the user to respond.
      }
      else
      {
         callback();
      }
   }
   else
   {
      callback();
   }
};

HumanAgentStrategy.finishModifyDefenseDice = function(modification, callback)
{
   let answer;

   if (modification && modification !== null && modification !== "null")
   {
      answer = modification;
   }

   const isAccepted = (answer !== undefined && answer !== null);

   callback(answer, isAccepted);
};

HumanAgentStrategy.choosePlanningActions = function(agent, tokens, tokenToValidManeuvers, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("tokens", tokens);
   InputValidator.validateNotNull("tokenToValidManeuvers", tokenToValidManeuvers);
   InputValidator.validateIsFunction("callback", callback);

   const finishCallback = this.finishPlanningAction;
   const myCallback = function(tokenToManeuver)
   {
      finishCallback(agent, tokenToManeuver, callback);
   };

   const store = agent.store();
   const resourceBase = store.getState().resourceBase;
   const environment = store.getState().environment;

   tokens.sort(function(token0, token1)
   {
      const id0 = token0.id();
      const id1 = token1.id();
      return id0 - id1;
   });
   const self = this;
   const element = React.createElement(PlanningPanel,
   {
      agent: self,
      callback: myCallback,
      environment: environment,
      resourceBase: resourceBase,
      tokens: tokens,
   });
   ReactDOM.render(element, document.getElementById(inputAreaId(agent)));
   window.dispatchEvent(new Event('resize'));

   // Wait for the user to respond.
};

HumanAgentStrategy.finishPlanningAction = function(agent, tokenToManeuver, callback)
{
   LOGGER.trace("HumanAgent.finishPlanningAction() start");

   // Handle the user response.
   const element = document.getElementById(inputAreaId(agent));
   ReactDOM.unmountComponentAtNode(element);
   window.dispatchEvent(new Event('resize'));
   LOGGER.trace("HumanAgent.finishPlanningAction() end");

   callback(tokenToManeuver);
};

HumanAgentStrategy.chooseShipAction = function(agent, token, shipActions, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("shipActions", shipActions);
   InputValidator.validateIsFunction("callback", callback);

   const finishCallback = this.finishShipAction;
   const myCallback = function(shipAction, isAccepted)
   {
      finishCallback(agent, shipAction, isAccepted, callback);
   };

   const store = agent.store();
   const resourceBase = store.getState().resourceBase;

   if (shipActions.length > 0)
   {
      const element = React.createElement(AbilityChooser,
      {
         damages: [],
         resourceBase: resourceBase,
         onChange: myCallback,
         pilots: [],
         shipActions: shipActions,
         token: token,
         upgrades: [],
      });
      ReactDOM.render(element, document.getElementById(inputAreaId(agent)));
      window.dispatchEvent(new Event('resize'));

      // Wait for the user to respond.
   }
   else
   {
      setTimeout(myCallback, 1000);
   }
};

HumanAgentStrategy.finishShipAction = function(agent, shipAction, isAccepted, callback)
{
   LOGGER.trace("HumanAgent.finishShipAction() start");

   // Handle the user response.
   const element = document.getElementById(inputAreaId(agent));
   ReactDOM.unmountComponentAtNode(element);
   window.dispatchEvent(new Event('resize'));
   LOGGER.trace("HumanAgent.finishShipAction() end");

   callback(shipAction, isAccepted);
};

HumanAgentStrategy.chooseWeaponAndDefender = function(agent, attacker, choices, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("choices", choices);
   InputValidator.validateIsFunction("callback", callback);

   const finishCallback = this.finishWeaponAndDefender;
   const myCallback = function(weapon, defender)
   {
      finishCallback(agent, weapon, defender, callback);
   };

   if (choices.length > 0)
   {
      const element = React.createElement(WeaponAndDefenderChooser,
      {
         attacker: attacker,
         choices: choices,
         callback: myCallback,
      });
      ReactDOM.render(element, document.getElementById(inputAreaId(agent)));
      window.dispatchEvent(new Event('resize'));

      // Wait for the user to respond.
   }
   else
   {
      callback();
   }
};

HumanAgentStrategy.finishWeaponAndDefender = function(agent, weapon, defender, callback)
{
   LOGGER.trace("HumanAgent.finishWeaponAndDefender() start");

   // Handle the user response.
   const element = document.getElementById(inputAreaId(agent));
   ReactDOM.unmountComponentAtNode(element);
   window.dispatchEvent(new Event('resize'));
   LOGGER.trace("HumanAgent.finishWeaponAndDefender() end");

   callback(weapon, defender);
};

HumanAgentStrategy.dealDamage = function(agent, attacker, weapon, attackDice, defender, defenseDice, damageDealer, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("weapon", weapon);
   InputValidator.validateNotNull("attackDice", attackDice);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("defenseDice", defenseDice);
   InputValidator.validateNotNull("damageDealer", damageDealer);
   InputValidator.validateNotNull("callback", callback);

   const store = agent.store();
   const resourceBase = store.getState().resourceBase;
   const finishCallback = this.finishDealDamage;
   const myCallback = function()
   {
      finishCallback(agent, callback);
   };

   const element = React.createElement(CombatUI,
   {
      attacker: attacker,
      attackDice: attackDice,
      criticalHitCount: damageDealer.criticalHits(),
      defender: defender,
      defenseDice: defenseDice,
      hitCount: damageDealer.hits(),
      resourceBase: resourceBase,
      okFunction: myCallback,
      phase: Phase.properties[store.getState().phaseKey],
      weapon: weapon,
   });

   ReactDOM.render(element, document.getElementById(inputAreaId(agent)));
   window.dispatchEvent(new Event('resize'));
};

HumanAgentStrategy.finishDealDamage = function(agent, callback)
{
   LOGGER.trace("HumanAgent.finishDealDamage() start");

   // Handle the user response.
   const element = document.getElementById(inputAreaId(agent));
   ReactDOM.unmountComponentAtNode(element);
   window.dispatchEvent(new Event('resize'));
   LOGGER.trace("HumanAgent.finishDealDamage() end");

   callback();
};

HumanAgentStrategy.name = "HumanAgent";

function inputAreaId(agent)
{
   InputValidator.validateNotNull("agent", agent);

   const store = agent.store();
   const environment = store.getState().environment;
   let answer = "inputArea";

   if (agent === environment.firstAgent())
   {
      answer = "firstPilotInputArea";
   }
   else if (agent === environment.secondAgent())
   {
      answer = "secondPilotInputArea";
   }
   else
   {
      throw "Unknown agent for inputAreaId: " + agent;
   }

   return answer;
}

export default HumanAgentStrategy;