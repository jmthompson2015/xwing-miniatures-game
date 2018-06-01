import Maneuver from "../artifact/Maneuver.js";

import Button from "./Button.js";
import ManeuverChooser from "./ManeuverChooser.js";
import OptionPane from "./OptionPane.js";

var PlanningPanel = createReactClass(
{
   propTypes:
   {
      agent: PropTypes.object.isRequired,
      callback: PropTypes.func.isRequired,
      environment: PropTypes.object.isRequired,
      resourceBase: PropTypes.string.isRequired,
      tokens: PropTypes.array.isRequired,
   },

   getInitialState: function()
   {
      return (
      {
         tokenToManeuver:
         {},
      });
   },

   render: function()
   {
      var tokens = this.props.tokens;
      var self = this;
      var cells = [];

      for (var i = 0; i < tokens.length; i++)
      {
         var token = tokens[i];
         var maneuverKeys = token.maneuverKeys();
         var maneuvers = [];
         for (var m = 0; m < maneuverKeys.length; m++)
         {
            maneuvers.push(Maneuver.properties[maneuverKeys[m]]);
         }
         var element = React.createElement(ManeuverChooser,
         {
            callback: self.selectionChanged,
            resourceBase: this.props.resourceBase,
            maneuvers: maneuvers,
            pilotName: token.name(true),
            shipName: token.shipName(),
            tokenId: token.id(),
         });
         cells.push(ReactDOMFactories.td(
         {
            key: i,
            className: "planningTableCell v-top",
         }, element));
      }

      var initialInput = ReactDOMFactories.table(
      {}, ReactDOMFactories.tbody(
      {}, ReactDOMFactories.tr(
      {}, cells)));
      var disabled = Object.getOwnPropertyNames(this.state.tokenToManeuver).length < tokens.length;
      var buttons = React.createElement(Button,
      {
         disabled: disabled,
         name: "OK",
         onClick: self.ok,
      });
      return React.createElement(OptionPane,
      {
         message: "",
         title: "Planning: Select Maneuvers",
         initialInput: initialInput,
         buttons: buttons,
      });
   },

   ok: function()
   {
      var tokenToManeuver = this.state.tokenToManeuver;
      var callback = this.props.callback;

      callback(tokenToManeuver);
   },

   selectionChanged: function(tokenId, maneuverKey)
   {
      LOGGER.debug("selectionChanged() tokenId = " + tokenId + " maneuverKey = " + maneuverKey);
      var tokens = this.props.tokens;
      var store = (tokens.length > 0 ? tokens[0].store() : undefined);
      var token = store.getState().environment.getTokenById(parseInt(tokenId));
      var tokenToManeuver = this.state.tokenToManeuver;
      tokenToManeuver[token.id()] = maneuverKey;

      this.setState(
      {
         tokenToManeuver: tokenToManeuver,
      });
   },
});

export default PlanningPanel;