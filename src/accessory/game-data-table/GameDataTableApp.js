import Logger from "../../utility/Logger.js";

import GameDataTable from "./GameDataTable.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const element = React.createElement(GameDataTable);
ReactDOM.render(element, document.getElementById("panel"));