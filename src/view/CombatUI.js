"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "utility/InputValidator",
  "artifact/AttackDiceValue", "artifact/DefenseDiceValue", "artifact/Phase",
  "view/Button", "view/EntityUI", "view/InputPanel", "view/OptionPane"],
   function(createReactClass, PropTypes, React, DOM, InputValidator,
      AttackDiceValue, DefenseDiceValue, Phase,
      Button, EntityUI, InputPanel, OptionPane)
   {
      var CombatUI = createReactClass(
      {
         propTypes:
         {
            attacker: PropTypes.object.isRequired,
            attackDice: PropTypes.object.isRequired,
            defender: PropTypes.object.isRequired,
            resourceBase: PropTypes.string.isRequired,
            phase: PropTypes.object.isRequired,
            weapon: PropTypes.object.isRequired,

            criticalHitCount: PropTypes.number,
            defenseDice: PropTypes.object,
            hitCount: PropTypes.number,
            modifications: PropTypes.array,
            okFunction: PropTypes.func,
         },

         render: function()
         {
            var phase = this.props.phase;
            var attacker = this.props.attacker;
            var defender = this.props.defender;
            var attackDice = this.props.attackDice;
            var defenseDice = this.props.defenseDice;
            var modifications = this.props.modifications;
            var weapon = this.props.weapon;

            var rows = [];

            // Attacker label.
            rows.push(DOM.tr(
            {
               key: rows.length,
            }, DOM.td(
            {}, DOM.span(
            {}, "Attacker: " + attacker.name()))));

            // Weapon label.
            rows.push(DOM.tr(
            {
               key: rows.length,
            }, DOM.td(
            {}, DOM.span(
            {}, "Weapon: " + weapon))));

            // Attack Dice panel.
            var attackPanel = React.createElement(CombatUI.AttackDiceUI,
            {
               dice: attackDice,
               resourceBase: this.props.resourceBase,
            });
            rows.push(DOM.tr(
            {
               key: rows.length,
            }, DOM.td(
            {}, attackPanel)));

            if (phase.key === Phase.COMBAT_MODIFY_ATTACK_DICE && modifications !== undefined)
            {
               // Modify Attack Dice panel.
               var modifyAttackPanel = React.createElement(CombatUI.ModifyAttackUI,
               {
                  attacker: attacker,
                  resourceBase: this.props.resourceBase,
                  modifications: modifications,
                  onChange: this.ok,
               });

               rows.push(DOM.tr(
               {
                  key: rows.length,
               }, DOM.td(
               {}, modifyAttackPanel)));
            }

            // Defender label.
            rows.push(DOM.tr(
            {
               key: rows.length,
            }, DOM.td(
            {}, DOM.span(
            {}, "Defender: " + defender.name()))));

            if (defenseDice)
            {
               // Defense Dice panel.
               var defensePanel = React.createElement(CombatUI.DefenseDiceUI,
               {
                  dice: defenseDice,
                  resourceBase: this.props.resourceBase,
               });

               rows.push(DOM.tr(
               {
                  key: rows.length,
               }, DOM.td(
               {}, defensePanel)));

               if (phase.key === Phase.COMBAT_MODIFY_DEFENSE_DICE && modifications !== undefined)
               {
                  // Modify Defense Dice panel.
                  var modifyDefensePanel = React.createElement(CombatUI.ModifyDefenseUI,
                  {
                     defender: defender,
                     resourceBase: this.props.resourceBase,
                     modifications: modifications,
                     onChange: this.ok,
                  });

                  rows.push(DOM.tr(
                  {
                     key: rows.length,
                  }, DOM.td(
                  {}, modifyDefensePanel)));
               }
            }

            if (phase.key === Phase.COMBAT_NOTIFY_DAMAGE)
            {
               // Damage panel.
               var damagePanel = React.createElement(CombatUI.DamageUI,
               {
                  criticalHitCount: this.props.criticalHitCount,
                  hitCount: this.props.hitCount,
                  resourceBase: this.props.resourceBase,
               });

               rows.push(DOM.tr(
               {
                  key: rows.length,
               }, DOM.td(
               {}, damagePanel)));
            }

            var message = DOM.table(
            {}, DOM.tbody(
            {}, rows));
            var okButton = React.createElement(Button,
            {
               key: 0,
               name: "OK",
               onClick: this.ok,
            });
            var buttons = DOM.span(
            {}, [okButton]);

            return React.createElement(OptionPane,
            {
               title: this.createTitle(phase),
               message: message,
               buttons: buttons,
            });
         },

         createTitle: function(phase)
         {
            var answer = "Combat";

            switch (phase.key)
            {
               case Phase.COMBAT_MODIFY_ATTACK_DICE:
                  answer += ": Modify Attack Dice";
                  break;
               case Phase.COMBAT_MODIFY_DEFENSE_DICE:
                  answer += ": Modify Defense Dice";
                  break;
               case Phase.COMBAT_NOTIFY_DAMAGE:
                  answer += ": Deal Damage";
                  break;
            }

            return answer;
         },

         ok: function(modification)
         {
            LOGGER.debug("CombatUI ok()");
            var answer;

            if (modification && modification.consequent)
            {
               answer = modification;
            }

            LOGGER.debug("CombatUI.ok() modification = " + modification + " " + (typeof modification));

            var okFunction = this.props.okFunction;

            if (okFunction)
            {
               okFunction(answer);
            }
         },
      });

      /*
       * Provides a user interface for the attacker during combat.
       *
       * @param dice Attack dice. (required)
       */
      CombatUI.AttackDiceUI = createReactClass(
      {
         propTypes:
         {
            dice: PropTypes.object.isRequired,
            resourceBase: PropTypes.string.isRequired,
         },

         render: function()
         {
            var columns = [];

            var dice = this.props.dice;
            InputValidator.validateNotNull("attack dice", dice);

            var values = dice.sortedValues();

            values.forEach(function(die)
            {
               columns.push(DOM.td(
               {
                  key: columns.length,
               }, this.createImage(die)));
            }, this);

            return DOM.table(
            {
               className: "combatDicePanel center",
            }, DOM.tbody(
            {}, DOM.tr(
            {}, columns)));
         },

         createImage: function(die)
         {
            var title = AttackDiceValue.properties[die].name;
            var source = this.props.resourceBase + "dice/Attack" + title.replace(" ", "") + "32.png";

            return DOM.img(
            {
               src: source,
               title: title,
            });
         },
      });

      /*
       * Provides a user interface for the defender during combat.
       *
       * @param defenseDice Defense dice. (optional)
       */
      CombatUI.DefenseDiceUI = createReactClass(
      {
         propTypes:
         {
            dice: PropTypes.object.isRequired,
            resourceBase: PropTypes.string.isRequired,
         },

         render: function()
         {
            var columns = [];

            var dice = this.props.dice;

            if (dice)
            {
               var values = dice.sortedValues();

               values.forEach(function(die)
               {
                  columns.push(DOM.td(
                  {
                     key: columns.length,
                  }, this.createImage(die)));
               }, this);
            }

            return DOM.table(
            {
               className: "combatDicePanel center",
            }, DOM.tbody(
            {}, DOM.tr(
            {}, columns)));
         },

         createImage: function(die)
         {
            var title = DefenseDiceValue.properties[die].name;
            var source = this.props.resourceBase + "dice/Defense" + title.replace(" ", "") + "32.png";

            return DOM.img(
            {
               src: source,
               title: title,
            });
         },
      });

      CombatUI.ModifyAttackUI = createReactClass(
      {
         propTypes:
         {
            attacker: PropTypes.object.isRequired,
            resourceBase: PropTypes.string.isRequired,
            modifications: PropTypes.array.isRequired,
            onChange: PropTypes.func.isRequired,
         },

         render: function()
         {
            var modifications = this.props.modifications;
            var resourceBase = this.props.resourceBase;
            var labelFunction = function(value)
            {
               return React.createElement(EntityUI,
               {
                  entity: value.sourceObject(),
                  resourceBase: resourceBase,
               });
            };

            return React.createElement(InputPanel,
            {
               type: InputPanel.Type.RADIO,
               values: modifications,
               name: "selectModifyAttack",
               labelFunction: labelFunction,
               onChange: this.myOnChange,
               panelClass: "combatChoicePanel",
            });
         },

         myOnChange: function(event, selected)
         {
            LOGGER.trace("ModifyAttackUI.myOnChange()");
            LOGGER.debug("ModifyAttackUI.myOnChange() modification = " + selected + " " + (typeof selected));
            this.props.onChange(selected);
         },
      });

      CombatUI.ModifyDefenseUI = createReactClass(
      {
         propTypes:
         {
            defender: PropTypes.object.isRequired,
            resourceBase: PropTypes.string.isRequired,
            modifications: PropTypes.array.isRequired,
            onChange: PropTypes.func.isRequired,
         },

         render: function()
         {
            var modifications = this.props.modifications;
            var resourceBase = this.props.resourceBase;
            var labelFunction = function(value)
            {
               return React.createElement(EntityUI,
               {
                  entity: value.sourceObject(),
                  resourceBase: resourceBase,
               });
            };

            return React.createElement(InputPanel,
            {
               type: InputPanel.Type.RADIO,
               values: modifications,
               name: "selectModifyDefense",
               labelFunction: labelFunction,
               onChange: this.myOnChange,
               panelClass: "combatChoicePanel",
            });
         },

         myOnChange: function(event, selected)
         {
            LOGGER.trace("ModifyDefenseUI.myOnChange()");
            LOGGER.debug("ModifyDefenseUI.myOnChange() modification = " + selected + " " + (typeof selected));
            this.props.onChange(selected);
         },
      });

      /*
       * Provides a user interface for damage.
       *
       * @param hitCount Hit count. (required)
       *
       * @param criticalHitCount Critical hit count. (required)
       */
      CombatUI.DamageUI = createReactClass(
      {
         propTypes:
         {
            criticalHitCount: PropTypes.number.isRequired,
            hitCount: PropTypes.number.isRequired,
            resourceBase: PropTypes.string.isRequired,
         },

         render: function()
         {
            var hitCount = this.props.hitCount;
            InputValidator.validateNotNull("hitCount", hitCount);
            var criticalHitCount = this.props.criticalHitCount;
            InputValidator.validateNotNull("criticalHitCount", criticalHitCount);

            var hitFilename = this.props.resourceBase + "pilotCard/Damage32.jpg";
            var criticalHitFilename = this.props.resourceBase + "pilotCard/CriticalDamage32.jpg";
            var columns = [];

            columns.push(DOM.td(
            {
               key: columns.length,
            }, DOM.span(
            {}, "Damage: ")));
            columns.push(DOM.td(
            {
               key: columns.length,
            }, DOM.img(
            {
               src: hitFilename,
               title: "Damage",
            })));
            columns.push(DOM.td(
            {
               key: columns.length,
            }, DOM.span(
            {}, hitCount)));
            columns.push(DOM.td(
            {
               key: columns.length,
            }, DOM.img(
            {
               src: criticalHitFilename,
               title: "Critical Damage",
            })));
            columns.push(DOM.td(
            {
               key: columns.length,
            }, DOM.span(
            {}, criticalHitCount)));

            return DOM.table(
            {}, DOM.tbody(
            {}, DOM.tr(
            {}, columns)));
         },
      });

      return CombatUI;
   });
