import ShipAction from "../artifact/ShipAction.js";

import ShipActionUI from "./ShipActionUI.js";

class ShipActionPanel extends React.Component
{
   render()
   {
      const shipActionKeys = this.props.shipActionKeys;
      const cells = [];

      shipActionKeys.forEach(function(shipActionKey, i)
      {
         const image = React.createElement(ShipActionUI,
         {
            shipAction: ShipAction.properties[shipActionKey],
         });

         cells.push(ReactDOMFactories.td(
         {
            key: shipActionKey + i,
         }, image));
      }, this);

      const row = ReactDOMFactories.tr(
      {}, cells);
      return ReactDOMFactories.table(
      {
         className: "pilotCardUIShipActions center bg-xw-light",
      }, ReactDOMFactories.tbody(
      {}, row));
   }
}

ShipActionPanel.propTypes = {
   shipActionKeys: PropTypes.array.isRequired,
};

export default ShipActionPanel;