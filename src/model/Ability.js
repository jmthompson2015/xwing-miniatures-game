/*
 * @param source One of [DamageCard, PilotCard, ShipAction, UpgradeCard].
 * @param sourceKey Damage, pilot, ship action, or upgrade key.
 * @param type One of [DamageAbilityX, PilotAbilityX, ShipActionAbility, UpgradeAbilityX].
 * @param abilityKey Ability key.
 */
import InputValidator from "../utility/InputValidator.js";

import DamageCard from "../artifact/DamageCard.js";
import PilotCard from "../artifact/PilotCard.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

function Ability(source, sourceKey, abilityType, abilityKey, context)
{
   InputValidator.validateNotNull("source", source);
   InputValidator.validateNotNull("sourceKey", sourceKey);
   InputValidator.validateNotNull("abilityType", abilityType);
   InputValidator.validateNotNull("abilityKey", abilityKey);
   // context optional.

   this.source = function()
   {
      return source;
   };

   this.sourceKey = function()
   {
      return sourceKey;
   };

   this.abilityType = function()
   {
      return abilityType;
   };

   this.abilityKey = function()
   {
      return abilityKey;
   };

   this.context = function()
   {
      return context;
   };

   var sourceObject = source.properties[sourceKey];

   this.sourceObject = function()
   {
      return sourceObject;
   };

   var myAbility = (abilityType[abilityKey] !== undefined ? abilityType[abilityKey][sourceKey] : undefined);

   this.ability = function()
   {
      return myAbility;
   };
}

Ability.prototype.condition = function()
{
   var myAbility = this.ability();

   return (myAbility !== undefined ? myAbility.condition : undefined);
};

Ability.prototype.conditionPasses = function(store, token)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("token", token);

   var condition = this.condition();

   return condition(store, token, this.context());
};

Ability.prototype.consequent = function()
{
   var myAbility = this.ability();
   var myConsequent = (myAbility !== undefined ? myAbility.consequent : undefined);

   return (myConsequent !== undefined ? myConsequent.bind(myAbility) : undefined);
};

Ability.prototype.executeConsequent = function(store, callback)
{
   InputValidator.validateNotNull("store", store);
   // callback optional.

   var consequent = this.consequent();

   return consequent(store, this.context(), callback);
};

Ability.prototype.isDamage = function()
{
   return this.source() === DamageCard;
};

Ability.prototype.isPilotCard = function()
{
   return this.source() === PilotCard;
};

Ability.prototype.isShipAction = function()
{
   return this.source() === ShipAction;
};

Ability.prototype.isUpgrade = function()
{
   return this.source() === UpgradeCard;
};

Ability.prototype.toString = function()
{
   var answer = "Ability ";

   answer += "source=" + this.source().toString();
   answer += ",sourceKey=" + this.sourceKey();
   answer += ",abilityType=" + this.abilityType().toString();
   answer += ",abilityKey=" + this.abilityKey();
   answer += ",context=" + JSON.stringify(this.context());

   return answer;
};

Ability.prototype.usedAbilities = function(token)
{
   InputValidator.validateNotNull("token", token);

   var answer;

   if (token.activationState !== undefined)
   {
      var state = token.store().getState();
      var source = this.source();

      switch (source)
      {
         case DamageCard:
            answer = state.tokenIdToUsedDamages[token.id()];
            break;
         case PilotCard:
            answer = state.tokenIdToUsedPilotCards[token.id()];
            break;
         case UpgradeCard:
            answer = state.tokenIdToUsedUpgrades[token.id()];
            break;
         default:
            throw "Unknown source: " + source + " " + (typeof source);
      }
   }

   return answer;
};

export default Ability;