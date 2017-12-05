"use strict";

define(["react-redux", "common/js/InputValidator", "view/js/PilotsUI"],
   function(ReactRedux, InputValidator, PilotsUI)
   {
      function mapStateToProps(state, ownProps)
      {
         InputValidator.validateNotNull("agent", ownProps.agent);
         InputValidator.validateNotNull("resourceBase", ownProps.resourceBase);

         var agent = ownProps.agent;
         var tokens = agent.pilotInstances();
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

         tokens = tokens.reduce(function(accumulator, cardInstance)
         {
            if (cardInstance.tokenFore !== undefined && cardInstance.tokenAft !== undefined)
            {
               accumulator.push(cardInstance.tokenFore());
               accumulator.push(cardInstance.tokenAft());
            }
            else
            {
               accumulator.push(cardInstance);
            }

            return accumulator;
         }, []);

         return (
         {
            resourceBase: ownProps.resourceBase,
            tokens: tokens,
         });
      }

      return ReactRedux.connect(mapStateToProps)(PilotsUI);
   });
