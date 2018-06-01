import UpgradeCard from "../artifact/UpgradeCard.js";

import Select from "./Select.js";
import UpgradeTypeUI from "./UpgradeTypeUI.js";

var UpgradeChooser = createReactClass(
{
   propTypes:
   {
      onChange: PropTypes.func.isRequired,
      pilot: PropTypes.object.isRequired,
      resourceBase: PropTypes.string.isRequired,
      upgradeType: PropTypes.object.isRequired,

      initialUpgrade: PropTypes.object,
      pilotIndex: PropTypes.number,
      upgradeIndex: PropTypes.number,
   },

   getInitialState: function()
   {
      var initialUpgrade = this.props.initialUpgrade;
      var upgradeKey = (initialUpgrade !== undefined ? initialUpgrade.key : undefined);

      return (
      {
         upgradeKey: upgradeKey,
      });
   },

   UPGRADE_PROMPT: "Select an upgrade",

   render: function()
   {
      var pilot = this.props.pilot;
      var upgradeType = this.props.upgradeType;
      var values = UpgradeCard.keysByPilotAndType(pilot.key, upgradeType.key);
      values.unshift(this.UPGRADE_PROMPT);

      var labelFunction = function(value)
      {
         var upgrade = UpgradeCard.properties[value];
         return (upgrade ? UpgradeCard.getName(value) + " [" + upgrade.squadPointCost + "]" : value);
      };

      var image = React.createElement(UpgradeTypeUI,
      {
         key: "upgradeChooserImage",
         upgradeType: upgradeType,
         resourceBase: this.props.resourceBase,
      });

      var select = React.createElement(Select,
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
   },

   upgradeChanged: function(event)
   {
      var upgradeKey = event.currentTarget.value;
      var upgradeIndex = event.currentTarget.dataset.upgradeindex;
      upgradeIndex = (upgradeIndex !== undefined ? parseInt(upgradeIndex) : undefined);

      this.setState(
      {
         upgradeKey: upgradeKey,
      });

      var pilotIndex = this.props.pilotIndex;
      var upgrade = UpgradeCard.properties[upgradeKey];
      this.props.onChange(event, pilotIndex, upgrade, upgradeIndex);
   },
});

export default UpgradeChooser;