import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Result = new Schema({
    date: {
        day: {
            type : Number,
        },
        month: {
            type : Number
        },
        year: {
            type : Number
        }
    },
    username : {
        type : String,
        unique : true
    },
    total : {
        type : Number
    }
});

export default mongoose.model('Result', Result);