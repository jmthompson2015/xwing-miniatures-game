class FactionUI extends React.Component
{
   render()
   {
      var faction = this.props.faction;

      var myKey = (this.props.myKey !== undefined ? this.props.myKey : faction.key);
      var size = (this.props.isSmall ? 24 : 32);
      var src = this.createSrc(faction, size);
      var icon = ReactDOMFactories.img(
      {
         key: myKey,
         className: "factionUIImage v-mid",
         height: size,
         src: src,
         title: faction.name,
      });

      var answer = icon;

      var showName = this.props.showName;

      if (showName)
      {
         answer = ReactDOMFactories.span(
         {}, icon, " ", faction.name);
      }

      return answer;
   }
}

FactionUI.prototype.createSrc = function(faction, size)
{
   var resourceBase = this.props.resourceBase;

   return resourceBase + "faction/" + size + "/" + faction.image;
};

FactionUI.propTypes = {
   faction: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,

   isSmall: PropTypes.bool,
   // default: faction value
   myKey: PropTypes.string,
   showName: PropTypes.bool,
};

FactionUI.defaultProps = {
   isSmall: false,
   showName: false,
};

export default FactionUI;