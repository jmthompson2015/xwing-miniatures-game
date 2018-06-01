import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";

import Action from "../model/Action.js";
import AgentSquadAction from "../model/AgentSquadAction.js";
import AgentSquadReducer from "../model/AgentSquadReducer.js";
import EnvironmentAction from "../model/EnvironmentAction.js";
import Game from "../model/Game.js";
import MediumAgentStrategy from "../model/MediumAgentStrategy.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import NewGamePanel from "../view/NewGamePanel.js";

import AgentSquadContainer from "./AgentSquadContainer.js";
import HumanAgentStrategy from "./HumanAgentStrategy.js";
import PilotsContainer from "./PilotsContainer.js";
import PlayAreaContainer from "./PlayAreaContainer.js";
import StatusBarContainer from "./StatusBarContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "resource/";

// Create initial agents and tokens.
var store0 = Redux.createStore(Reducer.root);
store0.dispatch(Action.setResourceBase(resourceBase));

var store1 = Redux.createStore(AgentSquadReducer.root);
store1.dispatch(AgentSquadAction.setDelegateStore(store0));
store1.dispatch(AgentSquadAction.setAgentName("Agent 1"));
store1.dispatch(AgentSquadAction.setAgentType(HumanAgentStrategy));
setSquad(store1);

var store2 = Redux.createStore(AgentSquadReducer.root);
store2.dispatch(AgentSquadAction.setDelegateStore(store0));
store2.dispatch(AgentSquadAction.setFaction(Faction.properties[Faction.REBEL]));
store2.dispatch(AgentSquadAction.setAgentName("Agent 2"));
store2.dispatch(AgentSquadAction.setAgentType(MediumAgentStrategy));
setSquad(store2);

var newGamePanel = React.createElement(ReactRedux.Provider,
{
   store: store0,
}, React.createElement(NewGamePanel,
{
   agentSquadClass: AgentSquadContainer,
   callback: startNewGame,
   resourceBase: resourceBase,
   store1: store1,
   store2: store2,
}));

ReactDOM.render(newGamePanel, document.getElementById("secondPilotInputArea"));
var game;

function startNewGame(agent1, squad1, agent2, squad2)
{
   LOGGER.info("startNewGame() start");

   LOGGER.info("agent1 = " + agent1);
   LOGGER.info("squad1 = " + squad1);
   LOGGER.info("agent2 = " + agent2);
   LOGGER.info("squad2 = " + squad2);

   var element = document.getElementById("secondPilotInputArea");
   element.innerHTML = "";

   game = new Game(agent1, squad1, agent2, squad2);
   var store = game.environment().store();
   createEnvironmentUI(game.engine(), game.environment(), resourceBase, store);

   game.start();

   updateSizes();

   LOGGER.info("startNewGame() end");
}

function createEnvironmentUI(engine, environment, resourceBase, store)
{
   // Status bar.
   var statusBarElement = React.createElement(ReactRedux.Provider,
   {
      store: store,
   }, React.createElement(StatusBarContainer));

   // First pilots.
   var firstPilotsElement = React.createElement(ReactRedux.Provider,
   {
      store: store,
   }, React.createElement(PilotsContainer,
   {
      agent: environment.firstAgent(),
      resourceBase: resourceBase,
   }));

   // Play area.
   var playAreaElement = React.createElement(ReactRedux.Provider,
   {
      store: store,
   }, React.createElement(PlayAreaContainer,
   {
      resourceBase: resourceBase,
   }));

   // Second pilots.
   var secondPilotsElement = React.createElement(ReactRedux.Provider,
   {
      store: store,
   }, React.createElement(PilotsContainer,
   {
      agent: environment.secondAgent(),
      resourceBase: resourceBase,
   }));

   ReactDOM.render(statusBarElement, document.getElementById("statusBarContainer"));
   ReactDOM.render(firstPilotsElement, document.getElementById("firstPilotArea"));
   ReactDOM.render(playAreaElement, document.getElementById("playAreaContainer"));
   ReactDOM.render(secondPilotsElement, document.getElementById("secondPilotArea"));
}

function setSquad(store)
{
   var faction = store.getState().faction;
   var agent = store.getState().agent;
   var squadBuilders = SquadBuilder.findByFaction(faction.key);
   var squad = squadBuilders[0].buildSquad(agent);
   store.dispatch(AgentSquadAction.setSquad(squad));
}

/*
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
 */
function updateSizes()
{
   var mainTable = document.getElementById("mainTable");
   var windowHeight = Math.min(window.innerHeight - 8, mainTable.clientHeight);
   var firstPilots = document.getElementById("firstPilotArea");
   var secondPilots = document.getElementById("secondPilotArea");
   var newHeight = windowHeight;

   if (firstPilots)
   {
      newHeight -= firstPilots.offsetHeight;
   }

   if (secondPilots)
   {
      newHeight -= secondPilots.offsetHeight;
   }

   // FIXME: use playFormat.height
   newHeight = Math.max(newHeight, 0.5 * 915);

   var myPlayAreaCanvas = document.getElementById("playAreaCanvas");
   if (myPlayAreaCanvas)
   {
      myPlayAreaCanvas.height = newHeight;
   }

   if (game)
   {
      var playFormat = game.environment().playFormat();

      if (myPlayAreaCanvas)
      {
         var aspectRatio = playFormat.width / playFormat.height;
         myPlayAreaCanvas.width = newHeight * aspectRatio;
      }

      var store = game.environment().store();
      store.dispatch(EnvironmentAction.setPlayAreaScale(newHeight / playFormat.height));
   }
}

window.addEventListener("resize", function()
{
   updateSizes();
}, false);
window.addEventListener("orientationchange", function()
{
   updateSizes();
}, false);