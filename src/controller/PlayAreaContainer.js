import InputValidator from "../utility/InputValidator.js";

import Phase from "../artifact/Phase.js";
import PlayFormat from "../artifact/PlayFormat.js";
import Ship from "../artifact/Ship.js";
import Faction from "../artifact/Faction.js";

import ManeuverAction from "../model/ManeuverAction.js";
import ManeuverComputer from "../model/ManeuverComputer.js";
import Selector from "../model/Selector.js";

import PlayAreaUI from "../view/PlayAreaUI.js";

// PlayAreaContainer

const EXPLOSION_PHASES = [Phase.COMBAT_AFTER_DEAL_DAMAGE];
const LASER_AUDIO_PHASES = [Phase.COMBAT_ROLL_ATTACK_DICE, ];
const LASER_BEAM_PHASES = [Phase.COMBAT_DECLARE_TARGET, Phase.COMBAT_ROLL_ATTACK_DICE, Phase.COMBAT_MODIFY_ATTACK_DICE, Phase.COMBAT_ROLL_DEFENSE_DICE, Phase.COMBAT_MODIFY_DEFENSE_DICE, Phase.COMBAT_COMPARE_RESULTS, Phase.COMBAT_NOTIFY_DAMAGE, Phase.COMBAT_DEAL_DAMAGE, Phase.COMBAT_AFTER_DEAL_DAMAGE];
const MANEUVER_PHASES = [Phase.ACTIVATION_REVEAL_DIAL, Phase.ACTIVATION_SET_TEMPLATE, Phase.ACTIVATION_EXECUTE_MANEUVER, Phase.ACTIVATION_CHECK_PILOT_STRESS, Phase.ACTIVATION_CLEAN_UP];

function mapStateToProps(state, ownProps)
{
   InputValidator.validateIsString("resourceBase", ownProps.resourceBase);

   const environment = state.environment;
   const scale = state.playAreaScale;
   const image = "background/" + (state.playFormatKey === PlayFormat.STANDARD ? "pia13845.jpg" : "horsehead_nebula_02092008.jpg");
   const width = (state.playFormatKey === PlayFormat.STANDARD ? 915 : 1830);
   const tokenPositions = environment.createTokenPositions();

   const answer = {
      playFormatKey: state.playFormatKey,
      scale: state.playAreaScale,
      width: scale * width,
      height: scale * 915,
      image: image,
      resourceBase: ownProps.resourceBase,
      tokenPositions: tokenPositions,
   };

   const activeToken = environment.activeCardInstance();
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
      const combatAction = Selector.combatAction(state, activeToken);

      if (combatAction)
      {
         const fromPosition = combatAction.attackerPosition();

         if (fromPosition)
         {
            const toPosition = combatAction.defenderPosition();

            if (toPosition)
            {
               const defender = combatAction.defender();

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
      const combatAction = Selector.combatAction(state, activeToken);
      LOGGER.debug("combatAction = " + combatAction);

      if (combatAction)
      {
         const attacker = combatAction.attacker();
         const fromPosition = combatAction.attackerPosition();
         LOGGER.debug("fromPosition = " + fromPosition);

         if (fromPosition)
         {
            const defender = combatAction.defender();
            const toPosition = combatAction.defenderPosition();
            LOGGER.debug("toPosition = " + toPosition);

            if (toPosition && !defender.isDestroyed())
            {
               const isPrimary = combatAction.weapon().isPrimary();
               const factionColor = attacker.card().shipFaction.faction.color;
               let audioClip;

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
      const maneuverAction = ManeuverAction.get(activeToken.store(), activeToken.id());

      if (maneuverAction)
      {
         const maneuver = maneuverAction.maneuver();
         const fromPosition = maneuverAction.fromPosition();
         const playFormatKey = state.environment.playFormatKey();
         const shipBase = maneuverAction.shipBase();
         const toPosition = ManeuverComputer.computeToPosition(playFormatKey, maneuver, fromPosition, shipBase);

         if (toPosition)
         {
            const path = ManeuverComputer.computePath(maneuver, fromPosition, shipBase);
            const fromPolygon = ManeuverComputer.computeFromPolygon(fromPosition, shipBase);
            const toPolygon = ManeuverComputer.computePolygon(shipBase, toPosition.x(), toPosition.y(), toPosition.heading());
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
   let answer;

   const shipKey = token.card().shipFaction.shipKey;

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
      const factionKey = token.card().shipFaction.factionKey;

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

export default ReactRedux.connect(mapStateToProps)(PlayAreaUI);