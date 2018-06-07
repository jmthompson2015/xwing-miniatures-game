import InputValidator from "../utility/InputValidator.js";

import ShipState from "../artifact/ShipState.js";
import Faction from "../artifact/Faction.js";
import LabeledImage from "./LabeledImage.js";

class ShipStateUI extends React.Component
{
   render()
   {
      const shipState = this.props.shipState;
      const faction = this.determineFaction(this.props.faction);
      const size = (shipState.key === ShipState.PILOT_SKILL ? 32 : 24);
      const src = this.createFilename(faction, shipState, size);
      const myKey = (this.props.myKey !== undefined ? this.props.myKey : shipState.key);
      const label = this.props.label;
      let image;

      if (label !== undefined)
      {
         image = React.createElement(LabeledImage,
         {
            key: myKey,
            className: "v-mid",
            image: src,
            resourceBase: this.props.resourceBase,
            label: label,
            labelClass: this.props.labelClass,
            showOne: this.props.showOne,
            title: shipState.name,
            width: size,
         });
      }
      else
      {
         image = ReactDOMFactories.img(
         {
            key: myKey,
            className: "v-mid",
            src: this.props.resourceBase + src,
            title: shipState.name,
         });
      }

      const showName = this.props.showName;
      let answer = image;

      if (showName)
      {
         answer = ReactDOMFactories.span(
         {
            className: "v-mid",
         }, image, " ", shipState.name);
      }

      return answer;
   }
}

ShipStateUI.prototype.createFilename = function(faction, shipState, size)
{
   InputValidator.validateNotNull("faction", faction);
   InputValidator.validateNotNull("shipState", shipState);
   InputValidator.validateNotNull("size", size);

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

   return "pilotCard/" + factionName + "_" + shipStateName + size + ".png";
};

ShipStateUI.prototype.determineFaction = function(faction)
{
   InputValidator.validateNotNull("faction", faction);

   let answer = faction;

   if (faction.key === Faction.FIRST_ORDER ||
      faction.key === Faction.RESISTANCE)
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

   // default: undefined
   label: PropTypes.string,
   // default: undefined
   labelClass: PropTypes.string,
   // default: ship state value
   myKey: PropTypes.string,
   showName: PropTypes.bool,
   showOne: PropTypes.bool,
};

ShipStateUI.defaultProps = {
   showName: false,
   showOne: false,
};

export default ShipStateUI;