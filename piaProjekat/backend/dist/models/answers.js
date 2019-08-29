"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Answers = new Schema({
    date: {
        day: {
            type: Number
        },
        month: {
            type: Number
        },
        year: {
            type: Number
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
exports.default = mongoose_1.default.model('Answers', Answers);
//# sourceMappingURL=answers.js.map