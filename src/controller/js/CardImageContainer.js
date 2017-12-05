"use strict";

define(["immutable", "react-redux", "common/js/InputValidator", "view/js/CardImage"],
   function(Immutable, ReactRedux, InputValidator, CardImage)
   {
      function mapStateToProps(state, ownProps)
      {
         InputValidator.validateNotNull("ownProps.cardInstance", ownProps.cardInstance);

         var cardInstance = ownProps.cardInstance;
         var isFaceUp = state.cardIsFaceUp.get(cardInstance.id());

         return (
         {
            card: cardInstance.card(),
            isFaceUp: isFaceUp,
            myKey: ownProps.myKey,
            resourceBase: state.resourceBase,
            width: ownProps.width,
         });
      }

      return ReactRedux.connect(mapStateToProps)(CardImage);
   });
