import Logger from "../utility/Logger.js";

import CardType from "../artifact/CardType.js";
import DamageCard from "../artifact/DamageCard.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import CardImage from "./CardImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";

const cells = [];
addCardImage(cells, DamageCard.properties[DamageCard.BLINDED_PILOT]);
addCardImage(cells, DamageCard.properties[DamageCard.CONSOLE_FIRE]);
addCardImage(cells, PilotCard.properties[PilotCard.DARTH_VADER]);
addCardImage(cells, PilotCard.properties[PilotCard.LUKE_SKYWALKER]);
addCardImage(cells, UpgradeCard.properties[UpgradeCard.A_WING_TEST_PILOT]);
addCardImage(cells, UpgradeCard.properties[UpgradeCard.BACKUP_SHIELD_GENERATOR]);

ReactDOM.render(ReactDOMFactories.div(
{}, cells), document.getElementById("panel"));

function addCardImage(cells, card, isReady, isFaceUp)
{
   const element = React.createElement(CardImage,
   {
      card: card,
      isFaceUp: isFaceUp,
      isReady: isReady,
      myKey: "" + cells.length,
      resourceBase: resourceBase,
      width: (card.cardTypeKey === CardType.PILOT ? 200 : 200 / 1.4),
   });

   cells.push(ReactDOMFactories.div(
   {
      key: "card" + cells.length,
      className: "bg-lotr-light fl v-top",
   }, element));
}