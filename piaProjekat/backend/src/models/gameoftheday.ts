import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Gameoftheday = new Schema({
    date: {
        day: {
            type : Number
        },
        month: {
            type : Number
        },
        year: {
            type : Number
        }
    },
    anagram: {
        zagonetka:{
            type : String
        },
        resenje:{
            type : String
        }
    }
});

export default mongoose.model('Gameoftheday', Gameoftheday);