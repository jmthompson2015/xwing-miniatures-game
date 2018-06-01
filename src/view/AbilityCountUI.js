import MathUtilities from "../utility/MathUtilities.js";

var AbilityCountUI = createReactClass(
{
   render: function()
   {
      var implementedCount = this.props.implementedCount;
      var abilityCount = this.props.abilityCount;
      var ratio = MathUtilities.round(100.0 * implementedCount / abilityCount, 0);

      return ReactDOMFactories.span(
         {}, "Implemented ", implementedCount, " / ",
         abilityCount, " = ", ratio, "%");
   },
});

AbilityCountUI.propTypes = {
   implementedCount: PropTypes.number.isRequired,
   abilityCount: PropTypes.number.isRequired,
};

export default AbilityCountUI;