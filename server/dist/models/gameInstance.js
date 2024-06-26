"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PlayerStatsSchema = new mongoose_1.Schema({
    cCorrect: { type: Number, default: 0 },
    cWrong: { type: Number, default: 0 },
    cDrinksTaken: { type: Number, default: 0 },
    cDrinksGiven: { type: Number, default: 0 },
    cCorrectStreak: { type: Number, default: 0 },
    cWrongStreak: { type: Number, default: 0 },
    lastQSkipped: { type: Boolean },
    lastQCorrect: { type: Boolean },
    history: { type: mongoose_1.Schema.Types.Mixed }
});
const GameInstanceSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    gameStartDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    playersObject: {
        type: Map,
        of: PlayerStatsSchema,
        required: true,
        default: new Map()
    },
    currentLyric: { type: String },
    currentPromptId: { type: String },
    currentRound: { type: Number },
    seenPromptIds: { type: [String] }
});
const Game = mongoose_1.default.model("game", GameInstanceSchema);
exports.default = Game;
