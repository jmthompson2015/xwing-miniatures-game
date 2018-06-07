import InputValidator from "../utility/InputValidator.js";

import AttackDiceValue from "../artifact/AttackDiceValue.js";
import DefenseDiceValue from "../artifact/DefenseDiceValue.js";
import Phase from "../artifact/Phase.js";

import Button from "./Button.js";
import EntityUI from "./EntityUI.js";
import InputPanel from "./InputPanel.js";
import OptionPane from "./OptionPane.js";

class CombatUI extends React.Component
{
   constructor(props)
   {
      super(props);

      this.ok = this.okFunction.bind(this);
   }

   render()
   {
      const phase = this.props.phase;
      const attacker = this.props.attacker;
      const defender = this.props.defender;
      const attackDice = this.props.attackDice;
      const defenseDice = this.props.defenseDice;
      const modifications = this.props.modifications;
      const weapon = this.props.weapon;

      const rows = [];

      // Attacker label.
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, ReactDOMFactories.td(
      {}, ReactDOMFactories.span(
      {}, "Attacker: " + attacker.name()))));

      // Weapon label.
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, ReactDOMFactories.td(
      {}, ReactDOMFactories.span(
      {}, "Weapon: " + weapon))));

      // Attack Dice panel.
      const attackPanel = React.createElement(CombatUI.AttackDiceUI,
      {
         dice: attackDice,
         resourceBase: this.props.resourceBase,
      });
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, ReactDOMFactories.td(
      {}, attackPanel)));

      if (phase.key === Phase.COMBAT_MODIFY_ATTACK_DICE && modifications !== undefined)
      {
         // Modify Attack Dice panel.
         const modifyAttackPanel = React.createElement(CombatUI.ModifyAttackUI,
         {
            attacker: attacker,
            resourceBase: this.props.resourceBase,
            modifications: modifications,
            onChange: this.ok,
         });

         rows.push(ReactDOMFactories.tr(
         {
            key: rows.length,
         }, ReactDOMFactories.td(
         {}, modifyAttackPanel)));
      }

      // Defender label.
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, ReactDOMFactories.td(
      {}, ReactDOMFactories.span(
      {}, "Defender: " + defender.name()))));

      if (defenseDice)
      {
         // Defense Dice panel.
         const defensePanel = React.createElement(CombatUI.DefenseDiceUI,
         {
            dice: defenseDice,
            resourceBase: this.props.resourceBase,
         });

         rows.push(ReactDOMFactories.tr(
         {
            key: rows.length,
         }, ReactDOMFactories.td(
         {}, defensePanel)));

         if (phase.key === Phase.COMBAT_MODIFY_DEFENSE_DICE && modifications !== undefined)
         {
            // Modify Defense Dice panel.
            const modifyDefensePanel = React.createElement(CombatUI.ModifyDefenseUI,
            {
               defender: defender,
               resourceBase: this.props.resourceBase,
               modifications: modifications,
               onChange: this.ok,
            });

            rows.push(ReactDOMFactories.tr(
            {
               key: rows.length,
            }, ReactDOMFactories.td(
            {}, modifyDefensePanel)));
         }
      }

      if (phase.key === Phase.COMBAT_NOTIFY_DAMAGE)
      {
         // Damage panel.
         const damagePanel = React.createElement(CombatUI.DamageUI,
         {
            criticalHitCount: this.props.criticalHitCount,
            hitCount: this.props.hitCount,
            resourceBase: this.props.resourceBase,
         });

         rows.push(ReactDOMFactories.tr(
         {
            key: rows.length,
         }, ReactDOMFactories.td(
         {}, damagePanel)));
      }

      const message = ReactDOMFactories.table(
      {}, ReactDOMFactories.tbody(
      {}, rows));
      const okButton = React.createElement(Button,
      {
         key: 0,
         name: "OK",
         onClick: this.ok,
      });
      const buttons = ReactDOMFactories.span(
      {}, [okButton]);

      return React.createElement(OptionPane,
      {
         title: this.createTitle(phase),
         message: message,
         buttons: buttons,
      });
   }
}

CombatUI.prototype.createTitle = function(phase)
{
   let answer = "Combat";

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
};

CombatUI.prototype.okFunction = function(modification)
{
   LOGGER.debug("CombatUI ok()");
   let answer;

   if (modification && modification.consequent)
   {
      answer = modification;
   }

   LOGGER.debug("CombatUI.ok() modification = " + modification + " " + (typeof modification));

   const okFunction = this.props.okFunction;

   if (okFunction)
   {
      okFunction(answer);
   }
};

/*
 * Provides a user interface for the attacker during combat.
 *
 * @param dice Attack dice. (required)
 */
class AttackDiceUI extends React.Component
{
   render()
   {
      const columns = [];

      const dice = this.props.dice;
      InputValidator.validateNotNull("attack dice", dice);

      const values = dice.sortedValues();

      values.forEach(function(die)
      {
         columns.push(ReactDOMFactories.td(
         {
            key: columns.length,
         }, this.createImage(die)));
      }, this);

      return ReactDOMFactories.table(
      {
         className: "combatDicePanel center",
      }, ReactDOMFactories.tbody(
      {}, ReactDOMFactories.tr(
      {}, columns)));
   }
}

