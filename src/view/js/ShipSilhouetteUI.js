"use strict";

define(["create-react-class", "prop-types", "react-dom-factories"],
   function(createReactClass, PropTypes, DOM)
   {
      var ShipSilhouetteUI = createReactClass(
      {
         render: function()
         {
            var ship = this.props.ship;
            var shipName = ship.name.replace(/\//g, "_"); // forward slash
            shipName = shipName.replace(/ /g, "_");
            var fileString = this.props.resourceBase + "silhouette/" + shipName + ".png";
            var myKey = (this.props.myKey !== undefined ? this.props.myKey : ship.key);

            var image = DOM.img(
            {
               key: myKey,
               className: "shipSilhouetteUIImage",
               src: fileString,
               title: ship.name,
            });

            var answer = image;

            if (this.props.showName)
            {
               answer = DOM.span(
               {
                  className: "shipSilhouetteUIImage",
               }, image, " ", ship.name);
            }

            return answer;
         },
      });

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

      return ShipSilhouetteUI;
   });
