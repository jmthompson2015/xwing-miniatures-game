import InputValidator from "../utility/InputValidator.js";

function Position(xIn, yIn, headingIn)
{
   const x = Math.round(xIn);
   const y = Math.round(yIn);
   const heading = Position.normalizeAngle(headingIn);

   this.x = function()
   {
      return x;
   };

   this.y = function()
   {
      return y;
   };

   this.heading = function()
   {
      return heading;
   };
}

Position.prototype.computeBearing = function(x2, y2)
{
   let answer = Position.computeHeading(this.x(), this.y(), x2, y2);
   answer -= this.heading();
   answer = Position.normalizeAngle(answer);

   return answer;
};

Position.prototype.computeDistance = function(position)
{
   InputValidator.validateNotNull("position", position);

   const dx = position.x() - this.x();
   const dy = position.y() - this.y();

   return Math.round(Math.sqrt((dx * dx) + (dy * dy)));
};

Position.prototype.toString = function()
{
   return "(" + this.x() + ", " + this.y() + ", " + this.heading() + ")";
};

Position.computeHeading = function(x1, y1, x2, y2)
{
   const dx = x2 - x1;
   const dy = y2 - y1;

   let answer = Math.round(Math.atan2(dy, dx) * 180.0 / Math.PI);
   answer = Position.normalizeAngle(answer);

   return answer;
};

Position.normalizeAngle = function(angle)
{
   let answer = angle;

   while (answer < 0)
   {
      answer += 360;
   }

   answer = answer % 360;

   return answer;
};

Position.ZERO = new Position(0, 0, 0);

export default Position;