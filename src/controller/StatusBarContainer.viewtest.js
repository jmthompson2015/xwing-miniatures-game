import Logger from "../utility/Logger.js";

import Phase from "../artifact/Phase.js";

import Action from "../model/Action.js";
import EnvironmentAction from "../model/EnvironmentAction.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";
import Reducer from "../model/Reducer.js";

import StatusBarContainer from "./StatusBarContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const store = Redux.createStore(Reducer.root);
const environment = EnvironmentFactory.createCoreSetEnvironment(store);
store.dispatch(EnvironmentAction.addRound(12));
store.dispatch(Action.enqueuePhase(Phase.COMBAT_ROLL_ATTACK_DICE));
store.dispatch(EnvironmentAction.setActiveToken(environment.pilotInstances()[0]));
store.dispatch(Action.setUserMessage("Somebody attacked someone."));

const element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(StatusBarContainer));
ReactDOM.render(element, document.getElementById("inputArea"));