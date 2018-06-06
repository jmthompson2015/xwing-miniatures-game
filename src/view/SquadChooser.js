import InputValidator from "../utility/InputValidator.js";

import Select from "./Select.js";
import SquadUI from "./SquadUI.js";

class SquadChooser extends React.Component
{
   constructor(props)
   {
      super(props);

      var squadBuilders = this.props.squadBuilders;
      InputValidator.validateNotEmpty("squadBuilders", squadBuilders);

      this.state = {
         squadBuilder: squadBuilders[0],
      };

      this.handleSquadChange = this.handleSquadChangeFunction.bind(this);
   }

   render()
   {
      var squadLabelFunction = function(value)
      {
         return value.toString();
      };
      var squadBuilders = this.props.squadBuilders;
      var selectedSquadBuilder = this.state.squadBuilder;
      var squadChooserSelect = React.createElement(Select,
      {
         values: squadBuilders,
         labelFunction: squadLabelFunction,
         initialSelectedValue: selectedSquadBuilder,
         onChange: this.handleSquadChange,
      });
      var agent = this.props.agent;
      var mySquad = selectedSquadBuilder.buildSquad(agent);
      var squadDisplayPanel = React.createElement(SquadUI,
      {
         resourceBase: this.props.resourceBase,
         squad: mySquad,
      });

      var rows = [];
      var cells = [];
      cells.push(ReactDOMFactories.td(
      {
         key: "squadLabel",
      }, "Squad:"));
      cells.push(ReactDOMFactories.td(
      {
         key: "squadChooserSelect",
         className: "squadChooserSelect",
      }, squadChooserSelect));
      rows.push(ReactDOMFactories.tr(
      {
         key: "selectRow",
      }, cells));

      rows.push(ReactDOMFactories.tr(
      {
         key: "displayRow",
      }, ReactDOMFactories.td(
      {
         colSpan: 2,
      }, squadDisplayPanel)));

      return ReactDOMFactories.table(
      {
         className: "squadChooser",
      }, ReactDOMFactories.tbody(
      {}, rows));
   }
}

SquadChooser.prototype.handleSquadChangeFunction = function(event)
{
   LOGGER.debug("SquadChooser.handleSquadChange() event.target.selectedIndex = " + event.target.selectedIndex);
   var squadBuilder = this.props.squadBuilders[event.target.selectedIndex];
   this.setState(
   {
      squadBuilder: squadBuilder,
   });
   LOGGER.debug("SquadChooser.handleSquadChange() squadBuilder = " + squadBuilder);

   if (this.props.onChange)
   {
      this.props.onChange(squadBuilder);
   }
};

SquadChooser.propTypes = {
   agent: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
   squadBuilders: PropTypes.array.isRequired,

   onChange: PropTypes.func,
};

export default SquadChooser;