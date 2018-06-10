import ShipState from "../artifact/ShipState.js";
import Faction from "../artifact/Faction.js";

import ImageWithLabelUI from "./ImageWithLabelUI.js";

class ShipStateUI extends React.Component
{
   render()
   {
      const shipState = this.props.shipState;
      const src = this.props.resourceBase + this.createFilename(shipState);

      return React.createElement(ImageWithLabelUI,
      {
         src: src,
         label: shipState.name,
         showLabel: this.props.showLabel,
      });
   }
}

ShipStateUI.prototype.createFilename = function(shipState)
{
   const faction = this.determineFaction(this.props.faction);
   const factionName = faction.shortName;
   let shipStateName;

   switch (shipState.key)
   {
      case ShipState.PILOT_SKILL:
         shipStateName = "Skill";
         break;
      case ShipState.PRIMARY_WEAPON:
         shipStateName = "Weapon";
         break;
      case ShipState.TURRET_WEAPON:
         shipStateName = "Turret_Weapon";
         break;
      default:
         shipStateName = shipState.name;
   }

   const size = (shipState.key === ShipState.PILOT_SKILL ? 32 : 24);

   return "pilotCard/" + factionName + "_" + shipStateName + size + ".png";
};

ShipStateUI.prototype.determineFaction = function(faction)
{
   let answer = faction;

   if ([Faction.FIRST_ORDER, Faction.RESISTANCE].includes(faction.key))
   {
      const factionKey = Faction.friend(faction.key);
      answer = Faction.properties[factionKey];
   }

   return answer;
};

ShipStateUI.propTypes = {
   faction: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
   shipState: PropTypes.object.isRequired,

   showLabel: PropTypes.bool,
};

ShipStateUI.defaultProps = {
   showLabel: false,
};

export default ShipStateUI;