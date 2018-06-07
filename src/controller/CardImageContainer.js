import InputValidator from "../utility/InputValidator.js";

import CardImage from "../view/CardImage.js";

// CardImageContainer

function mapStateToProps(state, ownProps)
{
   InputValidator.validateNotNull("ownProps.cardInstance", ownProps.cardInstance);

   const cardInstance = ownProps.cardInstance;
   const isFaceUp = state.cardIsFaceUp.get(cardInstance.id());

   return (
   {
      card: cardInstance.card(),
      isFaceUp: isFaceUp,
      myKey: ownProps.myKey,
      resourceBase: state.resourceBase,
      width: ownProps.width,
   });
}

export default ReactRedux.connect(mapStateToProps)(CardImage);