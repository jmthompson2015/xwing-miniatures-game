import ImageWithLabelUI from "./ImageWithLabelUI.js";

class FactionUI extends React.Component
{
   render()
   {
      const size = (this.props.isSmall ? 24 : 32);
      const faction = this.props.faction;
      const src = this.props.resourceBase + "faction/" + size + "/" + faction.image;
      const label = faction.name;

      return React.createElement(ImageWithLabelUI,
      {
         src: src,
         label: label,
         showLabel: this.props.showLabel,
      });
   }
}

FactionUI.propTypes = {
   faction: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,

   isSmall: PropTypes.bool,
   showLabel: PropTypes.bool,
};

FactionUI.defaultProps = {
   isSmall: false,
   showLabel: false,
};

export default FactionUI;