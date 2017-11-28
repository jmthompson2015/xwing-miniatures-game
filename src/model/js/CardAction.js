"use strict";

define(["immutable", "common/js/InputValidator", "artifact/js/Count"],
   function(Immutable, InputValidator, Count)
   {
      var CardAction = {};

      CardAction.ADD_COUNT = "addCount";
      CardAction.ADD_CRITICAL_DAMAGE = "addCriticalDamage";
      CardAction.ADD_DAMAGE = "addDamage";
      CardAction.ADD_SECONDARY_WEAPON = "addSecondaryWeapon";
      CardAction.ADD_UPGRADE = "addUpgrade";
      CardAction.ADD_UPGRADE_ENERGY = "addUpgradeEnergy";
      CardAction.ADD_USED_ABILITY = "addUsedAbility";
      CardAction.ADD_USED_PER_ROUND_ABILITY = "addUsedPerRoundAbility";
      CardAction.CLEAR_USED_ABILITIES = "clearUsedAbilities";
      CardAction.CLEAR_USED_PER_ROUND_ABILITIES = "clearUsedPerRoundAbilities";
      CardAction.INCREMENT_NEXT_CARD_ID = "incrementNextCardId";
      CardAction.REMOVE_CRITICAL_DAMAGE = "removeCriticalDamage";
      CardAction.REMOVE_DAMAGE = "removeDamage";
      CardAction.REMOVE_SECONDARY_WEAPON = "removeSecondaryWeapon";
      CardAction.REMOVE_UPGRADE = "removeUpgrade";
      CardAction.REMOVE_USED_ABILITY = "removeUsedAbility";
      CardAction.REMOVE_USED_PER_ROUND_ABILITY = "removeUsedPerRoundAbility";
      CardAction.SET_CARD_INSTANCE = "setCardInstance";
      CardAction.SET_COUNT = "setCount";
      CardAction.SET_PRIMARY_WEAPON = "setPrimaryWeapon";
      CardAction.SET_UPGRADE_ENERGY = "setUpgradeEnergy";

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

      CardAction.addCriticalDamage = function(cardInstance, damageKey)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("damageKey", damageKey);

         return (
         {
            type: CardAction.ADD_CRITICAL_DAMAGE,
            cardInstance: cardInstance,
            damageKey: damageKey,
         });
      };

      CardAction.addDamage = function(cardInstance, damageKey)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("damageKey", damageKey);

         return (
         {
            type: CardAction.ADD_DAMAGE,
            cardInstance: cardInstance,
            damageKey: damageKey,
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

      CardAction.addReinforceCount = function(cardInstance, value)
      {
         return CardAction.addCount(cardInstance, Count.REINFORCE, value);
      };

      CardAction.addSecondaryWeapon = function(cardInstance, weapon)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("weapon", weapon);

         return (
         {
            type: CardAction.ADD_SECONDARY_WEAPON,
            cardInstance: cardInstance,
            weapon: weapon,
         });
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

      CardAction.addUpgrade = function(cardInstance, upgradeKey)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("upgradeKey", upgradeKey);

         return (
         {
            type: CardAction.ADD_UPGRADE,
            cardInstance: cardInstance,
            upgradeKey: upgradeKey,
         });
      };

      CardAction.addUpgradeEnergy = function(cardInstance, upgradeKey, value)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("upgradeKey", upgradeKey);
         var myValue = (value !== undefined ? value : 1);

         return (
         {
            type: CardAction.ADD_UPGRADE_ENERGY,
            cardInstance: cardInstance,
            upgradeKey: upgradeKey,
            key: myValue,
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

      CardAction.removeCriticalDamage = function(cardInstance, damageKey)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("damageKey", damageKey);

         return (
         {
            type: CardAction.REMOVE_CRITICAL_DAMAGE,
            cardInstance: cardInstance,
            damageKey: damageKey,
         });
      };

      CardAction.removeDamage = function(cardInstance, damageKey)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("damageKey", damageKey);

         return (
         {
            type: CardAction.REMOVE_DAMAGE,
            cardInstance: cardInstance,
            damageKey: damageKey,
         });
      };

      CardAction.removeSecondaryWeapon = function(cardInstance, weapon)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("weapon", weapon);

         return (
         {
            type: CardAction.REMOVE_SECONDARY_WEAPON,
            cardInstance: cardInstance,
            weapon: weapon,
         });
      };

      CardAction.removeUpgrade = function(cardInstance, upgradeKey)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("upgradeKey", upgradeKey);

         return (
         {
            type: CardAction.REMOVE_UPGRADE,
            cardInstance: cardInstance,
            upgradeKey: upgradeKey,
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

      CardAction.setCardInstance = function(id, pilotKey, agent, idFore, idAft)
      {
         InputValidator.validateIsNumber("id", id);
         InputValidator.validateNotNull("pilotKey", pilotKey);
         InputValidator.validateNotNull("agent", agent);
         // idFore optional.
         // idAft optional.

         var payload = Immutable.Map(
         {
            id: id,
            pilotKey: pilotKey,
            agent: agent,
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

      CardAction.setPrimaryWeapon = function(cardInstance, weapon)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("weapon", weapon);

         return (
         {
            type: CardAction.SET_PRIMARY_WEAPON,
            cardInstance: cardInstance,
            weapon: weapon,
         });
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

      CardAction.setUpgradeEnergy = function(cardInstance, upgradeKey, value)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateNotNull("upgradeKey", upgradeKey);
         var myValue = (value !== undefined ? value : 0);

         return (
         {
            type: CardAction.SET_UPGRADE_ENERGY,
            cardInstance: cardInstance,
            upgradeKey: upgradeKey,
            key: myValue,
         });
      };

      CardAction.setWeaponsDisabledCount = function(cardInstance, value)
      {
         return CardAction.setCount(cardInstance, Count.WEAPONS_DISABLED, value);
      };

      return CardAction;
   });
