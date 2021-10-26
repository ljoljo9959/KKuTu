var fs = require("fs");

fs.readdir("../../../../log/report", (error, files) => {
   if (error){
      console.error(error);
      return;
   };
   files.forEach((file) => {
      var fileset = fs.readFileSync("../../../../log/report/" + file, 'utf-8');
      console.log(fileset);
})
});