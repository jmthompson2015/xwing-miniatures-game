"use strict";

define(["immutable", "common/js/InputValidator", "model/js/CardAction"],
   function(Immutable, InputValidator, CardAction)
   {
      var CardReducer = {};

      CardReducer.reduce = function(state, action)
      {
         LOGGER.debug("reduce() type = " + action.type);

         var newTokenIdToData;

         switch (action.type)
         {
            case CardAction.ADD_COUNT:
            case CardAction.SET_COUNT:
               // LOGGER.info("ADD_COUNT || SET_COUNT: token = " + action.token + " property = " + action.property + " value = " + action.key);
               var newTokenIdToCounts = CardReducer.tokenIdToCounts(state.tokenIdToCounts, action);
               return Object.assign(
               {}, state,
               {
                  tokenIdToCounts: newTokenIdToCounts,
               });
            case CardAction.ADD_SECONDARY_WEAPON:
            case CardAction.REMOVE_SECONDARY_WEAPON:
               newTokenIdToData = CardReducer.tokenIdToArray(state.tokenIdToSecondaryWeapons, action.type, action.token.id(), action.weapon);
               return Object.assign(
               {}, state,
               {
                  tokenIdToSecondaryWeapons: newTokenIdToData,
               });
            case CardAction.ADD_TOKEN_CRITICAL_DAMAGE:
            case CardAction.REMOVE_TOKEN_CRITICAL_DAMAGE:
               newTokenIdToData = CardReducer.tokenIdToArray(state.tokenIdToCriticalDamages, action.type, action.token.id(), action.damageKey);
               return Object.assign(
               {}, state,
               {
                  tokenIdToCriticalDamages: newTokenIdToData,
               });
            case CardAction.ADD_TOKEN_DAMAGE:
            case CardAction.REMOVE_TOKEN_DAMAGE:
               newTokenIdToData = CardReducer.tokenIdToArray(state.tokenIdToDamages, action.type, action.token.id(), action.damageKey);
               return Object.assign(
               {}, state,
               {
                  tokenIdToDamages: newTokenIdToData,
               });
            case CardAction.ADD_TOKEN_UPGRADE:
            case CardAction.REMOVE_TOKEN_UPGRADE:
               newTokenIdToData = CardReducer.tokenIdToArray(state.tokenIdToUpgrades, action.type, action.token.id(), action.upgradeKey);
               return Object.assign(
               {}, state,
               {
                  tokenIdToUpgrades: newTokenIdToData,
               });
            case CardAction.ADD_TOKEN_UPGRADE_ENERGY:
            case CardAction.SET_TOKEN_UPGRADE_ENERGY:
               var newTokenIdToUpgradeEnergy = CardReducer.tokenIdToUpgradeEnergy(state.tokenIdToUpgradeEnergy, action);
               return Object.assign(
               {}, state,
               {
                  tokenIdToUpgradeEnergy: newTokenIdToUpgradeEnergy,
               });
            case CardAction.ADD_TOKEN_USED_ABILITY:
            case CardAction.CLEAR_TOKEN_USED_ABILITIES:
            case CardAction.REMOVE_TOKEN_USED_ABILITY:
               newTokenIdToData = CardReducer.tokenIdToArray(state.tokenIdToUsedAbilities, action.type, action.token.id(), action.ability);
               return Object.assign(
               {}, state,
               {
                  tokenIdToUsedAbilities: newTokenIdToData,
               });
            case CardAction.ADD_TOKEN_USED_PER_ROUND_ABILITY:
            case CardAction.CLEAR_TOKEN_USED_PER_ROUND_ABILITIES:
            case CardAction.REMOVE_TOKEN_USED_PER_ROUND_ABILITY:
               newTokenIdToData = CardReducer.tokenIdToArray(state.tokenIdToUsedPerRoundAbilities, action.type, action.token.id(), action.ability);
               return Object.assign(
               {}, state,
               {
                  tokenIdToUsedPerRoundAbilities: newTokenIdToData,
               });
            case CardAction.INCREMENT_NEXT_TOKEN_ID:
               return Object.assign(
               {}, state,
               {
                  nextTokenId: state.nextTokenId + 1,
               });
            case CardAction.SET_PRIMARY_WEAPON:
               var newTokenIdToPrimaryWeapon = state.tokenIdToPrimaryWeapon.set(action.token.id(), action.weapon);
               return Object.assign(
               {}, state,
               {
                  tokenIdToPrimaryWeapon: newTokenIdToPrimaryWeapon,
               });
            case CardAction.SET_TOKEN:
               // LOGGER.info("SET_TOKEN: payload = " + JSON.stringify(action.payload));
               var newTokens = state.tokens.set(action.payload.get("id"), action.payload);
               return Object.assign(
               {}, state,
               {
                  tokens: newTokens,
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

      CardReducer.tokenIdToArray = function(state, actionType, actionTokenId, actionData)
      {
         InputValidator.validateNotNull("state", state);
         InputValidator.validateNotNull("actionType", actionType);
         InputValidator.validateIsNumber("actionTokenId", actionTokenId);
         // actionData optional.

         LOGGER.debug("CardReducer.tokenIdToArray() type = " + actionType);

         var newArray, oldArray;

         switch (actionType)
         {
            case CardAction.ADD_SECONDARY_WEAPON:
            case CardAction.ADD_TOKEN_CRITICAL_DAMAGE:
            case CardAction.ADD_TOKEN_DAMAGE:
            case CardAction.ADD_TOKEN_UPGRADE:
            case CardAction.ADD_TOKEN_USED_ABILITY:
            case CardAction.ADD_TOKEN_USED_PER_ROUND_ABILITY:
               oldArray = state.get(actionTokenId);
               newArray = (oldArray ? oldArray : Immutable.List());
               newArray = newArray.push(actionData);
               return state.set(actionTokenId, newArray);
            case CardAction.CLEAR_TOKEN_USED_ABILITIES:
            case CardAction.CLEAR_TOKEN_USED_PER_ROUND_ABILITIES:
               return state.set(actionTokenId, Immutable.List());
            case CardAction.REMOVE_SECONDARY_WEAPON:
            case CardAction.REMOVE_TOKEN_CRITICAL_DAMAGE:
            case CardAction.REMOVE_TOKEN_DAMAGE:
            case CardAction.REMOVE_TOKEN_UPGRADE:
            case CardAction.REMOVE_TOKEN_USED_ABILITY:
            case CardAction.REMOVE_TOKEN_USED_PER_ROUND_ABILITY:
               oldArray = state.get(actionTokenId);
               newArray = (oldArray ? oldArray : Immutable.List());
               var index = newArray.indexOf(actionData);
               newArray = newArray.delete(index);
               return state.set(actionTokenId, newArray);
            default:
               LOGGER.warn("CardReducer.tokenIdToArray: Unhandled action type: " + actionType);
               return state;
         }
      };

      CardReducer.tokenIdToCounts = function(state, action)
      {
         LOGGER.debug("tokenIdToCounts() type = " + action.type);

         switch (action.type)
         {
            case CardAction.ADD_COUNT:
            case CardAction.SET_COUNT:
               var oldTokenIdToCounts = (state.get(action.token.id()) ? state.get(action.token.id()) : Immutable.Map());
               return state.set(action.token.id(), CardReducer.counts(oldTokenIdToCounts, action));
            default:
               LOGGER.warn("CardReducer.tokenIdToCounts: Unhandled action type: " + action.type);
               return state;
         }
      };

      CardReducer.tokenIdToUpgradeEnergy = function(state, action)
      {
         LOGGER.debug("tokenIdToUpgradeEnergy() type = " + action.type);

         switch (action.type)
         {
            case CardAction.ADD_TOKEN_UPGRADE_ENERGY:
            case CardAction.SET_TOKEN_UPGRADE_ENERGY:
               var oldTokenIdToUpgradeEnergy = (state.get(action.token.id()) ? state.get(action.token.id()) : Immutable.Map());
               return state.set(action.token.id(), CardReducer.upgradeEnergy(oldTokenIdToUpgradeEnergy, action));
            default:
               LOGGER.warn("CardReducer.tokenIdToUpgradeEnergy: Unhandled action type: " + action.type);
               return state;
         }
      };

      CardReducer.upgradeEnergy = function(state, action)
      {
         LOGGER.debug("upgradeEnergy() type = " + action.type);

         switch (action.type)
         {
            case CardAction.ADD_TOKEN_UPGRADE_ENERGY:
               var oldValue = (state.get(action.property) ? state.get(action.property) : 0);
               return state.set(action.upgradeKey, Math.max(oldValue + action.key, 0));
            case CardAction.SET_TOKEN_UPGRADE_ENERGY:
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
