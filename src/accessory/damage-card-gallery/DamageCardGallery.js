import Logger from "../../utility/Logger.js";

import DamageCard from "../../artifact/DamageCard.js";

import CardImage from "../../view/CardImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";

var DamageGallery = createReactClass(
{
   render: function()
   {
      var damageKeys = this.props.damageKeys;

      var cells = [];

      damageKeys.forEach(function(damageKey)
      {
         var element = React.createElement(CardImage,
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
   },
});

var rows = [];

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

var mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));