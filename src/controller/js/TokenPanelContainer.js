"use strict";

define(["immutable", "react-redux", "common/js/InputValidator", "view/js/TokenPanel"],
   function(Immutable, ReactRedux, InputValidator, TokenPanel)
   {
      function mapStateToProps(state, ownProps)
      {
         InputValidator.validateNotNull("ownProps.cardInstance", ownProps.cardInstance);

         var cardInstance = ownProps.cardInstance;

         return (
         {
            attackerTargetLocks: cardInstance.attackerTargetLocks(),
            cloakCount: cardInstance.cloakCount(),
            damageCount: cardInstance.damageCount(),
            defenderTargetLocks: cardInstance.defenderTargetLocks(),
            energyCount: cardInstance.energyCount(),
            evadeCount: cardInstance.evadeCount(),
            focusCount: cardInstance.focusCount(),
            ionCount: cardInstance.ionCount(),
            reinforceCount: cardInstance.reinforceCount(),
            resourceBase: state.resourceBase,
            shieldCount: cardInstance.shieldCount(),
            stressCount: cardInstance.stressCount(),
            tractorBeamCount: cardInstance.tractorBeamCount(),
            weaponsDisabledCount: cardInstance.weaponsDisabledCount(),
         });
      }

      return ReactRedux.connect(mapStateToProps)(TokenPanel);
   });
