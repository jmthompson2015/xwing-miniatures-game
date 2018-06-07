import Maneuver from "../artifact/Maneuver.js";

import Button from "./Button.js";
import ManeuverChooser from "./ManeuverChooser.js";
import OptionPane from "./OptionPane.js";

class PlanningPanel extends React.Component
{
   constructor(props)
   {
      super(props);

      this.state = {
         tokenToManeuver:
         {},
      };

      this.ok = this.okFunction.bind(this);
      this.selectionChanged = this.selectionChangedFunction.bind(this);
   }

   render()
   {
      const tokens = this.props.tokens;
      const cells = [];

      for (let i = 0; i < tokens.length; i++)
      {
         const token = tokens[i];
         const maneuverKeys = token.maneuverKeys();
         const maneuvers = [];
         for (let m = 0; m < maneuverKeys.length; m++)
         {
            maneuvers.push(Maneuver.properties[maneuverKeys[m]]);
         }
         const element = React.createElement(ManeuverChooser,
         {
            callback: this.selectionChanged,
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

      const initialInput = ReactDOMFactories.table(
      {}, ReactDOMFactories.tbody(
      {}, ReactDOMFactories.tr(
      {}, cells)));
      const disabled = Object.getOwnPropertyNames(this.state.tokenToManeuver).length < tokens.length;
      const buttons = React.createElement(Button,
      {
         disabled: disabled,
         name: "OK",
         onClick: this.ok,
      });
      return React.createElement(OptionPane,
      {
         message: "",
         title: "Planning: Select Maneuvers",
         initialInput: initialInput,
         buttons: buttons,
      });
   }
}

PlanningPanel.prototype.okFunction = function()
{
   const tokenToManeuver = this.state.tokenToManeuver;
   const callback = this.props.callback;

   callback(tokenToManeuver);
};

PlanningPanel.prototype.selectionChangedFunction = function(tokenId, maneuverKey)
{
   LOGGER.debug("selectionChanged() tokenId = " + tokenId + " maneuverKey = " + maneuverKey);
   const tokens = this.props.tokens;
   const store = (tokens.length > 0 ? tokens[0].store() : undefined);
   const token = store.getState().environment.getTokenById(parseInt(tokenId));
   const tokenToManeuver = this.state.tokenToManeuver;
   tokenToManeuver[token.id()] = maneuverKey;

   this.setState(
   {
      tokenToManeuver: tokenToManeuver,
   });
};

PlanningPanel.propTypes = {
   agent: PropTypes.object.isRequired,
   callback: PropTypes.func.isRequired,
   environment: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
   tokens: PropTypes.array.isRequired,
};

export default PlanningPanel;