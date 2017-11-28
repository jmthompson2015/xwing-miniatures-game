"use strict";

define(["common/js/ArrayAugments", "common/js/InputValidator"],
   function(ArrayAugments, InputValidator)
   {
      var SimpleAgentStrategy = {
         chooseAbility: function(agent, damageAbilities, pilotAbilities, upgradeAbilities, callback)
         {
            InputValidator.validateNotNull("agent", agent);
            InputValidator.validateNotNull("damageAbilities", damageAbilities);
            InputValidator.validateNotNull("pilotAbilities", pilotAbilities);
            InputValidator.validateNotNull("upgradeAbilities", upgradeAbilities);
            InputValidator.validateIsFunction("callback", callback);

            var ability = (damageAbilities.length > 0 ? damageAbilities.xwingRandomElement() : undefined);

            if (ability === undefined)
            {
               ability = (upgradeAbilities.length > 0 ? upgradeAbilities.xwingRandomElement() : undefined);

               if (ability === undefined)
               {
                  ability = (pilotAbilities.length > 0 ? pilotAbilities.xwingRandomElement() : undefined);
               }
            }

            var isAccepted = (ability !== undefined);

            callback(ability, isAccepted);
         },

         chooseDecloakAction: function(agent, token, decloakActions, callback)
         {
            InputValidator.validateNotNull("agent", agent);
            InputValidator.validateNotNull("token", token);
            InputValidator.validateNotNull("decloakActions", decloakActions);
            InputValidator.validateIsFunction("callback", callback);

            var answer = decloakActions.xwingRandomElement();

            callback(token, answer);
         },

         chooseModifyAttackDiceAction: function(agent, attacker, defender, modifications, callback)
         {
            InputValidator.validateNotNull("agent", agent);
            InputValidator.validateNotNull("attacker", attacker);
            InputValidator.validateNotNull("defender", defender);
            InputValidator.validateNotNull("modifications", modifications);
            InputValidator.validateIsFunction("callback", callback);

            var answer = modifications.xwingRandomElement();
            var isAccepted = (answer !== undefined);

            callback(answer, isAccepted);
         },

         chooseModifyDefenseDiceAction: function(agent, attacker, defender, modifications, callback)
         {
            InputValidator.validateNotNull("agent", agent);
            InputValidator.validateNotNull("attacker", attacker);
            InputValidator.validateNotNull("defender", defender);
            InputValidator.validateNotNull("modifications", modifications);
            InputValidator.validateIsFunction("callback", callback);

            var answer = modifications.xwingRandomElement();
            var isAccepted = (answer !== undefined);

            callback(answer, isAccepted);
         },

         choosePlanningActions: function(agent, tokens, tokenToValidManeuvers, callback)
         {
            InputValidator.validateNotNull("agent", agent);
            InputValidator.validateNotNull("tokens", tokens);
            InputValidator.validateNotNull("tokenToValidManeuvers", tokenToValidManeuvers);
            InputValidator.validateIsFunction("callback", callback);

            var tokenToManeuver = {};

            tokens.forEach(function(token)
            {
               var validManeuvers = tokenToValidManeuvers[token];
               tokenToManeuver[token] = validManeuvers.xwingRandomElement();
            });

            callback(tokenToManeuver);
         },

         chooseShipAction: function(agent, token, shipActions, callback)
         {
            InputValidator.validateNotNull("agent", agent);
            InputValidator.validateNotNull("token", token);
            InputValidator.validateNotNull("shipActions", shipActions);
            InputValidator.validateIsFunction("callback", callback);

            var answer = shipActions.xwingRandomElement();
            var isAccepted = (answer !== undefined);

            callback(answer, isAccepted);
         },

         chooseWeaponAndDefender: function(agent, attacker, choices, callback)
         {
            InputValidator.validateNotNull("agent", agent);
            InputValidator.validateNotNull("attacker", attacker);
            InputValidator.validateNotNull("choices", choices);
            InputValidator.validateIsFunction("callback", callback);

            var weaponData = choices.xwingRandomElement();
            var myWeapon = weaponData.weapon;

            // The first entry should be the closest.
            var rangeToDefenders = weaponData.rangeToDefenders;
            var defenders = rangeToDefenders[0].defenders;
            var weapon = myWeapon;
            var defender = defenders[0];

            callback(weapon, defender);
         },

         dealDamage: function(agent)
         {
            InputValidator.validateNotNull("agent", agent);

            // Nothing to do.
         },
      };

      SimpleAgentStrategy.name = "SimpleAgent";

      return SimpleAgentStrategy;
   });
