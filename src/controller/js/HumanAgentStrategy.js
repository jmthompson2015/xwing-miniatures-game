"use strict";

define(["react", "react-dom", "common/js/ArrayUtilities", "common/js/InputValidator", "artifact/js/Phase",
  "model/js/AttackDice", "model/js/DefenseDice", "model/js/Selector",
  "view/js/AbilityChooser", "view/js/CombatUI", "view/js/PlanningPanel", "view/js/WeaponAndDefenderChooser"],
   function(React, ReactDOM, ArrayUtilities, InputValidator, Phase, AttackDice, DefenseDice, Selector, AbilityChooser, CombatUI, PlanningPanel, WeaponAndDefenderChooser)
   {
      var HumanAgentStrategy = {};

      HumanAgentStrategy.chooseAbility = function(agent, damageAbilities, pilotAbilities, upgradeAbilities, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("damageAbilities", damageAbilities);
         InputValidator.validateNotNull("pilotAbilities", pilotAbilities);
         InputValidator.validateNotNull("upgradeAbilities", upgradeAbilities);
         InputValidator.validateIsFunction("callback", callback);

         var finishCallback = this.finishChooseAbility;
         var myCallback = function(ability, isAccepted)
         {
            finishCallback(agent, ability, isAccepted, callback);
         };

         var store = agent.store();
         var resourceBase = store.getState().resourceBase;
         var environment = store.getState().environment;

         if (damageAbilities.length > 0 || pilotAbilities.length > 0 || upgradeAbilities.length > 0)
         {
            var element = React.createElement(AbilityChooser,
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
         var element = document.getElementById(inputAreaId(agent));
         element.innerHTML = "";
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

         var store = agent.store();
         var resourceBase = store.getState().resourceBase;
         var attacker = token;

         var callback2 = function(decloakAbility)
         {
            this.finishDecloakAction(agent, token, decloakAbility, callback);
         };
         var element = React.createElement(AbilityChooser,
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
         var element = document.getElementById(inputAreaId(agent));
         element.innerHTML = "";
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

         var finishCallback = this.finishModifyAttackDice;
         var myCallback = function(modification)
         {
            finishCallback(modification, callback);
         };

         var store = agent.store();
         var resourceBase = store.getState().resourceBase;
         var weapon = Selector.combatAction(store.getState(), attacker).weapon();
         var attackDice = AttackDice.get(store, attacker.id());

         if (modifications.length > 0)
         {
            var element = React.createElement(CombatUI,
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
      };

      HumanAgentStrategy.finishModifyAttackDice = function(modification, callback)
      {
         var answer;

         if (modification && modification !== null && modification !== "null")
         {
            answer = modification;
         }

         var isAccepted = (answer !== undefined && answer !== null);

         callback(answer, isAccepted);
      };

      HumanAgentStrategy.chooseModifyDefenseDiceAction = function(agent, attacker, defender, modifications, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("modifications", modifications);
         InputValidator.validateIsFunction("callback", callback);

         var finishCallback = this.finishModifyDefenseDice;
         var myCallback = function(modification)
         {
            finishCallback(modification, callback);
         };

         var store = agent.store();
         var resourceBase = store.getState().resourceBase;
         var weapon = Selector.combatAction(store.getState(), attacker).weapon();
         var attackDice = AttackDice.get(store, attacker.id());
         var defenseDice = DefenseDice.get(store, attacker.id());

         if (modifications.length > 0)
         {
            var element = React.createElement(CombatUI,
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
      };

      HumanAgentStrategy.finishModifyDefenseDice = function(modification, callback)
      {
         var answer;

         if (modification && modification !== null && modification !== "null")
         {
            answer = modification;
         }

         var isAccepted = (answer !== undefined && answer !== null);

         callback(answer, isAccepted);
      };

      HumanAgentStrategy.choosePlanningActions = function(agent, tokens, tokenToValidManeuvers, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("tokens", tokens);
         InputValidator.validateNotNull("tokenToValidManeuvers", tokenToValidManeuvers);
         InputValidator.validateIsFunction("callback", callback);

         var finishCallback = this.finishPlanningAction;
         var myCallback = function(tokenToManeuver)
         {
            finishCallback(agent, tokenToManeuver, callback);
         };

         var store = agent.store();
         var resourceBase = store.getState().resourceBase;
         var environment = store.getState().environment;

         tokens.sort(function(token0, token1)
         {
            var id0 = token0.id();
            var id1 = token1.id();
            return id0 - id1;
         });
         var self = this;
         var element = React.createElement(PlanningPanel,
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
         var element = document.getElementById(inputAreaId(agent));
         element.innerHTML = "";
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

         var finishCallback = this.finishShipAction;
         var myCallback = function(shipAction, isAccepted)
         {
            finishCallback(agent, shipAction, isAccepted, callback);
         };

         var store = agent.store();
         var resourceBase = store.getState().resourceBase;

         if (shipActions.length > 0)
         {
            var element = React.createElement(AbilityChooser,
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
         var element = document.getElementById(inputAreaId(agent));
         element.innerHTML = "";
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

         var finishCallback = this.finishWeaponAndDefender;
         var myCallback = function(weapon, defender)
         {
            finishCallback(agent, weapon, defender, callback);
         };

         if (choices.length > 0)
         {
            var element = React.createElement(WeaponAndDefenderChooser,
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
         var element = document.getElementById(inputAreaId(agent));
         element.innerHTML = "";
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

         var store = agent.store();
         var resourceBase = store.getState().resourceBase;
         var finishCallback = this.finishDealDamage;
         var myCallback = function()
         {
            finishCallback(agent, callback);
         };

         var element = React.createElement(CombatUI,
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
         var element = document.getElementById(inputAreaId(agent));
         element.innerHTML = "";
         window.dispatchEvent(new Event('resize'));
         LOGGER.trace("HumanAgent.finishDealDamage() end");

         callback();
      };

      HumanAgentStrategy.name = "HumanAgent";

      function inputAreaId(agent)
      {
         InputValidator.validateNotNull("agent", agent);

         var store = agent.store();
         var environment = store.getState().environment;
         var answer = "inputArea";

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

      return HumanAgentStrategy;
   });
