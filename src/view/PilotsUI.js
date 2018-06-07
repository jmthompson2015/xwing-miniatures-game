import CardInstanceUI from "./CardInstanceUI.js";

class PilotsUI extends React.Component
{
   render()
   {
      const tokens = this.props.tokens;

      const tokenElements = tokens.map(function(token, i)
      {
         const element = React.createElement(CardInstanceUI,
         {
            cardInstance: token,
         });
         return ReactDOMFactories.td(
         {
            key: i,
            className: "alignTop v-top",
         }, element);
      }, this);

      const row = ReactDOMFactories.tr(
      {}, tokenElements);

      const myTable = ReactDOMFactories.table(
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