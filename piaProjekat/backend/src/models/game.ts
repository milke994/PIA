import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Game = new Schema({
    Anagrami : [{
        zagonetka : {
            type:String
        },
        resenje : {
            type:String
        }
    }],
    Geografija : [{
        slovo : {
            type: String
        },
        odgovori: [{
            kategorija : {
                type : String
            },
            termin : {
                type : String
            }
        }]
    }]
});

export default mongoose.model('Game', Game);