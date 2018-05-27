"use strict";

var prefix = "accessory/xwing-data-converter/";
var suffix = "Test";
var testModules = ["EnumGenerator", "FactionConverter", "PilotConverter", "ShipConverter", "ShipFactionConverter", "UpgradeConverter", "XWingData",
      "XWingType"
    ];
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