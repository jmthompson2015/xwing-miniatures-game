import InputValidator from "../utility/InputValidator.js";

import Action from "./Action.js";
import Adjudicator from "./Adjudicator.js";
import Engine from "./Engine.js";
import Environment from "./Environment.js";
import EventObserver from "./EventObserver.js";
import PhaseObserver from "./PhaseObserver.js";
import Reducer from "./Reducer.js";

function Game(agent1, squad1, agent2, squad2, delayIn)
{
   InputValidator.validateNotNull("agent1", agent1);
   InputValidator.validateNotNull("squad1", squad1);
   InputValidator.validateNotNull("agent2", agent2);
   InputValidator.validateNotNull("squad2", squad2);
   // delayIn optional.

   var store = Redux.createStore(Reducer.root);
   var resourceBase = "resource/";
   store.dispatch(Action.setResourceBase(resourceBase));
   var environment = new Environment(store, agent1, squad1, agent2, squad2);
   EventObserver.observeStore(store);
   PhaseObserver.observeStore(store);

   if (delayIn !== undefined)
   {
      store.dispatch(Action.setDelay(delayIn));
   }

   var adjudicator = Adjudicator.create(store);
   var engine = new Engine(store);

   this.adjudicator = function()
   {
      return adjudicator;
   };

   this.engine = function()
   {
      return engine;
   };

   this.environment = function()
   {
      return environment;
   };
}

Game.prototype.start = function()
{
   var engine = this.engine();

   setTimeout(function()
   {
      engine.performPlanningPhase();
   }, 0);
};

export default Game;