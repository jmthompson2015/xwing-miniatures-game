"use strict";

define(["immutable", "common/js/InputValidator", "model/js/CardAction"],
   function(Immutable, InputValidator, CardAction)
   {
      var CardReducer = {};

      CardReducer.reduce = function(state, action)
      {
         LOGGER.debug("CardReducer.reduce() type = " + action.type);

         var newCardIdToData;

         switch (action.type)
         {
            case CardAction.ADD_COUNT:
            case CardAction.SET_COUNT:
               // LOGGER.info("ADD_COUNT || SET_COUNT: cardInstance = " + action.cardInstance + " property = " + action.property + " value = " + action.key);
               var newCardIdToCounts = CardReducer.cardIdToCounts(state.cardCounts, action);
               return Object.assign(
               {}, state,
               {
                  cardCounts: newCardIdToCounts,
               });
            case CardAction.ADD_SECONDARY_WEAPON:
            case CardAction.REMOVE_SECONDARY_WEAPON:
               newCardIdToData = CardReducer.cardIdToArray(state.cardSecondaryWeapons, action.type, action.cardInstance.id(), action.weapon);
               return Object.assign(
               {}, state,
               {
                  cardSecondaryWeapons: newCardIdToData,
               });
            case CardAction.ADD_CRITICAL_DAMAGE:
            case CardAction.REMOVE_CRITICAL_DAMAGE:
               newCardIdToData = CardReducer.cardIdToArray(state.cardCriticalDamages, action.type, action.cardInstance.id(), action.damageKey);
               return Object.assign(
               {}, state,
               {
                  cardCriticalDamages: newCardIdToData,
               });
            case CardAction.ADD_DAMAGE:
            case CardAction.REMOVE_DAMAGE:
               newCardIdToData = CardReducer.cardIdToArray(state.cardDamages, action.type, action.cardInstance.id(), action.damageKey);
               return Object.assign(
               {}, state,
               {
                  cardDamages: newCardIdToData,
               });
            case CardAction.ADD_UPGRADE:
            case CardAction.REMOVE_UPGRADE:
               newCardIdToData = CardReducer.cardIdToArray(state.cardUpgrades, action.type, action.cardInstance.id(), action.upgradeKey);
               return Object.assign(
               {}, state,
               {
                  cardUpgrades: newCardIdToData,
               });
            case CardAction.ADD_UPGRADE_ENERGY:
            case CardAction.SET_UPGRADE_ENERGY:
               var newCardUpgradeEnergy = CardReducer.cardUpgradeEnergy(state.cardUpgradeEnergy, action);
               return Object.assign(
               {}, state,
               {
                  cardUpgradeEnergy: newCardUpgradeEnergy,
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
            case CardAction.SET_PRIMARY_WEAPON:
               var newCardPrimaryWeapon = state.cardPrimaryWeapon.set(action.cardInstance.id(), action.weapon);
               return Object.assign(
               {}, state,
               {
                  cardPrimaryWeapon: newCardPrimaryWeapon,
               });
            case CardAction.SET_CARD_INSTANCE:
               // LOGGER.info("SET_TOKEN: payload = " + JSON.stringify(action.payload));
               var newCards = state.cardInstances.set(action.payload.get("id"), action.payload);
               return Object.assign(
               {}, state,
               {
                  cardInstances: newCards,
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
               var oldValue = (state.get(action.property) ? state.get(action.property) : 0);
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

         var newArray, oldArray;

         switch (actionType)
         {
            case CardAction.ADD_SECONDARY_WEAPON:
            case CardAction.ADD_CRITICAL_DAMAGE:
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
            case CardAction.REMOVE_SECONDARY_WEAPON:
            case CardAction.REMOVE_CRITICAL_DAMAGE:
            case CardAction.REMOVE_DAMAGE:
            case CardAction.REMOVE_UPGRADE:
            case CardAction.REMOVE_USED_ABILITY:
            case CardAction.REMOVE_USED_PER_ROUND_ABILITY:
               oldArray = state.get(actionTokenId);
               newArray = (oldArray ? oldArray : Immutable.List());
               var index = newArray.indexOf(actionData);
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
               var oldTokenIdToCounts = (state.get(action.cardInstance.id()) ? state.get(action.cardInstance.id()) : Immutable.Map());
               return state.set(action.cardInstance.id(), CardReducer.counts(oldTokenIdToCounts, action));
            default:
               LOGGER.warn("CardReducer.cardIdToCounts: Unhandled action type: " + action.type);
               return state;
         }
      };

      CardReducer.cardUpgradeEnergy = function(state, action)
      {
         LOGGER.debug("cardUpgradeEnergy() type = " + action.type);

         switch (action.type)
         {
            case CardAction.ADD_UPGRADE_ENERGY:
            case CardAction.SET_UPGRADE_ENERGY:
               var oldTokenIdToUpgradeEnergy = (state.get(action.cardInstance.id()) ? state.get(action.cardInstance.id()) : Immutable.Map());
               return state.set(action.cardInstance.id(), CardReducer.upgradeEnergy(oldTokenIdToUpgradeEnergy, action));
            default:
               LOGGER.warn("CardReducer.cardUpgradeEnergy: Unhandled action type: " + action.type);
               return state;
         }
      };

      CardReducer.upgradeEnergy = function(state, action)
      {
         LOGGER.debug("upgradeEnergy() type = " + action.type);

         switch (action.type)
         {
            case CardAction.ADD_UPGRADE_ENERGY:
               var oldValue = (state.get(action.property) ? state.get(action.property) : 0);
               return state.set(action.upgradeKey, Math.max(oldValue + action.key, 0));
            case CardAction.SET_UPGRADE_ENERGY:
               return state.set(action.upgradeKey, action.key);
            default:
               LOGGER.warn("CardReducer.upgradeEnergy: Unhandled action type: " + action.type);
               return state;
         }
      };

      if (Object.freeze)
      {
         Object.freeze(CardReducer);
      }

      return CardReducer;
   });
