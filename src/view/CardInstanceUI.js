import TargetLock from "../model/TargetLock.js";

import CardInstancesArea from "./CardInstancesArea.js";
import ReactUtilities from "./ReactUtilities.js";

import CardImageContainer from "../controller/CardImageContainer.js";
import TokenPanelContainer from "../controller/TokenPanelContainer.js";

class CardInstanceUI extends React.Component
{
   constructor(props)
   {
      super(props);

      this.state = {
         isSmall: true,
      };

      this.toggleSize = this.toggleSizeFunction.bind(this);
   }

   render()
   {
      const columns = [];
      const cardInstance = this.props.cardInstance;

      if (cardInstance)
      {
         const image = this.createCardImage(cardInstance);
         const tokenPanel = this.createTokenPanel(cardInstance);
         const cell = ReactDOMFactories.div(
         {
            key: "imagePanel" + columns.length,
            className: "v-mid",
            onClick: this.toggleSize,
         }, image);

         columns.push(cell);
         columns.push(tokenPanel);
         this.createAttachmentPanel(columns, cardInstance);
      }

      return ReactUtilities.createFlexboxWrap(columns, "cardInstanceUI", "bg-xw-medium items-center justify-center ma0 pa0");
   }
}

CardInstanceUI.prototype.toggleSizeFunction = function()
{
   this.setState(
   {
      isSmall: !this.state.isSmall,
   });
};

CardInstanceUI.prototype.createAttachmentPanel = function(columns, cardInstance)
{
   const upgrades = cardInstance.upgrades();
   const attachments = [];

   if (upgrades.size > 0)
   {
      for (let i = 0; i < upgrades.size; i++)
      {
         const upgradeInstance = upgrades.get(i);
         const upgradeUI = this.createAttachmentUI(upgradeInstance);
         attachments.push(upgradeUI);
      }
   }

   const damages = cardInstance.criticalDamages();

   if (damages.size > 0)
   {
      for (let j = 0; j < damages.size; j++)
      {
         const damageInstance = damages.get(j);
         const damageUI = this.createAttachmentUI(damageInstance);
         attachments.push(damageUI);
      }
   }

   columns.push(React.createElement(CardInstancesArea,
   {
      key: "attachmentPanel",
      cardInstanceUIs: attachments,
      isExpanded: false,
   }));
};

CardInstanceUI.prototype.createAttachmentUI = function(cardInstance)
{
   return React.createElement(CardInstanceUI,
   {
      key: "attachment" + cardInstance.id(),
      cardInstance: cardInstance,
      width: this.props.width / 1.4,
   });
};

CardInstanceUI.prototype.createCardImage = function(cardInstance)
{
   let width = this.props.width;

   if (this.state.isSmall)
   {
      width /= 2;
   }

   return React.createElement(CardImageContainer,
   {
      myKey: cardInstance.toString(),
      cardInstance: cardInstance,
      width: width,
   });
};

CardInstanceUI.prototype.createTokenPanel = function(cardInstance)
{
   const store = cardInstance.store();
   const attackerTargetLocks = TargetLock.getByAttacker(store, cardInstance);
   const defenderTargetLocks = TargetLock.getByDefender(store, cardInstance);

   return React.createElement(TokenPanelContainer,
   {
      key: "token" + cardInstance.id(),
      cardInstance: cardInstance,
      attackerTargetLocks: attackerTargetLocks,
      defenderTargetLocks: defenderTargetLocks,
   });
};

CardInstanceUI.propTypes = {
   cardInstance: PropTypes.object, // default: undefined
   width: PropTypes.number,
};

CardInstanceUI.defaultProps = {
   width: 250,
};

export default CardInstanceUI;