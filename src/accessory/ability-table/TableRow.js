"use strict";

define(["common/js/InputValidator", "artifact/js/Phase", "artifact/js/UpgradeHeader"],
   function(InputValidator, Phase, UpgradeHeader)
   {
      var TableRow = {};

      TableRow.createTableRow = function(ability, deck, count)
      {
         InputValidator.validateNotNull("ability", ability);
         InputValidator.validateNotNull("deck", deck);
         // count optional

         var type;
         var description = ability.description;
         var action;
         switch (deck)
         {
            case "ConditionCard":
               break;
            case "DamageCard":
               type = ability.trait;
               if (ability.hasAction)
               {
                  action = ability.actionDescription;
               }
               break;
            case "PilotCard":
               type = ability.shipFaction.factionKey;
               break;
            case "UpgradeCard":
               type = ability.typeKey;
               if (ability.header !== undefined)
               {
                  description = undefined;
                  action = ability.description;
               }
               break;
         }
         var isFlavorText = (ability.isFlavorText !== undefined ? ability.isFlavorText : false);
         var isImplemented = (ability.isImplemented !== undefined ? ability.isImplemented : false);
         var event = determineEvent(ability, description, action);

         return (
         {
            deck: deck,
            type: type,
            name: ability.name,
            count: count,
            description: description,
            isFlavorText: isFlavorText,
            action: action,
            isImplemented: isImplemented,
            event: event,
         });
      };

      var descriptionPatterns = [
         {
            patterns: ["squad point cost", "you may equip", "your action bar gains", /your.*upgrade bar gains/],
            event: "SquadBuilder",
            },
         {
            patterns: ["after acquiring a target lock", /after you acquire.*target lock/],
            event: "Event.targetLockAcquired",
            },
         {
            patterns: [/when performing.*(boost|barrel roll|decloak)/, /when you.*(boost|barrel roll|decloak)/],
            event: "Event.afterExecuteManeuver",
            },
         {
            patterns: [/when you are dealt.*damage card/],
            event: "Event.receiveDamage",
            },
         {
            patterns: ["when you receive a stress token", /each time you are assigned.*stress/],
            event: "Event.receiveStress",
            },
         {
            patterns: ["after you remove a stress token"],
            event: "Event.removeStress",
            },
         {
            patterns: ["at the start of the activation phase"],
            event: "Phase.activationStart",
            },
         {
            patterns: [/when you reveal.*maneuver/],
            event: "Phase.activationRevealDial",
            },
         {
            patterns: [/you may execute.*maneuver/],
            event: "Phase.activationSetTemplate",
            },
         {
            patterns: [/treat.*maneuvers.*as (green|white|red) maneuvers/],
            event: "Phase.activationCheckPilotStress",
            },
         {
            patterns: [/after executing.*maneuver/, /after you execute.*maneuver/],
            event: "Phase.activationCleanUp",
            },
         {
            patterns: ["during your \"perform action\" step"],
            event: "Phase.activationPerformAction",
            },
         {
            patterns: ["at the end of the activation phase"],
            event: "Phase.activationEnd",
            },
         {
            patterns: [/at the start of (each|the) combat phase/],
            event: "Phase.combatStart",
            },
         {
            patterns: ["when attacking"],
            event: "Phase.combatModifyAttackDice",
            },
         {
            patterns: ["when defending"],
            event: "Phase.combatModifyDefenseDice",
            },
         {
            patterns: ["after performing an attack", /(after|when) you perform an attack/, "after defending"],
            event: "Phase.combatAfterDealDamage",
            },
         {
            patterns: ["at the end of the combat phase"],
            event: "Phase.combatEnd",
            },
         {
            patterns: ["at the start of the end phase"],
            event: "Phase.endStart",
            },
         {
            patterns: ["at the end of the end phase"],
            event: "Phase.endEnd",
            },
        ];

      function determineEvent(ability, description)
      {
         var answer;

         if (ability.header)
         {
            switch (ability.header)
            {
               case UpgradeHeader.ACTION:
                  answer = "Phase.activationPerformAction";
                  break;
               case UpgradeHeader.ATTACK:
               case UpgradeHeader.ATTACK_ENERGY:
               case UpgradeHeader.ATTACK_FOCUS:
               case UpgradeHeader.ATTACK_TARGET_LOCK:
                  answer = "Phase.combatStart";
                  break;
               case UpgradeHeader.ENERGY:
                  answer = "Phase.activationUseEnergy";
                  break;
            }
         }

         var myDescription = (description !== undefined ? description.toLowerCase() : description);

         if (answer === undefined && myDescription)
         {
            for (var i = 0; i < descriptionPatterns.length; i++)
            {
               var descriptionPattern = descriptionPatterns[i];
               var patterns = descriptionPattern.patterns;

               for (var j = 0; j < patterns.length; j++)
               {
                  var pattern = patterns[j];

                  if (myDescription.indexOf(pattern) >= 0 || (pattern.test && pattern.test(myDescription)))
                  {
                     answer = descriptionPattern.event;
                     break;
                  }
               }
            }
         }

         return answer;
      }

      return TableRow;
   });
