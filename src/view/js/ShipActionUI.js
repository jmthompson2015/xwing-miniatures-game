"use strict";

define(["create-react-class", "prop-types", "react-dom-factories"],
   function(createReactClass, PropTypes, DOM)
   {
      var ShipActionUI = createReactClass(
      {
         propTypes:
         {
            shipAction: PropTypes.object.isRequired,
            resourceBase: PropTypes.string.isRequired,

            // default: ship action value
            myKey: PropTypes.string,
            // default: false
            showName: PropTypes.bool,
         },

         render: function()
         {
            var shipAction = this.props.shipAction;

            var actionName = shipAction.name.replace(" (left)", "Left");
            actionName = actionName.replace(" (straight)", "Straight");
            actionName = actionName.replace(" (right)", "Right");
            actionName = actionName.replace(/ /g, "");
            var fileString = this.props.resourceBase + "action/" + actionName + "24.png";
            var myKey = (this.props.myKey !== undefined ? this.props.myKey : shipAction.key);

            var image = DOM.img(
            {
               key: myKey,
               className: "shipActionUIImage",
               src: fileString,
               title: shipAction.name,
            });
            var showName = (this.props.showName !== undefined ? this.props.showName : false);

            var answer = image;

            if (showName)
            {
               answer = DOM.span(
               {
                  className: "shipActionUIImage",
               }, image, " ", shipAction.name);
            }

            return answer;
         },
      });

      return ShipActionUI;
   });
