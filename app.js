var express = require('express'),
port = process.env.PORT || 3000,
app = express();

//
// app.get('/', function(req,res){
//   res.sendFile(__dirname + '/index.ejs'); //using index.html for displaying socket. mounting socket io on to express server
// });

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response){
    response.render('index');
});

app.listen(port, function(){
  console.log('Server started on ' + port);
});
