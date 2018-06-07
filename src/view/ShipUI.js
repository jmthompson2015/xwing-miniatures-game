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

      const shipFaction = this.props.shipFaction;
      const image = new Image();
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

      const resourceBase = this.props.resourceBase;
      image.src = resourceBase + "ship/" + shipFaction.image;

      this.state = {
         image: image,
         isImageLoaded: false,
      };
   }

   render()
   {
      const shipFaction = this.props.shipFaction;
      const shipBase = shipFaction.ship.shipBase;

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
   const shipFaction = this.props.shipFaction;
   const shipBase = shipFaction.ship.shipBase;
   const canvas = document.getElementById(this.props.canvasId);
   const context = canvas.getContext("2d");
   const scale = 1.0;
   let id;
   const image = this.state.image;
   const position = this.props.position;

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