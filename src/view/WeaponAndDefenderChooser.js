import Range from "../artifact/Range.js";

import Button from "./Button.js";
import OptionPane from "./OptionPane.js";

class WeaponAndDefenderChooser extends React.Component
{
   constructor(props)
   {
      super(props);

      let weapon;
      let defender;

      const choices = this.props.choices;

      if (choices.length > 0)
      {
         weapon = choices[0].weapon;
         const rangeToDefenders = choices[0].rangeToDefenders;
         defender = rangeToDefenders[0].defenders[0];
      }

      this.state = {
         weapon: weapon,
         defender: defender
      };

      this.cancel = this.cancelFunction.bind(this);
      this.ok = this.okFunction.bind(this);
      this.selectionChanged = this.selectionChangedFunction.bind(this);
   }

   render()
   {
      const attacker = this.props.attacker;
      const message = ReactDOMFactories.div(
      {}, "Attacker: " + attacker.name());
      const selectedWeapon = this.state.weapon;
      const selectedDefender = this.state.defender;
      const choices = this.props.choices;
      const self = this;

      const rows = [];

      for (let i = 0; i < choices.length; i++)
      {
         const weaponAndRangeAndTokens = choices[i];
         const weapon = weaponAndRangeAndTokens.weapon;
         const weaponName = weapon.name();

         rows.push(ReactDOMFactories.tr(
         {
            key: rows.length
         }, ReactDOMFactories.td(
         {
            className: "weaponName pv2",
         }, weaponName)));

         const rangeToDefendersArray = weaponAndRangeAndTokens.rangeToDefenders;

         for (let j = 0; j < rangeToDefendersArray.length; j++)
         {
            const rangeToDefenders = rangeToDefendersArray[j];
            const rangeKey = rangeToDefenders.range;
            const rangeName = Range.properties[rangeKey].name;

            rows.push(ReactDOMFactories.tr(
            {
               key: rows.length
            }, ReactDOMFactories.td(
            {
               className: "rangeLabel bg-xw-medium"
            }, "Range " + rangeName)));

            const defenders = rangeToDefenders.defenders;

            if (defenders)
            {
               for (let k = 0; k < defenders.length; k++)
               {
                  const token = defenders[k];

                  const input = ReactDOMFactories.input(
                  {
                     key: 0,
                     type: "radio",
                     defaultChecked: (weapon === selectedWeapon && token.equals(selectedDefender)),
                     onClick: self.selectionChanged,
                     name: "weaponChooserRadioButtons",
                     "data-weapon-name": weaponName,
                     "data-defender-id": token.id()
                  });
                  const span = ReactDOMFactories.span(
                  {
                     key: 1
                  }, token.name());
                  const label = ReactDOMFactories.label(
                  {}, input, " ", span);
                  const cell = ReactDOMFactories.td(
                  {
                     className: "defenderChoice tl"
                  }, label);
                  rows.push(ReactDOMFactories.tr(
                  {
                     key: rows.length
                  }, cell));
               }
            }
         }
      }

      const initialInput = ReactDOMFactories.table(
      {
         className: "combatTable f6"
      }, ReactDOMFactories.tbody(
      {}, rows));
      const cancelButton = React.createElement(Button,
      {
         key: "cancelButton",
         name: "Cancel",
         onClick: self.cancel
      });
      const okButton = React.createElement(Button,
      {
         key: "okButton",
         name: "OK",
         onClick: self.ok
      });
      const buttons = ReactDOMFactories.span(
      {}, cancelButton, " ", okButton);
      return React.createElement(OptionPane,
      {
         panelClass: "optionPane",
         title: "Combat: Select Weapon and Defender",
         titleClass: "optionPaneTitle",
         message: message,
         messageClass: "optionPaneMessage",
         initialInput: initialInput,
         buttons: buttons,
         buttonsClass: "optionPaneButtons"
      });
   }
}

WeaponAndDefenderChooser.prototype.cancelFunction = function()
{
   LOGGER.debug("cancel()");
   this.props.callback(undefined);
};

WeaponAndDefenderChooser.prototype.findDefender = function(tokenId)
{
   let answer;

   const choices = this.props.choices;

   for (let i = 0; i < choices.length; i++)
   {
      const weaponAndRangeAndTokens = choices[i];

      const rangeToDefendersArray = weaponAndRangeAndTokens.rangeToDefenders;

      for (let j = 0; j < rangeToDefendersArray.length; j++)
      {
         const rangeToDefenders = rangeToDefendersArray[j];

         const defenders = rangeToDefenders.defenders;

         if (defenders)
         {
            for (let k = 0; k < defenders.length; k++)
            {
               const token = defenders[k];

               if (token.id() == tokenId)
               {
                  answer = token;
                  break;
               }
            }
         }
      }
   }

   return answer;
};

WeaponAndDefenderChooser.prototype.findWeapon = function(weaponName)
{
   const attacker = this.props.attacker;
   let answer = attacker.primaryWeapon();

   if (weaponName !== "Primary Weapon")
   {
      const secondaryWeapons = attacker.secondaryWeapons();

      for (let i = 0; i < secondaryWeapons.size; i++)
      {
         const weapon = secondaryWeapons.get(i);

         if (weapon.name() === weaponName)
         {
            answer = weapon;
            break;
         }
      }
   }

   return answer;
};

WeaponAndDefenderChooser.prototype.okFunction = function()
{
   LOGGER.debug("ok()");
   this.props.callback(this.state.weapon, this.state.defender);
};

WeaponAndDefenderChooser.prototype.selectionChangedFunction = function(event)
{
   LOGGER.debug("selectionChanged()");
   const weaponName = event.currentTarget.dataset.weaponName;
   const defenderId = event.currentTarget.dataset.defenderId;
   LOGGER.debug("weaponName = " + weaponName + " defenderId = " + defenderId);
   const weapon = this.findWeapon(weaponName);
   LOGGER.debug("weapon = " + weapon);
   const defender = this.findDefender(defenderId);
   LOGGER.debug("defender = " + defender);
   this.setState(
   {
      weapon: weapon,
      defender: defender
   });
};

WeaponAndDefenderChooser.propTypes = {
   callback: PropTypes.func.isRequired,
   choices: PropTypes.array.isRequired,
   attacker: PropTypes.object.isRequired,
};

export default WeaponAndDefenderChooser;