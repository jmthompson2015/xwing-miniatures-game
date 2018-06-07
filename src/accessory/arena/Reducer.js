import Action from "./Action.js";
import InitialState from "./InitialState.js";

const Reducer = {};

Reducer.root = function(state, action)
{
   LOGGER.debug("root() type = " + action.type);

   if (typeof state === 'undefined')
   {
      return new InitialState();
   }

   let newSbToCount;

   switch (action.type)
   {
      case Action.ADD_LOSE_COUNT:
         newSbToCount = Object.assign(
         {}, state.sbToLoseCount);
         newSbToCount[action.squadBuilder]++;
         return Object.assign(
         {}, state,
         {
            sbToLoseCount: newSbToCount,
         });
      case Action.ADD_TIE_COUNT:
         newSbToCount = Object.assign(
         {}, state.sbToTieCount);
         newSbToCount[action.squadBuilder]++;
         return Object.assign(
         {}, state,
         {
            sbToTieCount: newSbToCount,
         });
      case Action.ADD_WIN_COUNT:
         newSbToCount = Object.assign(
         {}, state.sbToWinCount);
         newSbToCount[action.squadBuilder]++;
         return Object.assign(
         {}, state,
         {
            sbToWinCount: newSbToCount,
         });
      default:
         LOGGER.warn("Reducer.root: Unhandled action type: " + action.type);
         return state;
   }
};

export default Reducer;