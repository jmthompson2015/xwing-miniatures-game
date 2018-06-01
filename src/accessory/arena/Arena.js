import Logger from "../../utility/Logger.js";
import TimePrinter from "../../utility/TimePrinter.js";

import Adjudicator from "../../model/Adjudicator.js";
import Agent from "../../model/Agent.js";
import Game from "../../model/Game.js";
import MediumAgentStrategy from "../../model/MediumAgentStrategy.js";
import DelegateReducer from "../../model/Reducer.js";

import Action from "./Action.js";
import ArenaTableContainer from "./ArenaTableContainer.js";
import Reducer from "./Reducer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);
LOGGER.setInfoEnabled(false);

var resourceBase = "../../../src/resource/";
var arenaStore = Redux.createStore(Reducer.root);

var element = React.createElement(ReactRedux.Provider,
{
   store: arenaStore,
}, React.createElement(ArenaTableContainer,
{
   resourceBase: resourceBase,
}));

ReactDOM.render(element, document.getElementById("tableContainer"));

var squadBuilders = arenaStore.getState().squadBuilders;
var sbsGameOver = {};
var adjudicatorStore = Redux.createStore(DelegateReducer.root);
var adjudicator = new Adjudicator(adjudicatorStore);
var competeCount = 0;
var doneCount = 0;
var start = Date.now();

for (var i = 0; i < squadBuilders.length; i++)
{
   var squadBuilder1 = squadBuilders[i];

   for (var j = i + 1; j < squadBuilders.length; j++)
   {
      var squadBuilder2 = squadBuilders[j];

      if (adjudicator.compareInitiative(squadBuilder1, squadBuilder2) >= 0)
      {
         compete(squadBuilder1, squadBuilder2);
      }
      else
      {
         compete(squadBuilder2, squadBuilder1);
      }

      competeCount++;
   }
}

setStatusMessage();

function compete(squadBuilder1, squadBuilder2)
{
   LOGGER.info("compete() " + squadBuilder1 + " vs " + squadBuilder2);
   var store = Redux.createStore(DelegateReducer.root);
   var agent1 = new Agent(store, "Agent1", undefined, MediumAgentStrategy);
   var agent2 = new Agent(store, "Agent2", undefined, MediumAgentStrategy);

   startNewGame(agent1, squadBuilder1, agent2, squadBuilder2);
   LOGGER.info("compete() end");
}

function setStatusMessage()
{
   var message = "Completed " + doneCount + " of " + competeCount + " competitions.";
   if (competeCount === doneCount)
   {
      message += " ";
      message += TimePrinter.formatElapsedTime(undefined, start, Date.now());
   }
   document.getElementById("statusArea").innerHTML = message;
}

function startNewGame(agent1, squadBuilder1, agent2, squadBuilder2)
{
   LOGGER.info("startNewGame() start");

   var squad1 = squadBuilder1.buildSquad(agent1);
   var squad2 = squadBuilder2.buildSquad(agent2);

   LOGGER.info("agent1 = " + agent1);
   LOGGER.info("squad1 = " + squad1);
   LOGGER.info("agent2 = " + agent2);
   LOGGER.info("squad2 = " + squad2);

   var delay = 10;
   var game = new Game(agent1, squad1, agent2, squad2, delay);
   var store = game.environment().store();

   function gameOver()
   {
      var key = squadBuilder1.toString() + squadBuilder2.toString();

      if (!sbsGameOver[key] && store.getState().isGameOver)
      {
         var winner = store.getState().winner;
         LOGGER.info("Arena.html gameOver() noticed the game is over. Winner = " + winner);

         if (winner !== undefined)
         {
            if (winner.toString().endsWith("1"))
            {
               LOGGER.info("winner squadBuilder1 = " + squadBuilder1);
               arenaStore.dispatch(Action.addWinCount(squadBuilder1));
               arenaStore.dispatch(Action.addLoseCount(squadBuilder2));
            }
            else
            {
               LOGGER.info("winner squadBuilder2 = " + squadBuilder2);
               arenaStore.dispatch(Action.addLoseCount(squadBuilder1));
               arenaStore.dispatch(Action.addWinCount(squadBuilder2));
            }
         }
         else
         {
            arenaStore.dispatch(Action.addTieCount(squadBuilder1));
            arenaStore.dispatch(Action.addTieCount(squadBuilder2));
         }

         sbsGameOver[key] = true;
         doneCount++;
         setStatusMessage();
      }
   }

   store.subscribe(gameOver);

   game.start();

   LOGGER.info("startNewGame() end");
}