var UpgradeTypeUI = createReactClass(
{
   render: function()
   {
      var upgradeType = this.props.upgradeType;
      var typeName0 = upgradeType.name;
      var typeName = typeName0.replace(" ", "");
      var fileString = this.props.resourceBase + "upgradeType/" + typeName + "24.png";
      var myKey = (this.props.myKey !== undefined ? this.props.myKey : upgradeType.key);

      var icon = ReactDOMFactories.img(
      {
         key: myKey,
         className: "upgradeTypeUIImage v-mid",
         src: fileString,
         title: typeName0,
      });

      var answer = icon;

      if (this.props.showName)
      {
         answer = ReactDOMFactories.span(
         {
            className: "v-mid",
         }, icon, " ", upgradeType.name);
      }

      return answer;
   },
});

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