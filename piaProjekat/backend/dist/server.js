"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
var passwordHash = require('password-hash');
mongoose_1.default.connect('mongodb://localhost:27017/etfkvizs');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('mongo open');
});
const router = express_1.default.Router();
const user_1 = __importDefault(require("./models/user"));
const game_1 = __importDefault(require("./models/game"));
const gameoftheday_1 = __importDefault(require("./models/gameoftheday"));
const gameoftheday_2 = __importDefault(require("./models/gameoftheday"));
const answers_1 = __importDefault(require("./models/answers"));
const answers_2 = __importDefault(require("./models/answers"));
const results_1 = __importDefault(require("./models/results"));
const results_2 = __importDefault(require("./models/results"));
router.route('/login').post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let passwordHashed = passwordHash.generate(password);
    user_1.default.find({ 'username': username }, (err, user) => {
        if (err)
            console.log(err);
        else if (user.length) {
            if (passwordHash.verify(password, passwordHashed)) {
                res.json(user);
            }
            else {
                res.json(null);
            }
        }
        else {
            res.json(null);
        }
    });
});
router.route('/register').post((req, res) => {
    var user = new user_1.default(req.body);
    var passwordHashed = passwordHash.generate(req.body.password);
    user.set('password', passwordHashed);
    user.save().
        then(user => {
        res.status(200).json({ 'user': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'user': 'no' });
        res.json(null);
    });
});
router.route('/checkUsername').post((req, res) => {
    let username = req.body.username;
    user_1.default.find({ 'username': username }, (err, user) => {
        if (err)
            console.log(err);
        else
            res.json(user);
    });
});
router.route('/checkAnswer').post((req, res) => {
    let username = req.body.username;
    let secretQuestion = req.body.question;
    let secretAnswer = req.body.answer;
    user_1.default.findOne({ 'username': username, 'secretQuestion': secretQuestion, 'secretAnswer': secretAnswer }, (err, user) => {
        if (err)
            console.log(err);
        else if (user) {
            res.json(user);
        }
        else {
            res.json(null);
        }
    });
});
router.route('/checkUser').post((req, res) => {
    let username = req.body.username;
    let jmbg = req.body.jmbg;
    user_1.default.findOne({ 'username': username, 'jmbg': jmbg }, (err, user) => {
        if (err)
            console.log(err);
        else if (user) {
            res.json(user);
        }
        else {
            res.json(null);
        }
    });
});
router.route('/changePassword').post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let passwordHashed = passwordHash.generate(password);
    user_1.default.updateOne({ 'username': username }, { $set: { 'password': passwordHashed } }, (err, res) => {
        if (err)
            console.log(err);
    });
});
router.route('/approveUser/:username').get((req, res) => {
    user_1.default.updateOne({ 'username': req.params.username }, { $set: { 'approved': true } }, (err, res) => {
        if (err)
            console.log(err);
    });
});
router.route('/unapproveUser/:username').get((req, res) => {
    user_1.default.deleteOne({ 'username': req.params.username }, (err) => {
        if (err)
            console.log(err);
    });
});
router.route('/unapprovedUsers').get((req, res) => {
    user_1.default.find({ 'type': 'user', 'approved': false }, (err, users) => {
        if (err)
            console.log(err);
        else
            res.json(users);
    });
});
router.route('/insertGames').post((req, res) => {
    let games = new game_1.default(req.body);
    games.save().then(game => {
        res.status(200).json({ 'game': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'game': 'no' });
        res.json(null);
    });
});
router.route('/getGames').get((req, res) => {
    game_1.default.findOne({}, (err, games) => {
        if (err)
            console.log(err);
        else {
            if (games)
                res.json(games);
            else
                res.json(null);
        }
    });
});
router.route('/updateAnagrams').post((req, res) => {
    let zagonetka = req.body.zagonetka;
    let resenje = req.body.resenje;
    var obj = {
        zagonetka: zagonetka,
        resenje: resenje
    };
    game_1.default.updateOne({}, { $push: { Anagrami: obj } }, (err, res) => {
        if (err)
            console.log(err);
    });
});
router.route('/updateGeography').post((req, res) => {
    let stari = req.body.stari;
    let termin = req.body.novitermin;
    game_1.default.updateOne({ 'Geografija.slovo': stari.slovo,
        'Geografija.odgovori.kategorija': stari.odgovori.kategorija }, { $set: { 'Geografija.$[elem1].odgovori.$[elem2].termin': termin } }, { arrayFilters: [{ 'elem1.slovo': stari.slovo }, { 'elem2.kategorija': stari.odgovori.kategorija }] }, (err, game) => {
        if (err)
            console.log(err);
    });
});
router.route('/getGeographyForLetter/:slovo').get((req, res) => {
    game_1.default.findOne({ 'Geografija.slovo': req.params.slovo }, (err, game) => {
        if (err)
            console.log(err);
        if (!game) {
            res.json(null);
        }
        else {
            res.json(game);
        }
    });
});
router.route('/updateAnswer').post((req, res) => {
    let date = req.body.date;
    let username = req.body.username;
    let approveds = req.body.approveds;
    answers_2.default.findOneAndUpdate({ 'date': date, 'username': username }, { $set: { 'approveds': approveds } }, (err, answer) => {
        if (err)
            console.log(err);
        if (answer) {
            res.json(answer);
        }
        else {
            res.json(null);
        }
    });
});
router.route('/getAnswers').get((req, res) => {
    answers_2.default.find({}, (err, answer) => {
        if (err)
            console.log(err);
        if (!answer) {
            res.json(null);
        }
        else {
            res.json(answer);
        }
    });
});
router.route('/deleteAnswer').post((req, res) => {
    let date = req.body.date;
    let username = req.body.username;
    answers_2.default.deleteOne({ 'date': date, 'username': username }, (err) => {
        if (err)
            console.log(err);
    });
});
router.route('/getAnswer').post((req, res) => {
    let date = req.body.date;
    let username = req.body.username;
    answers_2.default.findOne({ 'date': date, 'username': username }, (err, answer) => {
        if (err)
            console.log(err);
        if (!answer) {
            console.log('no answer found');
        }
        else {
            res.json(answer);
        }
    });
});
router.route('/pushAnswers').post((req, res) => {
    var answer = new answers_1.default(req.body);
    answer.save().then(answer => {
        res.status(200).json({ 'answer': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'answer': 'no' });
        res.json(null);
    });
});
router.route('/insertGeography').post((req, res) => {
    let data = req.body.dat;
    game_1.default.updateOne({}, { $push: { Geografija: data } }, (err, res) => {
        if (err)
            console.log(err);
    });
});
router.route('/getGeography').post((req, res) => {
    let slovo = req.body.slovo;
    let kategorija = req.body.kategorija;
    console.log(slovo, kategorija);
    game_1.default.findOne({ slovo: slovo }, (err, game) => {
        if (err)
            console.log(err);
        if (!game) {
            res.json(null);
        }
        else {
            console.log(game);
            // res.json(game);
        }
    });
});
router.route('/updateGeography').post((req, res) => {
    let slovo = req.body.slovo;
    let kategorija = req.body.kategorija;
    let termin = req.body.termin;
    game_1.default.updateOne({ Geografija: { slovo: slovo, kategorija: kategorija } }, { $set: { termin: termin } }, (err, res) => {
        if (err)
            console.log(err);
    });
});
router.route('/saveGameOfTheDay').post((req, res) => {
    var gameoftheday = new gameoftheday_1.default(req.body);
    gameoftheday.save().
        then(gameoftheday => {
        res.status(200).json({ 'gameoftheday': 'ok' });
    }).catch(err => {
        // res.status(400).json({'gameoftheday':'no'});
        res.json(null);
    });
});
router.route('/checkGameOfTheDay').post((req, res) => {
    let date = req.body.date;
    gameoftheday_2.default.findOne({ 'date': date }, (err, gameoftheday) => {
        if (err)
            console.log(err);
        else if (!gameoftheday) {
            res.json(null);
        }
        else {
            res.json(gameoftheday);
        }
    });
});
router.route('/insertResult').post((req, res) => {
    let result = new results_2.default(req.body);
    result.save().then(result => {
        res.status(200).json({ 'result': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'result': 'no' });
        res.json(null);
    });
});
router.route('/getResult').post((req, res) => {
    let date = req.body.date;
    let username = req.body.username;
    results_1.default.findOne({ 'date': date, 'username': username }, (err, result) => {
        if (err)
            console.log(err);
        if (result) {
            res.json(result);
        }
        else {
            res.json(null);
        }
    });
});
router.route('/getResultsForDate').post((req, res) => {
    let date = req.body.date;
    results_1.default.find({ 'date': date }, (err, result) => {
        if (err)
            console.log(err);
        if (result) {
            res.json(result);
        }
        else {
            res.json(null);
        }
    });
});
router.route('/getResultsForMonth/:month').get((req, res) => {
    let month = req.params.month;
    results_1.default.find({ 'date.month': month }, (err, results) => {
        if (err)
            console.log(err);
        if (results) {
            res.json(results);
        }
        else {
            res.json(null);
        }
    });
});
router.route('/getResultsBettwenTwoDates').post((req, res) => {
    let date1 = req.body.date1;
    let date2 = req.body.date2;
    if (date1.month == date2.month) {
        results_1.default.find({ 'date.day': {
                $lte: date1.day,
                $gte: date2.day
            }, 'date.month': date1.month, 'date.year': date1.year
        }, (err, results) => {
            if (err)
                console.log(err);
            if (results) {
                res.json(results);
            }
            else {
                res.json(null);
            }
        });
    }
    else {
        results_1.default.find({ $or: [
                {
                    'date.day': {
                        $lte: date1.day
                    },
                    'date.month': date1.month,
                    'date.year': date1.year
                }, {
                    'date.day': {
                        $gt: date2.day
                    },
                    'date.month': date2.month,
                    'date.year': date2.year
                }
            ] }, (err, results) => {
            if (err)
                console.log(err);
            if (results) {
                res.json(results);
            }
            else {
                res.json(null);
            }
        });
    }
});
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map