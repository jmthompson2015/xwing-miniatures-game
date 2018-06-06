import Ship from "../artifact/Ship.js";
import ShipFaction from "../artifact/ShipFaction.js";

import Select from "./Select.js";
import ShipSilhouetteUI from "./ShipSilhouetteUI.js";

class ShipChooser extends React.Component
{
   constructor(props)
   {
      super(props);

      var initialShip = props.initialShip;
      var shipKey = (initialShip !== undefined ? initialShip.key : undefined);

      this.state = {
         shipKey: shipKey,
      };

      this.shipChanged = this.shipChangedFunction.bind(this);
   }

   render()
   {
      var faction = this.props.faction;
      var values = ShipFaction.shipKeysByFaction(faction.key);
      values.unshift(this.SHIP_PROMPT);

      var labelFunction = function(value)
      {
         var ship = Ship.properties[value];
         return (ship ? ship.name : value);
      };

      var shipKey = this.state.shipKey;
      var select = React.createElement(Select,
      {
         values: values,
         labelFunction: labelFunction,
         initialSelectedValue: shipKey,
         onChange: this.shipChanged,
         clientProps:
         {
            "data-index": this.props.index,
         }
      });

      var ship = Ship.properties[shipKey];

      if (ship)
      {
         var image = React.createElement(ShipSilhouetteUI,
         {
            ship: ship,
            resourceBase: this.props.resourceBase,
         });

         return ReactDOMFactories.span(
         {}, image, " ", select);
      }
      else
      {
         return select;
      }
   }
}

ShipChooser.prototype.shipChangedFunction = function(event)
{
   var shipKey = event.currentTarget.value;
   var index = parseInt(event.currentTarget.dataset.index);

   this.setState(
   {
      shipKey: shipKey,
   });

   var ship = Ship.properties[shipKey];
   this.props.onChange(event, ship, index);
};

ShipChooser.SHIP_PROMPT = "Select a ship";

ShipChooser.propTypes = {
   resourceBase: PropTypes.string.isRequired,
   onChange: PropTypes.func.isRequired,
   faction: PropTypes.object.isRequired,

   index: PropTypes.number,
   initialShip: PropTypes.object,
};

export default ShipChooser;