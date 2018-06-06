class ShipSilhouetteUI extends React.Component
{
   render()
   {
      var ship = this.props.ship;
      var shipName = ship.name.replace(/\//g, "_"); // forward slash
      shipName = shipName.replace(/ /g, "_");
      var fileString = this.props.resourceBase + "silhouette/" + shipName + ".png";
      var myKey = (this.props.myKey !== undefined ? this.props.myKey : ship.key);

      var image = ReactDOMFactories.img(
      {
         key: myKey,
         className: "shipSilhouetteUIImage v-mid",
         src: fileString,
         title: ship.name,
      });

      var answer = image;

      if (this.props.showName)
      {
         answer = ReactDOMFactories.span(
         {
            className: "shipSilhouetteUIImage v-mid",
         }, image, " ", ship.name);
      }

      return answer;
   }
}

ShipSilhouetteUI.propTypes = {
   ship: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,

   // default: ship value
   myKey: PropTypes.string,
   showName: PropTypes.bool,
};

ShipSilhouetteUI.defaultProps = {
   showName: false,
};

export default ShipSilhouetteUI;