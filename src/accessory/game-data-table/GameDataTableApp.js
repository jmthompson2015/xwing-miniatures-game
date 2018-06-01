import Logger from "../../utility/Logger.js";

import GameDataTable from "./GameDataTable.js";

// require(["utility/Logger", "accessory/game-data-table/GameDataTable"],
//   function(Logger, GameDataTable)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var element = React.createElement(GameDataTable);
ReactDOM.render(element, document.getElementById("panel"));