"use strict";

define(["utility/InputValidator", "artifact/CardType", "artifact/ConditionCard", "artifact/DamageCard", "artifact/PilotCard", "artifact/UpgradeCard"],
   function(InputValidator, CardType, ConditionCard, DamageCard, PilotCard, UpgradeCard)
   {
      var CardResolver = {};

      CardResolver.resolve = function(cardTypeKey, cardKey)
      {
         InputValidator.validateIsString("cardTypeKey", cardTypeKey);
         InputValidator.validateIsString("cardKey", cardKey);

         var cardClass;

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

      return CardResolver;
   });
