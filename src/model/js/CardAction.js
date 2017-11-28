"use strict";

define(["immutable", "common/js/InputValidator", "artifact/js/Count"],
   function(Immutable, InputValidator, Count)
   {
      var CardAction = {};

      CardAction.ADD_COUNT = "addCount";
      CardAction.ADD_SECONDARY_WEAPON = "addSecondaryWeapon";
      CardAction.ADD_TOKEN_CRITICAL_DAMAGE = "addTokenCriticalDamage";
      CardAction.ADD_TOKEN_DAMAGE = "addTokenDamage";
      CardAction.ADD_TOKEN_UPGRADE = "addTokenUpgrade";
      CardAction.ADD_TOKEN_UPGRADE_ENERGY = "addTokenUpgradeEnergy";
      CardAction.ADD_TOKEN_USED_ABILITY = "addTokenUsedAbility";
      CardAction.ADD_TOKEN_USED_PER_ROUND_ABILITY = "addTokenUsedPerRoundAbility";
      CardAction.CLEAR_TOKEN_USED_ABILITIES = "clearTokenUsedAbilities";
      CardAction.CLEAR_TOKEN_USED_PER_ROUND_ABILITIES = "clearTokenUsedPerRoundAbilities";
      CardAction.INCREMENT_NEXT_TOKEN_ID = "incrementNextTokenId";
      CardAction.REMOVE_SECONDARY_WEAPON = "removeSecondaryWeapon";
      CardAction.REMOVE_TOKEN_CRITICAL_DAMAGE = "removeTokenCriticalDamage";
      CardAction.REMOVE_TOKEN_DAMAGE = "removeTokenDamage";
      CardAction.REMOVE_TOKEN_UPGRADE = "removeTokenUpgrade";
      CardAction.REMOVE_TOKEN_USED_ABILITY = "removeTokenUsedAbility";
      CardAction.REMOVE_TOKEN_USED_PER_ROUND_ABILITY = "removeTokenUsedPerRoundAbility";
      CardAction.SET_COUNT = "setCount";
      CardAction.SET_PRIMARY_WEAPON = "setPrimaryWeapon";
      CardAction.SET_TOKEN = "setToken";
      CardAction.SET_TOKEN_UPGRADE_ENERGY = "setTokenUpgradeEnergy";

      CardAction.addCloakCount = function(token, value)
      {
         return CardAction.addCount(token, Count.CLOAK, value);
      };

      CardAction.addCount = function(token, property, value)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("property", property);

         var myValue = (value !== undefined ? value : 1);

         return (
         {
            type: CardAction.ADD_COUNT,
            token: token,
            property: property,
            key: myValue,
         });
      };

      CardAction.addEnergyCount = function(token, value)
      {
         return CardAction.addCount(token, Count.ENERGY, value);
      };

      CardAction.addEvadeCount = function(token, value)
      {
         return CardAction.addCount(token, Count.EVADE, value);
      };

      CardAction.addFocusCount = function(token, value)
      {
         return CardAction.addCount(token, Count.FOCUS, value);
      };

      CardAction.addIonCount = function(token, value)
      {
         return CardAction.addCount(token, Count.ION, value);
      };

      CardAction.addReinforceCount = function(token, value)
      {
         return CardAction.addCount(token, Count.REINFORCE, value);
      };

      CardAction.addSecondaryWeapon = function(token, weapon)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("weapon", weapon);

         return (
         {
            type: CardAction.ADD_SECONDARY_WEAPON,
            token: token,
            weapon: weapon,
         });
      };

      CardAction.addShieldCount = function(token, value)
      {
         return CardAction.addCount(token, Count.SHIELD, value);
      };

      CardAction.addStressCount = function(token, value)
      {
         return CardAction.addCount(token, Count.STRESS, value);
      };

      CardAction.addTokenCriticalDamage = function(token, damageKey)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("damageKey", damageKey);

         return (
         {
            type: CardAction.ADD_TOKEN_CRITICAL_DAMAGE,
            token: token,
            damageKey: damageKey,
         });
      };

      CardAction.addTokenDamage = function(token, damageKey)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("damageKey", damageKey);

         return (
         {
            type: CardAction.ADD_TOKEN_DAMAGE,
            token: token,
            damageKey: damageKey,
         });
      };

      CardAction.addTokenUpgrade = function(token, upgradeKey)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("upgradeKey", upgradeKey);

         return (
         {
            type: CardAction.ADD_TOKEN_UPGRADE,
            token: token,
            upgradeKey: upgradeKey,
         });
      };

      CardAction.addTokenUpgradeEnergy = function(token, upgradeKey, value)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("upgradeKey", upgradeKey);
         var myValue = (value !== undefined ? value : 1);

         return (
         {
            type: CardAction.ADD_TOKEN_UPGRADE_ENERGY,
            token: token,
            upgradeKey: upgradeKey,
            key: myValue,
         });
      };

      CardAction.addTokenUsedAbility = function(token, ability)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("ability", ability);

         return (
         {
            type: CardAction.ADD_TOKEN_USED_ABILITY,
            token: token,
            ability: ability,
         });
      };

      CardAction.addTokenUsedPerRoundAbility = function(token, ability)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("ability", ability);

         return (
         {
            type: CardAction.ADD_TOKEN_USED_PER_ROUND_ABILITY,
            token: token,
            ability: ability,
         });
      };

      CardAction.addTractorBeamCount = function(token, value)
      {
         return CardAction.addCount(token, Count.TRACTOR_BEAM, value);
      };

      CardAction.addWeaponsDisabledCount = function(token, value)
      {
         return CardAction.addCount(token, Count.WEAPONS_DISABLED, value);
      };

      CardAction.clearTokenUsedAbilities = function(token)
      {
         InputValidator.validateNotNull("token", token);

         return (
         {
            type: CardAction.CLEAR_TOKEN_USED_ABILITIES,
            token: token,
         });
      };

      CardAction.clearTokenUsedPerRoundAbilities = function(token)
      {
         InputValidator.validateNotNull("token", token);

         return (
         {
            type: CardAction.CLEAR_TOKEN_USED_PER_ROUND_ABILITIES,
            token: token,
         });
      };

      CardAction.incrementNextTokenId = function()
      {
         return (
         {
            type: CardAction.INCREMENT_NEXT_TOKEN_ID,
         });
      };

      CardAction.removeSecondaryWeapon = function(token, weapon)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("weapon", weapon);

         return (
         {
            type: CardAction.REMOVE_SECONDARY_WEAPON,
            token: token,
            weapon: weapon,
         });
      };

      CardAction.removeTokenCriticalDamage = function(token, damageKey)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("damageKey", damageKey);

         return (
         {
            type: CardAction.REMOVE_TOKEN_CRITICAL_DAMAGE,
            token: token,
            damageKey: damageKey,
         });
      };

      CardAction.removeTokenDamage = function(token, damageKey)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("damageKey", damageKey);

         return (
         {
            type: CardAction.REMOVE_TOKEN_DAMAGE,
            token: token,
            damageKey: damageKey,
         });
      };

      CardAction.removeTokenUpgrade = function(token, upgradeKey)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("upgradeKey", upgradeKey);

         return (
         {
            type: CardAction.REMOVE_TOKEN_UPGRADE,
            token: token,
            upgradeKey: upgradeKey,
         });
      };

      CardAction.removeTokenUsedAbility = function(token, ability)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("ability", ability);

         return (
         {
            type: CardAction.REMOVE_TOKEN_USED_ABILITY,
            token: token,
            ability: ability,
         });
      };

      CardAction.removeTokenUsedPerRoundAbility = function(token, ability)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("ability", ability);

         return (
         {
            type: CardAction.REMOVE_TOKEN_USED_PER_ROUND_ABILITY,
            token: token,
            ability: ability,
         });
      };

      CardAction.setCloakCount = function(token, value)
      {
         return CardAction.setCount(token, Count.CLOAK, value);
      };

      CardAction.setCount = function(token, property, value)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("property", property);
         var myValue = (value ? value : 0);

         return (
         {
            type: CardAction.SET_COUNT,
            token: token,
            property: property,
            key: myValue,
         });
      };

      CardAction.setEnergyCount = function(token, value)
      {
         return CardAction.setCount(token, Count.ENERGY, value);
      };

      CardAction.setEvadeCount = function(token, value)
      {
         return CardAction.setCount(token, Count.EVADE, value);
      };

      CardAction.setFocusCount = function(token, value)
      {
         return CardAction.setCount(token, Count.FOCUS, value);
      };

      CardAction.setIonCount = function(token, value)
      {
         return CardAction.setCount(token, Count.ION, value);
      };

      CardAction.setPrimaryWeapon = function(token, weapon)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("weapon", weapon);

         return (
         {
            type: CardAction.SET_PRIMARY_WEAPON,
            token: token,
            weapon: weapon,
         });
      };

      CardAction.setReinforceCount = function(token, value)
      {
         return CardAction.setCount(token, Count.REINFORCE, value);
      };

      CardAction.setShieldCount = function(token, value)
      {
         return CardAction.setCount(token, Count.SHIELD, value);
      };

      CardAction.setStressCount = function(token, value)
      {
         return CardAction.setCount(token, Count.STRESS, value);
      };

      CardAction.setToken = function(id, pilotKey, agent, idFore, idAft)
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
            type: CardAction.SET_TOKEN,
            payload: payload,
         });
      };

      CardAction.setTokenUpgradeEnergy = function(token, upgradeKey, value)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("upgradeKey", upgradeKey);
         var myValue = (value !== undefined ? value : 0);

         return (
         {
            type: CardAction.SET_TOKEN_UPGRADE_ENERGY,
            token: token,
            upgradeKey: upgradeKey,
            key: myValue,
         });
      };

      CardAction.setTractorBeamCount = function(token, value)
      {
         return CardAction.setCount(token, Count.TRACTOR_BEAM, value);
      };

      CardAction.setWeaponsDisabledCount = function(token, value)
      {
         return CardAction.setCount(token, Count.WEAPONS_DISABLED, value);
      };

      return CardAction;
   });
