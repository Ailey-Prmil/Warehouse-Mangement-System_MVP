"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.verifyToken = exports.invalidateRefreshToken = exports.verifyRefreshToken = exports.storeRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = exports.getUser = exports.saveUser = exports.comparePassword = exports.hashPassword = void 0;
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var fs = require("fs-extra");
var path = require("path");
// JWT configuration (in production, these should be in environment variables)
var JWT_CONFIG = {
    SECRET: process.env.JWT_SECRET || 'your-secret-key-here',
    ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
    REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d'
};
// Absolute file paths for storing user data
var PROJECT_ROOT = process.cwd();
var TEMP_USER_FILE = path.join(PROJECT_ROOT, 'src/auth/data/temp-user.json');
var REFRESH_TOKENS_FILE = path.join(PROJECT_ROOT, 'src/auth/data/refresh-tokens.json');
// Ensure the data directory exists
var ensureDataDirectoryExists = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dataDir;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dataDir = path.dirname(TEMP_USER_FILE);
                return [4 /*yield*/, fs.ensureDir(dataDir)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Hash a password
var hashPassword = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var saltRounds;
    return __generator(this, function (_a) {
        saltRounds = 12;
        return [2 /*return*/, bcrypt.hash(password, saltRounds)];
    });
}); };
exports.hashPassword = hashPassword;
// Compare a password with a hash
var comparePassword = function (password, hash) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, bcrypt.compare(password, hash)];
    });
}); };
exports.comparePassword = comparePassword;
// Save user to temporary JSON file
var saveUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ensureDataDirectoryExists()];
            case 1:
                _a.sent();
                return [4 /*yield*/, fs.writeJSON(TEMP_USER_FILE, user, { spaces: 2 })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.saveUser = saveUser;
// Get user from temporary JSON file
var getUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ensureDataDirectoryExists()];
            case 1:
                _a.sent();
                console.log("Checking for user file at: ".concat(TEMP_USER_FILE));
                return [4 /*yield*/, fs.pathExists(TEMP_USER_FILE)];
            case 2:
                if (!_a.sent()) return [3 /*break*/, 4];
                return [4 /*yield*/, fs.readJSON(TEMP_USER_FILE)];
            case 3:
                userData = _a.sent();
                console.log('User data found:', { username: userData.username });
                return [2 /*return*/, userData];
            case 4:
                console.log('No user file found at path');
                return [2 /*return*/, null];
            case 5:
                error_1 = _a.sent();
                console.error('Error reading user file:', error_1);
                return [2 /*return*/, null];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
// Generate access token
var generateAccessToken = function (username) {
    var payload = {
        username: username,
        tokenType: 'access',
        iat: Math.floor(Date.now() / 1000)
    };
    return jwt.sign(payload, JWT_CONFIG.SECRET, {
        expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRATION
    });
};
exports.generateAccessToken = generateAccessToken;
// Generate refresh token
var generateRefreshToken = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = {
                    username: username,
                    tokenType: 'refresh',
                    iat: Math.floor(Date.now() / 1000)
                };
                refreshToken = jwt.sign(payload, JWT_CONFIG.SECRET, {
                    expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRATION
                });
                // Store refresh token
                return [4 /*yield*/, (0, exports.storeRefreshToken)(username, refreshToken)];
            case 1:
                // Store refresh token
                _a.sent();
                return [2 /*return*/, refreshToken];
        }
    });
}); };
exports.generateRefreshToken = generateRefreshToken;
// Store refresh token
var storeRefreshToken = function (username, token) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshTokens;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ensureDataDirectoryExists()];
            case 1:
                _a.sent();
                refreshTokens = {};
                return [4 /*yield*/, fs.pathExists(REFRESH_TOKENS_FILE)];
            case 2:
                if (!_a.sent()) return [3 /*break*/, 4];
                return [4 /*yield*/, fs.readJSON(REFRESH_TOKENS_FILE)];
            case 3:
                refreshTokens = _a.sent();
                _a.label = 4;
            case 4:
                // Add new token
                if (!refreshTokens[username]) {
                    refreshTokens[username] = [];
                }
                // Limit to 5 refresh tokens per user
                refreshTokens[username].push(token);
                if (refreshTokens[username].length > 5) {
                    refreshTokens[username].shift(); // Remove oldest token
                }
                // Save updated tokens
                return [4 /*yield*/, fs.writeJSON(REFRESH_TOKENS_FILE, refreshTokens, { spaces: 2 })];
            case 5:
                // Save updated tokens
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.storeRefreshToken = storeRefreshToken;
// Verify if refresh token is valid and stored
var verifyRefreshToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded, username, refreshTokens, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                decoded = jwt.verify(token, JWT_CONFIG.SECRET);
                if (decoded.tokenType !== 'refresh') {
                    return [2 /*return*/, null];
                }
                username = decoded.username;
                return [4 /*yield*/, fs.pathExists(REFRESH_TOKENS_FILE)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, fs.readJSON(REFRESH_TOKENS_FILE)];
            case 2:
                refreshTokens = _a.sent();
                if (refreshTokens[username] && refreshTokens[username].includes(token)) {
                    return [2 /*return*/, username];
                }
                _a.label = 3;
            case 3: return [2 /*return*/, null];
            case 4:
                error_2 = _a.sent();
                console.error('Refresh token verification failed:', error_2);
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.verifyRefreshToken = verifyRefreshToken;
// Invalidate a refresh token
var invalidateRefreshToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded, username, refreshTokens, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                decoded = jwt.verify(token, JWT_CONFIG.SECRET);
                if (decoded.tokenType !== 'refresh') {
                    return [2 /*return*/, false];
                }
                username = decoded.username;
                return [4 /*yield*/, fs.pathExists(REFRESH_TOKENS_FILE)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 4];
                return [4 /*yield*/, fs.readJSON(REFRESH_TOKENS_FILE)];
            case 2:
                refreshTokens = _a.sent();
                if (!refreshTokens[username]) return [3 /*break*/, 4];
                // Remove the token
                refreshTokens[username] = refreshTokens[username].filter(function (t) { return t !== token; });
                return [4 /*yield*/, fs.writeJSON(REFRESH_TOKENS_FILE, refreshTokens, { spaces: 2 })];
            case 3:
                _a.sent();
                return [2 /*return*/, true];
            case 4: return [2 /*return*/, false];
            case 5:
                error_3 = _a.sent();
                console.error('Error invalidating refresh token:', error_3);
                return [2 /*return*/, false];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.invalidateRefreshToken = invalidateRefreshToken;
// Verify JWT token (access token)
var verifyToken = function (token) {
    try {
        var decoded = jwt.verify(token, JWT_CONFIG.SECRET);
        // Check if it's an access token
        if (decoded.tokenType !== 'access') {
            return null;
        }
        return decoded;
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};
exports.verifyToken = verifyToken;
// Generate both access and refresh tokens
var generateTokens = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accessToken = (0, exports.generateAccessToken)(username);
                return [4 /*yield*/, (0, exports.generateRefreshToken)(username)];
            case 1:
                refreshToken = _a.sent();
                return [2 /*return*/, {
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }];
        }
    });
}); };
exports.generateTokens = generateTokens;
