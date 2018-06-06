import ShipAction from "../artifact/ShipAction.js";

import ShipActionUI from "./ShipActionUI.js";

class ShipActionPanel extends React.Component
{
   render()
   {
      var shipActionKeys = this.props.shipActionKeys;
      var cells = [];

      shipActionKeys.forEach(function(shipActionKey, i)
      {
         var image = React.createElement(ShipActionUI,
         {
            shipAction: ShipAction.properties[shipActionKey],
         });

         cells.push(ReactDOMFactories.td(
         {
            key: shipActionKey + i,
         }, image));
      }, this);

      var row = ReactDOMFactories.tr(
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