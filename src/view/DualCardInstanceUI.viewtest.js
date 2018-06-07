import Logger from "../utility/Logger.js";

import Action from "../model/Action.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";

import CardInstanceUI from "./CardInstanceUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const environment = EnvironmentFactory.createHugeShipEnvironment();
const store = environment.store();
store.dispatch(Action.setResourceBase(resourceBase));

const pilotInstance2 = environment.pilotInstances()[2];
const pilotInstance2Fore = pilotInstance2.tokenFore();
const pilotInstance2Aft = pilotInstance2.tokenAft();
const pilotInstance3 = environment.pilotInstances()[3];
const pilotInstance3Fore = pilotInstance3.tokenFore();
const pilotInstance3Aft = pilotInstance3.tokenAft();

const cells = [];

addCardInstanceUI(cells, pilotInstance2Fore);
addCardInstanceUI(cells, pilotInstance2Aft);
addCardInstanceUI(cells, pilotInstance3Fore);
addCardInstanceUI(cells, pilotInstance3Aft);

ReactDOM.render(ReactDOMFactories.div(
{}, cells), document.getElementById("panel"));

function addCardInstanceUI(cells, cardInstance)
{
   const element = React.createElement(ReactRedux.Provider,
   {
      store: store,
   }, React.createElement(CardInstanceUI,
   {
      cardInstance: cardInstance,
   }));

   cells.push(ReactDOMFactories.div(
   {
      key: "card" + cells.length,
      className: "v-top",
   }, element));
}