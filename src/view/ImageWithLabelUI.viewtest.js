import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";
import UpgradeType from "../artifact/UpgradeType.js";

import ImageWithLabelUI from "./ImageWithLabelUI.js";
import ReactUtilities from "./ReactUtilities.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const faction = Faction.properties[Faction.IMPERIAL];
const size = 24;
const upgradeType = UpgradeType.properties[UpgradeType.ELITE];
const typeName = upgradeType.name.replace(" ", "");
const resourceBase = "../resource/";
const className = "ba b--silver bg-near-white f6 tl v-mid";
const rows = [];

const image0 = React.createElement(ImageWithLabelUI,
{
   src: resourceBase + "faction/" + size + "/" + faction.image,
   label: faction.name,
});

const image1 = React.createElement(ImageWithLabelUI,
{
   src: resourceBase + "faction/" + size + "/" + faction.image,
   label: faction.name,
   showLabel: true,
});

let cells = [];

cells.push(ReactUtilities.createCell(image0, "standard", className));
cells.push(ReactUtilities.createCell(image1, "standard+label", className));

rows.push(ReactUtilities.createRow(cells, rows.length));

const image2 = React.createElement(ImageWithLabelUI,
{
   src: resourceBase + "upgradeType/" + typeName + "24.png",
   label: upgradeType.name,
});

const image3 = React.createElement(ImageWithLabelUI,
{
   src: resourceBase + "upgradeType/" + typeName + "24.png",
   label: upgradeType.name,
   showLabel: true,
});

cells = [];

cells.push(ReactUtilities.createCell(image2, "standard", className));
cells.push(ReactUtilities.createCell(image3, "standard+label", className));

rows.push(ReactUtilities.createRow(cells, rows.length));

ReactDOM.render(ReactUtilities.createTable(rows), document.getElementById("upgradeTypePanel"));