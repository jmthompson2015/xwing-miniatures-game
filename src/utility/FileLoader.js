const FileLoader = {};

FileLoader.loadFile = function(file, callback)
{
   const xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function()
   {
      if (xhr.readyState === 4 /* && xhr.status === 200 */ )
      {
         callback(xhr.responseText);
      }
   };
   xhr.open('GET', file, true);
   xhr.send(null);
};

export default FileLoader;