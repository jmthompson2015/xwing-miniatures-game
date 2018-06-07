import InputValidator from "../utility/InputValidator.js";

import Maneuver from "../artifact/Maneuver.js";

import Action from "./Action.js";
import ActivationAction from "./ActivationAction.js";
import QueueProcessor from "./QueueProcessor.js";

function ActivationPhaseTask(store)
{
   InputValidator.validateNotNull("store", store);

   this.store = function()
   {
      return store;
   };
}

ActivationPhaseTask.prototype.delay = function()
{
   return 10;
};

ActivationPhaseTask.prototype.doIt = function(callback)
{
   InputValidator.validateNotNull("callback", callback);

   LOGGER.trace("ActivationPhaseTask.doIt() start");

   const store = this.store();
   const environment = store.getState().environment;

   const queue = environment.getTokensForActivation(true);
   const elementFunction = this.decloakElementFunction.bind(this);
   const phaseCallback = this.activationAction.bind(this);
   const finishFunction = function(finishCallback)
   {
      phaseCallback(finishCallback);
   };
   const delay = this.delay();

   const queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
   queueProcessor.processQueue();

   LOGGER.trace("ActivationPhaseTask.doIt() end");
};

ActivationPhaseTask.prototype.decloakElementFunction = function(cardInstance, queueCallback)
{
   InputValidator.validateNotNull("cardInstance", cardInstance);
   InputValidator.validateIsFunction("queueCallback", queueCallback);

   const store = this.store();

   if (cardInstance.isCloaked && cardInstance.isCloaked())
   {
      LOGGER.debug("checking decloak for " + cardInstance);
      const agent = cardInstance.agent();
      const agentCallback = function(token, decloakAbility)
      {
         LOGGER.debug("token = " + token + " decloakAbility = " + decloakAbility);

         if (decloakAbility !== undefined)
         {
            const consequent = decloakAbility.consequent();
            consequent(store, token, queueCallback, decloakAbility.context());
            LOGGER.debug("token.isCloaked() ? " + token.isCloaked());
            LOGGER.debug("token.cloakCount() = " + token.cloakCount());
         }
         else
         {
            queueCallback();
         }
      };
      agent.getDecloakAction(cardInstance, agentCallback);

      // Wait for agent to respond.
   }
   else
   {
      queueCallback();
   }
};

ActivationPhaseTask.prototype.activationAction = function(callback)
{
   InputValidator.validateNotNull("callback", callback);

   LOGGER.trace("ActivationPhaseTask.activationAction() start");

   const store = this.store();
   const environment = store.getState().environment;

   const queue = environment.getTokensForActivation(true);
   const elementFunction = this.activationActionElementFunction.bind(this);
   const phaseCallback = this.finishActivationPhase.bind(this);
   const finishFunction = function(finishCallback)
   {
      phaseCallback(finishCallback);
   };
   const delay = this.delay();

   const queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
   queueProcessor.processQueue();

   LOGGER.trace("ActivationPhaseTask.activationAction() end");
};

ActivationPhaseTask.prototype.activationActionElementFunction = function(cardInstance, queueCallback)
{
   InputValidator.validateNotNull("cardInstance", cardInstance);
   InputValidator.validateIsFunction("queueCallback", queueCallback);

   const store = this.store();
   const environment = store.getState().environment;
   environment.setActiveToken(cardInstance);
   let myToken = cardInstance;

   if (cardInstance.idParent() !== undefined && cardInstance.card().key.endsWith("fore"))
   {
      myToken = environment.parentOf(cardInstance);
   }

   const maneuverKey = store.getState().pilotToManeuver.get("" + myToken.id());
   const activationAction = ActivationAction.create(store, cardInstance.id(), queueCallback);
   const maneuver = Maneuver.properties[maneuverKey];
   store.dispatch(Action.setTokenManeuver(cardInstance, maneuver));

   setTimeout(function()
   {
      activationAction.doIt();
   }, this.delay());
};

ActivationPhaseTask.prototype.finishActivationPhase = function(callback)
{
   InputValidator.validateNotNull("callback", callback);

   LOGGER.trace("ActivationPhaseTask.finishActivationPhase() start");

   callback();

   LOGGER.trace("ActivationPhaseTask.finishActivationPhase() end");
};

export default ActivationPhaseTask;