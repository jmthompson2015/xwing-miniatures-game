"use strict";

define(["immutable", "common/js/InputValidator", "artifact/js/Count"],
   function(Immutable, InputValidator, Count)
   {
      var CardAction = {};

      CardAction.ADD_COUNT = "addCount";
      CardAction.ADD_DAMAGE = "addDamage";
      CardAction.ADD_UPGRADE = "addUpgrade";
      CardAction.ADD_USED_ABILITY = "addUsedAbility";
      CardAction.ADD_USED_PER_ROUND_ABILITY = "addUsedPerRoundAbility";
      CardAction.CLEAR_USED_ABILITIES = "clearUsedAbilities";
      CardAction.CLEAR_USED_PER_ROUND_ABILITIES = "clearUsedPerRoundAbilities";
      CardAction.INCREMENT_NEXT_CARD_ID = "incrementNextCardId";
      CardAction.REMOVE_DAMAGE = "removeDamage";
      CardAction.REMOVE_UPGRADE = "removeUpgrade";
      CardAction.REMOVE_USED_ABILITY = "removeUsedAbility";
      CardAction.REMOVE_USED_PER_ROUND_ABILITY = "removeUsedPerRoundAbility";
      CardAction.SET_CARD_INSTANCE = "setCardInstance";
      CardAction.SET_COUNT = "setCount";
      CardAction.SET_FACE_UP = "setFaceUp";

      CardAction.addCloakCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.CLOAK, value);
      };

      CardAction.addCount = function(cardInstance, property, value)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("property", property);

         var myValue = (value !== undefined ? value : 1);

         return (
         {
            type: CardAction.ADD_COUNT,
            cardInstance: cardInstance,
            property: property,
            key: myValue,
         });
      };

      CardAction.addDamage = function(cardInstance, damageInstance)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("damageInstance", damageInstance);

         return (
         {
            type: CardAction.ADD_DAMAGE,
            cardInstance: cardInstance,
            damageInstance: damageInstance,
         });
      };

      CardAction.addEnergyCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.ENERGY, value);
      };

      CardAction.addEvadeCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.EVADE, value);
      };

      CardAction.addFocusCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.FOCUS, value);
      };

      CardAction.addIonCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.ION, value);
      };

      CardAction.addOrdnanceCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.ORDNANCE, value);
      };

      CardAction.addReinforceCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.REINFORCE, value);
      };

      CardAction.addShieldCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.SHIELD, value);
      };

      CardAction.addStressCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.STRESS, value);
      };

      CardAction.addTractorBeamCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.TRACTOR_BEAM, value);
      };

      CardAction.addUpgrade = function(cardInstance, upgradeInstance)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("upgradeInstance", upgradeInstance);

         return (
         {
            type: CardAction.ADD_UPGRADE,
            cardInstance: cardInstance,
            upgradeInstance: upgradeInstance,
         });
      };

      CardAction.addUsedAbility = function(cardInstance, ability)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("ability", ability);

         return (
         {
            type: CardAction.ADD_USED_ABILITY,
            cardInstance: cardInstance,
            ability: ability,
         });
      };

      CardAction.addUsedPerRoundAbility = function(cardInstance, ability)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("ability", ability);

         return (
         {
            type: CardAction.ADD_USED_PER_ROUND_ABILITY,
            cardInstance: cardInstance,
            ability: ability,
         });
      };

      CardAction.addWeaponsDisabledCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.WEAPONS_DISABLED, value);
      };

      CardAction.clearUsedAbilities = function(cardInstance)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);

         return (
         {
            type: CardAction.CLEAR_USED_ABILITIES,
            cardInstance: cardInstance,
         });
      };

      CardAction.clearUsedPerRoundAbilities = function(cardInstance)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);

         return (
         {
            type: CardAction.CLEAR_USED_PER_ROUND_ABILITIES,
            cardInstance: cardInstance,
         });
      };

      CardAction.incrementNextCardId = function()
      {
         return (
         {
            type: CardAction.INCREMENT_NEXT_CARD_ID,
         });
      };

      CardAction.removeDamage = function(cardInstance, damageInstance)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("damageInstance", damageInstance);

         return (
         {
            type: CardAction.REMOVE_DAMAGE,
            cardInstance: cardInstance,
            damageInstance: damageInstance,
         });
      };

      CardAction.removeUpgrade = function(cardInstance, upgradeInstance)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("upgradeInstance", upgradeInstance);

         return (
         {
            type: CardAction.REMOVE_UPGRADE,
            cardInstance: cardInstance,
            upgradeInstance: upgradeInstance,
         });
      };

      CardAction.removeUsedAbility = function(cardInstance, ability)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("ability", ability);

         return (
         {
            type: CardAction.REMOVE_USED_ABILITY,
            cardInstance: cardInstance,
            ability: ability,
         });
      };

      CardAction.removeUsedPerRoundAbility = function(cardInstance, ability)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("ability", ability);

         return (
         {
            type: CardAction.REMOVE_USED_PER_ROUND_ABILITY,
            cardInstance: cardInstance,
            ability: ability,
         });
      };

      CardAction.setCardInstance = function(id, cardTypeKey, cardKey, agent, idParent, idFore, idAft)
      {
         InputValidator.validateIsNumber("id", id);
         InputValidator.validateIsString("cardTypeKey", cardTypeKey);
         InputValidator.validateIsString("cardKey", cardKey);
         // agent optional.
         // idParent optional.
         // idFore optional.
         // idAft optional.

         var payload = Immutable.Map(
         {
            id: id,
            cardTypeKey: cardTypeKey,
            cardKey: cardKey,
            agent: agent,
            idParent: idParent,
            idFore: idFore,
            idAft: idAft,
         });

         return (
         {
            type: CardAction.SET_CARD_INSTANCE,
            payload: payload,
         });
      };

      CardAction.setCloakCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.CLOAK, value);
      };

      CardAction.setCount = function(cardInstance, property, value)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("property", property);
         var myValue = (value ? value : 0);

         return (
         {
            type: CardAction.SET_COUNT,
            cardInstance: cardInstance,
            property: property,
            key: myValue,
         });
      };

      CardAction.setEnergyCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.ENERGY, value);
      };

      CardAction.setEvadeCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.EVADE, value);
      };

      CardAction.setFocusCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.FOCUS, value);
      };

      CardAction.setIonCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.ION, value);
      };

      CardAction.setFaceUp = function(cardInstance, isFaceUp)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateIsBoolean("isFaceUp", isFaceUp);

         return (
         {
            type: CardAction.SET_FACE_UP,
            cardInstance: cardInstance,
            isFaceUp: isFaceUp,
         });
      };

      CardAction.setOrdnanceCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.ORDNANCE, value);
      };

      CardAction.setReinforceCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.REINFORCE, value);
      };

      CardAction.setShieldCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.SHIELD, value);
      };

      CardAction.setStressCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.STRESS, value);
      };

      CardAction.setTractorBeamCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.TRACTOR_BEAM, value);
      };

      CardAction.setWeaponsDisabledCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.WEAPONS_DISABLED, value);
      };

      return CardAction;
   });
