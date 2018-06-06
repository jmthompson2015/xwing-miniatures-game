import CardInstanceUI from "./CardInstanceUI.js";

class PilotsUI extends React.Component
{
   render()
   {
      var tokens = this.props.tokens;

      var tokenElements = tokens.map(function(token, i)
      {
         var element = React.createElement(CardInstanceUI,
         {
            cardInstance: token,
         });
         return ReactDOMFactories.td(
         {
            key: i,
            className: "alignTop v-top",
         }, element);
      }, this);

      var row = ReactDOMFactories.tr(
      {}, tokenElements);

      var myTable = ReactDOMFactories.table(
      {
         className: "center"
      }, ReactDOMFactories.tbody(
      {}, row));

      return ReactDOMFactories.div(
      {}, myTable);
   }
}

PilotsUI.propTypes = {
   tokens: PropTypes.array.isRequired,
   resourceBase: PropTypes.string.isRequired,
};

export default PilotsUI;