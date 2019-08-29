import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Answers = new Schema({
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
    username: {
        type: String
    },
    categories: {
        type: [String]
    },
    terms: {
        type: [String]
    },
    approveds: {
        type: [Boolean]
    }
});

export default mongoose.model('Answers', Answers);