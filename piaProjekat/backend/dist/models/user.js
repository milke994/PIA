"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
        type: String
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
exports.default = mongoose_1.default.model('User', User);
//# sourceMappingURL=user.js.map