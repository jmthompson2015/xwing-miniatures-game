import ShipAction from "../artifact/ShipAction.js";

class ShipActionUI extends React.Component
{
   render()
   {
      const shipAction = this.props.shipAction;
      let className = "center tc v-mid";
      let src = shipAction.key.toLowerCase();

      if (shipAction.key === ShipAction.DECLOAK)
      {
         src = "cloak";
         className += " silver";
      }

      const image = ReactDOMFactories.span(
      {
         className: className,
         title: shipAction.name,
      }, ReactDOMFactories.i(
      {
         className: "xwing-miniatures-font xwing-miniatures-font-" + src,
      }));

      let answer = image;

      if (this.props.showLabel)
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

   showLabel: PropTypes.bool,
};

ShipActionUI.defaultProps = {
   showLabel: false,
};

export default ShipActionUI;