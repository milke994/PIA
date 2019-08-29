"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Game = new Schema({
    Anagrami: [{
            zagonetka: {
                type: String
            },
            resenje: {
                type: String
            }
        }],
    Geografija: [{
            slovo: {
                type: String
            },
            odgovori: [{
                    kategorija: {
                        type: String
                    },
                    termin: {
                        type: String
                    }
                }]
        }]
});
exports.default = mongoose_1.default.model('Game', Game);
//# sourceMappingURL=game.js.map