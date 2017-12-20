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
            case CardType.PILOT:
            case CardType.UPGRADE:
               cardUrl = card.image;
               answer = this.props.resourceBase + "../../../lib/xwing-data/images/" + cardUrl;
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
