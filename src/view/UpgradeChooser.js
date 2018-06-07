import UpgradeCard from "../artifact/UpgradeCard.js";

import Select from "./Select.js";
import UpgradeTypeUI from "./UpgradeTypeUI.js";

class UpgradeChooser extends React.Component
{
   constructor(props)
   {
      super(props);

      const initialUpgrade = props.initialUpgrade;
      const upgradeKey = (initialUpgrade !== undefined ? initialUpgrade.key : undefined);

      this.state = {
         upgradeKey: upgradeKey,
      };

      this.upgradeChanged = this.upgradeChangedFunction.bind(this);
   }

   render()
   {
      const pilot = this.props.pilot;
      const upgradeType = this.props.upgradeType;
      const values = UpgradeCard.keysByPilotAndType(pilot.key, upgradeType.key);
      values.unshift(this.UPGRADE_PROMPT);

      const labelFunction = function(value)
      {
         const upgrade = UpgradeCard.properties[value];
         return (upgrade ? UpgradeCard.getName(value) + " [" + upgrade.squadPointCost + "]" : value);
      };

      const image = React.createElement(UpgradeTypeUI,
      {
         key: "upgradeChooserImage",
         upgradeType: upgradeType,
         resourceBase: this.props.resourceBase,
      });

      const select = React.createElement(Select,
      {
         key: "upgradeChooserSelect",
         values: values,
         labelFunction: labelFunction,
         initialSelectedValue: this.state.upgradeKey,
         onChange: this.upgradeChanged,
         clientProps:
         {
            "data-upgradeindex": this.props.upgradeIndex,
         }
      });

      return ReactDOMFactories.span(
      {}, image, " ", select);
   }
}

UpgradeChooser.prototype.upgradeChangedFunction = function(event)
{
   const upgradeKey = event.currentTarget.value;
   let upgradeIndex = event.currentTarget.dataset.upgradeindex;
   upgradeIndex = (upgradeIndex !== undefined ? parseInt(upgradeIndex) : undefined);

   this.setState(
   {
      upgradeKey: upgradeKey,
   });

   const pilotIndex = this.props.pilotIndex;
   const upgrade = UpgradeCard.properties[upgradeKey];
   this.props.onChange(event, pilotIndex, upgrade, upgradeIndex);
};

UpgradeChooser.UPGRADE_PROMPT = "Select an upgrade";

UpgradeChooser.propTypes = {
   onChange: PropTypes.func.isRequired,
   pilot: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
   upgradeType: PropTypes.object.isRequired,

   initialUpgrade: PropTypes.object,
   pilotIndex: PropTypes.number,
   upgradeIndex: PropTypes.number,
};

export default UpgradeChooser;