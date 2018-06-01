import InputValidator from "../utility/InputValidator.js";

import CardType from "./CardType.js";

var ConditionCard = {
   A_DEBT_TO_PAY: "aDebtToPay",
   FANATICAL_DEVOTION: "fanaticalDevotion",
   HARPOONED: "harpooned",
   ILL_SHOW_YOU_THE_DARK_SIDE: "illShowYouTheDarkSide",
   MIMICKED: "mimicked",
   RATTLED: "rattled",
   SHADOWED: "shadowed",
   SUPPRESSIVE_FIRE: "suppressiveFire",

   properties:
   {
      "aDebtToPay":
      {
         name: "A Debt to Pay",
         isUnique: true,
         description: "When attacking a ship that has the \"A Score to Settle\" Upgrade card, you may change 1 [Focus] result to a [Critical Hit] result.",
         image: "conditions/a-debt-to-pay.png",
         wave: "10",
         key: "aDebtToPay",
      },
      "fanaticalDevotion":
      {
         name: "Fanatical Devotion",
         isUnique: true,
         description: "When defending, you cannot spend focus tokens.<br /><br />When attacking, if you spend a focus token to change all [Focus] results to [Hit] results, set aside the first [Focus] result that you change. The set-aside [Hit] result cannot be canceled by defense dice, but the defender may cancel [Critical Hit] results before it.<br /><br />During the End phase, remove this card.",
         image: "conditions/fanatical-devotion.png",
         wave: "10",
         key: "fanaticalDevotion",
      },
      "harpooned":
      {
         name: "Harpooned!",
         description: "When you are hit by an attack, if there is at least 1 uncancelled [Critical Hit] result, each other ship at range 1 suffers 1 damage. Then discard this card and receive one facedown Damage card.<br /><br />When you are destroyed, each ship at Range 1 of you suffers 1 damage.<br /><br /><strong>Action:</strong> Discard this card. Then roll 1 attack die. On a [Hit] or [Critical Hit] result, suffer 1 damage.",
         image: "conditions/harpooned.png",
         wave: "Aces",
         key: "harpooned",
      },
      "illShowYouTheDarkSide":
      {
         name: "I\'ll Show You the Dark Side",
         isUnique: true,
         description: "When this card is assigned, if it is not already in play, the player who assigned it searches the Damage deck for 1 Damage card with the <strong>Pilot</strong> trait and may place it faceup on this card. Then shuffle the damage deck.<br /><br />When you suffer critical damage during an attack, you are instead dealt the chosen faceup Damage card.<br /><br />When there is no Damage card on this card, remove it.",
         image: "conditions/ill-show-you-the-dark-side.png",
         wave: "10",
         key: "illShowYouTheDarkSide",
      },
      "mimicked":
      {
         name: "Mimicked",
         isUnique: true,
         description: "\"Thweek\" is treated as having your pilot ability.<br /><br />\"Thweek\" cannot apply a Condition card by using your pilot ability.<br /><br />\"Thweek\" does not lose your pilot ability if you are destroyed.",
         image: "conditions/mimicked.png",
         wave: "Aces",
         key: "mimicked",
      },
      "rattled":
      {
         name: "Rattled",
         isUnique: true,
         description: "When you suffer damage from a bomb, you suffer 1 additional critical damage. Then, remove this card.<br /><br /><strong>Action:</strong> Roll 1 attack die. On a [Focus] or [Hit] result, remove this card.",
         image: "conditions/rattled.png",
         wave: "13",
         key: "rattled",
      },
      "shadowed":
      {
         name: "Shadowed",
         isUnique: true,
         description: "\"Thweek\" is treated as having the pilot skill value you had after setup.<br /><br />This pilot skill value of \"Thweek\" does not change if your pilot skill value changes or you are destroyed.",
         image: "conditions/shadowed.png",
         wave: "Aces",
         key: "shadowed",
      },
      "suppressiveFire":
      {
         name: "Suppressive Fire",
         isUnique: true,
         description: "When attacking a ship other than \"Captain Rex,\" roll 1 fewer attack die.<br /><br />When you declare an attack targeting \"Captain Rex\" or when \"Captain Rex\" is destroyed, remove this card.<br /><br />At the end of the Combat phase, if \"Captain Rex\" did not perform an attack this phase, remove this card.",
         image: "conditions/suppressive-fire.png",
         wave: "10",
         key: "suppressiveFire",
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

ConditionCard.getName = function(conditionKey)
{
   InputValidator.validateNotNull("conditionKey", conditionKey);

   var condition = ConditionCard.properties[conditionKey];
   var answer = "";
   answer += (condition.isUnique ? "\u2022 " : ""); // bullet
   answer += condition.name;

   return answer;
};

ConditionCard.toString = function()
{
   return "ConditionCard";
};

if (Object.freeze)
{
   Object.freeze(ConditionCard);
}

export default ConditionCard;