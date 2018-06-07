class FactionUI extends React.Component
{
   render()
   {
      const faction = this.props.faction;

      const myKey = (this.props.myKey !== undefined ? this.props.myKey : faction.key);
      const size = (this.props.isSmall ? 24 : 32);
      const src = this.createSrc(faction, size);
      const icon = ReactDOMFactories.img(
      {
         key: myKey,
         className: "factionUIImage v-mid",
         height: size,
         src: src,
         title: faction.name,
      });

      let answer = icon;

      const showName = this.props.showName;

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
   const resourceBase = this.props.resourceBase;

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