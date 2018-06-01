var CardImage = createReactClass(
{
   render: function()
   {
      return ReactDOMFactories.img(
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

   // return this.props.resourceBase + "../../lib/xwing-data/images/" + card.image;
   let answer;
   // if (card.image !== undefined && (card.image.startsWith("src/") || card.image.startsWith("resource/")))
   // console.log("card.image = " + card.image);
   // console.log("card.image.indexOf(\"resource/\") = " + card.image.indexOf("resource/"));
   if (card.image !== undefined && card.image.indexOf("resource/") >= 0)
   {
      answer = this.props.resourceBase + card.image;
   }
   else
   {
      answer = "https://cdn.jsdelivr.net/npm/xwing-data@0.65.0/images/" + card.image;
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

export default CardImage;