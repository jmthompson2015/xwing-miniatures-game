import Ship from "../artifact/Ship.js";
import ShipFaction from "../artifact/ShipFaction.js";

import Select from "./Select.js";
import ShipSilhouetteUI from "./ShipSilhouetteUI.js";

class ShipChooser extends React.Component
{
   constructor(props)
   {
      super(props);

      const initialShip = props.initialShip;
      const shipKey = (initialShip !== undefined ? initialShip.key : undefined);

      this.state = {
         shipKey: shipKey,
      };

      this.shipChanged = this.shipChangedFunction.bind(this);
   }

   render()
   {
      const faction = this.props.faction;
      const values = ShipFaction.shipKeysByFaction(faction.key);
      values.unshift(this.SHIP_PROMPT);

      const labelFunction = function(value)
      {
         const ship = Ship.properties[value];
         return (ship ? ship.name : value);
      };

      const shipKey = this.state.shipKey;
      const select = React.createElement(Select,
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

      const ship = Ship.properties[shipKey];

      if (ship)
      {
         const image = React.createElement(ShipSilhouetteUI,
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
   const shipKey = event.currentTarget.value;
   const index = parseInt(event.currentTarget.dataset.index);

   this.setState(
   {
      shipKey: shipKey,
   });

   const ship = Ship.properties[shipKey];
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