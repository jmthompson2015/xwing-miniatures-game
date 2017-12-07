"use strict";

define(["create-react-class", "prop-types", "react-dom-factories", "artifact/js/CardType"],
   function(createReactClass, PropTypes, DOM, CardType)
   {
      var CardImage = createReactClass(
      {
         render: function()
         {
            return DOM.img(
            {
               key: this.canvasId(),
               className: "br3",
               src: this.createSrc(),
               title: this.props.card.name,
               width: this.props.width,
            });
         },
      });

      CardImage.prototype.canvasId = function()
      {
         return this.props.card.key + this.props.isFaceUp + "CardImageCanvas" + this.props.myKey + this.props.width;
      };

      CardImage.prototype.createSrc = function()
      {
         var answer;
         var card = this.props.card;
         var cardUrl;

         switch (card.cardTypeKey)
         {
            case CardType.DAMAGE:
               var damageDeckTypeUrl = (card.key.endsWith("V2") ? "core-tfa/" : "core/");
               cardUrl = card.imagePath;
               answer = this.props.resourceBase + "../../../lib/xwing-data/images/damage-decks/" + damageDeckTypeUrl + cardUrl;
               break;
            case CardType.PILOT:
               var faction = card.shipFaction.faction;
               var factionUrl = faction.imagePath;
               var ship = card.shipFaction.ship;
               var shipUrl = ship.name.replace(/\//, "-") + "/";
               cardUrl = card.imagePath;
               answer = this.props.resourceBase + "../../../lib/xwing-data/images/pilots/" + factionUrl + shipUrl + cardUrl;
               break;
            case CardType.UPGRADE:
               var upgradeType = card.type;
               var upgradeTypeUrl = upgradeType.imagePath;
               cardUrl = card.imagePath;
               answer = this.props.resourceBase + "../../../lib/xwing-data/images/upgrades/" + upgradeTypeUrl + cardUrl;
               break;
            default:
               throw "Unhandled cardTypeKey: " + card.cardTypeKey + " for card: " + card + " " + card.name;
         }

         return answer;
      };

      CardImage.propTypes = {
         card: PropTypes.object.isRequired,
         resourceBase: PropTypes.string.isRequired,

         isFaceUp: PropTypes.bool,
         myKey: PropTypes.string, // default: undefined
         width: PropTypes.number,
      };

      CardImage.defaultProps = {
         isFaceUp: true,
         width: 250,
      };

      return CardImage;
   });
