"use strict";

define(["create-react-class", "prop-types", "react-dom-factories", "common/js/MathUtilities"],
   function(createReactClass, PropTypes, DOM, MathUtilities)
   {
      var AbilityCountUI = createReactClass(
      {
         render: function()
         {
            var implementedCount = this.props.implementedCount;
            var abilityCount = this.props.abilityCount;
            var ratio = MathUtilities.round(100.0 * implementedCount / abilityCount, 0);

            return DOM.span(
               {}, "Implemented ", implementedCount, " / ",
               abilityCount, " = ", ratio, "%");
         },
      });

      AbilityCountUI.propTypes = {
         implementedCount: PropTypes.number.isRequired,
         abilityCount: PropTypes.number.isRequired,
      };

      return AbilityCountUI;
   });
