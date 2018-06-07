import InputValidator from "../utility/InputValidator.js";

import CardType from "./CardType.js";
import ConditionCard from "./ConditionCard.js";
import DamageCard from "./DamageCard.js";
import PilotCard from "./PilotCard.js";
import UpgradeCard from "./UpgradeCard.js";

const CardResolver = {};

CardResolver.resolve = function(cardTypeKey, cardKey)
{
   InputValidator.validateIsString("cardTypeKey", cardTypeKey);
   InputValidator.validateIsString("cardKey", cardKey);

   let cardClass;

   switch (cardTypeKey)
   {
      case CardType.CONDITION:
         cardClass = ConditionCard;
         break;
      case CardType.DAMAGE:
         cardClass = DamageCard;
         break;
      case CardType.PILOT:
         cardClass = PilotCard;
         break;
      case CardType.UPGRADE:
         cardClass = UpgradeCard;
         break;
      default:
         throw "Unknown cardTypeKey: " + cardTypeKey;
   }

   return cardClass.properties[cardKey];
};

if (Object.freeze)
{
   Object.freeze(CardResolver);
}

export default CardResolver;