AttackDiceUI.prototype.createImage = function(die)
{
   const title = AttackDiceValue.properties[die].name;
   const source = this.props.resourceBase + "dice/Attack" + title.replace(" ", "") + "32.png";

   return ReactDOMFactories.img(
   {
      src: source,
      title: title,
   });
};

AttackDiceUI.propTypes = {
   dice: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
};

CombatUI.AttackDiceUI = AttackDiceUI;

/*
 * Provides a user interface for the defender during combat.
 *
 * @param defenseDice Defense dice. (optional)
 */
class DefenseDiceUI extends React.Component
{
   render()
   {
      const columns = [];

      const dice = this.props.dice;

      if (dice)
      {
         const values = dice.sortedValues();

         values.forEach(function(die)
         {
            columns.push(ReactDOMFactories.td(
            {
               key: columns.length,
            }, this.createImage(die)));
         }, this);
      }

      return ReactDOMFactories.table(
      {
         className: "combatDicePanel center",
      }, ReactDOMFactories.tbody(
      {}, ReactDOMFactories.tr(
      {}, columns)));
   }
}

DefenseDiceUI.prototype.createImage = function(die)
{
   const title = DefenseDiceValue.properties[die].name;
   const source = this.props.resourceBase + "dice/Defense" + title.replace(" ", "") + "32.png";

   return ReactDOMFactories.img(
   {
      src: source,
      title: title,
   });
};

DefenseDiceUI.propTypes = {
   dice: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
};

CombatUI.DefenseDiceUI = DefenseDiceUI;

class ModifyAttackUI extends React.Component
{
   constructor(props)
   {
      super(props);

      this.myOnChange = this.myOnChangeFunction.bind(this);
   }

   render()
   {
      const modifications = this.props.modifications;
      const resourceBase = this.props.resourceBase;
      const labelFunction = function(value)
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
   }
}

ModifyAttackUI.prototype.myOnChangeFunction = function(event, selected)
{
   LOGGER.trace("ModifyAttackUI.myOnChange()");
   LOGGER.debug("ModifyAttackUI.myOnChange() modification = " + selected + " " + (typeof selected));
   this.props.onChange(selected);
};

ModifyAttackUI.propTypes = {
   attacker: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
   modifications: PropTypes.array.isRequired,
   onChange: PropTypes.func.isRequired,
};

CombatUI.ModifyAttackUI = ModifyAttackUI;

class ModifyDefenseUI extends React.Component
{
   constructor(props)
   {
      super(props);

      this.myOnChange = this.myOnChangeFunction.bind(this);
   }

   render()
   {
      const modifications = this.props.modifications;
      const resourceBase = this.props.resourceBase;
      const labelFunction = function(value)
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
   }
}

ModifyDefenseUI.prototype.myOnChangeFunction = function(event, selected)
{
   LOGGER.trace("ModifyDefenseUI.myOnChange()");
   LOGGER.debug("ModifyDefenseUI.myOnChange() modification = " + selected + " " + (typeof selected));
   this.props.onChange(selected);
};

ModifyDefenseUI.propTypes = {
   defender: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
   modifications: PropTypes.array.isRequired,
   onChange: PropTypes.func.isRequired,
};

CombatUI.ModifyDefenseUI = ModifyDefenseUI;

/*
 * Provides a user interface for damage.
 *
 * @param hitCount Hit count. (required)
 *
 * @param criticalHitCount Critical hit count. (required)
 */
class DamageUI extends React.Component
{
   render()
   {
      const hitCount = this.props.hitCount;
      InputValidator.validateNotNull("hitCount", hitCount);
      const criticalHitCount = this.props.criticalHitCount;
      InputValidator.validateNotNull("criticalHitCount", criticalHitCount);

      const hitFilename = this.props.resourceBase + "pilotCard/Damage32.jpg";
      const criticalHitFilename = this.props.resourceBase + "pilotCard/CriticalDamage32.jpg";
      const columns = [];

      columns.push(ReactDOMFactories.td(
      {
         key: columns.length,
      }, ReactDOMFactories.span(
      {}, "Damage: ")));
      columns.push(ReactDOMFactories.td(
      {
         key: columns.length,
      }, ReactDOMFactories.img(
      {
         src: hitFilename,
         title: "Damage",
      })));
      columns.push(ReactDOMFactories.td(
      {
         key: columns.length,
      }, ReactDOMFactories.span(
      {}, hitCount)));
      columns.push(ReactDOMFactories.td(
      {
         key: columns.length,
      }, ReactDOMFactories.img(
      {
         src: criticalHitFilename,
         title: "Critical Damage",
      })));
      columns.push(ReactDOMFactories.td(
      {
         key: columns.length,
      }, ReactDOMFactories.span(
      {}, criticalHitCount)));

      return ReactDOMFactories.table(
      {}, ReactDOMFactories.tbody(
      {}, ReactDOMFactories.tr(
      {}, columns)));
   }
}

DamageUI.propTypes = {
   criticalHitCount: PropTypes.number.isRequired,
   hitCount: PropTypes.number.isRequired,
   resourceBase: PropTypes.string.isRequired,
};

CombatUI.DamageUI = DamageUI;

CombatUI.propTypes = {
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
};

export default CombatUI;