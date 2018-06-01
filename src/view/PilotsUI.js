import CardInstanceUI from "./CardInstanceUI.js";

var PilotsUI = createReactClass(
{
   propTypes:
   {
      tokens: PropTypes.array.isRequired,
      resourceBase: PropTypes.string.isRequired,
   },

   render: function()
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
   },
});

export default PilotsUI;