"use strict";

define(["immutable", "common/js/InputValidator",
  "artifact/js/Difficulty", "artifact/js/Event", "artifact/js/Maneuver", "artifact/js/Phase",
  "model/js/Action", "model/js/CardAction", "model/js/ManeuverAction"],
   function(Immutable, InputValidator, Difficulty, Event, Maneuver, Phase, Action, CardAction, ManeuverAction)
   {
      function ActivationAction(store, tokenId, callback)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("tokenId", tokenId);
         InputValidator.validateNotNull("callback", callback);

         this.store = function()
         {
            return store;
         };

         this.tokenId = function()
         {
            return tokenId;
         };

         this.callback = function()
         {
            return callback;
         };
      }

      //////////////////////////////////////////////////////////////////////////
      // Creation methods.

      ActivationAction.create = function(store, tokenId, callback)
      {
         var activationAction = new ActivationAction(store, tokenId, callback);

         activationAction._save();

         return activationAction;
      };

      //////////////////////////////////////////////////////////////////////////
      // Accessor methods.

      ActivationAction.prototype.adjudicator = function()
      {
         var store = this.store();

         return store.getState().adjudicator;
      };

      ActivationAction.prototype.delay = function()
      {
         var store = this.store();

         return store.getState().delay;
      };

      ActivationAction.prototype.environment = function()
      {
         var store = this.store();

         return store.getState().environment;
      };

      ActivationAction.prototype.maneuver = function()
      {
         var store = this.store();
         var tokenId = this.tokenId();

         return store.getState().cardManeuver[tokenId];
      };

      ActivationAction.prototype.maneuverKey = function()
      {
         var maneuver = this.maneuver();

         return (maneuver !== undefined ? maneuver.key : undefined);
      };

      ActivationAction.prototype.token = function()
      {
         var environment = this.environment();
         var tokenId = this.tokenId();

         return environment.getTokenById(tokenId);
      };

      ActivationAction.prototype.toString = function()
      {
         return "ActivationAction tokenId=" + this.tokenId() + ", delay=" + this.delay();
      };

      //////////////////////////////////////////////////////////////////////////
      // Behavior methods.

      ActivationAction.prototype.doIt = function()
      {
         LOGGER.trace("ActivationAction.doIt() start");

         this.revealDial();

         LOGGER.trace("ActivationAction.doIt() end");
      };

      ActivationAction.prototype.revealDial = function()
      {
         LOGGER.trace("ActivationAction.revealDial() start");

         var store = this.store();
         var token = this.token();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_REVEAL_DIAL, token, this.setTemplate.bind(this)));

         LOGGER.trace("ActivationAction.revealDial() end");
      };

      ActivationAction.prototype.setTemplate = function()
      {
         LOGGER.trace("ActivationAction.setTemplate() start");

         var store = this.store();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_SET_TEMPLATE, this.token(), this.executeManeuver.bind(this)));

         LOGGER.trace("ActivationAction.setTemplate() end");
      };

      ActivationAction.prototype.executeManeuver = function()
      {
         LOGGER.trace("ActivationAction.executeManeuver() start");

         var store = this.store();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_EXECUTE_MANEUVER, this.token(), this.finishExecuteManeuver.bind(this)));

         LOGGER.trace("ActivationAction.executeManeuver() end");
      };

      ActivationAction.prototype.finishExecuteManeuver = function()
      {
         LOGGER.trace("ActivationAction.finishExecuteManeuver() start");

         var store = this.store();
         var environment = this.environment();
         var token = this.token();
         var maneuverKey = this.maneuverKey();
         var parentToken = token;

         if (token.parent && token.card().key.endsWith("fore"))
         {
            parentToken = token.parent;
         }

         if (maneuverKey)
         {
            var fromPosition = environment.getPositionFor(parentToken);

            if (fromPosition)
            {
               var maneuverAction = new ManeuverAction(environment.store(), parentToken.id(), maneuverKey);
               maneuverAction.doIt();
               store.dispatch(Action.enqueueEvent(Event.AFTER_EXECUTE_MANEUVER, parentToken, this.checkPilotStress.bind(this)));
            }
            else
            {
               this.checkPilotStress();
            }
         }
         else
         {
            this.checkPilotStress();
         }

         LOGGER.trace("ActivationAction.finishExecuteManeuver() end");
      };

      ActivationAction.prototype.checkPilotStress = function()
      {
         LOGGER.trace("ActivationAction.checkPilotStress() start");

         var store = this.store();
         var token = this.token();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_CHECK_PILOT_STRESS, token, this.finishCheckPilotStress.bind(this)));

         LOGGER.trace("ActivationAction.checkPilotStress() end");
      };

      ActivationAction.prototype.finishCheckPilotStress = function()
      {
         LOGGER.trace("ActivationAction.finishCheckPilotStress() start");

         var maneuver = this.maneuver();

         if (maneuver)
         {
            var difficultyKey = maneuver.difficultyKey;
            LOGGER.trace("difficultyKey = " + difficultyKey);
            var token = this.token();

            if (token)
            {
               var cleanUp = this.cleanUp.bind(this);
               var delay = this.delay();
               var nextFunction = function()
               {
                  setTimeout(cleanUp, delay);
               };
               if (difficultyKey === Difficulty.EASY)
               {
                  token.removeStress(nextFunction);
               }
               else if (difficultyKey === Difficulty.HARD)
               {
                  token.receiveStress(nextFunction);
               }
               else
               {
                  nextFunction();
               }
            }
            else
            {
               setTimeout(this.callback(), this.delay());
            }
         }
         else
         {
            setTimeout(this.callback(), this.delay());
         }

         LOGGER.trace("ActivationAction.finishCheckPilotStress() end");
      };

      ActivationAction.prototype.cleanUp = function()
      {
         LOGGER.trace("ActivationAction.cleanUp() start");

         var store = this.store();
         var token = this.token();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_CLEAN_UP, token, this.gainEnergy.bind(this)));

         LOGGER.trace("ActivationAction.cleanUp() end");
      };

      ActivationAction.prototype.gainEnergy = function()
      {
         LOGGER.trace("ActivationAction.gainEnergy() start");

         var store = this.store();
         var token = this.token();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_GAIN_ENERGY, token, this.finishGainEnergy.bind(this)));

         LOGGER.trace("ActivationAction.gainEnergy() end");
      };

      ActivationAction.prototype.finishGainEnergy = function()
      {
         LOGGER.trace("ActivationAction.finishGainEnergy() start");

         var token = this.token();

         if (token.isHuge() || (token.parent && token.parent.isHuge()))
         {
            var maneuverKey = this.maneuverKey();

            if (maneuverKey !== undefined)
            {
               var maneuver = Maneuver.properties[maneuverKey];

               if (maneuver && maneuver.energy !== undefined)
               {
                  // Gain energy up to the energy limit.
                  var energyLimit = token.energyValue();
                  var diff = energyLimit - token.energyCount();

                  if (diff > 0)
                  {
                     var store = this.store();
                     var value = Math.min(diff, maneuver.energy);
                     store.dispatch(CardAction.addEnergyCount(token, value));
                  }
               }
            }
         }

         this.allocateEnergy();

         LOGGER.trace("ActivationAction.finishGainEnergy() end");
      };

      ActivationAction.prototype.allocateEnergy = function()
      {
         LOGGER.trace("ActivationAction.allocateEnergy() start");

         var store = this.store();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_ALLOCATE_ENERGY, this.token(), this.finishAllocateEnergy.bind(this)));

         LOGGER.trace("ActivationAction.allocateEnergy() end");
      };

      ActivationAction.prototype.finishAllocateEnergy = function()
      {
         LOGGER.trace("ActivationAction.finishAllocateEnergy() start");

         var token = this.token();

         if (token.isHuge() || (token.parent && token.parent.isHuge()))
         {
            // FIXME: implement finishAllocateEnergy()
         }

         this.useEnergy();

         LOGGER.trace("ActivationAction.finishAllocateEnergy() end");
      };

      ActivationAction.prototype.useEnergy = function()
      {
         LOGGER.trace("ActivationAction.useEnergy() start");

         var store = this.store();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_USE_ENERGY, this.token(), this.finishUseEnergy.bind(this)));

         LOGGER.trace("ActivationAction.useEnergy() end");
      };

      ActivationAction.prototype.finishUseEnergy = function()
      {
         LOGGER.trace("ActivationAction.finishUseEnergy() start");

         var token = this.token();

         if (token.isHuge() || (token.parent && token.parent.isHuge()))
         {
            // FIXME: implement finishUseEnergy()
         }

         this.performAction();

         LOGGER.trace("ActivationAction.finishUseEnergy() end");
      };

      ActivationAction.prototype.performAction = function()
      {
         LOGGER.trace("ActivationAction.performAction() start");

         var store = this.store();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_PERFORM_ACTION, this.token(), this.finishPerformAction.bind(this)));

         LOGGER.trace("ActivationAction.performAction() end");
      };

      ActivationAction.prototype.finishPerformAction = function()
      {
         LOGGER.trace("ActivationAction.finishPerformAction() start");

         var store = this.store();
         var token = this.token();

         if (token)
         {
            store.dispatch(CardAction.clearUsedAbilities(token));
         }

         setTimeout(this.callback(), this.delay());

         LOGGER.trace("ActivationAction.finishPerformAction() end");
      };

      //////////////////////////////////////////////////////////////////////////
      // Mutator methods.

      ActivationAction.prototype._save = function()
      {
         var store = this.store();
         var tokenId = this.tokenId();
         var callback = this.callback();

         var values = Immutable.Map(
         {
            tokenId: tokenId,
            callback: callback,
         });

         store.dispatch(Action.setTokenActivationAction(tokenId, values));
      };

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      ActivationAction.get = function(store, tokenId)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("tokenId", tokenId);

         var values = store.getState().cardActivationAction[tokenId];

         var answer;

         if (values !== undefined)
         {
            var callback = values.get("callback");

            answer = new ActivationAction(store, tokenId, callback);
         }

         return answer;
      };

      return ActivationAction;
   });
