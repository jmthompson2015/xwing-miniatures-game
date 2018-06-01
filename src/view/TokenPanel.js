import LabeledImage from "./LabeledImage.js";
import ReactUtilities from "./ReactUtilities.js";

var TokenPanel = createReactClass(
{
   render: function()
   {
      var rows = [];

      this.maybeAddBonus(rows, this.props.bonusPilotSkill, "elite", "Pilot Skill", "orange");
      this.maybeAddBonus(rows, this.props.bonusPrimaryWeapon, "attack", "Primary Weapon", "red");
      this.maybeAddBonus(rows, this.props.bonusEnergy, "energy", "Energy", "xw-violet");
      this.maybeAddBonus(rows, this.props.bonusAgility, "agility", "Agility", "xw-green");
      this.maybeAddBonus(rows, this.props.bonusHull, "hull", "Hull", "yellow");
      this.maybeAddBonus(rows, this.props.bonusShield, "shield", "Shield", "xw-cyan");

      this.maybeAddToken(rows, this.props.cloakCount, "token/CloakToken32.png", "Cloak");
      this.maybeAddToken(rows, this.props.energyCount, "token/EnergyToken32.png", "Energy");
      this.maybeAddToken(rows, this.props.evadeCount, "token/EvadeToken32.png", "Evade");
      this.maybeAddToken(rows, this.props.focusCount, "token/FocusToken32.png", "Focus");
      this.maybeAddToken(rows, this.props.ionCount, "token/IonToken32.png", "Ion");
      this.maybeAddToken(rows, this.props.ordnanceCount, "token/OrdnanceToken32.png", "Ordnance");
      this.maybeAddToken(rows, this.props.reinforceCount, "token/ReinforceToken32.png", "Reinforce");
      this.maybeAddToken(rows, this.props.shieldCount, "token/ShieldToken32.png", "Shield");
      this.maybeAddToken(rows, this.props.stressCount, "token/StressToken32.png", "Stress");
      this.maybeAddToken(rows, this.props.tractorBeamCount, "token/TractorBeamToken32.png", "Tractor Beam");
      this.maybeAddToken(rows, this.props.weaponsDisabledCount, "token/WeaponsDisabledToken32.png", "Weapons Disabled");

      var attackerTargetLocks = this.props.attackerTargetLocks;
      var defenderTargetLocks = this.props.defenderTargetLocks;

      attackerTargetLocks.forEach(function(targetLock)
      {
         var title = "Target Lock to " + targetLock.defender().name();
         this.addTargetLock(rows, targetLock, "token/AttackerTargetLock32.png", title);
      }, this);

      defenderTargetLocks.forEach(function(targetLock)
      {
         var title = "Target Lock from " + targetLock.attacker().name();
         this.addTargetLock(rows, targetLock, "token/DefenderTargetLock32.png", title);
      }, this);

      this.maybeAddToken(rows, this.props.damageCount, "pilotCard/Damage32.jpg", "Damage", "b black");

      var keySuffix = "" + this.props.bonusAttack + this.props.bonusDefense + this.props.bonusHitPoints + this.props.bonusThreat + this.props.bonusWillpower;

      return ReactUtilities.createFlexboxWrap(rows, this.props.myKey + keySuffix, "content-center flex-column justify-center");
   },
});

TokenPanel.prototype.addTargetLock = function(rows, targetLock, src, title)
{
   var element = React.createElement(LabeledImage,
   {
      image: src,
      resourceBase: this.props.resourceBase,
      label: targetLock.id(),
      labelClass: "lightImageText b f5 white",
      title: title,
      width: 38,
   });

   var key = "targetLock" + targetLock.attacker() + targetLock.defender();
   var cell2 = ReactUtilities.createCell(element, key, "tc v-mid");
   rows.push(ReactUtilities.createRow(cell2, key, "tc v-mid"));
};

TokenPanel.prototype.maybeAddBonus = function(cells, count, src, title, labelClass)
{
   if (count !== undefined && count !== 0)
   {
      var value = (count > 0 ? "+" : "") + count;
      var symbol = ReactDOMFactories.span(
      {
         key: "symbol",
         className: "f6 " + labelClass,
      }, ReactDOMFactories.i(
      {
         className: "xwing-miniatures-font xwing-miniatures-font-" + src,
      }));

      var cell2 = ReactUtilities.createCell([value, symbol], "bonusCell" + title + cells.length, "tc v-mid", title);
      cells.push(ReactUtilities.createRow(cell2, "bonusRow" + title + cells.length, "tc v-mid"));
   }
};

TokenPanel.prototype.maybeAddToken = function(rows, count, src, title, labelClassIn)
{
   if (count !== undefined && count !== 0)
   {
      var labelClass = (labelClassIn !== undefined ? labelClassIn : "b white");
      var cell = React.createElement(LabeledImage,
      {
         image: src,
         label: "" + count,
         labelClass: labelClass,
         resourceBase: this.props.resourceBase,
         title: title,
      });

      var cell2 = ReactUtilities.createCell(cell, "tokenCell" + title + rows.length, "tc v-mid");
      rows.push(ReactUtilities.createRow(cell2, "tokenRow" + title + rows.length, "tc v-mid"));
   }
};

TokenPanel.propTypes = {
   resourceBase: PropTypes.string.isRequired,

   attackerTargetLocks: PropTypes.array,
   bonusAgility: PropTypes.number,
   bonusEnergy: PropTypes.number,
   bonusHull: PropTypes.number,
   bonusPilotSkill: PropTypes.number,
   bonusPrimaryWeapon: PropTypes.number,
   bonusShield: PropTypes.number,
   cloakCount: PropTypes.number,
   damageCount: PropTypes.number,
   defenderTargetLocks: PropTypes.array,
   energyCount: PropTypes.number,
   evadeCount: PropTypes.number,
   focusCount: PropTypes.number,
   ionCount: PropTypes.number,
   reinforceCount: PropTypes.number,
   myKey: PropTypes.string,
   shieldCount: PropTypes.number,
   stressCount: PropTypes.number,
   tractorBeamCount: PropTypes.number,
   weaponsDisabledCount: PropTypes.number,
};

TokenPanel.defaultProps = {
   attackerTargetLocks: [],
   defenderTargetLocks: [],
   myKey: "tokenPanel",
};

export default TokenPanel;