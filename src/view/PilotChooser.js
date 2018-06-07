import PilotCard from "../artifact/PilotCard.js";

import FactionUI from "./FactionUI.js";
import Select from "./Select.js";

class PilotChooser extends React.Component
{
   constructor(props)
   {
      super(props);

      const initialPilot = props.initialPilot;
      const pilotKey = (initialPilot !== undefined ? initialPilot.key : undefined);

      this.state = {
         pilotKey: pilotKey,
      };

      this.pilotChanged = this.pilotChangedFunction.bind(this);
   }

   render()
   {
      const ship = this.props.ship;
      const faction = this.props.faction;
      const keys = PilotCard.keysByShipAndFaction(ship.key, faction.key);
      keys.unshift(this.PILOT_PROMPT);

      const labelFunction = function(value)
      {
         const pilot = PilotCard.properties[value];
         if (pilot && pilot.fore)
         {
            return (pilot ? PilotCard.getName(value) + " [" + (pilot.fore.squadPointCost + pilot.aft.squadPointCost) + "]" : value);
         }
         else
         {
            return (pilot ? PilotCard.getName(value) + " [" + pilot.squadPointCost + "]" : value);
         }
      };

      const pilotKey = this.state.pilotKey;
      const select = React.createElement(Select,
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

      const pilot = PilotCard.properties[pilotKey];

      if (pilot)
      {
         const image = React.createElement(FactionUI,
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
   const pilotKey = event.currentTarget.value;
   LOGGER.debug("PilotChooser.pilotChanged() pilotKey = " + pilotKey);
   const index = parseInt(event.currentTarget.dataset.index);

   this.setState(
   {
      pilotKey: pilotKey,
   });

   const pilot = PilotCard.properties[pilotKey];
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