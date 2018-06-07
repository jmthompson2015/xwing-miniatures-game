import MathUtilities from "../utility/MathUtilities.js";

class AbilityCountUI extends React.Component
{
   render()
   {
      const implementedCount = this.props.implementedCount;
      const abilityCount = this.props.abilityCount;
      const ratio = MathUtilities.round(100.0 * implementedCount / abilityCount, 0);

      return ReactDOMFactories.span(
         {}, "Implemented ", implementedCount, " / ",
         abilityCount, " = ", ratio, "%");
   }
}

AbilityCountUI.propTypes = {
   implementedCount: PropTypes.number.isRequired,
   abilityCount: PropTypes.number.isRequired,
};

export default AbilityCountUI;