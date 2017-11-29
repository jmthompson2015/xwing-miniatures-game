"use strict";

define(["immutable", "common/js/InputValidator", "artifact/js/PilotCard",
  "model/js/CardAction", "model/js/CardInstance", "model/js/TargetLock"],
   function(Immutable, InputValidator, PilotCard, CardAction, CardInstance, TargetLock)
   {
      function DualCardInstance(store, pilotKey, agent, upgradeKeysForeIn, upgradeKeysAftIn, idIn, isNewIn, idFore, idAft)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("pilotKey", pilotKey);
         InputValidator.validateNotNull("agent", agent);
         // upgradeKeysForeIn optional.
         // upgradeKeysAftIn optional.
         // idIn optional. default: determined from store
         // isNewIn optional. default: true
         // idFore optional.
         // idAft optional.

         this.store = function()
         {
            return store;
         };

         this.pilotKey = function()
         {
            return pilotKey;
         };

         this.agent = function()
         {
            return agent;
         };

         var id = idIn;

         if (isNaN(id))
         {
            id = store.getState().nextCardId;
            store.dispatch(CardAction.incrementNextCardId());
         }

         this.id = function()
         {
            return id;
         };

         var pilot = PilotCard.properties[pilotKey];
         var shipFaction = pilot.shipFaction;
         var ship = shipFaction.ship;

         var pilotFore = pilot.fore;
         pilotFore.shipFaction = pilot.shipFaction;
         var pilotAft = pilot.aft;
         pilotAft.shipFaction = pilot.shipFaction;
         var tokenFore;
         var tokenAft;

         var isNew = (isNewIn !== undefined ? isNewIn : true);

         if (isNew)
         {
            var upgradeKeysFore = (upgradeKeysForeIn ? upgradeKeysForeIn : Immutable.List());
            var upgradeKeysAft = (upgradeKeysAftIn ? upgradeKeysAftIn : Immutable.List());
            tokenFore = new CardInstance(store, pilotFore, agent, upgradeKeysFore);
            tokenAft = new CardInstance(store, pilotAft, agent, upgradeKeysAft);
            this._save(upgradeKeysFore, upgradeKeysAft, tokenFore, tokenAft);
         }
         else
         {
            tokenFore = CardInstance.get(store, idFore);
            tokenAft = CardInstance.get(store, idAft);
         }

         tokenFore.parent = this;
         tokenAft.parent = this;

         var myCrippledPilotFore, myCrippledPilotAft;
         var myCrippledTokenFore, myCrippledTokenAft;

         this.pilot = function()
         {
            return pilot;
         };

         this.pilotAft = function()
         {
            var answer = pilotAft;

            if (tokenAft.isDestroyed())
            {
               answer = crippledPilotAft();
            }

            return answer;
         };

         this.pilotFore = function()
         {
            var answer = pilotFore;

            if (tokenFore.isDestroyed())
            {
               answer = crippledPilotFore();
            }

            return answer;
         };

         this.ship = function()
         {
            return ship;
         };

         this.tokenAft = function()
         {
            var answer = tokenAft;

            if (tokenAft.isDestroyed())
            {
               answer = this.crippledTokenAft();
            }

            return answer;
         };

         this.tokenFore = function()
         {
            var answer = tokenFore;

            if (tokenFore.isDestroyed())
            {
               answer = this.crippledTokenFore();
            }

            return answer;
         };

         this.crippledTokenAft = function()
         {
            if (tokenAft.isDestroyed() && myCrippledTokenAft === undefined)
            {
               var upgradeKeys = [];
               myCrippledTokenAft = new CardInstance(store, crippledPilotAft(), agent, upgradeKeys);
               myCrippledTokenAft.parent = this;
            }

            return myCrippledTokenAft;
         };

         this.crippledTokenFore = function()
         {
            if (tokenFore.isDestroyed() && myCrippledTokenFore === undefined)
            {
               var upgradeKeys = [];
               myCrippledTokenFore = new CardInstance(store, crippledPilotFore(), agent, upgradeKeys);
               myCrippledTokenFore.parent = this;
            }

            return myCrippledTokenFore;
         };

         function crippledPilotAft()
         {
            if (myCrippledPilotAft === undefined)
            {
               myCrippledPilotAft = pilot.crippledAft;
               myCrippledPilotAft.shipFaction = pilot.shipFaction;
            }

            return myCrippledPilotAft;
         }

         function crippledPilotFore()
         {
            if (myCrippledPilotFore === undefined)
            {
               myCrippledPilotFore = pilot.crippledFore;
               myCrippledPilotFore.shipFaction = pilot.shipFaction;
            }

            return myCrippledPilotFore;
         }
      }

      //////////////////////////////////////////////////////////////////////////
      // Accessor methods.

      DualCardInstance.prototype.equals = function(other)
      {
         return this.id() == other.id() && this.pilotKey() == other.pilotKey();
      };

      DualCardInstance.prototype.isDestroyed = function()
      {
         this.tokenFore();
         this.tokenAft();
         var myCrippledTokenFore = this.crippledTokenFore();
         var myCrippledTokenAft = this.crippledTokenAft();

         return !(myCrippledTokenFore === undefined || myCrippledTokenAft === undefined);
      };

      DualCardInstance.prototype.isHuge = function()
      {
         return true;
      };

      DualCardInstance.prototype.isStressed = function()
      {
         return false;
      };

      DualCardInstance.prototype.isUpgradedWith = function()
      {
         return false;
      };

      DualCardInstance.prototype.maneuverKeys = function()
      {
         return this.pilot().shipFaction.ship.maneuverKeys.slice();
      };

      DualCardInstance.prototype.name = function()
      {
         return this.id() + " " + this.pilot().name;
      };

      DualCardInstance.prototype.pilotName = function()
      {
         var properties = this.pilot();
         var isUnique = properties.isUnique;
         var answer = this.id() + " ";

         if (isUnique)
         {
            answer += "\u25CF ";
         }

         answer += properties.name;

         return answer;
      };

      DualCardInstance.prototype.primaryWeapon = function()
      {
         return this.tokenFore().primaryWeapon();
      };

      DualCardInstance.prototype.shipName = function()
      {
         return this.pilot().shipFaction.ship.name;
      };

      DualCardInstance.prototype.toString = function()
      {
         return this.name();
      };

      //////////////////////////////////////////////////////////////////////////
      // Mutator methods.

      DualCardInstance.prototype.removeAllTargetLocks = function()
      {
         var store = this.store();
         TargetLock.removeAllTargetLocks(store, this.tokenFore());
         TargetLock.removeAllTargetLocks(store, this.tokenAft());

         var myCrippledTokenFore = this.crippledTokenFore();

         if (myCrippledTokenFore !== undefined)
         {
            TargetLock.removeAllTargetLocks(store, myCrippledTokenFore);
         }

         var myCrippledTokenAft = this.crippledTokenAft();

         if (myCrippledTokenAft)
         {
            TargetLock.removeAllTargetLocks(store, myCrippledTokenAft);
         }
      };

      DualCardInstance.prototype._save = function(upgradeKeysFore, upgradeKeysAft, tokenFore, tokenAft)
      {
         InputValidator.validateNotNull("upgradeKeysFore", upgradeKeysFore);
         InputValidator.validateNotNull("upgradeKeysAft", upgradeKeysAft);
         InputValidator.validateNotNull("tokenFore", tokenFore);
         InputValidator.validateNotNull("tokenAft", tokenAft);

         var store = this.store();
         var id = this.id();
         var pilotKey = this.pilotKey();
         var agent = this.agent();

         store.dispatch(CardAction.setCardInstance(id, pilotKey, agent, tokenFore.id(), tokenAft.id()));
      };

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      DualCardInstance.prototype.newInstance = function(store, agent)
      {
         var pilotKey = this.pilotKey();
         var tokenFore = this.tokenFore();
         var tokenAft = this.tokenAft();
         var upgradeKeysFore = tokenFore.upgradeKeys().slice();
         var upgradeKeysAft = tokenAft.upgradeKeys().slice();

         return new DualCardInstance(store, pilotKey, agent, upgradeKeysFore, upgradeKeysAft);
      };

      DualCardInstance.get = function(store, id)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("id", id);

         var values = store.getState().cardInstances.get(id);
         var answer;

         if (values !== undefined)
         {
            var pilotKey = values.get("pilotKey");
            var agent = values.get("agent");
            var idFore = values.get("idFore");
            var idAft = values.get("idAft");
            var upgradeKeysFore = store.getState().cardUpgrades.get(id);
            var upgradeKeysAft = store.getState().cardUpgrades.get(id);
            var isNew = false;

            answer = new DualCardInstance(store, pilotKey, agent, upgradeKeysFore, upgradeKeysAft, id, isNew, idFore, idAft);
         }

         return answer;
      };

      return DualCardInstance;
   });
