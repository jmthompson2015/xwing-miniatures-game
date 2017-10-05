"use strict";

define(["create-react-class", "prop-types", "react-dom-factories"],
   function(createReactClass, PropTypes, DOM)
   {
      var FactionUI = createReactClass(
      {
         render: function()
         {
            var faction = this.props.faction;

            var myKey = (this.props.myKey !== undefined ? this.props.myKey : faction.key);
            var size = (this.props.isSmall ? 24 : 32);
            var src = this.createSrc(faction, size);
            var icon = DOM.img(
            {
               key: myKey,
               className: "factionUIImage",
               height: size,
               src: src,
               title: faction.name,
            });

            var answer = icon;

            var showName = this.props.showName;

            if (showName)
            {
               answer = DOM.span(
               {}, icon, " ", faction.name);
            }

            return answer;
         },

         createSrc: function(faction, size)
         {
            var resourceBase = this.props.resourceBase;

            return resourceBase + "faction/" + size + "/" + faction.image;
         },
      });

      FactionUI.propTypes = {
         faction: PropTypes.object.isRequired,
         resourceBase: PropTypes.string.isRequired,

         isSmall: PropTypes.bool,
         // default: faction value
         myKey: PropTypes.string,
         showName: PropTypes.bool,
      };

      FactionUI.defaultProps = {
         isSmall: false,
         showName: false,
      };

      return FactionUI;
   });
