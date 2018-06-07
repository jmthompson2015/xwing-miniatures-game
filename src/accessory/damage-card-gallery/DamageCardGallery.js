import Logger from "../../utility/Logger.js";

import DamageCard from "../../artifact/DamageCard.js";

import CardImage from "../../view/CardImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../../../src/resource/";

class DamageGallery extends React.Component
{
   render()
   {
      const damageKeys = this.props.damageKeys;

      const cells = [];

      damageKeys.forEach(function(damageKey)
      {
         const element = React.createElement(CardImage,
         {
            key: "damageInstance" + damageKey,
            card: DamageCard.properties[damageKey],
            resourceBase: resourceBase,
            width: 135,
         });
         cells.push(element);
      });

      return ReactDOMFactories.div(
      {}, cells);
   }
}

const rows = [];

rows.push(ReactDOMFactories.h2(
{
   key: "damageHeader" + rows.length,
}, "Version 1"));

rows.push(React.createElement(DamageGallery,
{
   key: "damageGallery" + rows.length,
   damageKeys: DamageCard.keysV1(),
}));

rows.push(ReactDOMFactories.h2(
{
   key: "damageHeader" + rows.length,
}, "Version 2"));

rows.push(React.createElement(DamageGallery,
{
   key: "damageGallery" + rows.length,
   damageKeys: DamageCard.keysV2(),
}));

const mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));