import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';



const app = express();

app.use(cors());
app.use(bodyParser.json());

var passwordHash = require('password-hash');

mongoose.connect('mongodb://localhost:27017/etfkvizs');

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('mongo open');
})

const router = express.Router();

import User from './models/user';
import Game from './models/game';
import Gameoftheday from './models/gameoftheday';
import gameoftheday from './models/gameoftheday';
import Answer from './models/answers';
import answers from './models/answers';
import results from './models/results';
import Result from './models/results';

router.route('/login').post(
    (req, res)=>{
        let username = req.body.username;
        let password = req.body.password;
        let passwordHashed = passwordHash.generate(password);
        User.find({'username':username},
         (err,user)=>{
            if(err) console.log(err);
            else if(user.length){
                if(passwordHash.verify(password, passwordHashed)){
                    res.json(user);
                } else {
                    res.json(null);
                }
            } else{
                res.json(null);
            }
        })
    }
);

router.route('/register').post((req, res)=>{
    var user = new User(req.body);
    var passwordHashed = passwordHash.generate(req.body.password);
    user.set('password', passwordHashed);
    user.save().
        then(user=>{
            res.status(200).json({'user':'ok'});
        }).catch(err=>{
            res.status(400).json({'user':'no'});
            res.json(null);
        })
});

router.route('/checkUsername').post((req, res)=>{
    let username = req.body.username;

    User.find({'username':username}, (err,user) =>{
        if(err) console.log(err);
        else res.json(user);
    })
});

router.route('/checkAnswer').post((req, res) =>{
    let username = req.body.username;
    let secretQuestion = req.body.question;
    let secretAnswer = req.body.answer;
    User.findOne({'username':username, 'secretQuestion':secretQuestion, 'secretAnswer':secretAnswer}, (err, user)=>{
        if(err) console.log(err);
        else if(user){
            res.json(user);
        } else{
            res.json(null);
        }
    })
})

router.route('/checkUser').post((req, res) =>{
    let username = req.body.username;
    let jmbg = req.body.jmbg;
    User.findOne({'username':username, 'jmbg' : jmbg}, (err, user) =>{
        if(err) console.log(err);
        else if(user){
            res.json(user);
        } else{
            res.json(null);
        }
    })
})

router.route('/changePassword').post((req, res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let passwordHashed = passwordHash.generate(password);
    User.updateOne({'username':username},{$set:{'password':passwordHashed}}, (err, res)=>{
        if(err) console.log(err);
    })
})

router.route('/approveUser/:username').get((req, res)=>{
    User.updateOne({'username':req.params.username},{$set:{'approved':true}}, (err, res)=>{
        if(err) console.log(err);
    })
})

router.route('/unapproveUser/:username').get((req, res)=>{
    User.deleteOne({'username':req.params.username}, (err)=>{
        if(err) console.log(err);
    })
})

router.route('/unapprovedUsers').get((req, res)=>{
    User.find({'type':'user', 'approved':false}, (err, users)=>{
        if(err) console.log(err);
        else res.json(users);
    })
})

router.route('/insertGames').post((req, res)=>{
    let games = new Game(req.body);
    games.save().then(game=>{
        res.status(200).json({'game':'ok'});
    }).catch(err=>{
        res.status(400).json({'game':'no'});
        res.json(null);
    })
})

router.route('/getGames').get((req, res)=>{
    Game.findOne({}, (err, games)=>{
        if(err) console.log(err);
        else {
            if(games) res.json(games);
            else res.json(null);
        }
    })
})

router.route('/updateAnagrams').post((req, res)=>{
    let zagonetka = req.body.zagonetka;
    let resenje = req.body.resenje;
    var obj = {
        zagonetka: zagonetka,
        resenje: resenje
    }
    Game.updateOne({},{$push:{Anagrami: obj}},(err, res)=>{
        if(err) console.log(err);
    })
})

router.route('/updateGeography').post((req, res)=>{
    let stari = req.body.stari;
    let termin = req.body.novitermin;
    Game.updateOne({'Geografija.slovo': stari.slovo, 
    'Geografija.odgovori.kategorija': stari.odgovori.kategorija},
    {$set:{'Geografija.$[elem1].odgovori.$[elem2].termin':termin}},
    {arrayFilters:[{'elem1.slovo':stari.slovo},{'elem2.kategorija':stari.odgovori.kategorija}]},(err, game)=>{
        if(err) console.log(err);
    }) 
})


router.route('/getGeographyForLetter/:slovo').get((req, res)=>{
    Game.findOne({'Geografija.slovo':req.params.slovo},(err, game)=>{
        if(err) console.log(err);
        if(!game){
            res.json(null);
        } else{
            res.json(game);
        }
    })
})

