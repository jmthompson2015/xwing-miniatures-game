/*
 * Provides upgrade abilities for the End Phase.
 */
import InputValidator from "../utility/InputValidator.js";

import AttackDiceValue from "../artifact/AttackDiceValue.js";
import Phase from "../artifact/Phase.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

// import Action from "./Action.js";
import AttackDice from "./AttackDice.js";
import CardAction from "./CardAction.js";

var UpgradeAbility4 = {};

////////////////////////////////////////////////////////////////////////
UpgradeAbility4[Phase.END_START] = {};

UpgradeAbility4[Phase.END_START][UpgradeCard.PULSED_RAY_SHIELD] = {
   // During the End phase, you may receive 1 ion token to recover 1 shield (up to your shield value). You can equip this upgrade only if your shield value is "1".
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.shieldCount() < token.shieldValue();
   },
   consequent: function(store, token, callback)
   {
      store.dispatch(CardAction.addIonCount(token));
      token.recoverShield();
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility4[Phase.END_CLEAN_UP] = {};

UpgradeAbility4[Phase.END_CLEAN_UP][UpgradeCard.QUANTUM_STORM] = {
   // At the start of the End phase, if you have 1 or fewer energy tokens, gain 1 energy token.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.energyCount() <= 1;
   },
   consequent: function(store, token, callback)
   {
      store.dispatch(CardAction.addEnergyCount(token));
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility4[Phase.END_ROUND_END] = {};

UpgradeAbility4[Phase.END_ROUND_END][UpgradeCard.CLOAKING_DEVICE] = {
   // Action: Perform a free cloak action. At the end of each round, if you are cloaked, roll 1 attack die. On a focus result, discard this card, then decloak or discard your cloak token.
   condition: function(store, token)
   {
      var upgradeKey = UpgradeCard.CLOAKING_DEVICE;
      return isActiveCardInstance(store, token) && token.isCloaked() && token.isPerRoundAbilityUsed(UpgradeCard, upgradeKey);
   },
   consequent: function(store, token, callback)
   {
      if (AttackDice.rollRandomValue() === AttackDiceValue.FOCUS)
      {
         var upgradeKey = UpgradeCard.CLOAKING_DEVICE;
         token.discardUpgrade(upgradeKey);

         var agent = token.agent();
         var environment = store.getState().environment;
         var adjudicator = store.getState().adjudicator;
         var shipActions0 = [ShipAction.DECLOAK];
         var that = this;
         var finishCallback = function(shipActionAbility)
         {
            that.finishConsequent(store, token, shipActionAbility, callback);
         };
         agent.getShipAction(environment, adjudicator, token, finishCallback, shipActions0);

         // Wait for agent to respond.
      }
      else
      {
         callback();
      }
   },
   finishConsequent: function(store, token, shipActionAbility, callback)
   {
      store.dispatch(CardAction.addIonCount(token));
      if (shipActionAbility)
      {
         var consequent = shipActionAbility.consequent();
         consequent(store, token, callback, shipActionAbility.context());
      }
      else
      {
         callback();
      }
   },
};

////////////////////////////////////////////////////////////////////////
function getActiveCardInstance(store)
{
   InputValidator.validateNotNull("store", store);

   var environment = store.getState().environment;

   return environment.activeCardInstance();
}

function isActiveCardInstance(store, token)
{
   var activeToken = getActiveCardInstance(store);

   return token.equals(activeToken);
}

UpgradeAbility4.toString = function()
{
   return "model/UpgradeAbility4";
};

if (Object.freeze)
{
   Object.freeze(UpgradeAbility4);
}

export default UpgradeAbility4;