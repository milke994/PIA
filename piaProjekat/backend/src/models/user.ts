import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let User = new Schema({
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    mail: {
        type: String
    },
    occupation: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    jmbg: {
        type: String
    },
    secretQuestion: {
        type: String
    },
    secretAnswer: {
        type : String
    },
    picture: {
        type: String
    },
    type: {
        type: String
    },
    approved: {
        type: Boolean
    }
});

export default mongoose.model('User', User);