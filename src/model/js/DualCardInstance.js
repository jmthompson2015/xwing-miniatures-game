"use strict";

define(["immutable", "common/js/InputValidator", "artifact/js/CardResolver", "artifact/js/CardType", "artifact/js/PilotCard",
  "model/js/AgentAction", "model/js/CardAction", "model/js/CardInstance", "model/js/TargetLock"],
   function(Immutable, InputValidator, CardResolver, CardType, PilotCard, AgentAction, CardAction, CardInstance, TargetLock)
   {
      function DualCardInstance(store, cardOrKey, agent, upgradeKeysForeIn, upgradeKeysAftIn, idIn, isNewIn, idFore, idAft)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("cardOrKey", cardOrKey);
         InputValidator.validateNotNull("agent", agent);
         // upgradeKeysForeIn optional.
         // upgradeKeysAftIn optional.
         // idIn optional. default: determined from store
         // isNewIn optional. default: true
         // idFore optional.
         // idAft optional.

         var card;

         if (typeof cardOrKey === "string")
         {
            var cardKey = cardOrKey;
            card = PilotCard.properties[cardKey];
         }
         else
         {
            card = cardOrKey;
         }

         var id = idIn;

         if (isNaN(id))
         {
            id = store.getState().nextCardId;
            store.dispatch(CardAction.incrementNextCardId());
         }

         this.store = function()
         {
            return store;
         };

         this.card = function()
         {
            return card;
         };

         this.agent = function()
         {
            return agent;
         };

         this.id = function()
         {
            return id;
         };

         var shipFaction = card.shipFaction;
         var ship = shipFaction.ship;

         var pilotFore = card.fore;
         pilotFore.shipFaction = card.shipFaction;
         var pilotAft = card.aft;
         pilotAft.shipFaction = card.shipFaction;
         var tokenFore;
         var tokenAft;

         var isNew = (isNewIn !== undefined ? isNewIn : true);

         if (isNew)
         {
            var upgradeKeysFore = (upgradeKeysForeIn ? upgradeKeysForeIn : Immutable.List());
            var upgradeKeysAft = (upgradeKeysAftIn ? upgradeKeysAftIn : Immutable.List());
            tokenFore = new CardInstance(store, pilotFore, agent, upgradeKeysFore, undefined, true, id);
            tokenAft = new CardInstance(store, pilotAft, agent, upgradeKeysAft, undefined, true, id);
            this._save(upgradeKeysFore, upgradeKeysAft, tokenFore, tokenAft);
         }
         else
         {
            tokenFore = CardInstance.get(store, idFore);
            tokenAft = CardInstance.get(store, idAft);
         }

         var myCrippledPilotFore, myCrippledPilotAft;
         var myCrippledTokenFore, myCrippledTokenAft;

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
               myCrippledTokenAft = new CardInstance(store, crippledPilotAft(), agent, upgradeKeys, undefined, true, id);
            }

            return myCrippledTokenAft;
         };

         this.crippledTokenFore = function()
         {
            if (tokenFore.isDestroyed() && myCrippledTokenFore === undefined)
            {
               var upgradeKeys = [];
               myCrippledTokenFore = new CardInstance(store, crippledPilotFore(), agent, upgradeKeys, undefined, true, id);
            }

            return myCrippledTokenFore;
         };

         function crippledPilotAft()
         {
            if (myCrippledPilotAft === undefined)
            {
               myCrippledPilotAft = card.crippledAft;
               myCrippledPilotAft.shipFaction = card.shipFaction;
            }

            return myCrippledPilotAft;
         }

         function crippledPilotFore()
         {
            if (myCrippledPilotFore === undefined)
            {
               myCrippledPilotFore = card.crippledFore;
               myCrippledPilotFore.shipFaction = card.shipFaction;
            }

            return myCrippledPilotFore;
         }
      }

      DualCardInstance.prototype.isDual = true;

      //////////////////////////////////////////////////////////////////////////
      // Accessor methods.

      DualCardInstance.prototype.energyCount = function()
      {
         return this.tokenAft().energyCount();
      };

      DualCardInstance.prototype.energyValue = function()
      {
         return this.tokenAft().energyValue();
      };

      DualCardInstance.prototype.equals = function(other)
      {
         return this.id() == other.id() && this.card().key == other.card().key;
      };

      DualCardInstance.prototype.idParent = function()
      {
         return undefined;
      };

      DualCardInstance.prototype.isChild = function()
      {
         return false;
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
         return this.card().shipFaction.ship.maneuverKeys.slice();
      };

      DualCardInstance.prototype.name = function()
      {
         return this.id() + " " + this.card().name;
      };

      DualCardInstance.prototype.pilotName = function()
      {
         var properties = this.card();
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
         return this.card().shipFaction.ship.name;
      };

      DualCardInstance.prototype.toString = function()
      {
         return this.name();
      };

      DualCardInstance.prototype.upgradeKeys = function()
      {
         return [];
      };

      DualCardInstance.prototype.upgrades = function()
      {
         return [];
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
         var cardTypeKey = this.card().cardTypeKey;
         var cardKey = this.card().key;
         var agent = this.agent();

         store.dispatch(CardAction.setCardInstance(id, cardTypeKey, cardKey, agent, undefined, tokenFore.id(), tokenAft.id()));

         if (this.card().cardTypeKey === CardType.PILOT)
         {
            store.dispatch(AgentAction.addPilot(agent, this));
         }
      };

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      DualCardInstance.prototype.newInstance = function(store, agent)
      {
         var card = this.card();
         var tokenFore = this.tokenFore();
         var tokenAft = this.tokenAft();
         var upgradeKeysFore = tokenFore.upgradeKeys().slice();
         var upgradeKeysAft = tokenAft.upgradeKeys().slice();

         return new DualCardInstance(store, card, agent, upgradeKeysFore, upgradeKeysAft);
      };

      DualCardInstance.get = function(store, id)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("id", id);

         var values = store.getState().cardInstances.get(id);
         var answer;

         if (values !== undefined)
         {
            var cardTypeKey = values.get("cardTypeKey");
            var cardKey = values.get("cardKey");
            var card = CardResolver.resolve(cardTypeKey, cardKey);
            var agent = values.get("agent");
            var idFore = values.get("idFore");
            var idAft = values.get("idAft");
            var upgradeKeysFore = store.getState().cardUpgrades.get(id);
            var upgradeKeysAft = store.getState().cardUpgrades.get(id);
            var isNew = false;

            answer = new DualCardInstance(store, card, agent, upgradeKeysFore, upgradeKeysAft, id, isNew, idFore, idAft);
         }

         return answer;
      };

      return DualCardInstance;
   });
