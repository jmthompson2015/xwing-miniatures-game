"use strict";

define(["react-redux", "utility/InputValidator", "artifact/Phase", "artifact/PlayFormat", "artifact/Ship", "artifact/Faction",
  "model/ManeuverAction", "model/ManeuverComputer", "model/Selector", "view/PlayAreaUI"],
   function(ReactRedux, InputValidator, Phase, PlayFormat, Ship, Faction,
      ManeuverAction, ManeuverComputer, Selector, PlayAreaUI)
   {
      // PlayAreaContainer

      var EXPLOSION_PHASES = [Phase.COMBAT_AFTER_DEAL_DAMAGE];
      var LASER_AUDIO_PHASES = [Phase.COMBAT_ROLL_ATTACK_DICE, ];
      var LASER_BEAM_PHASES = [Phase.COMBAT_DECLARE_TARGET, Phase.COMBAT_ROLL_ATTACK_DICE, Phase.COMBAT_MODIFY_ATTACK_DICE, Phase.COMBAT_ROLL_DEFENSE_DICE, Phase.COMBAT_MODIFY_DEFENSE_DICE, Phase.COMBAT_COMPARE_RESULTS, Phase.COMBAT_NOTIFY_DAMAGE, Phase.COMBAT_DEAL_DAMAGE, Phase.COMBAT_AFTER_DEAL_DAMAGE];
      var MANEUVER_PHASES = [Phase.ACTIVATION_REVEAL_DIAL, Phase.ACTIVATION_SET_TEMPLATE, Phase.ACTIVATION_EXECUTE_MANEUVER, Phase.ACTIVATION_CHECK_PILOT_STRESS, Phase.ACTIVATION_CLEAN_UP];

      function mapStateToProps(state, ownProps)
      {
         InputValidator.validateIsString("resourceBase", ownProps.resourceBase);

         var environment = state.environment;
         var scale = state.playAreaScale;
         var image = "background/" + (state.playFormatKey === PlayFormat.STANDARD ? "pia13845.jpg" : "horsehead_nebula_02092008.jpg");
         var width = (state.playFormatKey === PlayFormat.STANDARD ? 915 : 1830);
         var tokenPositions = environment.createTokenPositions();

         var answer = {
            playFormatKey: state.playFormatKey,
            scale: state.playAreaScale,
            width: scale * width,
            height: scale * 915,
            image: image,
            resourceBase: ownProps.resourceBase,
            tokenPositions: tokenPositions,
         };

         var activeToken = environment.activeCardInstance();
         LOGGER.debug("activeToken = " + activeToken);

         if (activeToken)
         {
            checkManeuver(state, activeToken, answer);
            checkLaserBeam(state, activeToken, answer);
            checkExplosion(state, activeToken, answer);
         }

         return answer;
      }

      function checkExplosion(state, activeToken, answer)
      {
         if (EXPLOSION_PHASES.includes(state.phaseKey))
         {
            var combatAction = Selector.combatAction(state, activeToken);

            if (combatAction)
            {
               var fromPosition = combatAction.attackerPosition();

               if (fromPosition)
               {
                  var toPosition = combatAction.defenderPosition();

                  if (toPosition)
                  {
                     var defender = combatAction.defender();

                     if (defender && defender.isDestroyed())
                     {
                        LOGGER.debug("setting explosion data");

                        answer.explosion = {
                           position: toPosition,
                           shipBase: defender.card().shipFaction.ship.shipBase,
                           audioClip: document.getElementById("explosionAudio"),
                        };
                     }
                  }
               }
            }
         }
      }

      function checkLaserBeam(state, activeToken, answer)
      {
         if (LASER_BEAM_PHASES.includes(state.phaseKey))
         {
            var combatAction = Selector.combatAction(state, activeToken);
            LOGGER.debug("combatAction = " + combatAction);

            if (combatAction)
            {
               var attacker = combatAction.attacker();
               var fromPosition = combatAction.attackerPosition();
               LOGGER.debug("fromPosition = " + fromPosition);

               if (fromPosition)
               {
                  var defender = combatAction.defender();
                  var toPosition = combatAction.defenderPosition();
                  LOGGER.debug("toPosition = " + toPosition);

                  if (toPosition && !defender.isDestroyed())
                  {
                     var isPrimary = combatAction.weapon().isPrimary();
                     var factionColor = attacker.card().shipFaction.faction.color;
                     var audioClip;

                     if (LASER_AUDIO_PHASES.includes(state.phaseKey))
                     {
                        audioClip = getLaserAudioClip(attacker);
                     }
                     LOGGER.debug("setting laser beam data");

                     answer.laserBeam = {
                        fromPosition: fromPosition,
                        toPosition: toPosition,
                        isPrimary: isPrimary,
                        factionColor: factionColor,
                        audioClip: audioClip,
                     };
                  }
               }
            }
         }
      }

      function checkManeuver(state, activeToken, answer)
      {
         if (MANEUVER_PHASES.includes(state.phaseKey))
         {
            var maneuverAction = ManeuverAction.get(activeToken.store(), activeToken.id());

            if (maneuverAction)
            {
               var maneuver = maneuverAction.maneuver();
               var fromPosition = maneuverAction.fromPosition();
               var playFormatKey = state.environment.playFormatKey();
               var shipBase = maneuverAction.shipBase();
               var toPosition = ManeuverComputer.computeToPosition(playFormatKey, maneuver, fromPosition, shipBase);

               if (toPosition)
               {
                  var path = ManeuverComputer.computePath(maneuver, fromPosition, shipBase);
                  var fromPolygon = ManeuverComputer.computeFromPolygon(fromPosition, shipBase);
                  var toPolygon = ManeuverComputer.computePolygon(shipBase, toPosition.x(), toPosition.y(), toPosition.heading());
                  LOGGER.debug("setting maneuver data");

                  answer.maneuver = {
                     maneuver: maneuver,
                     fromPolygon: fromPolygon,
                     fromPosition: fromPosition,
                     path: path,
                     shipBase: shipBase,
                     toPolygon: toPolygon,
                  };
               }
            }
         }
      }

      function getLaserAudioClip(token)
      {
         var answer;

         var shipKey = token.card().shipFaction.shipKey;

         if (shipKey === Ship.YT_1300 || shipKey === Ship.YT_2400)
         {
            answer = document.getElementById("millenniumFalconLaserAudio");
         }
         else if (shipKey === Ship.FIRESPRAY_31)
         {
            answer = document.getElementById("slave1LaserAudio");
         }
         else
         {
            var factionKey = token.card().shipFaction.factionKey;

            if (factionKey === Faction.IMPERIAL)
            {
               answer = document.getElementById("tieFighterLaserAudio");
            }
            else
            {
               answer = document.getElementById("xWingLaserAudio");
            }
         }

         return answer;
      }

      return ReactRedux.connect(mapStateToProps)(PlayAreaUI);
   });
