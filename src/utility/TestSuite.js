import Logger from "./Logger.js";

import ArrayUtilitiesTest from "./ArrayUtilities.test.js";
import InputValidatorTest from "./InputValidator.test.js";
import JSONFileLoaderTest from "./JSONFileLoader.test.js";
import MathUtilitiesTest from "./MathUtilities.test.js";
import TimePrinterTest from "./TimePrinter.test.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);
LOGGER.setInfoEnabled(false);

QUnit.start();