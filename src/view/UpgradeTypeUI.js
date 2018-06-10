import ImageWithLabelUI from "./ImageWithLabelUI.js";

class UpgradeTypeUI extends React.Component
{
   render()
   {
      const upgradeType = this.props.upgradeType;
      const typeName = upgradeType.name.replace(" ", "");
      const src = this.props.resourceBase + "upgradeType/" + typeName + "24.png";
      const label = upgradeType.name;

      return React.createElement(ImageWithLabelUI,
      {
         src: src,
         label: label,
         showLabel: this.props.showLabel,
      });
   }
}

UpgradeTypeUI.propTypes = {
   upgradeType: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,

   showLabel: PropTypes.bool,
};

UpgradeTypeUI.defaultProps = {
   showLabel: false,
};

export default UpgradeTypeUI;