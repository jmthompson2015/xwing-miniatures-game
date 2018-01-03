"use strict";

define(["immutable", "common/js/ArrayAugments", "model/js/EnvironmentAction"],
   function(Immutable, ArrayAugments, EnvironmentAction)
   {
      var EnvironmentReducer = {};

      EnvironmentReducer.reduce = function(state, action)
      {
         LOGGER.debug("EnvironmentReducer.reduce() type = " + action.type);

         var action2, damageId, newPositionToTokenId, newTokenIdToData, newTokens;

         switch (action.type)
         {
            case EnvironmentAction.ADD_ROUND:
               LOGGER.info("Round: " + (state.round + action.key));
               return Object.assign(
               {}, state,
               {
                  round: state.round + action.key,
               });
            case EnvironmentAction.DISCARD_DAMAGE:
               damageId = action.damageInstance.id();
               return Object.assign(
               {}, state,
               {
                  damageDiscardPile: state.damageDiscardPile.push(damageId),
               });
            case EnvironmentAction.DRAW_DAMAGE:
               damageId = action.damageInstance.id();
               var index = state.damageDeck.indexOf(damageId);
               var newDamages = (index >= 0 ? state.damageDeck.delete(index) : state.damageDeck);
               return Object.assign(
               {}, state,
               {
                  damageDeck: newDamages,
               });
            case EnvironmentAction.MOVE_TOKEN:
               var tokenId = state.positionToCardId.get(action.fromPosition.toString());
               action.id = tokenId;
               newPositionToTokenId = state.positionToCardId.delete(action.fromPosition.toString());
               newPositionToTokenId = newPositionToTokenId.set(action.toPosition.toString(), action.id);
               return Object.assign(
               {}, state,
               {
                  positionToCardId: newPositionToTokenId,
                  cardPosition: state.cardPosition.set(action.id, action.toPosition),
               });
            case EnvironmentAction.PLACE_TOKEN:
               newTokens = EnvironmentReducer.tokens(state.cardInstances, action);
               return Object.assign(
               {}, state,
               {
                  positionToCardId: state.positionToCardId.set(action.position.toString(), action.token.id()),
                  cardPosition: state.cardPosition.set(action.token.id(), action.position),
                  cardInstances: newTokens,
               });
            case EnvironmentAction.REMOVE_TOKEN:
               newTokenIdToData = state.cardPosition.delete(action.token.id());
               newTokens = EnvironmentReducer.tokens(state.cardInstances, action);
               var position = state.cardPosition.get(action.token.id());
               if (position)
               {
                  return Object.assign(
                  {}, state,
                  {
                     positionToCardId: state.positionToCardId.delete(position.toString()),
                     cardPosition: newTokenIdToData,
                     cardInstances: newTokens,
                  });
               }
               else
               {
                  return Object.assign(
                  {}, state,
                  {
                     cardPosition: newTokenIdToData,
                     cardInstances: newTokens,
                  });
               }
               return state;
            case EnvironmentAction.REMOVE_TOKEN_AT:
               // LOGGER.info("EnvironmentReducer REMOVE_TOKEN_AT state.positionToCardId[action.position] = " + state.positionToCardId[action.position]);
               tokenId = state.positionToCardId.get(action.position.toString());
               if (tokenId !== undefined)
               {
                  tokenId = parseInt(tokenId);
                  var environment = state.environment;
                  action.token = environment.getTokenById(tokenId);
                  action2 = EnvironmentAction.removeToken(action.token);
                  newTokens = EnvironmentReducer.tokens(state.cardInstances, action2);
                  return Object.assign(
                  {}, state,
                  {
                     positionToCardId: state.positionToCardId.delete(action.position.toString()),
                     cardPosition: state.cardPosition.delete(action.token.id()),
                     cardInstances: newTokens,
                  });
               }
               return state;
            case EnvironmentAction.REPLENISH_DAMAGE_DECK:
               var newDamageDeck = state.damageDiscardPile.toJS();
               newDamageDeck.xwingShuffle();
               return Object.assign(
               {}, state,
               {
                  damageDeck: Immutable.List(newDamageDeck),
                  damageDiscardPile: Immutable.List(),
               });
            case EnvironmentAction.SET_ACTIVE_TOKEN:
               LOGGER.info("Active CardInstance: " + action.token);
               return Object.assign(
               {}, state,
               {
                  activeCardId: (action.token ? action.token.id() : undefined),
               });
            case EnvironmentAction.SET_DAMAGE_DECK:
               return Object.assign(
               {}, state,
               {
                  damageDeck: Immutable.List(action.damageDeck),
               });
            case EnvironmentAction.SET_FIRST_AGENT:
               return Object.assign(
               {}, state,
               {
                  firstAgent: action.agent,
               });
            case EnvironmentAction.SET_FIRST_SQUAD:
               return Object.assign(
               {}, state,
               {
                  firstSquad: action.squad,
               });
            case EnvironmentAction.SET_PLAY_AREA_SCALE:
               return Object.assign(
               {}, state,
               {
                  playAreaScale: action.scale,
               });
            case EnvironmentAction.SET_PLAY_FORMAT:
               return Object.assign(
               {}, state,
               {
                  playFormatKey: action.playFormatKey,
               });
            case EnvironmentAction.SET_SECOND_AGENT:
               return Object.assign(
               {}, state,
               {
                  secondAgent: action.agent,
               });
            case EnvironmentAction.SET_SECOND_SQUAD:
               return Object.assign(
               {}, state,
               {
                  secondSquad: action.squad,
               });
            case EnvironmentAction.SET_TOKEN_TOUCHING:
               return Object.assign(
               {}, state,
               {
                  cardIsTouching: state.cardIsTouching.set(action.token.id(), action.isTouching),
               });
            default:
               LOGGER.warn("EnvironmentReducer.reduce: Unhandled action type: " + action.type);
               return state;
         }
      };

      EnvironmentReducer.tokens = function(state, action)
      {
         LOGGER.debug("EnvironmentReducer.tokens() type = " + action.type);

         switch (action.type)
         {
            case EnvironmentAction.PLACE_TOKEN:
               return state.set(action.token.id(), Immutable.Map(
               {
                  id: action.token.id(),
                  cardTypeKey: action.token.card().cardTypeKey,
                  cardKey: action.token.card().key,
                  agent: action.token.agent(),
                  idFore: (action.token.tokenFore ? action.token.tokenFore().id() : undefined),
                  idAft: (action.token.tokenAft ? action.token.tokenAft().id() : undefined),
               }));
            case EnvironmentAction.REMOVE_TOKEN:
               return state.delete(action.token.id());
            default:
               LOGGER.warn("EnvironmentReducer.cardInstances: Unhandled action type: " + action.type);
               return state;
         }
      };

      if (Object.freeze)
      {
         Object.freeze(EnvironmentReducer);
      }

      return EnvironmentReducer;
   });
