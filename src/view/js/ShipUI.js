"use strict";

define(["create-react-class", "prop-types", "react-dom-factories", "view/js/ShipImage"],
   function(createClassReact, PropTypes, DOM, ShipImage)
   {
      var ShipUI = createClassReact(
      {
         propTypes:
         {
            canvasId: PropTypes.string.isRequired,
            resourceBase: PropTypes.string.isRequired,
            position: PropTypes.object.isRequired,
            shipFaction: PropTypes.object.isRequired,
         },

         componentDidMount: function()
         {
            this.paint();
         },

         componentDidUpdate: function()
         {
            this.paint();
         },

         getInitialState: function()
         {
            var shipFaction = this.props.shipFaction;
            var image = new Image();
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

            var resourceBase = this.props.resourceBase;
            image.src = resourceBase + "ship/" + shipFaction.image;

            return (
            {
               image: image,
               isImageLoaded: false,
            });
         },

         render: function()
         {
            var shipFaction = this.props.shipFaction;
            var shipBase = shipFaction.ship.shipBase;

            return DOM.canvas(
            {
               id: this.props.canvasId,
               width: shipBase.width,
               height: shipBase.height,
               title: shipFaction.name,
            });
         },

         paint: function()
         {
            var shipFaction = this.props.shipFaction;
            var shipBase = shipFaction.ship.shipBase;
            var canvas = document.getElementById(this.props.canvasId);
            var context = canvas.getContext("2d");
            var scale = 1.0;
            var id;
            var image = this.state.image;
            var position = this.props.position;

            context.clearRect(0, 0, shipBase.width, shipBase.height);

            ShipImage.draw(context, scale, id, image, position, shipFaction);
         },
      });

      return ShipUI;
   });
