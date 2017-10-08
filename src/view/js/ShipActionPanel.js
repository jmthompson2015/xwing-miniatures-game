"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "artifact/js/ShipAction", "view/js/ShipActionUI"],
   function(createReactClass, PropTypes, React, DOM, ShipAction, ShipActionUI)
   {
      var ShipActionPanel = createReactClass(
      {
         propTypes:
         {
            shipActionKeys: PropTypes.array.isRequired,
            resourceBase: PropTypes.string.isRequired,
         },

         render: function()
         {
            var shipActionKeys = this.props.shipActionKeys;
            var cells = [];

            shipActionKeys.forEach(function(shipActionKey, i)
            {
               var image = React.createElement(ShipActionUI,
               {
                  shipAction: ShipAction.properties[shipActionKey],
                  resourceBase: this.props.resourceBase,
               });

               cells.push(DOM.td(
               {
                  key: shipActionKey + i,
               }, image));
            }, this);

            var row = DOM.tr(
            {}, cells);
            return DOM.table(
            {
               className: "pilotCardUIShipActions center bg-xw-light",
            }, DOM.tbody(
            {}, row));
         },
      });

      return ShipActionPanel;
   });
