import InputValidator from "../utility/InputValidator.js";

import TokenPanel from "../view/TokenPanel.js";

// TokenPanelContainer

function mapStateToProps(state, ownProps)
{
   InputValidator.validateNotNull("ownProps.cardInstance", ownProps.cardInstance);

   var cardInstance = ownProps.cardInstance;

   return (
   {
      attackerTargetLocks: cardInstance.attackerTargetLocks(),
      bonusPilotSkill: cardInstance.bonusPilotSkillValue(),
      bonusPrimaryWeapon: cardInstance.bonusPrimaryWeaponValue(),
      bonusEnergy: cardInstance.bonusEnergyValue(),
      bonusAgility: cardInstance.bonusAgilityValue(),
      bonusHull: cardInstance.bonusHullValue(),
      bonusShield: cardInstance.bonusShieldValue(),
      cloakCount: cardInstance.cloakCount(),
      damageCount: cardInstance.damageCount(),
      defenderTargetLocks: cardInstance.defenderTargetLocks(),
      energyCount: cardInstance.energyCount(),
      evadeCount: cardInstance.evadeCount(),
      focusCount: cardInstance.focusCount(),
      ionCount: cardInstance.ionCount(),
      ordnanceCount: cardInstance.ordnanceCount(),
      reinforceCount: cardInstance.reinforceCount(),
      resourceBase: state.resourceBase,
      shieldCount: cardInstance.shieldCount(),
      stressCount: cardInstance.stressCount(),
      tractorBeamCount: cardInstance.tractorBeamCount(),
      weaponsDisabledCount: cardInstance.weaponsDisabledCount(),
   });
}

export default ReactRedux.connect(mapStateToProps)(TokenPanel);