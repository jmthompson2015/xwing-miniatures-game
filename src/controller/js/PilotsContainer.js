"use strict";

define(["react-redux", "common/js/InputValidator", "view/js/PilotsUI"],
   function(ReactRedux, InputValidator, PilotsUI)
   {
      function mapStateToProps(state, ownProps)
      {
         InputValidator.validateNotNull("faction", ownProps.faction);
         InputValidator.validateNotNull("resourceBase", ownProps.resourceBase);

         var environment = state.environment;
         var faction = ownProps.faction;
         var tokens = environment.getTokensForFaction(faction.key);
         tokens.sort(function(token0, token1)
         {
            var pilotSkill0 = token0.pilotSkillValue();
            var pilotSkill1 = token1.pilotSkillValue();
            var answer = pilotSkill0 - pilotSkill1;

            if (answer === 0)
            {
               answer = token0.id() - token1.id();
            }

            return answer;
         });

         return (
         {
            resourceBase: ownProps.resourceBase,
            tokens: tokens,
         });
      }

      return ReactRedux.connect(mapStateToProps)(PilotsUI);
   });
