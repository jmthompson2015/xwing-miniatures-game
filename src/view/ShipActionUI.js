import ShipAction from "../artifact/ShipAction.js";

class ShipActionUI extends React.Component
{
   render()
   {
      const shipAction = this.props.shipAction;
      const myKey = (this.props.myKey !== undefined ? this.props.myKey : shipAction.key);
      let className = "center tc v-mid";
      let src = shipAction.key.toLowerCase();

      if (shipAction.key === ShipAction.DECLOAK)
      {
         src = "cloak";
         className += " silver";
      }

      const image = ReactDOMFactories.span(
      {
         key: myKey,
         className: className,
         title: shipAction.name,
      }, ReactDOMFactories.i(
      {
         className: "xwing-miniatures-font xwing-miniatures-font-" + src,
      }));

      let answer = image;
      const showName = this.props.showName;

      if (showName)
      {
         answer = ReactDOMFactories.span(
         {
            className: "v-mid",
         }, image, " ", shipAction.name);
      }

      return answer;
   }
}

ShipActionUI.propTypes = {
   shipAction: PropTypes.object.isRequired,

   // default: ship action value
   myKey: PropTypes.string,
   showName: PropTypes.bool,
};

ShipActionUI.defaultProps = {
   showName: false,
};

export default ShipActionUI;