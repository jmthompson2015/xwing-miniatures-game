import Range from "../artifact/Range.js";

import Button from "./Button.js";
import OptionPane from "./OptionPane.js";

class WeaponAndDefenderChooser extends React.Component
{
   constructor(props)
   {
      super(props);

      var weapon;
      var defender;

      var choices = this.props.choices;

      if (choices.length > 0)
      {
         weapon = choices[0].weapon;
         var rangeToDefenders = choices[0].rangeToDefenders;
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
      var attacker = this.props.attacker;
      var message = ReactDOMFactories.div(
      {}, "Attacker: " + attacker.name());
      var selectedWeapon = this.state.weapon;
      var selectedDefender = this.state.defender;
      var choices = this.props.choices;
      var self = this;

      var rows = [];

      for (var i = 0; i < choices.length; i++)
      {
         var weaponAndRangeAndTokens = choices[i];
         var weapon = weaponAndRangeAndTokens.weapon;
         var weaponName = weapon.name();

         rows.push(ReactDOMFactories.tr(
         {
            key: rows.length
         }, ReactDOMFactories.td(
         {
            className: "weaponName pv2",
         }, weaponName)));

         var rangeToDefendersArray = weaponAndRangeAndTokens.rangeToDefenders;

         for (var j = 0; j < rangeToDefendersArray.length; j++)
         {
            var rangeToDefenders = rangeToDefendersArray[j];
            var rangeKey = rangeToDefenders.range;
            var rangeName = Range.properties[rangeKey].name;

            rows.push(ReactDOMFactories.tr(
            {
               key: rows.length
            }, ReactDOMFactories.td(
            {
               className: "rangeLabel bg-xw-medium"
            }, "Range " + rangeName)));

            var defenders = rangeToDefenders.defenders;

            if (defenders)
            {
               for (var k = 0; k < defenders.length; k++)
               {
                  var token = defenders[k];

                  var input = ReactDOMFactories.input(
                  {
                     key: 0,
                     type: "radio",
                     defaultChecked: (weapon === selectedWeapon && token.equals(selectedDefender)),
                     onClick: self.selectionChanged,
                     name: "weaponChooserRadioButtons",
                     "data-weapon-name": weaponName,
                     "data-defender-id": token.id()
                  });
                  var span = ReactDOMFactories.span(
                  {
                     key: 1
                  }, token.name());
                  var label = ReactDOMFactories.label(
                  {}, input, " ", span);
                  var cell = ReactDOMFactories.td(
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

      var initialInput = ReactDOMFactories.table(
      {
         className: "combatTable f6"
      }, ReactDOMFactories.tbody(
      {}, rows));
      var cancelButton = React.createElement(Button,
      {
         key: "cancelButton",
         name: "Cancel",
         onClick: self.cancel
      });
      var okButton = React.createElement(Button,
      {
         key: "okButton",
         name: "OK",
         onClick: self.ok
      });
      var buttons = ReactDOMFactories.span(
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
   var answer;

   var choices = this.props.choices;

   for (var i = 0; i < choices.length; i++)
   {
      var weaponAndRangeAndTokens = choices[i];

      var rangeToDefendersArray = weaponAndRangeAndTokens.rangeToDefenders;

      for (var j = 0; j < rangeToDefendersArray.length; j++)
      {
         var rangeToDefenders = rangeToDefendersArray[j];

         var defenders = rangeToDefenders.defenders;

         if (defenders)
         {
            for (var k = 0; k < defenders.length; k++)
            {
               var token = defenders[k];

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
   var attacker = this.props.attacker;
   var answer = attacker.primaryWeapon();

   if (weaponName !== "Primary Weapon")
   {
      var secondaryWeapons = attacker.secondaryWeapons();

      for (var i = 0; i < secondaryWeapons.size; i++)
      {
         var weapon = secondaryWeapons.get(i);

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
   var weaponName = event.currentTarget.dataset.weaponName;
   var defenderId = event.currentTarget.dataset.defenderId;
   LOGGER.debug("weaponName = " + weaponName + " defenderId = " + defenderId);
   var weapon = this.findWeapon(weaponName);
   LOGGER.debug("weapon = " + weapon);
   var defender = this.findDefender(defenderId);
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