"use strict";

define(["create-react-class", "prop-types", "react-dom-factories"],
   function(createReactClass, PropTypes, DOM)
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
         var card = this.props.card;

         return this.props.resourceBase + "../../../lib/xwing-data/images/" + card.image;
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
