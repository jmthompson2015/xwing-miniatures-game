class UpgradeTypeUI extends React.Component
{
   render()
   {
      const upgradeType = this.props.upgradeType;
      const typeName0 = upgradeType.name;
      const typeName = typeName0.replace(" ", "");
      const fileString = this.props.resourceBase + "upgradeType/" + typeName + "24.png";
      const myKey = (this.props.myKey !== undefined ? this.props.myKey : upgradeType.key);

      const icon = ReactDOMFactories.img(
      {
         key: myKey,
         className: "upgradeTypeUIImage v-mid",
         src: fileString,
         title: typeName0,
      });

      let answer = icon;

      if (this.props.showName)
      {
         answer = ReactDOMFactories.span(
         {
            className: "v-mid",
         }, icon, " ", upgradeType.name);
      }

      return answer;
   }
}

UpgradeTypeUI.propTypes = {
   upgradeType: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,

   // default: upgrade type value
   myKey: PropTypes.string,
   showName: PropTypes.bool,
};

UpgradeTypeUI.defaultProps = {
   showName: false,
};

export default UpgradeTypeUI;