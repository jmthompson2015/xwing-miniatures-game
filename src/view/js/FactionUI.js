"use strict";

define(["create-react-class", "prop-types", "react-dom-factories", "common/js/InputValidator"],
   function(createReactClass, PropTypes, DOM, InputValidator)
   {
      var FactionUI = createReactClass(
      {
         propTypes:
         {
            faction: PropTypes.object.isRequired,
            resourceBase: PropTypes.string.isRequired,

            // default: false
            isSmall: PropTypes.bool,
            // default: faction value
            myKey: PropTypes.string,
            // default: false
            showName: PropTypes.bool,
         },

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

            var showName = (this.props.showName !== undefined ? this.props.showName : false);

            if (showName)
            {
               answer = DOM.span(
               {}, icon, " ", faction.name);
            }

            return answer;
         },

         createSrc: function(faction, size)
         {
            InputValidator.validateNotNull("faction", faction);

            var resourceBase = this.props.resourceBase;
            var factionUrls = ["galactic-empire", "first-order", "rebel-alliance", "resistance", "scum-and-villainy"];
            var factions = ["imperial", "firstOrder", "rebel", "resistance", "scum"];
            var factionUrl = factionUrls[factions.indexOf(faction.key)];

            return resourceBase + "faction/" + size + "/" + factionUrl + ".png";
         },
      });

      return FactionUI;
   });
