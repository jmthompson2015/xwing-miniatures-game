import ImageWithLabelUI from "./ImageWithLabelUI.js";

class ShipSilhouetteUI extends React.Component
{
   render()
   {
      const ship = this.props.ship;
      let shipName = ship.name.replace(/\//g, "_"); // forward slash
      shipName = shipName.replace(/ /g, "_");
      const src = this.props.resourceBase + "silhouette/" + shipName + ".png";
      const label = ship.name;

      return React.createElement(ImageWithLabelUI,
      {
         src: src,
         label: label,
         showLabel: this.props.showLabel,
      });
   }
}

ShipSilhouetteUI.propTypes = {
   ship: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,

   showLabel: PropTypes.bool,
};

ShipSilhouetteUI.defaultProps = {
   showLabel: false,
};

export default ShipSilhouetteUI;