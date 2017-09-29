"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "common/js/InputValidator",
  "artifact/js/ShipState", "artifact/js/Faction", "view/js/LabeledImage"],
   function(createClassReact, PropTypes, React, DOM, InputValidator, ShipState, Faction, LabeledImage)
   {
      var ShipStateUI = createClassReact(
      {
         render: function()
         {
            var shipState = this.props.shipState;
            var faction = this.determineFaction(this.props.faction);
            var size = (shipState.key === ShipState.PILOT_SKILL ? 32 : 24);
            var src = this.createFilename(faction, shipState, size);
            var myKey = (this.props.myKey !== undefined ? this.props.myKey : shipState.key);
            var label = this.props.label;
            var cellStyle = {
               display: "table-cell",
               verticalAlign: "middle",
            };
            var image;

            if (label !== undefined)
            {
               image = React.createElement(LabeledImage,
               {
                  image: src,
                  resourceBase: this.props.resourceBase,
                  label: label,
                  labelClass: this.props.labelClass,
                  showOne: this.props.showOne,
                  style: cellStyle,
                  width: size,
               });
            }
            else
            {
               image = DOM.img(
               {
                  src: this.props.resourceBase + src,
                  style: cellStyle,
               });
            }

            var cell0 = DOM.div(
            {
               key: myKey,
               style: cellStyle,
               title: shipState.name,
            }, image);

            var showName = (this.props.showName !== undefined ? this.props.showName : false);
            var answer = cell0;

            if (showName)
            {
               var cell1 = DOM.div(
               {
                  className: "shipStateUIText",
                  style: cellStyle,
               }, shipState.name);
               var row = DOM.div(
               {
                  style:
                  {
                     display: "table-row",
                  },
               }, cell0, cell1);
               answer = DOM.div(
               {
                  style:
                  {
                     display: "table",
                  },
               }, row);
            }

            return answer;
         },

         createFilename: function(faction, shipState, size)
         {
            InputValidator.validateNotNull("faction", faction);
            InputValidator.validateNotNull("shipState", shipState);
            InputValidator.validateNotNull("size", size);

            var factionName = faction.shortName;
            var shipStateName;

            switch (shipState.key)
            {
               case ShipState.PILOT_SKILL:
                  shipStateName = "Skill";
                  break;
               case ShipState.PRIMARY_WEAPON:
                  shipStateName = "Weapon";
                  break;
               case ShipState.TURRET_WEAPON:
                  shipStateName = "Turret_Weapon";
                  break;
               default:
                  shipStateName = shipState.name;
            }

            return "pilotCard/" + factionName + "_" + shipStateName + size + ".png";
         },

         determineFaction: function(faction)
         {
            InputValidator.validateNotNull("faction", faction);

            var answer = faction;

            if (faction.key === Faction.FIRST_ORDER ||
               faction.key === Faction.RESISTANCE)
            {
               var factionKey = Faction.friend(faction.key);
               answer = Faction.properties[factionKey];
            }

            return answer;
         },
      });

      ShipStateUI.propTypes = {
         faction: PropTypes.object.isRequired,
         resourceBase: PropTypes.string.isRequired,
         shipState: PropTypes.object.isRequired,

         // default: undefined
         label: PropTypes.string,
         // default: undefined
         labelClass: PropTypes.string,
         // default: ship state value
         myKey: PropTypes.string,
         showName: PropTypes.bool,
         showOne: PropTypes.bool,
      };

      ShipStateUI.defaultProps = {
         showName: false,
         showOne: false,
      };

      return ShipStateUI;
   });
