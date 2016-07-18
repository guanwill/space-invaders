var express = require('express'),
port = process.env.PORT || 3000,
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
cors = require('cors'),
Gamestat = require('./models/gamestat');
// apiRouter = require('./config/apiRouter');

//
// app.get('/', function(req,res){
//   res.sendFile(__dirname + '/index.ejs'); //using index.html for displaying socket. mounting socket io on to express server
// });

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var corsOptions = {
    origin: "*",
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-reset-token', 'x-invite-token', 'x-api-key', 'x-www-form-urlencoded'],
    credentials: true
};
app.use(cors(corsOptions));

//------MONGOOSE-----
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamestats')

//-------ROUTES-------

app.get('/', function(request, response){
    response.render('index');
});
app.get('/api', function(request, response){
  Gamestat.find({}, function(err, gamestats){
    if(err) console.log(err);
    // response.send('LIST')
    // console.log(musics);
    response.json(gamestats);
  });
});

app.post('/api', function(request, response){
  console.log('json')
  var gamestat = new Gamestat ({
    name: request.body.name,
    score: request.body.score
  })
  gamestat.save(function(err, gamestat){
    if (err){console.log(err)}
    else {
      console.log('json')
      response.json(gamestat);
    }
  })
});


app.listen(port, function(){
  console.log('Server started on ' + port);
});
