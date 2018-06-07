import InputValidator from "../utility/InputValidator.js";

import Action from "./Action.js";
import CardAction from "./CardAction.js";
import DamageAbility0 from "./DamageAbility0.js";
import Observer from "./Observer.js";
import PilotAbility0 from "./PilotAbility0.js";
import QueueProcessor from "./QueueProcessor.js";
import UpgradeAbility0 from "./UpgradeAbility0.js";

function EventObserver(store)
{
   InputValidator.validateNotNull("store", store);

   this.store = function()
   {
      return store;
   };
}

//////////////////////////////////////////////////////////////////////////
// Creation methods.

EventObserver.observeStore = function(store)
{
   const observer = new EventObserver(store);

   const select = function(state)
   {
      return state.eventQueue;
   };

   Observer.observeStore(store, select, observer.onChange.bind(observer));

   return observer;
};

//////////////////////////////////////////////////////////////////////////
// Behavior methods.

EventObserver.prototype.onChange = function(eventQueue)
{
   LOGGER.trace("EventObserver.onChange() start");

   if (eventQueue.size > 0)
   {
      const store = this.store();
      store.dispatch(Action.dequeueEvent());
      const eventData = store.getState().eventData;

      LOGGER.debug("eventData = " + JSON.stringify(eventData));

      if (eventData !== undefined)
      {
         const environment = store.getState().environment;
         const queue = environment.getTokensForActivation();
         const pilotInstanceCallback = this.finishOnChange.bind(this);
         const callback = function()
         {
            pilotInstanceCallback(eventData);
         };
         const pilotInstanceFunction = this.chooseAbility.bind(this);
         const elementFunction = function(pilotInstance, queueCallback)
         {
            pilotInstanceFunction(eventData, pilotInstance, queueCallback);
         };
         const delay = 10;
         const queueProcessor = new QueueProcessor(queue, callback, elementFunction, undefined, delay);
         queueProcessor.processQueue();
      }
   }

   LOGGER.trace("EventObserver.onChange() end");
};

EventObserver.prototype.chooseAbility = function(eventData, pilotInstance, queueCallback)
{
   LOGGER.trace("EventObserver.chooseAbility() start");

   InputValidator.validateNotNull("eventData", eventData);
   InputValidator.validateNotNull("pilotInstance", pilotInstance);
   InputValidator.validateNotNull("queueCallback", queueCallback);

   const eventKey = eventData.get("eventKey");

   const damageAbilities = (pilotInstance.usableDamageAbilities !== undefined ? pilotInstance.usableDamageAbilities(DamageAbility0, eventKey) : []);
   const pilotAbilities = (pilotInstance.usablePilotAbilities !== undefined ? pilotInstance.usablePilotAbilities(PilotAbility0, eventKey) : []);
   const upgradeAbilities = (pilotInstance.usableUpgradeAbilities !== undefined ? pilotInstance.usableUpgradeAbilities(UpgradeAbility0, eventKey) : []);

   if (damageAbilities.length > 0 || pilotAbilities.length > 0 || upgradeAbilities.length > 0)
   {
      const that = this;
      const agentCallback = function(ability, isAccepted)
      {
         that.finishChooseAbility(eventData, pilotInstance, queueCallback, ability, isAccepted);
      };
      const agent = pilotInstance.agent();
      agent.chooseAbility(damageAbilities, pilotAbilities, upgradeAbilities, agentCallback);
   }
   else
   {
      queueCallback();
   }

   LOGGER.trace("EventObserver.chooseAbility() end");
};

EventObserver.prototype.finishChooseAbility = function(eventData, pilotInstance, queueCallback, ability, isAccepted)
{
   LOGGER.trace("EventObserver.finishChooseAbility() start");

   InputValidator.validateNotNull("eventData", eventData);
   InputValidator.validateNotNull("pilotInstance", pilotInstance);
   InputValidator.validateNotNull("queueCallback", queueCallback);
   // ability optional.
   // isAccepted optional.

   LOGGER.debug("ActivationAction.finishRevealDial() ability = " + ability + " isAccepted ? " + isAccepted);

   const that = this;
   const backFunction = function()
   {
      that.chooseAbility(eventData, pilotInstance, queueCallback);
   };
   const forwardFunction = function()
   {
      queueCallback();
   };

   this.finish(eventData, pilotInstance, backFunction, forwardFunction, ability, isAccepted);

   LOGGER.trace("EventObserver.finishChooseAbility() end");
};

EventObserver.prototype.finish = function(eventData, pilotInstance, backFunction, forwardFunction, ability, isAccepted)
{
   LOGGER.trace("EventObserver.finish() start");

   InputValidator.validateNotNull("eventData", eventData);
   InputValidator.validateNotNull("pilotInstance", pilotInstance);
   InputValidator.validateNotNull("backFunction", backFunction);
   InputValidator.validateNotNull("forwardFunction", forwardFunction);
   // ability optional.
   // isAccepted optional.

   if (ability !== undefined && isAccepted === true)
   {
      const store = this.store();

      if (ability.sourceObject().oncePerRound)
      {
         store.dispatch(CardAction.addUsedPerRoundAbility(pilotInstance, ability));
      }
      else
      {
         store.dispatch(CardAction.addUsedAbility(pilotInstance, ability));
      }

      const message = ability.sourceObject().name + " ability used.";
      LOGGER.info(message);
      store.dispatch(Action.setUserMessage(message));

      const consequent = ability.consequent();
      consequent(store, pilotInstance, backFunction);
   }
   else
   {
      forwardFunction();
   }

   LOGGER.trace("EventObserver.finish() end");
};

EventObserver.prototype.finishOnChange = function(eventData)
{
   LOGGER.trace("EventObserver.finishOnChange() start");

   InputValidator.validateNotNull("eventData", eventData);

   const store = this.store();
   store.dispatch(Action.clearEvent());

   const callback = eventData.get("eventCallback");

   if (callback !== undefined)
   {
      callback();
   }

   LOGGER.trace("EventObserver.finishOnChange() end");
};

if (Object.freeze)
{
   Object.freeze(EventObserver);
}

export default EventObserver;