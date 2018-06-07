import InputValidator from "../utility/InputValidator.js";

import Difficulty from "../artifact/Difficulty.js";
import Event from "../artifact/Event.js";
import Maneuver from "../artifact/Maneuver.js";
import Phase from "../artifact/Phase.js";

import Action from "./Action.js";
import CardAction from "./CardAction.js";
import ManeuverAction from "./ManeuverAction.js";

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
   const activationAction = new ActivationAction(store, tokenId, callback);

   activationAction._save();

   return activationAction;
};

//////////////////////////////////////////////////////////////////////////
// Accessor methods.

ActivationAction.prototype.adjudicator = function()
{
   const store = this.store();

   return store.getState().adjudicator;
};

ActivationAction.prototype.delay = function()
{
   const store = this.store();

   return store.getState().delay;
};

ActivationAction.prototype.environment = function()
{
   const store = this.store();

   return store.getState().environment;
};

ActivationAction.prototype.maneuver = function()
{
   const store = this.store();
   const tokenId = this.tokenId();

   return store.getState().cardManeuver.get(tokenId);
};

ActivationAction.prototype.maneuverKey = function()
{
   const maneuver = this.maneuver();

   return (maneuver !== undefined ? maneuver.key : undefined);
};

ActivationAction.prototype.token = function()
{
   const environment = this.environment();
   const tokenId = this.tokenId();

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

   const store = this.store();
   const token = this.token();
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_REVEAL_DIAL, token, this.setTemplate.bind(this)));

   LOGGER.trace("ActivationAction.revealDial() end");
};

ActivationAction.prototype.setTemplate = function()
{
   LOGGER.trace("ActivationAction.setTemplate() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_SET_TEMPLATE, this.token(), this.executeManeuver.bind(this)));

   LOGGER.trace("ActivationAction.setTemplate() end");
};

ActivationAction.prototype.executeManeuver = function()
{
   LOGGER.trace("ActivationAction.executeManeuver() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_EXECUTE_MANEUVER, this.token(), this.finishExecuteManeuver.bind(this)));

   LOGGER.trace("ActivationAction.executeManeuver() end");
};

ActivationAction.prototype.finishExecuteManeuver = function()
{
   LOGGER.trace("ActivationAction.finishExecuteManeuver() start");

   const store = this.store();
   const environment = this.environment();
   const token = this.token();
   const maneuverKey = this.maneuverKey();
   let parentToken = token;

   if (token && token.idParent() !== undefined && token.card().key.endsWith("fore"))
   {
      parentToken = environment.parentOf(token);
   }

   if (maneuverKey)
   {
      const fromPosition = environment.getPositionFor(parentToken);

      if (fromPosition)
      {
         const maneuverAction = new ManeuverAction(environment.store(), parentToken.id(), maneuverKey);
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

   const store = this.store();
   const token = this.token();

   if (token)
   {
      store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_CHECK_PILOT_STRESS, token, this.finishCheckPilotStress.bind(this)));
   }
   else
   {
      setTimeout(this.callback(), this.delay());
   }

   LOGGER.trace("ActivationAction.checkPilotStress() end");
};

ActivationAction.prototype.finishCheckPilotStress = function()
{
   LOGGER.trace("ActivationAction.finishCheckPilotStress() start");

   const maneuver = this.maneuver();

   if (maneuver)
   {
      const difficultyKey = maneuver.difficultyKey;
      LOGGER.trace("difficultyKey = " + difficultyKey);
      const token = this.token();

      if (token)
      {
         const cleanUp = this.cleanUp.bind(this);
         const delay = this.delay();
         const nextFunction = function()
         {
            setTimeout(cleanUp, delay);
         };
         if (difficultyKey === Difficulty.EASY)
         {
            token.removeStress(nextFunction);
         }
         else if (difficultyKey === Difficulty.HARD)
         {
            token.receiveStress(1, nextFunction);
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

   const store = this.store();
   const token = this.token();
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_CLEAN_UP, token, this.gainEnergy.bind(this)));

   LOGGER.trace("ActivationAction.cleanUp() end");
};

ActivationAction.prototype.gainEnergy = function()
{
   LOGGER.trace("ActivationAction.gainEnergy() start");

   const store = this.store();
   const token = this.token();
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_GAIN_ENERGY, token, this.finishGainEnergy.bind(this)));

   LOGGER.trace("ActivationAction.gainEnergy() end");
};

ActivationAction.prototype.finishGainEnergy = function()
{
   LOGGER.trace("ActivationAction.finishGainEnergy() start");

   const token = this.token();

   if (token.isHuge())
   {
      const maneuverKey = this.maneuverKey();

      if (maneuverKey !== undefined)
      {
         const maneuver = Maneuver.properties[maneuverKey];

         if (maneuver && maneuver.energy !== undefined)
         {
            // Gain energy up to the energy limit.
            const energyLimit = token.energyValue();
            const energyCount = token.energyCount();
            const diff = energyLimit - energyCount;

            if (diff > 0)
            {
               const store = this.store();
               const value = Math.min(diff, maneuver.energy);
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

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_ALLOCATE_ENERGY, this.token(), this.finishAllocateEnergy.bind(this)));

   LOGGER.trace("ActivationAction.allocateEnergy() end");
};

ActivationAction.prototype.finishAllocateEnergy = function()
{
   LOGGER.trace("ActivationAction.finishAllocateEnergy() start");

   const token = this.token();

   if (token.isHuge())
   {
      // FIXME: implement finishAllocateEnergy()
   }

   this.useEnergy();

   LOGGER.trace("ActivationAction.finishAllocateEnergy() end");
};

ActivationAction.prototype.useEnergy = function()
{
   LOGGER.trace("ActivationAction.useEnergy() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_USE_ENERGY, this.token(), this.finishUseEnergy.bind(this)));

   LOGGER.trace("ActivationAction.useEnergy() end");
};

ActivationAction.prototype.finishUseEnergy = function()
{
   LOGGER.trace("ActivationAction.finishUseEnergy() start");

   const token = this.token();

   if (token.isHuge())
   {
      // FIXME: implement finishUseEnergy()
   }

   this.performAction();

   LOGGER.trace("ActivationAction.finishUseEnergy() end");
};

ActivationAction.prototype.performAction = function()
{
   LOGGER.trace("ActivationAction.performAction() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_PERFORM_ACTION, this.token(), this.finishPerformAction.bind(this)));

   LOGGER.trace("ActivationAction.performAction() end");
};

ActivationAction.prototype.finishPerformAction = function()
{
   LOGGER.trace("ActivationAction.finishPerformAction() start");

   const store = this.store();
   const token = this.token();

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
   const store = this.store();
   const tokenId = this.tokenId();
   const callback = this.callback();

   const values = Immutable.Map(
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

   const values = store.getState().cardActivationAction.get(tokenId);

   let answer;

   if (values !== undefined)
   {
      const callback = values.get("callback");

      answer = new ActivationAction(store, tokenId, callback);
   }

   return answer;
};

export default ActivationAction;