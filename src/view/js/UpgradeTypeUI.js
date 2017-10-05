"use strict";

define(["create-react-class", "prop-types", "react-dom-factories"],
   function(createReactClass, PropTypes, DOM)
   {
      var UpgradeTypeUI = createReactClass(
      {
         render: function()
         {
            var upgradeType = this.props.upgradeType;
            var typeName0 = upgradeType.name;
            var typeName = typeName0.replace(" ", "");
            var fileString = this.props.resourceBase + "upgradeType/" + typeName + "24.png";
            var myKey = (this.props.myKey !== undefined ? this.props.myKey : upgradeType.key);

            var icon = DOM.img(
            {
               key: myKey,
               className: "upgradeTypeUIImage",
               src: fileString,
               title: typeName0,
            });

            var answer = icon;

            if (this.props.showName)
            {
               answer = DOM.span(
               {}, icon, " ", upgradeType.name);
            }

            return answer;
         },
      });

      UpgradeTypeUI.propTypes = {
         upgradeType: PropTypes.object.isRequired,
         resourceBase: PropTypes.string.isRequired,

         // default: upgrade type value
         myKey: PropTypes.string,
         showName: PropTypes.bool,
      };

      UpgradeTypeUI.defaultProps = {
         showName: false,
      };

      return UpgradeTypeUI;
   });
