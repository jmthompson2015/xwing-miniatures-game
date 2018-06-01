import Logger from "../utility/Logger.js";

import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";
import UpgradeType from "../artifact/UpgradeType.js";

import UpgradeChooser from "./UpgradeChooser.js";

// require(["react", "react-dom", "utility/Logger",
// 		"artifact/PilotCard", "artifact/UpgradeCard", "artifact/UpgradeType", "view/UpgradeChooser"
// 	],
// 	function(React, ReactDOM, Logger, PilotCard, UpgradeCard, UpgradeType, UpgradeChooser)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var pilot = PilotCard.properties[PilotCard.DARTH_VADER];
var upgradeType = UpgradeType.properties[UpgradeType.ELITE];

var element1 = React.createElement(UpgradeChooser,
{
   resourceBase: resourceBase,
   pilot: pilot,
   upgradeType: upgradeType,
   onChange: upgradeCardChanged
});
ReactDOM.render(element1, document.getElementById("upgradeChooserPanel1"));

var element2 = React.createElement(UpgradeChooser,
{
   resourceBase: resourceBase,
   initialUpgrade: UpgradeCard.properties[UpgradeCard.JUKE],
   pilot: pilot,
   pilotIndex: 0,
   upgradeType: upgradeType,
   upgradeIndex: 2,
   onChange: upgradeCardChanged
});
ReactDOM.render(element2, document.getElementById("upgradeChooserPanel2"));

function upgradeCardChanged(event, pilotIndex, upgrade, upgradeIndex)
{
   LOGGER.info("upgradeCardChanged() pilotIndex = " + pilotIndex + " upgrade = " + (upgrade ? upgrade.key : upgrade) + " upgradeIndex = " + upgradeIndex);
}