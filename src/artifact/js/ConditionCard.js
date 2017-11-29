"use strict";

define(["artifact/js/CardType"], function(CardType)
{
   var ConditionCard = {
      FANATICAL_DEVOTION: "fanaticalDevotion",
      ILL_SHOW_YOU_THE_DARK_SIDE: "illShowYouTheDarkSide",

      properties:
      {
         "fanaticalDevotion":
         {
            name: "Fanatical Devotion",
            description: "When defending, you cannot spend focus tokens. When attacking, if you spend a focus token to change all focus results to hit results, set aside the first focus result that you change. The set-aside hit result cannot be canceled by defense dice, but the defender may cancel critical hit results before it.",
            key: "fanaticalDevotion",
         },
         "illShowYouTheDarkSide":
         {
            name: "I'll Show You the Dark Side",
            description: "When this card is assigned, if it is not already in play, the player who assigned it searches the Damage deck for 1 Damage card with the PilotCard trait and may place it faceup on this card. Then shuffle the damage deck. When you suffer critical damage during an attack, you are instead dealt the chosen faceup Damage card. When there is no Damage card on this card, remove it.",
            key: "illShowYouTheDarkSide",
         },
      },
   };

   ConditionCard.keys = function()
   {
      return Object.keys(ConditionCard.properties);
   };

   ConditionCard.values = function()
   {
      return Object.values(ConditionCard.properties);
   };

   ConditionCard.keys().forEach(function(upgradeKey)
   {
      var condition = ConditionCard.properties[upgradeKey];
      condition.cardTypeKey = CardType.CONDITION;
      condition.xwingType = ConditionCard;
   });

   //////////////////////////////////////////////////////////////////////////
   // Utility methods.

   ConditionCard.toString = function()
   {
      return "ConditionCard";
   };

   if (Object.freeze)
   {
      Object.freeze(ConditionCard);
   }

   return ConditionCard;
});
