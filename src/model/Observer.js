/*
 * @see https://github.com/reactjs/redux/issues/303#issuecomment-125184409
 */
import InputValidator from "../utility/InputValidator.js";

const Observer = {};

Observer.observeStore = function(store, select, onChange)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("select", select);
   InputValidator.validateNotNull("onChange", onChange);

   let currentState;

   function handleChange()
   {
      const nextState = select(store.getState());

      if (nextState !== currentState)
      {
         currentState = nextState;
         onChange(nextState);
      }
   }

   const unsubscribe = store.subscribe(handleChange);

   handleChange();

   return unsubscribe;
};

if (Object.freeze)
{
   Object.freeze(Observer);
}

export default Observer;