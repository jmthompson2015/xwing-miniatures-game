import PilotCard from "../artifact/PilotCard.js";

import FactionUI from "./FactionUI.js";
import Select from "./Select.js";

class PilotChooser extends React.Component
{
   constructor(props)
   {
      super(props);

      var initialPilot = props.initialPilot;
      var pilotKey = (initialPilot !== undefined ? initialPilot.key : undefined);

      this.state = {
         pilotKey: pilotKey,
      };

      this.pilotChanged = this.pilotChangedFunction.bind(this);
   }

   render()
   {
      var ship = this.props.ship;
      var faction = this.props.faction;
      var keys = PilotCard.keysByShipAndFaction(ship.key, faction.key);
      keys.unshift(this.PILOT_PROMPT);

      var labelFunction = function(value)
      {
         var pilot = PilotCard.properties[value];
         if (pilot && pilot.fore)
         {
            return (pilot ? PilotCard.getName(value) + " [" + (pilot.fore.squadPointCost + pilot.aft.squadPointCost) + "]" : value);
         }
         else
         {
            return (pilot ? PilotCard.getName(value) + " [" + pilot.squadPointCost + "]" : value);
         }
      };

      var pilotKey = this.state.pilotKey;
      var select = React.createElement(Select,
      {
         values: keys,
         labelFunction: labelFunction,
         initialSelectedValue: pilotKey,
         onChange: this.pilotChanged,
         clientProps:
         {
            "data-index": this.props.index,
         }
      });

      var pilot = PilotCard.properties[pilotKey];

      if (pilot)
      {
         var image = React.createElement(FactionUI,
         {
            faction: faction,
            isSmall: true,
            resourceBase: this.props.resourceBase,
         });

         return ReactDOMFactories.span(
         {}, image, " ", select);
      }
      else
      {
         return select;
      }
   }
}

PilotChooser.prototype.pilotChangedFunction = function(event)
{
   var pilotKey = event.currentTarget.value;
   LOGGER.debug("PilotChooser.pilotChanged() pilotKey = " + pilotKey);
   var index = parseInt(event.currentTarget.dataset.index);

   this.setState(
   {
      pilotKey: pilotKey,
   });

   var pilot = PilotCard.properties[pilotKey];
   this.props.onChange(event, pilot, index);
};

PilotChooser.PILOT_PROMPT = "Select a pilot";

PilotChooser.propTypes = {
   faction: PropTypes.object.isRequired,
   onChange: PropTypes.func.isRequired,
   resourceBase: PropTypes.string.isRequired,
   ship: PropTypes.object.isRequired,

   index: PropTypes.number,
   initialPilot: PropTypes.object,
};

export default PilotChooser;