router.route('/updateAnswer').post((req, res)=>{
    let date = req.body.date;
    let username = req.body.username;
    let approveds = req.body.approveds;
    answers.findOneAndUpdate({'date':date, 'username' : username},{$set:{'approveds':approveds}},(err, answer)=>{
        if(err) console.log(err);
        if(answer){
            res.json(answer);
        } else {
            res.json(null);
        }
    })
})

router.route('/getAnswers').get((req, res)=>{
    answers.find({},(err, answer)=>{
        if(err) console.log(err);
        if(!answer){
            res.json(null);
        } else {
            res.json(answer);
        }
    })
})

router.route('/deleteAnswer').post((req, res)=>{
    let date = req.body.date;
    let username = req.body.username;
    answers.deleteOne({'date':date,'username':username},(err)=>{
        if(err) console.log(err);
    })
})

router.route('/getAnswer').post((req, res)=>{
    let date = req.body.date;
    let username = req.body.username;
    answers.findOne({'date':date, 'username':username},(err, answer)=>{
        if(err) console.log(err);
        if(!answer) {
            console.log('no answer found');
        } else {
            res.json(answer);
        }
    })
})

router.route('/pushAnswers').post((req, res)=>{
    var answer = new Answer(req.body);
    answer.save().then(answer=>{
        res.status(200).json({'answer':'ok'});
    }).catch(err=>{
        res.status(400).json({'answer':'no'});
        res.json(null);
    })
})

router.route('/insertGeography').post((req, res)=>{
    let data = req.body.dat;
    Game.updateOne({},{$push:{Geografija: data}},(err, res)=>{
        if(err) console.log(err);
    })
})

router.route('/getGeography').post((req, res)=>{
    let slovo = req.body.slovo;
    let kategorija = req.body.kategorija;
    console.log(slovo, kategorija);
    Game.findOne({slovo : slovo}, 
    (err, game)=>{
    if(err) console.log(err);
    if(!game){
        res.json(null);
    } else {
        console.log(game);
        // res.json(game);
    }
    })
})

router.route('/updateGeography').post((req, res)=>{
    let slovo = req.body.slovo;
    let kategorija = req.body.kategorija;
    let termin = req.body.termin;
    Game.updateOne({Geografija: {slovo : slovo, kategorija : kategorija}},{$set:{termin: termin}},(err, res)=>{
        if(err) console.log(err);
    })
})

router.route('/saveGameOfTheDay').post((req, res)=>{
    var gameoftheday = new Gameoftheday(req.body);
    gameoftheday.save().
        then(gameoftheday=>{
            res.status(200).json({'gameoftheday':'ok'});
        }).catch(err=>{
            // res.status(400).json({'gameoftheday':'no'});
            res.json(null);
        })
})

router.route('/checkGameOfTheDay').post((req, res)=>{
    let date = req.body.date;
    gameoftheday.findOne({'date': date}, (err, gameoftheday)=>{
        if(err) console.log(err);
        else if(!gameoftheday){
            res.json(null);
        } else{
            res.json(gameoftheday);
        }
    })
})

router.route('/insertResult').post((req, res)=>{
    let result = new Result(req.body);
    result.save().then(result=>{
        res.status(200).json({'result':'ok'});
    }).catch(err=>{
        res.status(400).json({'result':'no'});
        res.json(null);
    })
})

router.route('/getResult').post((req, res)=>{
    let date = req.body.date;
    let username = req.body.username;
    results.findOne({'date':date,'username':username},(err,result)=>{
        if(err) console.log(err);
        if(result){
            res.json(result);
        } else {
            res.json(null);
        }
    })
})

router.route('/getResultsForDate').post((req, res)=>{
    let date = req.body.date;
    results.find({'date' : date}, (err, result)=>{
        if(err) console.log(err);
        if(result){
            res.json(result);
        } else{
            res.json(null);
        }
    })
})

router.route('/getResultsForMonth/:month').get((req, res)=>{
    let month = req.params.month;
    results.find({'date.month':month}, (err, results)=>{
        if(err) console.log(err);
        if(results){
            res.json(results);
        } else {
            res.json(null);
        }
    })
})

router.route('/getResultsBettwenTwoDates').post((req, res)=>{
    let date1 = req.body.date1;
    let date2 = req.body.date2;
    if(date1.month == date2.month){
        results.find({'date.day': {
            $lte : date1.day,
            $gte : date2.day
        }, 'date.month' : date1.month, 'date.year' : date1.year
        }, (err, results)=>{
            if(err) console.log(err);
            if(results){
                res.json(results)
            } else{
                res.json(null);
            }
        })
    } else{
        results.find({ $or: [
            {
                'date.day':{
                    $lte : date1.day
                },
                'date.month': date1.month,
                'date.year' : date1.year
            },{
                'date.day':{
                    $gt : date2.day
                },
                'date.month': date2.month,
                'date.year': date2.year
            }
        ]}, (err, results)=>{
        if(err) console.log(err);
        if(results){
            res.json(results);
        } else {
            res.json(null);
        }
    })
    }
})

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));