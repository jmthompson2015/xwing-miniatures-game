class StatusBarUI extends React.Component
{
   render()
   {
      const round = this.props.round;
      const phase = this.props.phase;
      const phaseName = (phase ? phase.name : " ");
      const activeShipName = (this.props.activeShipName ? this.props.activeShipName : " ");
      const userMessage = this.props.userMessage;

      const roundUI = ReactDOMFactories.span(
      {}, "Round: ", round);
      const phaseUI = ReactDOMFactories.span(
      {}, "Phase: ", phaseName);
      const activePilotUI = ReactDOMFactories.span(
      {}, "Active Ship: ", activeShipName);
      const messageAreaUI = ReactDOMFactories.span(
      {}, userMessage);
      const helpLinkUI = ReactDOMFactories.a(
      {
         href: "view/help.html",
         target: "_blank",
      }, "Help");

      const cells = [];

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

      const row = ReactDOMFactories.tr(
      {}, cells);

      return ReactDOMFactories.table(
      {
         className: "statusBarUI bg-xw-light w-100",
      }, ReactDOMFactories.tbody(
      {}, row));
   }
}

StatusBarUI.propTypes = {
   activeShipName: PropTypes.string.isRequired,
   phase: PropTypes.object.isRequired,
   round: PropTypes.number.isRequired,
   userMessage: PropTypes.string.isRequired,
};

export default StatusBarUI;