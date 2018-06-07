import ArrayUtilities from "../utility/ArrayUtilities.js";
import InputValidator from "../utility/InputValidator.js";

const SimpleAgentStrategy = {};

SimpleAgentStrategy.chooseAbility = function(agent, damageAbilities, pilotAbilities, upgradeAbilities, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("damageAbilities", damageAbilities);
   InputValidator.validateNotNull("pilotAbilities", pilotAbilities);
   InputValidator.validateNotNull("upgradeAbilities", upgradeAbilities);
   InputValidator.validateIsFunction("callback", callback);

   let ability = (damageAbilities.length > 0 ? ArrayUtilities.randomElement(damageAbilities) : undefined);

   if (ability === undefined)
   {
      ability = (upgradeAbilities.length > 0 ? ArrayUtilities.randomElement(upgradeAbilities) : undefined);

      if (ability === undefined)
      {
         ability = (pilotAbilities.length > 0 ? ArrayUtilities.randomElement(pilotAbilities) : undefined);
      }
   }

   const isAccepted = (ability !== undefined);

   callback(ability, isAccepted);
};

SimpleAgentStrategy.chooseDecloakAction = function(agent, token, decloakActions, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("decloakActions", decloakActions);
   InputValidator.validateIsFunction("callback", callback);

   const answer = ArrayUtilities.randomElement(decloakActions);

   callback(token, answer);
};

SimpleAgentStrategy.chooseModifyAttackDiceAction = function(agent, attacker, defender, modifications, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("modifications", modifications);
   InputValidator.validateIsFunction("callback", callback);

   const answer = ArrayUtilities.randomElement(modifications);
   const isAccepted = (answer !== undefined);

   callback(answer, isAccepted);
};

SimpleAgentStrategy.chooseModifyDefenseDiceAction = function(agent, attacker, defender, modifications, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("modifications", modifications);
   InputValidator.validateIsFunction("callback", callback);

   const answer = ArrayUtilities.randomElement(modifications);
   const isAccepted = (answer !== undefined);

   callback(answer, isAccepted);
};

SimpleAgentStrategy.choosePlanningActions = function(agent, tokens, tokenToValidManeuvers, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("tokens", tokens);
   InputValidator.validateNotNull("tokenToValidManeuvers", tokenToValidManeuvers);
   InputValidator.validateIsFunction("callback", callback);

   const tokenToManeuver = {};

   tokens.forEach(function(token)
   {
      const validManeuvers = tokenToValidManeuvers[token];
      tokenToManeuver[token.id()] = ArrayUtilities.randomElement(validManeuvers);
   });

   callback(tokenToManeuver);
};

SimpleAgentStrategy.chooseShipAction = function(agent, token, shipActions, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("shipActions", shipActions);
   InputValidator.validateIsFunction("callback", callback);

   const answer = ArrayUtilities.randomElement(shipActions);
   const isAccepted = (answer !== undefined);

   callback(answer, isAccepted);
};

SimpleAgentStrategy.chooseWeaponAndDefender = function(agent, attacker, choices, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("choices", choices);
   InputValidator.validateIsFunction("callback", callback);

   const weaponData = ArrayUtilities.randomElement(choices);
   const myWeapon = weaponData.weapon;

   // The first entry should be the closest.
   const rangeToDefenders = weaponData.rangeToDefenders;
   const defenders = rangeToDefenders[0].defenders;
   const weapon = myWeapon;
   const defender = defenders[0];

   callback(weapon, defender);
};

SimpleAgentStrategy.dealDamage = function(agent)
{
   InputValidator.validateNotNull("agent", agent);

   // Nothing to do.
};

SimpleAgentStrategy.name = "SimpleAgent";

export default SimpleAgentStrategy;