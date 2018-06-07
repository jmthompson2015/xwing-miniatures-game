const Difficulty = {
   EASY: "easy",
   STANDARD: "standard",
   HARD: "hard",

   properties:
   {
      "easy":
      {
         name: "Easy",
         key: "easy",
      },
      "standard":
      {
         name: "Standard",
         key: "standard",
      },
      "hard":
      {
         name: "Hard",
         key: "hard",
      },
   },
};

Difficulty.keys = function()
{
   return Object.keys(Difficulty.properties);
};

Difficulty.toString = function()
{
   return "Difficulty";
};

Difficulty.values = function()
{
   return Object.values(Difficulty.properties);
};

if (Object.freeze)
{
   Object.freeze(Difficulty);
}

export default Difficulty;