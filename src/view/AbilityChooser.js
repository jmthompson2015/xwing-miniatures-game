import ArrayUtilities from "../utility/ArrayUtilities.js";

import Button from "./Button.js";
import EntityUI from "./EntityUI.js";
import InputPanel from "./InputPanel.js";
import OptionPane from "./OptionPane.js";

class AbilityChooser extends React.Component
{
   constructor(props)
   {
      super(props);

      this.myOnChange = this.myOnChangeFunction.bind(this);
      this.ok = this.okFunction.bind(this);
   }

   render()
   {
      const token = this.props.token;
      const damages = this.props.damages;
      const pilots = this.props.pilots;
      const shipActions = this.props.shipActions;
      const upgrades = this.props.upgrades;
      const resourceBase = this.props.resourceBase;

      const message = "Active Ship: " + token.name();
      const okButton = React.createElement(Button,
      {
         key: 0,
         name: "Pass",
         onClick: this.ok,
      });
      const buttons = ReactDOMFactories.span(
      {}, [okButton]);

      const labelFunction = function(value)
      {
         const answer = React.createElement(EntityUI,
         {
            context: value.context(),
            entity: value.sourceObject(),
            resourceBase: resourceBase,
         });

         return answer;
      };

      const values = shipActions.slice();
      ArrayUtilities.addAll(values, pilots);
      ArrayUtilities.addAll(values, upgrades);
      ArrayUtilities.addAll(values, damages);

      const initialInput = React.createElement(InputPanel,
      {
         type: InputPanel.Type.RADIO,
         values: values,
         name: "selectUpgrade",
         labelFunction: labelFunction,
         onChange: this.myOnChange,
         panelClass: "combatChoicePanel f6 tl",
      });

      const title = "Select Ability";

      return React.createElement(OptionPane,
      {
         panelClass: "optionPane bg-xw-light",
         title: title,
         titleClass: "optionPaneTitle bg-moon-gray",
         message: message,
         messageClass: "combatMessage",
         initialInput: initialInput,
         buttons: buttons,
         buttonsClass: "optionPaneButtons pa2 tr",
      });
   }
}

AbilityChooser.prototype.myOnChangeFunction = function(event, selected)
{
   LOGGER.trace("AbilityChooser.myOnChange()");
   LOGGER.debug("AbilityChooser.myOnChange() selected = " + selected + " " + (typeof selected));

   const isAccepted = (selected !== undefined);
   this.props.onChange(selected, isAccepted);
};

AbilityChooser.prototype.okFunction = function()
{
   const isAccepted = false;
   this.props.onChange(undefined, undefined, undefined, isAccepted);
};

AbilityChooser.propTypes = {
   damages: PropTypes.array.isRequired,
   resourceBase: PropTypes.string.isRequired,
   onChange: PropTypes.func.isRequired,
   pilots: PropTypes.array.isRequired,
   shipActions: PropTypes.array.isRequired,
   token: PropTypes.object.isRequired,
   upgrades: PropTypes.array.isRequired,
};

export default AbilityChooser;