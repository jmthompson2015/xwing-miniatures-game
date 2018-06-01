var StatusBarUI = createReactClass(
{
   propTypes:
   {
      activeShipName: PropTypes.string.isRequired,
      phase: PropTypes.object.isRequired,
      round: PropTypes.number.isRequired,
      userMessage: PropTypes.string.isRequired,
   },

   render: function()
   {
      var round = this.props.round;
      var phase = this.props.phase;
      var phaseName = (phase ? phase.name : " ");
      var activeShipName = (this.props.activeShipName ? this.props.activeShipName : " ");
      var userMessage = this.props.userMessage;

      var roundUI = ReactDOMFactories.span(
      {}, "Round: ", round);
      var phaseUI = ReactDOMFactories.span(
      {}, "Phase: ", phaseName);
      var activePilotUI = ReactDOMFactories.span(
      {}, "Active Ship: ", activeShipName);
      var messageAreaUI = ReactDOMFactories.span(
      {}, userMessage);
      var helpLinkUI = ReactDOMFactories.a(
      {
         href: "view/help.html",
         target: "_blank",
      }, "Help");

      var cells = [];

      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: "statusBarUICell ba",
      }, roundUI));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: "statusBarUICell ba",
      }, phaseUI));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: "statusBarUICell ba",
      }, activePilotUI));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: "statusBarUICell ba",
      }, messageAreaUI));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: "statusBarUICell ba",
      }, helpLinkUI));

      var row = ReactDOMFactories.tr(
      {}, cells);

      return ReactDOMFactories.table(
      {
         className: "statusBarUI bg-xw-light w-100",
      }, ReactDOMFactories.tbody(
      {}, row));
   },
});

export default StatusBarUI;