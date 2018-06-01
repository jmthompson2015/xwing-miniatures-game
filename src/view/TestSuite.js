import Logger from "../utility/Logger.js";

import SquadColumnsTest from "./SquadColumns.test.js";
import UpgradeTypeComparatorTest from "./UpgradeTypeComparator.test.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);
LOGGER.setInfoEnabled(false);

QUnit.start();