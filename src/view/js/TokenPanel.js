"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "artifact/js/Count", "view/js/LabeledImage", "view/js/ReactUtilities"],
   function(createReactClass, PropTypes, React, DOM, Count, LabeledImage, ReactUtilities)
   {
      var TokenPanel = createReactClass(
      {
         render: function()
         {
            var cells = [];

            this.maybeAddToken(cells, this.props.cloakCount, "token/CloakToken32.png", "Cloak");
            this.maybeAddToken(cells, this.props.energyCount, "token/EnergyToken32.png", "Energy");
            this.maybeAddToken(cells, this.props.evadeCount, "token/EvadeToken32.png", "Evade");
            this.maybeAddToken(cells, this.props.focusCount, "token/FocusToken32.png", "Focus");
            this.maybeAddToken(cells, this.props.ionCount, "token/IonToken32.png", "Ion");
            this.maybeAddToken(cells, this.props.reinforceCount, "token/ReinforceToken32.png", "Reinforce");
            this.maybeAddToken(cells, this.props.shieldCount, "token/ShieldToken32.png", "Shield");
            this.maybeAddToken(cells, this.props.stressCount, "token/StressToken32.png", "Stress");
            this.maybeAddToken(cells, this.props.tractorBeamCount, "token/TractorBeamToken32.png", "TractorBeam");
            this.maybeAddToken(cells, this.props.weaponsDisabledCount, "token/WeaponsDisabledToken32.png", "WeaponsDisabled");

            var attackerTargetLocks = this.props.attackerTargetLocks;
            var defenderTargetLocks = this.props.defenderTargetLocks;

            attackerTargetLocks.forEach(function(targetLock)
            {
               var title = "Target Lock to " + targetLock.defender().name();
               this.addTargetLock(cells, targetLock, "token/AttackerTargetLock32.png", title);
            }, this);

            defenderTargetLocks.forEach(function(targetLock)
            {
               var title = "Target Lock from " + targetLock.attacker().name();
               this.addTargetLock(cells, targetLock, "token/DefenderTargetLock32.png", title);
            }, this);

            this.maybeAddToken(cells, this.props.damageCount, "pilotCard/Damage32.jpg", "Damage", "b black");

            var row = ReactUtilities.createRow(cells, "tokenRow");
            var centerCell = ReactUtilities.createTable(row, "tokenPanel", "center tc v-mid");
            var keySuffix = "" + this.props.bonusAttack + this.props.bonusDefense + this.props.bonusHitPoints + this.props.bonusThreat + this.props.bonusWillpower;

            return DOM.div(
            {
               key: this.props.myKey + keySuffix,
               className: "w-100",
            }, centerCell);
         },
      });

      TokenPanel.prototype.addTargetLock = function(cells, targetLock, src, title)
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
         cells.push(ReactUtilities.createCell(element, key, "v-mid"));
      };

      TokenPanel.prototype.maybeAddToken = function(cells, count, src, title, labelClassIn)
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

            cells.push(ReactUtilities.createCell(cell, "tokenCell" + title + cells.length, "v-mid"));
         }
      };

      TokenPanel.propTypes = {
         resourceBase: PropTypes.string.isRequired,

         attackerTargetLocks: PropTypes.array,
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

      return TokenPanel;
   });
