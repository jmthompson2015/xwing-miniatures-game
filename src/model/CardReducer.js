import InputValidator from "../utility/InputValidator.js";

import CardAction from "./CardAction.js";

const CardReducer = {};

CardReducer.reduce = function(state, action)
{
   LOGGER.debug("CardReducer.reduce() type = " + action.type);

   let cardId, damageId, index, upgradeId;
   let oldDamages, oldUpgrades;
   let newCardIdToData;

   switch (action.type)
   {
      case CardAction.ADD_COUNT:
      case CardAction.SET_COUNT:
         // LOGGER.info("ADD_COUNT || SET_COUNT: cardInstance = " + action.cardInstance + " property = " + action.property + " value = " + action.key);
         const newCardIdToCounts = CardReducer.cardIdToCounts(state.cardCounts, action);
         return Object.assign(
         {}, state,
         {
            cardCounts: newCardIdToCounts,
         });
      case CardAction.ADD_DAMAGE:
         cardId = action.cardInstance.id();
         oldDamages = (state.cardDamages.get(cardId) !== undefined ? state.cardDamages.get(cardId) : Immutable.List());
         return Object.assign(
         {}, state,
         {
            cardDamages: state.cardDamages.set(cardId, oldDamages.push(action.damageInstance.id())),
         });
      case CardAction.ADD_UPGRADE:
         cardId = action.cardInstance.id();
         oldUpgrades = (state.cardUpgrades.get(cardId) !== undefined ? state.cardUpgrades.get(cardId) : Immutable.List());
         return Object.assign(
         {}, state,
         {
            cardUpgrades: state.cardUpgrades.set(cardId, oldUpgrades.push(action.upgradeInstance.id())),
         });
      case CardAction.ADD_USED_ABILITY:
      case CardAction.CLEAR_USED_ABILITIES:
      case CardAction.REMOVE_USED_ABILITY:
         newCardIdToData = CardReducer.cardIdToArray(state.cardUsedAbilities, action.type, action.cardInstance.id(), action.ability);
         return Object.assign(
         {}, state,
         {
            cardUsedAbilities: newCardIdToData,
         });
      case CardAction.ADD_USED_PER_ROUND_ABILITY:
      case CardAction.CLEAR_USED_PER_ROUND_ABILITIES:
      case CardAction.REMOVE_USED_PER_ROUND_ABILITY:
         newCardIdToData = CardReducer.cardIdToArray(state.cardUsedPerRoundAbilities, action.type, action.cardInstance.id(), action.ability);
         return Object.assign(
         {}, state,
         {
            cardUsedPerRoundAbilities: newCardIdToData,
         });
      case CardAction.INCREMENT_NEXT_CARD_ID:
         return Object.assign(
         {}, state,
         {
            nextCardId: state.nextCardId + 1,
         });
      case CardAction.REMOVE_DAMAGE:
         cardId = action.cardInstance.id();
         damageId = action.damageInstance.id();
         oldDamages = (state.cardDamages.get(cardId) ? state.cardDamages.get(cardId) : Immutable.List());
         index = oldDamages.indexOf(damageId);
         const newDamages = (index >= 0 ? oldDamages.delete(index) : oldDamages);
         return Object.assign(
         {}, state,
         {
            cardDamages: state.cardDamages.set(cardId, newDamages),
         });
      case CardAction.REMOVE_UPGRADE:
         cardId = action.cardInstance.id();
         upgradeId = action.upgradeInstance.id();
         oldUpgrades = (state.cardUpgrades.get(cardId) ? state.cardUpgrades.get(cardId) : Immutable.List());
         index = oldUpgrades.indexOf(upgradeId);
         const newUpgrades = (index >= 0 ? oldUpgrades.delete(index) : oldUpgrades);
         return Object.assign(
         {}, state,
         {
            cardUpgrades: state.cardUpgrades.set(cardId, newUpgrades),
         });
      case CardAction.SET_CARD_INSTANCE:
         // LOGGER.info("SET_TOKEN: payload = " + JSON.stringify(action.payload));
         const newCards = state.cardInstances.set(action.payload.get("id"), action.payload);
         return Object.assign(
         {}, state,
         {
            cardInstances: newCards,
         });
      case CardAction.SET_FACE_UP:
         return Object.assign(
         {}, state,
         {
            cardIsFaceUp: state.cardIsFaceUp.set(action.cardInstance.id(), action.isFaceUp),
         });
      default:
         LOGGER.warn("CardReducer.reduce: Unhandled action type: " + action.type);
         return state;
   }
};

CardReducer.counts = function(state, action)
{
   LOGGER.debug("counts() type = " + action.type);

   switch (action.type)
   {
      case CardAction.ADD_COUNT:
         const oldValue = (state.get(action.property) ? state.get(action.property) : 0);
         return state.set(action.property, Math.max(oldValue + action.key, 0));
      case CardAction.SET_COUNT:
         return state.set(action.property, action.key);
      default:
         LOGGER.warn("CardReducer.counts: Unhandled action type: " + action.type);
         return state;
   }
};

CardReducer.cardIdToArray = function(state, actionType, actionTokenId, actionData)
{
   InputValidator.validateNotNull("state", state);
   InputValidator.validateNotNull("actionType", actionType);
   InputValidator.validateIsNumber("actionTokenId", actionTokenId);
   // actionData optional.

   LOGGER.debug("CardReducer.cardIdToArray() type = " + actionType);

   let newArray, oldArray;

   switch (actionType)
   {
      case CardAction.ADD_DAMAGE:
      case CardAction.ADD_UPGRADE:
      case CardAction.ADD_USED_ABILITY:
      case CardAction.ADD_USED_PER_ROUND_ABILITY:
         oldArray = state.get(actionTokenId);
         newArray = (oldArray ? oldArray : Immutable.List());
         newArray = newArray.push(actionData);
         return state.set(actionTokenId, newArray);
      case CardAction.CLEAR_USED_ABILITIES:
      case CardAction.CLEAR_USED_PER_ROUND_ABILITIES:
         return state.set(actionTokenId, Immutable.List());
      case CardAction.REMOVE_DAMAGE:
      case CardAction.REMOVE_UPGRADE:
      case CardAction.REMOVE_USED_ABILITY:
      case CardAction.REMOVE_USED_PER_ROUND_ABILITY:
         oldArray = state.get(actionTokenId);
         newArray = (oldArray ? oldArray : Immutable.List());
         const index = newArray.indexOf(actionData);
         newArray = newArray.delete(index);
         return state.set(actionTokenId, newArray);
      default:
         LOGGER.warn("CardReducer.cardIdToArray: Unhandled action type: " + actionType);
         return state;
   }
};

CardReducer.cardIdToCounts = function(state, action)
{
   LOGGER.debug("cardCounts() type = " + action.type);

   switch (action.type)
   {
      case CardAction.ADD_COUNT:
      case CardAction.SET_COUNT:
         const oldTokenIdToCounts = (state.get(action.cardInstance.id()) ? state.get(action.cardInstance.id()) : Immutable.Map());
         return state.set(action.cardInstance.id(), CardReducer.counts(oldTokenIdToCounts, action));
      default:
         LOGGER.warn("CardReducer.cardIdToCounts: Unhandled action type: " + action.type);
         return state;
   }
};

if (Object.freeze)
{
   Object.freeze(CardReducer);
}

export default CardReducer;