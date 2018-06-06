import ShipImage from "./ShipImage.js";

class ShipUI extends React.Component
{
   componentDidMount()
   {
      this.paint();
   }

   componentDidUpdate()
   {
      this.paint();
   }

   constructor(props)
   {
      super(props);

      var shipFaction = this.props.shipFaction;
      var image = new Image();
      image.onload = function()
      {
         if (!this.state.isImageLoaded)
         {
            this.setState(
            {
               isImageLoaded: true,
            });
         }
      }.bind(this);

      var resourceBase = this.props.resourceBase;
      image.src = resourceBase + "ship/" + shipFaction.image;

      this.state = {
         image: image,
         isImageLoaded: false,
      };
   }

   render()
   {
      var shipFaction = this.props.shipFaction;
      var shipBase = shipFaction.ship.shipBase;

      return ReactDOMFactories.canvas(
      {
         id: this.props.canvasId,
         width: shipBase.width,
         height: shipBase.height,
         title: shipFaction.name,
      });
   }
}

ShipUI.prototype.paint = function()
{
   var shipFaction = this.props.shipFaction;
   var shipBase = shipFaction.ship.shipBase;
   var canvas = document.getElementById(this.props.canvasId);
   var context = canvas.getContext("2d");
   var scale = 1.0;
   var id;
   var image = this.state.image;
   var position = this.props.position;

   context.clearRect(0, 0, shipBase.width, shipBase.height);

   ShipImage.draw(context, scale, id, image, position, shipFaction);
};

ShipUI.propTypes = {
   canvasId: PropTypes.string.isRequired,
   resourceBase: PropTypes.string.isRequired,
   position: PropTypes.object.isRequired,
   shipFaction: PropTypes.object.isRequired,
};

export default ShipUI;