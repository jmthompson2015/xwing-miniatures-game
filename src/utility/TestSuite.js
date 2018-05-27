"use strict";

var prefix = "utility/";
var suffix = ".test";
var testModules = ["ArrayUtilities", "InputValidator", "JSONFileLoader", "MathUtilities", "TimePrinter"];
testModules = testModules.map(function(testModule)
{
   return prefix + testModule + suffix;
});
testModules.unshift("utility/Logger");

require(testModules, function(Logger)
{
   window.LOGGER = new Logger();
   LOGGER.setTraceEnabled(false);
   LOGGER.setDebugEnabled(false);
   LOGGER.setInfoEnabled(false);

   QUnit.start();
});