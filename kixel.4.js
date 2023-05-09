var VERSION = "1.0.1";

var game;
var state;
var axis;
const PORTRAIT = 0;
const LANDSCAPE = 1;

var device;
const DESKTOP = 0;
const MOBILE = 1;

var controlType;
const MOUSE = 0;
const KEYBOARD = 1;

var wasDown = false;
var justClicked = false;
var draggingSelection = false;
var createSelectionOnUndo = false;
var colorsDown = false;
var currentColorDown = null;
var buttonsDown = false;
var optionsDown = false;
var directionsDown = false;
var currentDirectionDown = null;
var initButtonDown = 0;
var currentButtonDown = null;
var keyboardButtonDown = false;

var currentX;
var currentY;
var lastX = null;
var lastY = null;

var currentTool;
const BRUSH = 0;
const BUCKET = 1;
const SELECTION_BRUSH = 2;
const SHAPES = 3;
const SELECTION_BUCKET = 4;
const SELECTION_MARQUEE = 7;

var currentMode;
const DRAW = 0;
const SELECTION = 1;

var selectMode;
const CUT = 0;
const COPY = 1;

var currentShape;
const LINE = 0;
const OPEN_RECTANGLE = 1;
const CLOSED_RECTANGLE = 2;
const OPEN_ELLIPSE = 3;
const CLOSED_ELLIPSE = 4;

var gridMode;
const EVEN = 0;
const SEGMENTS = 1;
const OFF = 2;

var symmetryMode;
const SYM_NONE = 0;
const SYM_X = 1;
const SYM_Y = 2;
const SYM_BOTH = 3;

var audioMode;
const MUSIC_SFX = 0;
const RADIO_SFX = 1
const SFX_ONLY = 2;
const NO_AUDIO = 3;

var clearStep = 0;
var clearMode;
var clearModes = [
    CLEAR_MARIO = 0,
    CLEAR_DYNAMITE = 1,
    CLEAR_FIST = 2,
];

var currentMouseButton;
const LEFT_MOUSE = 0;
const RIGHT_MOUSE = 1;

var prevMouseX;
var prevMouseY;

var fakePointer = {
    position: {
        x: 0,
        y: 0,
    },
};

var framesSinceArrowPressed = 0;

// gameplay
var currentPaletteIndex = 0;
var currentColorIndex = 15;
var currentX;
var currentY;
var startX;
var startY;
var brushSize = 1;
var drawingSelectionBox = false;
var currentUndoState = 0;
var lastUndoIndex = 0;
var canUndo = false;
var canRedo = false;
var undid = false;
var redid = false;
var openingScreenIsOpen = true;
var tutorialIndex = 0;
var loadedPalette = null;
var numColorsUsed = 6;
var colorsUsed = [];
var kixelPaletteError = false;

relativeTime = Math.floor(new Date().getTime() / 1000); // declared in index.js
var compoElapsed = false;
var compoLateElapsed = false;

var currentState = null;
const OPENING = null;
const PAINTING = 0;
const MAIN_MENU = 1;
const SAVE_MENU = 2;
const LOAD_MENU = 3;
const OFFSET_MENU = 4;
const CLEAR_MENU = 5;
const CLEARING = 6;
const SUBMISSION_MENU = 7;
const MESSAGE = 8;
const LOADING = 9;
const LOADING_ANIM = 10;
const TRUE_COLORS_TITLE = 11;
const TRUE_COLORS_GAMEPLAY = 12;
const TRUE_COLORS_RESULTS = 13;

var chosenButton = null;

var controlsDisabled = true;
var doorOpened = false;
var editorStarted = false;

// mobile
var canvasPointer = null;
var pushButtonPointer = null;

// visuals
var curtainTransparency = 0;
var mainMenuPosition = 0;
var nextToolArrowPosition = 0;
var framesSinceLastRelease = 0;
var lastColorReleased = null;
var lastButtonReleased = null;
var optionTextSize = 20;
var menuShakeOffsetX = 0;
var menuShakeOffsetY = 0;
var menuShakeAngle = 0;
var menuShakeIntensity = 0;
var loadAnimProgress = 0;

const OPTION_DOWN_OFFSET = 5;

// audio
var musicEnabled = false;
var sfxEnabled = false;
var audioStartTime = null;
var lastPause = null;
var pauseTime = 0;
var musicTime = 0;
var lastReportedTime = null;
var patternNumber = 1;
var beatNumber = 1;
var beatAmount = 16;
var songVolume = 1.0;
var numSongPatterns;
var BPM;
var quarterNote;
var lastChord = [null, null, null];

// final product
var title = "Upload Test";
var description = "";

var loggedInName = "";

// ~Multi

window.addEventListener("load", function() {
    window.scrollTo(0, 0);
});

var hexToBase64 = function(str) {
    return btoa(str.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

var base64ToHex = function(str) {
    let raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        let hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result;
}

document.addEventListener("contextmenu", function(e) { // Thanks, Mr Speaker.
    e.preventDefault();
}, false);

function detectMobile() {
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
    }
    else {
        return false;
    }
}

function compareColors(colorObj1, colorObj2) {
    if (colorObj1.r == colorObj2.r && colorObj1.g == colorObj2.g && colorObj1.b == colorObj2.b) {
        // in this version of Phaser, createColor has a default alpha of 1, but getPixel has a default alpha of 255.
        // anything over 1 should be treated as the same to square this circle without messing with Phaser
        if (colorObj1.a > 0 && colorObj2.a > 0)
            return true;
        else if (colorObj1.a == 0 && colorObj2.a == 0)
            return true;
        else            
            return false;
    }
    else
        return false;
}

function getChord() {
    switch (musicName) {
        case 'bakin':
            switch (patternNumber) {
                case 1:
                case 2:
                case 3:
                case 4:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4: return ['F#1', 'A#1', 'C#2'];
                        case 5:
                        case 6: return ['G#1', 'C2', 'D#2'];
                        case 7:
                        case 8: return ['F#1', 'A#1', 'C#2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['F#1', 'A#1', 'C#2'];
                        case 13:
                        case 14: return ['G#1', 'C2', 'D#2'];
                        case 15:
                        case 16: return ['F#1', 'A#1', 'C#2'];
                    }
                case 5:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4: return ['F1', 'G#1', 'B1'];
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['F#1', 'A#1', 'C#2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['D#1', 'F#1', 'A#1'];
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['C#1', 'F1', 'G#1', 'B1'];
                    }
                case 6:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['F#1', 'A#1', 'C#2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['D1', 'F#1', 'A1'];
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['C#1', 'F1', 'G#1', 'B1'];
                    }
                case 7:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['F#1', 'A#1', 'C#2'];
                    }
                case 8:
                case 9:
                case 10:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4: return ['F#1', 'A#1', 'C#2'];
                        case 5:
                        case 6: return ['F#1', 'B1', 'D#2'];
                        case 7:
                        case 8: return ['F#1', 'A#1', 'C#2'];
                        case 9:
                        case 10: 
                        case 11:
                        case 12: return ['F1', 'G#1', 'B1'];
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['D#1', 'F#1', 'B1'];
                    }
                case 11:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4: return ['F#1', 'A#1', 'C#2'];
                        case 5:
                        case 6: return ['F#1', 'B1', 'D#2'];
                        case 7:
                        case 8: return ['F#1', 'A#1', 'C#2'];
                        case 9:
                        case 10: 
                        case 11:
                        case 12: return ['F1', 'G#1', 'B1'];
                        case 13:
                        case 14: return ['D#1', 'F#1', 'B1'];
                        case 15: return ['D1', 'F#1', 'A1'];
                        case 16: return ['E1', 'G#1', 'B1'];
                    }
            }
            break;
        case 'compo':
            switch (patternNumber) {
                case 1:
                case 2:
                case 3:
                case 4:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['C1', 'E1', 'G1', 'A1'];
                    }
                case 5:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['F1', 'A1', 'C2', 'G2'];
                    }
                case 6:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['D1', 'F1', 'A1', 'G2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['D1', 'G1', 'B1', 'F2'];
                    }
                case 7:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['C1', 'E1', 'G1', 'D2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['F1', 'A1', 'C2', 'E2'];
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['F1', 'G#1', 'C2', 'E2'];
                    }
                case 8:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['C1', 'E1', 'G2', 'F2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['D1', 'F1', 'A1', 'E2'];
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['D1', 'F1', 'G#1', 'E2'];
                    }
                case 9:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['A1', 'C2', 'E2', 'G2'];
                        case 9:
                        case 10: 
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['G1', 'B1', 'D2', 'E2'];
                    }
                case 10:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['F1', 'A1', 'C2', 'G2'];
                        case 9:
                        case 10: 
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['G1', 'B1', 'D2', 'F2'];
                    }
                case 11:
                case 12:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['C1', 'E1', 'G2', 'F2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['D1', 'F1', 'A1', 'E2'];
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['D1', 'F1', 'G#1', 'E2'];
                    }
            }
            break;
        case 'haunted':
            switch (patternNumber) {
                case 1:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['D#2', 'F#2', 'A#2'];
                        case 4:
                        case 5:
                        case 6: return ['D2', 'F2', 'G#2', 'B2'];
                        case 7:
                        case 8:
                        case 9: return ['D#2', 'F#2', 'A#2'];
                        case 10:
                        case 11:
                        case 12: return ['D2', 'F2', 'G#2', 'A#2'];
                    }
                case 2:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['A#1', 'D2', 'F#2', 'B2'];
                        case 4:
                        case 5:
                        case 6: return ['D#2', 'F#2', 'A#2'];
                        case 7:
                        case 8:
                        case 9: return ['A#1', 'D2', 'F2', 'G#2'];
                        case 10:
                        case 11:
                        case 12: return ['A#1', 'D#2', 'F#2'];
                    }
                case 3 :
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['D#2', 'F#2', 'A#2'];
                        case 4:
                        case 5:
                        case 6: return ['D2', 'F2', 'G#2', 'B2'];
                        case 7:
                        case 8:
                        case 9: return ['D#2', 'F#2', 'A#2'];
                        case 10:
                        case 11:
                        case 12: return ['D2', 'F2', 'G#2'];
                    }
                case 4:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6: return ['D#2', 'F#2', 'G#2', 'B2'];
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['D2', 'F2', 'G#2', 'A#2'];
                    }
                case 5:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['D#2', 'F#2', 'A#2'];
                        case 4:
                        case 5:
                        case 6: return ['D2', 'F2', 'G#2', 'B2'];
                        case 7:
                        case 8:
                        case 9: return ['D#2', 'F#2', 'A#2'];
                        case 10:
                        case 11:
                        case 12: return ['D2', 'F2', 'G#2', 'A#2'];
                    }
                case 6:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['A#1', 'D2', 'F#2', 'B2'];
                        case 4:
                        case 5:
                        case 6: return ['D#2', 'F#2', 'A#2'];
                        case 7:
                        case 8:
                        case 9: return ['A#1', 'D2', 'F2', 'G#2'];
                        case 10:
                        case 11:
                        case 12: return ['A#1', 'D#2', 'F#2'];
                    }
                case 7:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['D2', 'F2', 'G#2'];
                        case 4:
                        case 5:
                        case 6: return ['D2', 'F2', 'B2'];
                        case 7:
                        case 8:
                        case 9: return ['D#2', 'F#2', 'A#2'];
                        case 10:
                        case 11:
                        case 12: return ['A#1', 'D#2', 'F#2']; 
                    }
                case 8:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['A1', 'D#2', 'F#2'];
                        case 4:
                        case 5:
                        case 6: return ['A#1', 'D#2', 'F#2'];
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['A#1', 'D2', 'F2'];
                    }
                case 9:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['D#2', 'F#2', 'A#2'];
                        case 4:
                        case 5:
                        case 6: return ['D2', 'F2', 'G#2', 'B2'];
                        case 7:
                        case 8:
                        case 9: return ['D#2', 'F#2', 'A#2'];
                        case 10:
                        case 11:
                        case 12: return ['D2', 'F2', 'G#2', 'A#2'];
                    }
                case 10:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['A#1', 'D2', 'F#2', 'B2'];
                        case 4:
                        case 5:
                        case 6: return ['D#2', 'F#2', 'A#2'];
                        case 7:
                        case 8:
                        case 9: return ['A#1', 'D2', 'F2', 'G#2'];
                        case 10:
                        case 11:
                        case 12: return ['A#1', 'D#2', 'F#2'];
                    }
                case 11:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['F#1', 'A#1', 'C#2'];
                        case 4:
                        case 5:
                        case 6: return ['F#1', 'A#1', 'D#2'];
                        case 7:
                        case 8:
                        case 9: return ['F#1', 'G#1', 'C2'];
                        case 10:
                        case 11:
                        case 12: return ['G#1', 'C2', 'D#2', 'A#1' ];
                    }
                case 12:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['F1', 'G#1', 'C#2'];
                        case 4:
                        case 5:
                        case 6: return ['F#1', 'A#1', 'C#2'];
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['F1', 'G#1', 'A#1', 'D2'];
                    }
                case 13:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['F#1', 'A#1', 'C#2'];
                        case 4:
                        case 5:
                        case 6: return ['F#1', 'A#1', 'D#2'];
                        case 7:
                        case 8:
                        case 9: return ['G#1', 'C2', 'D#2'];
                        case 10:
                        case 11:
                        case 12: return ['F1', 'G#1', 'C2'];
                    }
                case 14:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['F#1', 'A1', 'C2'];
                        case 4:
                        case 5:
                        case 6: return ['G#1', 'B1', 'D#2'];
                        case 7:
                        case 8:
                        case 9: return ['A#1', 'D#2', 'F2', 'G#2'];
                        case 10:
                        case 11:
                        case 12: return ['A#1', 'D2', 'F2', 'G#2'];
                    }
                case 15:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['A1', 'C2', 'D#2'];
                        case 4:
                        case 5:
                        case 6: return ['A1', 'C#2', 'E2'];
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['G#1', 'C2', 'D#2'];
                    }
                case 16:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3: return ['A1', 'C2', 'D#2'];
                        case 4:
                        case 5:
                        case 6: return ['A1', 'C#2', 'E2'];
                        case 7:
                        case 8:
                        case 9: return ['G#1', 'C2', 'D#2'];
                        case 10:
                        case 11:
                        case 12: return ['A#1', 'D2', 'F2'];
                    }
            }
            break;
        case 'boss':
            switch (patternNumber) {
                case 1:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['F#1', 'A#1', 'C#2', 'F2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['F#1', 'A#1', 'D#2', 'G#2'];
                    }
                case 2:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['C#1', 'F#1', 'A#1', 'D#2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['C#1', 'F1', 'G#1', 'D#2'];
                    }
                case 3:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['F#1', 'A#1', 'C#2', 'F2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['A#1', 'D#2', 'G#2'];
                    }
                case 4:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['C#1', 'F#1', 'A#1', 'D#2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['C#1', 'F1', 'G#1', 'D#2'];
                    }
                case 5:
                case 6:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4: return ['B1', 'D#2', 'F#2'];
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['B1', 'D#2', 'G#2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['A#1', 'C#2', 'F#2'];
                    }
                case 7:
                case 8:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4: 
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['B1', 'D#2', 'F#2', 'G#2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['C#2', 'F2', 'G#2', 'B2'];
                    }
                case 9:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4: return ['D2', 'F2', 'A#2'];
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['D2', 'F#2', 'A2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['C#2', 'F2', 'G#2'];
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['D#2', 'F#2', 'B2'];
                    }
                case 10:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4: return ['D2', 'F2', 'A#2'];
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['D2', 'F#2', 'A#2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['G2', 'D#2', 'A#2'];
                        case 13:
                        case 14: return ['C#2', 'F#2', 'G#2'];
                        case 15:
                        case 16: return ['C#2', 'F2', 'G#2'];
                    }
                case 11:
                case 12:
                case 13:
                case 14:
                    switch (beatNumber) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8: return ['A#1', 'C#2', 'F#2'];
                        case 9:
                        case 10:
                        case 11:
                        case 12: return ['A#1', 'C#2', 'F2'];
                        case 13:
                        case 14:
                        case 15:
                        case 16: return ['C2', 'D#2', 'F#2', 'G#2'];
                    }
            }
            break;
    }
}

function getNote() {
    return getChord()[Math.floor(Math.random() * getChord().length)];
}

function detectCapitalLetters(event) {
    if (event.getModifierState("CapsLock") &&
        ((event.keyCode >= 48 && event.keyCode < 57) || (event.keyCode >= 65 && event.keyCode < 90)) &&
        get("kixel-program-title-field").value.length < 30) {
        if (sfxEnabled)
            game.sfx2.play('enterCapitalLetter');

        menuShakeIntensity = 20;
    }
}

function setupKixelCreator() {
    if (window.innerWidth > window.innerHeight) {
        axis = LANDSCAPE;
    }
    else {
        axis = PORTRAIT;
    }
    
    if (detectMobile()) {
        device = MOBILE;
    }
    else {
        device = DESKTOP;
    }

    if (typeof compoNumber !== 'undefined') {
        //createCountdownTimers(Math.round(new Date().getTime() / 1000), "'" + compoNumber + "'", true);
;    }

    game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'container', {preload: KixelEditor.preload, create: KixelEditor.create, update: KixelEditor.update}, false, true);
    game.config = {
        enableDebug: false,
    }
    game.state.add('Editor', KixelEditor);
    game.state.start('Editor');
}   

var palettes = {
    titles: ["NEUTRAL PALETTE", "ARNE 16", "ARQ16", "COMMODORE 64", "WINDOWS 3.X", "CD-BAC", "COPPER TECH", "PERFECT MONO"],
    creators: ["multi", "arne", "endesga", "commodore", "microsoft", "dimwiddy", "arne", "multi"],
    colors: [
        // NEUTRAL PALETTE
        ["#ffffff", "#ff0000", "#880000", "#ff8800", "#884400", "#ffff00", "#888800", "#00ff00",
        	"#008800", "#00ffff", "#008888", "#0000ff", "#000088", "#aaaaaa", "#555555", "#000000"],
        // ARNE 16
        ["#ffffff", "#be2633", "#e06f8b", "#493c2b", "#a46422", "#eb8931", "#f7e26b", "#1b2632",
			"#2f484e", "#44891a", "#a3ce27", "#005784", "#31a2f2", "#b2dcef", "#9d9d9d", "#000000"],
        // ARQ16
        ["#ffffff", "#ffd19d", "#aeb5bd", "#4d80c9", "#e93841", "#054494", "#f1892d", "#823e2c",
			"#ffa9a9", "#5ae150", "#ffe947", "#7d3ebf", "#eb6c82", "#1e8a4c", "#511e43", "#100820"],
        // COMMODORE 64
        ["#ffffff", "#626262", "#898989", "#adadad", "#9f4e44", "#cb7e75", "#6d5412", "#a1683c",
        	"#c9d487", "#9ae29b", "#5cab5e", "#6abfc6", "#887ecb", "#50459b", "#a057a3", "#000000"],
        // WINDOWS 3.X
        ["#ffffff", "#7e7e7e", "#bebebe", "#7e0000", "#fe0000", "#047e00", "#06ff04", "#ffff04",
			"#7e7e00", "#00007e", "#0000ff", "#7e007e", "#fe00ff", "#047e7e", "#06ffff", "#000000"],
        // CD-BAC
        ["#fdf5f9", "#da835c", "#7f3710", "#c4c466", "#f4fb4a", "#c7f0dc", "#77e28e", "#31983f",
			"#37368d", "#8e64e3", "#d697ff", "#f5cee6", "#ce3f50", "#5d0929", "#301421", "#000000"],
        // COPPER TECH
        ["#ffffff", "#262144", "#355278", "#60748a", "#898989", "#5aa8b2", "#91d9f3", "#f4cd72",
			"#bfb588", "#c58843", "#9e5b47", "#5f4351", "#dc392d", "#6ea92c", "#1651dd", "#000000"],
		// PERFECT MONO
        ["#ffffff", "#eeeeee", "#dddddd", "#cccccc", "#bbbbbb", "#aaaaaa", "#999999", "#888888",
        	"#777777", "#666666", "#555555", "#444444", "#333333", "#222222", "#111111", "#000000"],
    ]
};

var KixelEditor = function(game) {

}

KixelEditor.prototype = {
    preload: function() {
        this.style = { font: "bold 32px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        game.load.image('phaserLogo', 'kixelassets/phaserlogo.png');

        var avatar;
        if (typeof playerAvatarString !== 'undefined')
            avatar = playerAvatarString;
        else
            avatar = "kixels/74.png";

        game.load.image('playerAvatar', avatar);
        if (typeof username !== 'undefined') {
            trueColorsRecords.forEach(function(record, index) {
                if (index > 0)
                    game.load.image('communityAvatar' + index, 'kixels/' + record.kixel + '.png');
            }, this);
        }

        game.load.spritesheet('icons', 'kixelassets/icons.png', 80, 80);
        game.load.image('selectionTilesprite', 'kixelassets/maskpattern.png');

        game.load.bitmapFont('04b30', 'kixelassets/04b_30.png', 'kixelassets/04b_30.fnt');
        game.load.bitmapFont('04b30-white', 'kixelassets/04b_30-white.png', 'kixelassets/04b_30.fnt');
        game.load.bitmapFont('euxoi', 'kixelassets/euxoi.png', 'kixelassets/euxoi.fnt');
        game.load.bitmapFont('euxoi_stroke', 'kixelassets/euxoi_stroke.png', 'kixelassets/euxoi_stroke.fnt');

        game.load.audio(musicName, 'kixelassets/' + musicName + '.ogg', 'kixelassets/' + musicName + '.mp3');
        if (typeof username !== 'undefined')
            game.load.audio('trueColorsBgm', 'kixelassets/truecolorsbgm.ogg', 'kixelassets/truecolorsbgm.mp3');
        game.load.audio('sfx', 'kixelassets/sfx.ogg', 'kixelassets/sfx.mp3');

        game.load.image('trueColorsLogo', 'kixelassets/truecolorslogo.png');
        game.load.image('trueColorsOptionBacking', 'kixelassets/truecolorsoptionbacking.png');
        game.load.spritesheet('trueColorsExample', 'kixelassets/truecolorsexample.png', 160, 160);

        if (typeof username !== 'undefined')
            game.load.image('randomKixel', 'kixels/' + randomKixelId + '.png');

        if (typeof compoNumber !== 'undefined')
            game.load.image('compoIcon', './mainassets/' + get("kixel-compo-multiplayer-mode").innerHTML + '-icon.png');

        game.load.spritesheet('mario', 'kixelassets/mario.png', 160, 280, -1, 0, 20);
        game.load.image('explosion', 'kixelassets/explosion.png');
        game.load.spritesheet('dynamite', 'kixelassets/dynamite.png', 284, 307);
        game.load.image('fist', 'kixelassets/fist.png');
    },
    create: function() {
        state = this;

        this.downloadLink = document.createElement('a');
        this.downloadLink.setAttribute('download', 'kixel.png');

        this.loadedImageCanvas = document.createElement('canvas');
        this.loadedImageCanvas.width = 160;
        this.loadedImageCanvas.height = 160;
        this.loadedImageContext;
        this.loadedImage = new Image();
        this.loadedImage.onload = function() {
            state.loadedImageContext = state.loadedImageCanvas.getContext("2d");
            state.loadedImageContext.drawImage(state.loadedImage, 0, 0);
            
            let big = false;

            if (this.width == 160 && this.height == 160) {
                big = true;
            }
            else if (this.width == 32 && this.height == 32) {
                big = false;
            }
            else {
                state.giveMessage("This isn't a genuine kixel.");
                return;
            }
            
            if (state.validateImportedKixel(big)) {
                for (var x = 0; x < 32; x++) {
                    for (var y = 0; y < 32; y++) {
                        let imageData = state.loadedImageContext.getImageData(x * (big ? 5 : 1), y * (big ? 5 : 1), 1, 1);
                        let color = Phaser.Color.RGBtoString(imageData.data[0], imageData.data[1], imageData.data[2], "#");

                        state.maskProduct.rect(x, y, 1, 1, color);
                    }
                }

                if (sfxEnabled) {
                    game.sfx1.play('loadAnimation', 0, 1.0, true);
                    game.sfx2.play('confirmLoad');
                }

                currentState = LOADING_ANIM;
                loadAnimProgress = 0;
                state.eventTimer = 0;
            }
            else {
                if (kixelPaletteError) {
                    state.giveMessage("This image doesn't match the current palette restriction.");
                    kixelPaletteError = false;
                }
                else {
                    state.giveMessage("This isn't a genuine kixel.");
                }
            }
            
        }

        this.fileInput = document.createElement('input');
        this.fileInput.setAttribute('type', 'file');
        this.fileInput.setAttribute('accept', 'image/png');
        this.fileInput.addEventListener('change', function(e) {
            let file = e.target.files[0];

            musicEnabled = false;
            game.music.pause();

            if (file.type === "image/png") {
                currentState = LOADING;
                state.mainMenuButtons.setAll('exists', false);
                state.drawerOpen = false;
                state.drawerPosition = 0;
                state.trueColorsSelector.exists = false;
                state.trueColorsSelector.label.exists = false;
                state.trueColorsStatus.exists = false;

                state.fileReader.readAsDataURL(file);
            }
            else
                state.giveMessage("This isn't the right filetype... What did you give me?!");

            this.value = null;
        });

        this.fileReader = new FileReader();
        this.fileReader.onload = function(e) {
            state.loadedImage.src = e.target.result;
        };

        // SETUP
        if (typeof errorMessage !== 'undefined') {
            //openingScreenIsOpen = true;
            //controlsDisabled = true;
            console.log(errorMessage);
        }

        if (typeof maxKixelNotice !== 'undefined' && typeof compoNumber == 'undefined') {
            //openingScreenIsOpen = true;
            //controlsDisabled = true;
            console.log(maxKixelNotice);
        }
        // SOUND
        switch (musicName) {
            case 'bakin': BPM = 110; numSongPatterns = 11; songVolume = 0.4; break;
            case 'compo': BPM = 120; numSongPatterns = 12; songVolume = 0.5; break;
            case 'haunted': BPM = 120; numSongPatterns = 16; beatAmount = 12; songVolume = 0.7; break;
            case 'boss': BPM = 135; numSongPatterns = 14; songVolume = 0.8; break;
        }

        quarterNote = 60000 / BPM;

        this.mainMusic = game.add.audio(musicName);
        if (typeof username !== 'undefined') {
            this.trueColorsMusic = game.add.audio('trueColorsBgm');
            this.trueColorsMusic.addMarker('trueColors', 0, 131, 0.9, false);
            this.trueColorsMusic.addMarker('title', 131.46, 37.2, 0.9, true);
            this.trueColorsMusic.addMarker('results', 168.666, 48, 0.9, true);
            this.trueColorsMusic.addMarker('perfect', 216.666, 3.5, 1.0, false);
        }

        game.music = this.mainMusic;
        game.music.onLoop.add(function() {
            musicTime = 0;
        }, this);

        game.sfx1 = game.add.audio('sfx');
        game.sfx1.addMarker('click-C1', 0.0, 1.0);
        game.sfx1.addMarker('click-C#1', 1.0, 1.0);
        game.sfx1.addMarker('click-D1', 2.0, 1.0);
        game.sfx1.addMarker('click-D#1', 3.0, 1.0);
        game.sfx1.addMarker('click-E1', 4.0, 1.0);
        game.sfx1.addMarker('click-F1', 5.0, 1.0);
        game.sfx1.addMarker('click-F#1', 6.0, 1.0);
        game.sfx1.addMarker('click-G1', 7.0, 1.0);
        game.sfx1.addMarker('click-G#1', 8.0, 1.0);
        game.sfx1.addMarker('click-A1', 9.0, 1.0);
        game.sfx1.addMarker('click-A#1', 10.0, 1.0);
        game.sfx1.addMarker('click-B1', 11.0, 1.0);
        game.sfx1.addMarker('click-C2', 12.0, 1.0);
        game.sfx1.addMarker('click-C#2', 13.0, 1.0);
        game.sfx1.addMarker('click-D2', 14.0, 1.0);
        game.sfx1.addMarker('click-D#2', 15.0, 1.0);
        game.sfx1.addMarker('click-E2', 16.0, 1.0);
        game.sfx1.addMarker('click-F2', 17.0, 1.0);
        game.sfx1.addMarker('click-F#2', 18.0, 1.0);
        game.sfx1.addMarker('click-G2', 19.0, 1.0);
        game.sfx1.addMarker('click-G#2', 20.0, 1.0);
        game.sfx1.addMarker('click-A2', 21.0, 1.0);
        game.sfx1.addMarker('click-A#2', 22.0, 1.0);
        game.sfx1.addMarker('click-B2', 23.0, 1.0);
        game.sfx1.addMarker('start', 75.0, 1.0);
        game.sfx1.addMarker('changeTool', 77.0, 1.0);
        game.sfx1.addMarker('paint-left-C1', 24.0, 1.0);
        game.sfx1.addMarker('paint-left-C#1', 25.0, 1.0);
        game.sfx1.addMarker('paint-left-D1', 26.0, 1.0);
        game.sfx1.addMarker('paint-left-D#1', 27.0, 1.0);
        game.sfx1.addMarker('paint-left-E1', 28.0, 1.0);
        game.sfx1.addMarker('paint-left-F1', 29.0, 1.0);
        game.sfx1.addMarker('paint-left-F#1', 30.0, 1.0);
        game.sfx1.addMarker('paint-left-G1', 31.0, 1.0);
        game.sfx1.addMarker('paint-left-G#1', 32.0, 1.0);
        game.sfx1.addMarker('paint-left-A1', 33.0, 1.0);
        game.sfx1.addMarker('paint-left-A#1', 34.0, 1.0);
        game.sfx1.addMarker('paint-left-B1', 35.0, 1.0);
        game.sfx1.addMarker('paint-left-C2', 36.0, 1.0);
        game.sfx1.addMarker('paint-left-C#2', 37.0, 1.0);
        game.sfx1.addMarker('paint-left-D2', 38.0, 1.0);
        game.sfx1.addMarker('paint-left-D#2', 39.0, 1.0);
        game.sfx1.addMarker('paint-left-E2', 40.0, 1.0);
        game.sfx1.addMarker('paint-left-F2', 41.0, 1.0);
        game.sfx1.addMarker('paint-left-F#2', 42.0, 1.0);
        game.sfx1.addMarker('paint-left-G2', 43.0, 1.0);
        game.sfx1.addMarker('paint-left-G#2', 44.0, 1.0);
        game.sfx1.addMarker('paint-left-A2', 45.0, 1.0);
        game.sfx1.addMarker('paint-left-A#2', 46.0, 1.0);
        game.sfx1.addMarker('paint-left-B2', 47.0, 1.0);
        game.sfx1.addMarker('changeColor', 106.0, 1.0);
        game.sfx1.addMarker('choir-C1', 125.0, 1.0);
        game.sfx1.addMarker('choir-C#1', 126.0, 1.0);
        game.sfx1.addMarker('choir-D1', 127.0, 1.0);
        game.sfx1.addMarker('choir-D#1', 128.0, 1.0);
        game.sfx1.addMarker('choir-E1', 129.0, 1.0);
        game.sfx1.addMarker('choir-F1', 130.0, 1.0);
        game.sfx1.addMarker('choir-F#1', 131.0, 1.0);
        game.sfx1.addMarker('choir-G1', 132.0, 1.0);
        game.sfx1.addMarker('choir-G#1', 133.0, 1.0);
        game.sfx1.addMarker('choir-A1', 134.0, 1.0);
        game.sfx1.addMarker('choir-A#1', 135.0, 1.0);
        game.sfx1.addMarker('choir-B1', 136.0, 1.0);
        game.sfx1.addMarker('choir-C2', 137.0, 1.0);
        game.sfx1.addMarker('choir-C#2', 138.0, 1.0);
        game.sfx1.addMarker('choir-D2', 139.0, 1.0);
        game.sfx1.addMarker('choir-D#2', 140.0, 1.0);
        game.sfx1.addMarker('choir-E2', 141.0, 1.0);
        game.sfx1.addMarker('choir-F2', 142.0, 1.0);
        game.sfx1.addMarker('choir-F#2', 143.0, 1.0);
        game.sfx1.addMarker('choir-G2', 144.0, 1.0);
        game.sfx1.addMarker('choir-G#2', 145.0, 1.0);
        game.sfx1.addMarker('choir-A2', 146.0, 1.0);
        game.sfx1.addMarker('choir-A#2', 147.0, 1.0);
        game.sfx1.addMarker('choir-B2', 148.0, 1.0);
        game.sfx1.addMarker('optionDown', 181.0, 1.0);
        game.sfx1.addMarker('marioHammer', 184.0, 1.0);
        game.sfx1.addMarker('dynamite3', 187.0, 1.0);
        game.sfx1.addMarker('dynamite2', 188.0, 1.0);
        game.sfx1.addMarker('dynamite1', 189.0, 1.0);
        game.sfx1.addMarker('explosion', 190.0, 1.0);
        game.sfx1.addMarker('fistHit', 191.0, 1.0);
        game.sfx1.addMarker('loadAnimation', 201.0, 1.0);
        game.sfx1.addMarker('drawerOpening', 202.0, 1.0);
        game.sfx1.addMarker('trueColorsTimer', 212.0, 1.0);
        game.sfx1.addMarker('trueColorsRoundFinish', 213.0, 1.0);
        game.sfx1.addMarker('trueColorsResult', 214.0, 1.0);
        game.sfx1.addMarker('trueColorsKixelAppear', 215.0, 1.0);
        game.sfx1.addMarker('trueColorsMenuMove', 217.0, 1.0);
        game.sfx1.addMarker('nextTrueColorsResult', 218.0, 1.0);
        game.sfx1.addMarker('trueColorsCorrect', 219.0, 1.0);
        game.sfx1.addMarker('trueColorsIncorrect', 220.0, 1.0);

        game.sfx2 = game.add.audio('sfx');
        game.sfx2.addMarker('paint-left-C1', 24.0, 1.0);
        game.sfx2.addMarker('paint-left-C#1', 25.0, 1.0);
        game.sfx2.addMarker('paint-left-D1', 26.0, 1.0);
        game.sfx2.addMarker('paint-left-D#1', 27.0, 1.0);
        game.sfx2.addMarker('paint-left-E1', 28.0, 1.0);
        game.sfx2.addMarker('paint-left-F1', 29.0, 1.0);
        game.sfx2.addMarker('paint-left-F#1', 30.0, 1.0);
        game.sfx2.addMarker('paint-left-G1', 31.0, 1.0);
        game.sfx2.addMarker('paint-left-G#1', 32.0, 1.0);
        game.sfx2.addMarker('paint-left-A1', 33.0, 1.0);
        game.sfx2.addMarker('paint-left-A#1', 34.0, 1.0);
        game.sfx2.addMarker('paint-left-B1', 35.0, 1.0);
        game.sfx2.addMarker('paint-left-C2', 36.0, 1.0);
        game.sfx2.addMarker('paint-left-C#2', 37.0, 1.0);
        game.sfx2.addMarker('paint-left-D2', 38.0, 1.0);
        game.sfx2.addMarker('paint-left-D#2', 39.0, 1.0);
        game.sfx2.addMarker('paint-left-E2', 40.0, 1.0);
        game.sfx2.addMarker('paint-left-F2', 41.0, 1.0);
        game.sfx2.addMarker('paint-left-F#2', 42.0, 1.0);
        game.sfx2.addMarker('paint-left-G2', 43.0, 1.0);
        game.sfx2.addMarker('paint-left-G#2', 44.0, 1.0);
        game.sfx2.addMarker('paint-left-A2', 45.0, 1.0);
        game.sfx2.addMarker('paint-left-A#2', 46.0, 1.0);
        game.sfx2.addMarker('paint-left-B2', 47.0, 1.0);
        game.sfx2.addMarker('paint-right-C1', 48.0, 1.0);
        game.sfx2.addMarker('paint-right-C#1', 49.0, 1.0);
        game.sfx2.addMarker('paint-right-D1', 50.0, 1.0);
        game.sfx2.addMarker('paint-right-D#1', 51.0, 1.0);
        game.sfx2.addMarker('paint-right-E1', 52.0, 1.0);
        game.sfx2.addMarker('paint-right-F1', 53.0, 1.0);
        game.sfx2.addMarker('paint-right-F#1', 54.0, 1.0);
        game.sfx2.addMarker('paint-right-G1', 55.0, 1.0);
        game.sfx2.addMarker('paint-right-G#1', 56.0, 1.0);
        game.sfx2.addMarker('paint-right-A1', 57.0, 1.0);
        game.sfx2.addMarker('paint-right-A#1', 58.0, 1.0);
        game.sfx2.addMarker('paint-right-B1', 59.0, 1.0);
        game.sfx2.addMarker('paint-right-C2', 60.0, 1.0);
        game.sfx2.addMarker('paint-right-C#2', 61.0, 1.0);
        game.sfx2.addMarker('paint-right-D2', 62.0, 1.0);
        game.sfx2.addMarker('paint-right-D#2', 63.0, 1.0);
        game.sfx2.addMarker('paint-right-E2', 64.0, 1.0);
        game.sfx2.addMarker('paint-right-F2', 65.0, 1.0);
        game.sfx2.addMarker('paint-right-F#2', 66.0, 1.0);
        game.sfx2.addMarker('paint-right-G2', 67.0, 1.0);
        game.sfx2.addMarker('paint-right-G#2', 68.0, 1.0);
        game.sfx2.addMarker('paint-right-A2', 69.0, 1.0);
        game.sfx2.addMarker('paint-right-A#2', 70.0, 1.0);
        game.sfx2.addMarker('paint-right-B2', 71.0, 1.0);
        game.sfx2.addMarker('undo', 73.0, 1.0);
        game.sfx2.addMarker('redo', 74.0, 1.0);
        game.sfx2.addMarker('openTools', 76.0, 1.0);
        game.sfx2.addMarker('drawTool', 78.0, 1.0);
        game.sfx2.addMarker('shapeTool', 79.0, 1.0);
        game.sfx2.addMarker('bucketTool', 80.0, 1.0);
        game.sfx2.addMarker('changeBrushSize1', 81.0, 1.0);
        game.sfx2.addMarker('changeBrushSize2', 82.0, 1.0);
        game.sfx2.addMarker('changeBrushSize3', 83.0, 1.0);
        game.sfx2.addMarker('changeGrid1', 84.0, 1.0);
        game.sfx2.addMarker('changeGrid2', 85.0, 1.0);
        game.sfx2.addMarker('changeGrid3', 86.0, 1.0);
        game.sfx2.addMarker('openBox', 87.0, 1.0);
        game.sfx2.addMarker('solidBox', 88.0, 1.0);
        game.sfx2.addMarker('openEllipse', 89.0, 1.0);
        game.sfx2.addMarker('solidEllipse', 90.0, 1.0);
        game.sfx2.addMarker('line', 91.0, 1.0);
        game.sfx2.addMarker('palette1', 92.0, 1.0);
        game.sfx2.addMarker('palette2', 93.0, 1.0);
        game.sfx2.addMarker('palette3', 94.0, 1.0);
        game.sfx2.addMarker('palette4', 95.0, 1.0);
        game.sfx2.addMarker('palette5', 96.0, 1.0);
        game.sfx2.addMarker('palette6', 97.0, 1.0);
        game.sfx2.addMarker('palette7', 98.0, 1.0);
        game.sfx2.addMarker('palette8', 99.0, 1.0);
        game.sfx2.addMarker('useBucketLeft', 100.0, 1.0);
        game.sfx2.addMarker('useBucketRight', 101.0, 1.0);
        game.sfx2.addMarker('startShapeLeft', 102.0, 1.0);
        game.sfx2.addMarker('finishShape', 103.0, 1.0);
        game.sfx2.addMarker('startShapeRight', 104.0, 1.0);
        game.sfx2.addMarker('finish', 105.0, 1.0);
        game.sfx2.addMarker('jawharp', 107.0, 1.0);
        game.sfx2.addMarker('suckColor', 108.0, 1.0);
        game.sfx2.addMarker('offsetDirections', 109.0, 1.0);
        game.sfx2.addMarker('cutMode', 110.0, 1.0);
        game.sfx2.addMarker('copyMode', 111.0, 1.0);
        game.sfx2.addMarker('handSelectTool', 112.0, 1.0);
        game.sfx2.addMarker('boxSelectTool', 113.0, 1.0);
        game.sfx2.addMarker('fillSelectTool', 114.0, 1.0);
        game.sfx2.addMarker('placeSelection', 115.0, 1.0);
        game.sfx2.addMarker('enterCapitalLetter', 116.0, 1.0);
        game.sfx2.addMarker('palette-c-1', 117.0, 1.0);
        game.sfx2.addMarker('palette-c-2', 118.0, 1.0);
        game.sfx2.addMarker('palette-c-3', 119.0, 1.0);
        game.sfx2.addMarker('palette-c-4', 120.0, 1.0);
        game.sfx2.addMarker('palette-c-5', 121.0, 1.0);
        game.sfx2.addMarker('palette-c-6', 122.0, 1.0);
        game.sfx2.addMarker('palette-c-7', 123.0, 1.0);
        game.sfx2.addMarker('palette-c-8', 124.0, 1.0);
        game.sfx2.addMarker('choir-C1', 125.0, 1.0);
        game.sfx2.addMarker('choir-C#1', 126.0, 1.0);
        game.sfx2.addMarker('choir-D1', 127.0, 1.0);
        game.sfx2.addMarker('choir-D#1', 128.0, 1.0);
        game.sfx2.addMarker('choir-E1', 129.0, 1.0);
        game.sfx2.addMarker('choir-F1', 130.0, 1.0);
        game.sfx2.addMarker('choir-F#1', 131.0, 1.0);
        game.sfx2.addMarker('choir-G1', 132.0, 1.0);
        game.sfx2.addMarker('choir-G#1', 133.0, 1.0);
        game.sfx2.addMarker('choir-A1', 134.0, 1.0);
        game.sfx2.addMarker('choir-A#1', 135.0, 1.0);
        game.sfx2.addMarker('choir-B1', 136.0, 1.0);
        game.sfx2.addMarker('choir-C2', 137.0, 1.0);
        game.sfx2.addMarker('choir-C#2', 138.0, 1.0);
        game.sfx2.addMarker('choir-D2', 139.0, 1.0);
        game.sfx2.addMarker('choir-D#2', 140.0, 1.0);
        game.sfx2.addMarker('choir-E2', 141.0, 1.0);
        game.sfx2.addMarker('choir-F2', 142.0, 1.0);
        game.sfx2.addMarker('choir-F#2', 143.0, 1.0);
        game.sfx2.addMarker('choir-G2', 144.0, 1.0);
        game.sfx2.addMarker('choir-G#2', 145.0, 1.0);
        game.sfx2.addMarker('choir-A2', 146.0, 1.0);
        game.sfx2.addMarker('choir-A#2', 147.0, 1.0);
        game.sfx2.addMarker('choir-B2', 148.0, 1.0);
        game.sfx2.addMarker('unselectAll', 149.0, 1.0);
        game.sfx2.addMarker('cancelDrag', 150.0, 1.0);
        game.sfx2.addMarker('negativeSelectBox', 151.0, 1.0);
        game.sfx2.addMarker('finishNegativeSelect', 152.0, 1.0);
        game.sfx2.addMarker('hand-deselect-C1', 153.0, 1.0);
        game.sfx2.addMarker('hand-deselect-C#1', 154.0, 1.0);
        game.sfx2.addMarker('hand-deselect-D1', 155.0, 1.0);
        game.sfx2.addMarker('hand-deselect-D#1', 156.0, 1.0);
        game.sfx2.addMarker('hand-deselect-E1', 157.0, 1.0);
        game.sfx2.addMarker('hand-deselect-F1', 158.0, 1.0);
        game.sfx2.addMarker('hand-deselect-F#1', 159.0, 1.0);
        game.sfx2.addMarker('hand-deselect-G1', 160.0, 1.0);
        game.sfx2.addMarker('hand-deselect-G#1', 161.0, 1.0);
        game.sfx2.addMarker('hand-deselect-A1', 162.0, 1.0);
        game.sfx2.addMarker('hand-deselect-A#1', 163.0, 1.0);
        game.sfx2.addMarker('hand-deselect-B1', 164.0, 1.0);
        game.sfx2.addMarker('hand-deselect-C2', 165.0, 1.0);
        game.sfx2.addMarker('hand-deselect-C#2', 166.0, 1.0);
        game.sfx2.addMarker('hand-deselect-D2', 167.0, 1.0);
        game.sfx2.addMarker('hand-deselect-D#2', 168.0, 1.0);
        game.sfx2.addMarker('hand-deselect-E2', 169.0, 1.0);
        game.sfx2.addMarker('hand-deselect-F2', 170.0, 1.0);
        game.sfx2.addMarker('hand-deselect-F#2', 171.0, 1.0);
        game.sfx2.addMarker('hand-deselect-G2', 172.0, 1.0);
        game.sfx2.addMarker('hand-deselect-G#2', 173.0, 1.0);
        game.sfx2.addMarker('hand-deselect-A2', 174.0, 1.0);
        game.sfx2.addMarker('hand-deselect-A#2', 175.0, 1.0);
        game.sfx2.addMarker('hand-deselect-B2', 176.0, 1.0);
        game.sfx2.addMarker('symmetryNone', 177.0, 1.0);
        game.sfx2.addMarker('symmetryX', 178.0, 1.0);
        game.sfx2.addMarker('symmetryY', 179.0, 1.0);
        game.sfx2.addMarker('symmetryBoth', 180.0, 1.0);
        game.sfx2.addMarker('startClear', 182.0, 1.0);
        game.sfx2.addMarker('openOffsetMenu', 183.0, 1.0);
        game.sfx2.addMarker('marioHit', 185.0, 1.0);
        game.sfx2.addMarker('finishClear', 186.0, 1.0);
        game.sfx2.addMarker('closeOffsetMenu', 192.0, 1.0);
        game.sfx2.addMarker('confirmOffset', 193.0, 1.0);
        game.sfx2.addMarker('menuBack', 194.0, 1.0);
        game.sfx2.addMarker('openSaveMenu', 195.0, 1.0);
        game.sfx2.addMarker('saveKixel', 196.0, 1.0);
        game.sfx2.addMarker('openLoadMenu', 198.0, 1.0);
        game.sfx2.addMarker('confirmLoad', 197.0, 1.0);
        game.sfx2.addMarker('messageWindowClick1', 199.0, 1.0);
        game.sfx2.addMarker('messageWindowClick2', 200.0, 1.0);
        game.sfx2.addMarker('startTrueColors', 203.0, 1.0);
        game.sfx2.addMarker('trueColorsPaletteSelection0', 204.0, 1.0);
        game.sfx2.addMarker('trueColorsPaletteSelection1', 205.0, 1.0);
        game.sfx2.addMarker('trueColorsPaletteSelection2', 206.0, 1.0);
        game.sfx2.addMarker('trueColorsPaletteSelection3', 207.0, 1.0);
        game.sfx2.addMarker('trueColorsPaletteSelection4', 208.0, 1.0);
        game.sfx2.addMarker('trueColorsPaletteSelection5', 209.0, 1.0);
        game.sfx2.addMarker('trueColorsPaletteSelection6', 210.0, 1.0);
        game.sfx2.addMarker('trueColorsPaletteSelection7', 211.0, 1.0);
        game.sfx2.addMarker('closeTrueColors', 216.0, 1.0);

        game.sfx3 = game.add.audio('sfx');
        game.sfx3.addMarker('door', 72.0, 1.0);
        game.sfx3.addMarker('choir-C1', 125.0, 1.0);
        game.sfx3.addMarker('choir-C#1', 126.0, 1.0);
        game.sfx3.addMarker('choir-D1', 127.0, 1.0);
        game.sfx3.addMarker('choir-D#1', 128.0, 1.0);
        game.sfx3.addMarker('choir-E1', 129.0, 1.0);
        game.sfx3.addMarker('choir-F1', 130.0, 1.0);
        game.sfx3.addMarker('choir-F#1', 131.0, 1.0);
        game.sfx3.addMarker('choir-G1', 132.0, 1.0);
        game.sfx3.addMarker('choir-G#1', 133.0, 1.0);
        game.sfx3.addMarker('choir-A1', 134.0, 1.0);
        game.sfx3.addMarker('choir-A#1', 135.0, 1.0);
        game.sfx3.addMarker('choir-B1', 136.0, 1.0);
        game.sfx3.addMarker('choir-C2', 137.0, 1.0);
        game.sfx3.addMarker('choir-C#2', 138.0, 1.0);
        game.sfx3.addMarker('choir-D2', 139.0, 1.0);
        game.sfx3.addMarker('choir-D#2', 140.0, 1.0);
        game.sfx3.addMarker('choir-E2', 141.0, 1.0);
        game.sfx3.addMarker('choir-F2', 142.0, 1.0);
        game.sfx3.addMarker('choir-F#2', 143.0, 1.0);
        game.sfx3.addMarker('choir-G2', 144.0, 1.0);
        game.sfx3.addMarker('choir-G#2', 145.0, 1.0);
        game.sfx3.addMarker('choir-A2', 146.0, 1.0);
        game.sfx3.addMarker('choir-A#2', 147.0, 1.0);
        game.sfx3.addMarker('choir-B2', 148.0, 1.0);

        game.sfx1.volume = 0.7;
        game.sfx2.volume = 0.7;
        game.sfx3.volume = 0.7;

        // CONTROLS
        game.input.pointer1.wasDown = false;
        game.input.pointer2.wasDown = false;

        game.onPause.add(function() {
            if (game.music.isPlaying && (currentState !== TRUE_COLORS_GAMEPLAY || this.trueColorsEventStep < 3)) {
                game.music.pause();
                lastPause = this.game.time.time;
            }
        }, this);

        game.onResume.add(function() {
            if (game.music.paused && currentState !== SUBMISSION_MENU && musicEnabled) {
                game.music.resume();

                if (lastPause !== null) {
                    pauseTime += this.game.time.time - lastPause;
                }
            }
        });

        this.cursors = game.input.keyboard.createCursorKeys();
        this.cursors.down.onDown.add(function() {
            if (!controlsDisabled) {
                framesSinceArrowPressed = 0;
                this.timeOfLastPaletteSwap = -Infinity;
                
                if (this.virtualCursor.grid.y == 31)
                    this.virtualCursor.grid.y = 0;
                else
                    this.virtualCursor.grid.y++;

                this.setControlType(KEYBOARD);
            }
            if (currentState == SUBMISSION_MENU) {
                 document.getElementById('kixel-program-description-field').focus();
            }
            else if (currentState == OFFSET_MENU && !optionsDown) {
                optionsDown = true;
                this.offsetDownButton.isDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
            else if (typeof username !== 'undefined') {
                if (currentState == TRUE_COLORS_TITLE && (this.trueColorsSelectedIndex === null || this.trueColorsSelectedIndex === 0) && this.eventTimer >= 3000 && this.trueColorsEventStep < 3000) {
                    if (sfxEnabled)
                        game.sfx1.play('trueColorsMenuMove');

                    this.trueColorsSelectedIndex = 1;
                }
            }
        }, this);
        this.cursors.down.onUp.add(function() {
            if (currentState == OFFSET_MENU && optionsDown) {
                optionsDown = false;
                this.offsetDownButton.isDown = false;
                this.offsetKixel("down");
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);

        this.cursors.up.onDown.add(function() {
            if (!controlsDisabled) {
                framesSinceArrowPressed = 0;
                this.timeOfLastPaletteSwap = -Infinity;

                this.virtualCursor.visible = true;

                if (this.virtualCursor.grid.y == 0)
                    this.virtualCursor.grid.y = 31;
                else
                    this.virtualCursor.grid.y--;

                this.setControlType(KEYBOARD);
            }
            if (currentState == SUBMISSION_MENU) {
                 document.getElementById('kixel-program-title-field').focus();
            }
            else if (currentState == OFFSET_MENU && !optionsDown) {
                optionsDown = true;
                this.offsetUpButton.isDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
            else if (typeof username !== 'undefined') {
                if (currentState == TRUE_COLORS_TITLE && (this.trueColorsSelectedIndex === null || this.trueColorsSelectedIndex === 1) && this.eventTimer >= 3000 && this.trueColorsEventStep < 3000) {
                    if (sfxEnabled)
                        game.sfx1.play('trueColorsMenuMove');

                    this.trueColorsSelectedIndex = 0;
                }
            }
        }, this);
        this.cursors.up.onUp.add(function() {
            if (currentState == OFFSET_MENU && optionsDown) {
                optionsDown = false;
                this.offsetUpButton.isDown = false;
                this.offsetKixel("up");
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);

        this.cursors.right.onDown.add(function() {
            if (!controlsDisabled) {
                framesSinceArrowPressed = 0;
                this.timeOfLastPaletteSwap = -Infinity;

                this.virtualCursor.visible = true;
                
                if (this.virtualCursor.grid.x == 31)
                    this.virtualCursor.grid.x = 0;
                else
                    this.virtualCursor.grid.x++;

                this.setControlType(KEYBOARD);
            }
            if (currentState == OFFSET_MENU && !optionsDown) {
                optionsDown = true;
                this.offsetRightButton.isDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
            else if (currentState == TRUE_COLORS_GAMEPLAY && this.trueColorsControlsEnabled) {
                this.trueColorsButton2.isDown = true;
                this.trueColorsSelectNext();
            }
        }, this);
        this.cursors.right.onUp.add(function() {
            if (currentState == OFFSET_MENU && optionsDown) {
                optionsDown = false;
                this.offsetRightButton.isDown = false;
                this.offsetKixel("right");
            }
            else if (currentState == TRUE_COLORS_GAMEPLAY) {
                this.trueColorsButton2.isDown = false;
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);

        this.cursors.left.onDown.add(function() {
            if (!controlsDisabled) {
                framesSinceArrowPressed = 0;
                this.timeOfLastPaletteSwap = -Infinity;

                this.virtualCursor.visible = true;
                
                if (this.virtualCursor.grid.x == 0)
                    this.virtualCursor.grid.x = 31;
                else
                    this.virtualCursor.grid.x--;

                this.setControlType(KEYBOARD);
            }
            if (currentState == OFFSET_MENU && !optionsDown) {
                optionsDown = true;
                this.offsetLeftButton.isDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
            else if (currentState == TRUE_COLORS_GAMEPLAY && this.trueColorsControlsEnabled) {
                this.trueColorsButton1.isDown = true;
                this.trueColorsSelectPrev();
            }
        }, this);
        this.cursors.left.onUp.add(function() {
            if (currentState == OFFSET_MENU && optionsDown) {
                optionsDown = false;
                this.offsetLeftButton.isDown = false;
                this.offsetKixel("left");
            }
            else if (currentState == TRUE_COLORS_GAMEPLAY) {
                this.trueColorsButton1.isDown = false;
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);

        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);

        this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.shiftKey.onDown.add(function() {
            if (!controlsDisabled) {
                this.setControlType(KEYBOARD);
                keyboardButtonDown = true;
                buttonsDown = true;
            }
        }, this);
        this.shiftKey.onUp.add(function() {
            if (this.drawerOpen && this.drawerPosition == this.trueColorsSelector.height + 30) {
                this.launchTrueColors();
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SHIFT);

        this.ctrlKey = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        this.ctrlKey.onDown.add(function() {
            if (!controlsDisabled) {
                this.setControlType(KEYBOARD);
                justClicked = true;
            }
        }, this);
        this.ctrlKey.onUp.add(function() {
            if (currentState == MAIN_MENU || currentState == SAVE_MENU || currentState == SUBMISSION_MENU) {
                if (typeof username !== 'undefined' && !this.drawerOpen) {
                    if (sfxEnabled)
                        game.sfx1.play('drawerOpening');

                    this.drawerOpen = true;
                    this.trueColorsSelector.exists = true;
                    this.trueColorsStatus.exists = true;
                    this.drawer.exists = false;
                    this.eventTimer = 0;
                }
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.CONTROL);

        this.colorKeys = [];

        this.oneKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);
        this.oneKey.onUp.add(function(button, pointer, isOver) {
            if (openingScreenIsOpen) {
                this.startEditor(0);
            }
        }, this);
        this.colorKeys.push(this.oneKey);

        this.twoKey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.TWO);
        this.twoKey.onUp.add(function(button, pointer, isOver) {
            if (openingScreenIsOpen) {
                this.startEditor(1);
            }
        }, this);
        this.colorKeys.push(this.twoKey);

        this.threeKey = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.THREE);
        this.threeKey.onUp.add(function(button, pointer, isOver) {
            if (openingScreenIsOpen) {
                this.startEditor(2);
            }
        }, this);
        this.colorKeys.push(this.threeKey);

        this.fourKey = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.FOUR);
        this.colorKeys.push(this.fourKey);

        this.fiveKey = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.FIVE);
        this.colorKeys.push(this.fiveKey);

        this.sixKey = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SIX);
        this.colorKeys.push(this.sixKey);

        this.sevenKey = game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SEVEN);
        this.colorKeys.push(this.sevenKey);

        this.eightKey = game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.EIGHT);
        this.colorKeys.push(this.eightKey);

        this.nineKey = game.input.keyboard.addKey(Phaser.Keyboard.NINE);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.NINE);
        this.colorKeys.push(this.nineKey);

        this.zeroKey = game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ZERO);
        this.colorKeys.push(this.zeroKey);

        this.qKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.Q);
        this.colorKeys.push(this.qKey);

        this.wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.W);
        this.colorKeys.push(this.wKey);

        this.eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.E);
        this.colorKeys.push(this.eKey);

        this.rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.R);
        this.colorKeys.push(this.rKey);

        this.tKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.T);
        this.colorKeys.push(this.tKey);

        this.yKey = game.input.keyboard.addKey(Phaser.Keyboard.Y);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.Y);
        this.colorKeys.push(this.yKey);

        this.colorKeys.forEach(function(key, index) {
            key.onDown.add(function() {
                this.setControlType(KEYBOARD);

                if (!controlsDisabled && !colorsDown) {
                    colorsDown = true;
                    currentColorDown = index;
                    keyboardButtonDown = true;
                    game.sfx2.play('openTools');
                    if (currentColorIndex !== index)
                        game.sfx1.play('changeColor');
                }
            }, this);
            key.onUp.add(function() {
                if (!controlsDisabled && colorsDown) {
                    this.virtualCursor.visible = true;
                    this.changeColor(index);

                }

                colorsDown = false;
                currentColorDown = null;
                keyboardButtonDown = false;

                this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                    this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
            }, this);
        }, this);

        this.qKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (currentState == MAIN_MENU) {
                if (!optionsDown) {
                    optionsDown = true;
                    this.clearCanvasButton.isDown = true;

                    if (sfxEnabled)
                        game.sfx1.play('optionDown');
                }
            }
            else if (currentState == SAVE_MENU) {
                if (!optionsDown) {
                    optionsDown = true;
                    this.saveLittleButton.isDown = true;

                    if (sfxEnabled)
                        game.sfx1.play('optionDown');
                }
            }
        }, this);
        this.qKey.onUp.add(function() {
            if (currentState == MAIN_MENU && this.clearCanvasButton.isDown) {
                optionsDown = false;
                this.clearCanvasButton.isDown = false;
                this.clearCanvasButton.executeButtonFunction();
            }
            else if (currentState == SAVE_MENU && this.saveLittleButton.isDown) {
                optionsDown = false;
                this.saveLittleButton.isDown = false;
                this.saveLittleButton.executeButtonFunction();
            }
        }, this);

        this.wKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (currentState == MAIN_MENU) {
                if (!optionsDown) {
                    optionsDown = true;
                    this.offsetButton.isDown = true;
                    if (sfxEnabled)
                        game.sfx1.play('optionDown');
                }
            }
            else if (currentState == SAVE_MENU) {
                if (!optionsDown) {
                    optionsDown = true;
                    this.saveBigButton.isDown = true;

                    if (sfxEnabled)
                        game.sfx1.play('optionDown');
                }
            }
        }, this);
        this.wKey.onUp.add(function() {
            if (currentState == MAIN_MENU && this.offsetButton.isDown) {
                optionsDown = false;
                this.offsetButton.isDown = false;
                this.offsetButton.executeButtonFunction();
            }
            else if (currentState == SAVE_MENU && this.saveBigButton.isDown) {
                optionsDown = false;
                this.saveBigButton.isDown = false;
                this.saveBigButton.executeButtonFunction();
            }
        }, this);

        this.eKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (currentState == MAIN_MENU) {
                if (!optionsDown) {
                    optionsDown = true;
                    this.symmetryButton.isDown = true;

                    if (sfxEnabled)
                        game.sfx1.play('optionDown');
                }
            }
        }, this);
        this.eKey.onUp.add(function() {
            if (currentState == MAIN_MENU && this.symmetryButton.isDown) {
                optionsDown = false;
                this.symmetryButton.isDown = false;
                this.symmetryButton.executeButtonFunction();
            }
        }, this);

        this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.aKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (!controlsDisabled && currentState == PAINTING) {
                keyboardButtonDown = true;
                buttonsDown = true;
            }
            if (currentState == MAIN_MENU && !optionsDown) {
                optionsDown = true;
                this.gridButton.isDown = true;
                
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.aKey.onUp.add(function() {
            if (currentState == MAIN_MENU && this.gridButton.isDown) {
                optionsDown = false;
                this.gridButton.isDown = false;
                this.gridButton.executeButtonFunction();
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.A);

        this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.sKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (!controlsDisabled && currentState == PAINTING) {
                keyboardButtonDown = true;
                buttonsDown = true;
            }
            if (currentState == MAIN_MENU && !optionsDown) {
                optionsDown = true;
                this.audioButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.sKey.onUp.add(function() {
            if (currentState == MAIN_MENU && this.audioButton.isDown) {
                optionsDown = false;
                this.audioButton.isDown = false;
                this.audioButton.executeButtonFunction();
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.S);

        this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.dKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (!controlsDisabled) {
                keyboardButtonDown = true;
                buttonsDown = true;
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.D);

        this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.zKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (!controlsDisabled && currentState == PAINTING) {
                keyboardButtonDown = true;
                buttonsDown = true;
            }
            if (currentState == MAIN_MENU && !optionsDown) {
                optionsDown = true;
                this.saveButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.zKey.onUp.add(function() {
            if (currentState == MAIN_MENU && this.saveButton.isDown) {
                optionsDown = false;
                this.saveButton.isDown = false;
                this.saveButton.executeButtonFunction();
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.Z);

        this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.xKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (!controlsDisabled && currentState == PAINTING) {
                keyboardButtonDown = true;
                buttonsDown = true;
            }
            if (currentState == MAIN_MENU && !optionsDown) {
                optionsDown = true;
                this.loadButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.xKey.onUp.add(function() {
            if (currentState == MAIN_MENU && this.loadButton.isDown) {
                optionsDown = false;
                this.loadButton.isDown = false;
                this.loadButton.executeButtonFunction();
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.X);

        this.mKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.mKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (!controlsDisabled && currentState == PAINTING && this.changePaletteButton.exists) {
                keyboardButtonDown = true;
                buttonsDown = true;
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.M);

        this.nKey = game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.nKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (!controlsDisabled && currentState == PAINTING && this.changePaletteButton.exists) {
                keyboardButtonDown = true;
                buttonsDown = true;
            }
        }, this);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.N);
        
        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.enterKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if (!controlsDisabled) {
                keyboardButtonDown = true;
                buttonsDown = true;
            }
            if (currentState == MAIN_MENU && this.submitButton.exists) {
                this.submitButton.isDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
            else if (currentState == SUBMISSION_MENU) {
                if (document.getElementById('kixel-program-title-field').value.length > 0) {
                    title = document.getElementById('kixel-program-title-field').value;
                    description = document.getElementById('kixel-program-description-field').value;
                    this.submitKixel();
                }
            }
            else if (currentState == OFFSET_MENU && !optionsDown) {
                optionsDown = true;
                this.confirmOffsetButton.isDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
            else if (currentState == MESSAGE) {
                this.messageWindowButton.isDown = true;

                if (sfxEnabled)
                    game.sfx2.play('messageWindowClick1');
            }
            else if (typeof username !== 'undefined') {
                if (currentState == TRUE_COLORS_TITLE && this.trueColorsEventStep < 3000) {
                    if (this.trueColorsSelectedIndex == 0) {
                        this.startTrueColors();
                    }
                    else if (this.trueColorsSelectedIndex == 1) {
                        this.closeTrueColors();
                    }
                }
                else if (currentState == TRUE_COLORS_RESULTS && this.trueColorsEventStep == 9) {
                    this.closeTrueColors();
                }
            }
        }, this);
        this.enterKey.onUp.add(function() {
            if (currentState == MAIN_MENU && this.submitButton.isDown) {
                this.openSubmissionMenu();
            }
            else if (currentState == OFFSET_MENU && this.confirmOffsetButton.isDown) {
                this.confirmOffsetButton.executeButtonFunction();
            }
            else if (currentState == MESSAGE && this.messageWindowButton.isDown) {
                this.messageWindowButton.executeButtonFunction();
            }

            optionsDown = false;
            this.submitButton.isDown = false;
            this.confirmOffsetButton.isDown = false;
            this.messageWindowButton.isDown = false;
        }, this);

        this.escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.escKey.onDown.add(function() {
            this.setControlType(KEYBOARD);

            if ((currentState == MAIN_MENU || currentState == SAVE_MENU || currentState == SUBMISSION_MENU) && !optionsDown) {
                optionsDown = true;
                this.cancelButton.isDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
            else if (currentState == OFFSET_MENU && !optionsDown) {
                optionsDown = true;
                this.cancelOffsetButton.isDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.escKey.onUp.add(function() {
            if ((currentState == MAIN_MENU || currentState == SAVE_MENU || currentState == SUBMISSION_MENU) && this.cancelButton.isDown) {
                this.cancelButton.executeButtonFunction();
                optionsDown = false;
                this.cancelButton.isDown = false;
            }
            else if (currentState == OFFSET_MENU && this.cancelOffsetButton.isDown) {
                this.cancelOffsetButton.executeButtonFunction();
                optionsDown = false;
                this.cancelButton.isDown = false;
            }
        }, this);

        // BASICS
        this.currentSelection = null;
        this.canvasScale = 1;

        this.undoStates = [];
        for (var x = 0; x < 16; x++) {
            var undoState = game.make.bitmapData(32, 32);
            this.undoStates.push(undoState);
        }

        // VISUALS
        game.stage.backgroundColor = 0xffffff;

        this.bgGraphics = game.add.graphics(0, 0);

        this.bgGraphics.beginFill(Phaser.Color.hexToRGB(palettes.colors[currentPaletteIndex][10]));
        this.bgGraphics.drawRect(0, 0, game.width, game.height);
        this.bgGraphics.endFill();

        this.bgBmd = game.make.bitmapData(372, 100);
        
        this.bgText1 = game.make.bitmapText(0, 0, "04b30", "KIXEL CREATOR");
        this.bgText2 = game.make.bitmapText(0, 0, "euxoi", "ver. " + VERSION);
        
        for (var x = 0; x < this.bgText1.children.length; x++) {
            this.bgBmd.draw(this.bgText1.children[x], this.bgText1.children[x].x, this.bgText1.children[x].y);
        }

        for (var x = 0; x < this.bgText2.children.length; x++) {
            this.bgBmd.draw(this.bgText2.children[x], this.bgText2.children[x].x + 100, this.bgText2.children[x].y + 30);
        }

        this.bgSprites = game.add.group();

        for (var x = 0; x < 7; x++) {
            var sprite = game.add.sprite(0, 0, this.bgBmd);
            sprite.alpha = 0.5;
            sprite.rotation = -0.4;
            this.bgSprites.add(sprite);
        }

        this.underlayGraphics = game.add.graphics(0, 0);

        this.kixel = game.make.bitmapData(32, 32);
        this.biggerKixel = game.make.bitmapData(160, 160);
        this.canvasKixel = game.make.bitmapData(32, 32);
        this.copyCanvasKixel = game.make.bitmapData(32, 32);

        this.maskProduct = game.make.bitmapData(32, 32);
        this.cutMaskProduct = game.make.bitmapData(32, 32);
        this.undoMaskProduct = game.make.bitmapData(32, 32);
        this.canvasMaskProduct = game.make.bitmapData(32, 32);

        this.kixel.rect(0, 0, 32, 32, "#ffffff");
        this.canvasKixel.rect(0, 0, 32, 32, "#ffffff");

        this.canvas = game.add.sprite(game.width / 2, game.height / 2, this.canvasKixel);
        this.canvas.anchor.setTo(0.5);
        this.canvas.intendedX = game.width / 2;
        this.canvas.intendedY = game.height / 2;

        this.canvasReference = game.add.sprite(game.width / 2, game.height / 2, null);
        this.canvasReference.anchor.setTo(0.5);

        this.canvasProductPreview = game.add.sprite(game.width / 2, game.height / 2, this.canvasMaskProduct);
        this.canvasProductPreview.anchor.setTo(0.5);

        this.maskArea = game.add.graphics(32, 32);

        this.selectionOverlay = game.add.tileSprite(0, 0, 32, 32, 'selectionTilesprite');
        this.selectionOverlay.anchor.setTo(0.5);
        this.selectionOverlay.autoScroll(-30, -30);
        this.selectionOverlay.mask = this.maskArea;
        this.selectionOverlay.visible = false;

        this.gridGraphics = game.add.graphics(0, 0);

        if (typeof compoNumber !== 'undefined') {
            // compo stuff
            this.compoTitle = game.add.text(0, 0, get("kixel-compo-title").innerHTML);
            this.compoTitle.anchor.setTo(0.5, 0);
            this.compoTitle.font = "Oswald";
            this.compoTitle.padding.set(10, 10);
            this.compoTitle.lineSpacing = -20;
            this.compoTitle.align = "center";
            this.compoTitle.addColor('white', 0);
            this.compoTitle.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.compoTitle.wordWrap = true;
            this.compoTitle.useAdvancedWrap = true;

            this.compoType = game.add.text(0, 0, get("kixel-compo-type").innerHTML);
            this.compoType.anchor.setTo(0.5, 0);
            this.compoType.font = "Oswald";
            this.compoType.padding.set(10, 10);
            this.compoType.align = "center";
            this.compoType.addColor('white', 0);
            this.compoType.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.compoType.wordWrap = true;
            this.compoType.useAdvancedWrap = true;

            this.compoObjective1 = game.add.text(0, 0, "Objective" + (get("kixel-compo-objective-2") ? "s" : "") + "\n" + get("kixel-compo-objective-1").innerHTML);
            this.compoObjective1.font = "Oswald";
            this.compoObjective1.padding.set(10, 10);
            this.compoObjective1.lineSpacing = -10;
            this.compoObjective1.addColor('white', 0);
            this.compoObjective1.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.compoObjective1.wordWrap = true;
            this.compoObjective1.useAdvancedWrap = true;

            this.compoObjective2 = game.add.text(0, 0, "not set");
            this.compoObjective2.font = "Oswald";
            this.compoObjective2.padding.set(10, 10);
            this.compoObjective2.lineSpacing = -10;
            this.compoObjective2.addColor('white', 0);
            this.compoObjective2.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.compoObjective2.wordWrap = true;
            this.compoObjective2.useAdvancedWrap = true;
            if (get("kixel-compo-objective-2") !== null) {
                this.compoObjective2.setText(get("kixel-compo-objective-2").innerHTML);
            }
            else {
                this.compoObjective2.exists = false;
            }

            this.compoTimeLeft = game.add.text(0, 0, "TIME LEFT");
            this.compoTimeLeft.anchor.setTo(0.5, 0);
            this.compoTimeLeft.font = "Oswald";
            this.compoTimeLeft.padding.set(20, 20);
            this.compoTimeLeft.align = "center";
            this.compoTimeLeft.addColor('white', 0);
            this.compoTimeLeft.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.compoTimeLeft.wordWrap = true;
            this.compoTimeLeft.useAdvancedWrap = true;

            this.compoTimerD = game.add.sprite(0, 0, null);
            this.compoTimerD.anchor.setTo(0.5, 0);
            this.compoTimerD.exists = false;

            this.compoTimerDText = game.add.bitmapText(0, 0, "04b30-white");
            this.compoTimerDText.anchor.setTo(0.5);

            this.compoTimerH = game.add.sprite(0, 0, null);
            this.compoTimerH.anchor.setTo(0.5, 0);
            this.compoTimerH.exists = false;

            this.compoTimerHText = game.add.bitmapText(0, 0, "04b30-white");
            this.compoTimerHText.anchor.setTo(0.5);

            this.compoTimerM = game.add.sprite(0, 0, null);
            this.compoTimerM.anchor.setTo(0.5, 0);
            this.compoTimerM.exists = false;

            this.compoTimerMText = game.add.bitmapText(0, 0, "04b30-white");
            this.compoTimerMText.anchor.setTo(0.5);

            this.compoTimerS = game.add.sprite(0, 0, null);
            this.compoTimerS.anchor.setTo(0.5, 0);
            this.compoTimerS.exists = false;

            this.compoTimerSText = game.add.bitmapText(0, 0, "04b30-white");
            this.compoTimerSText.anchor.setTo(0.5);
        }

        // controls on UI
        this.colorSelectors = [];

        for (var x = 0; x < 16; x++) {
            var selector = game.add.button(x * 50, 0, null);
            selector.onInputDown.add(function() {
                colorsDown = true;

                if (sfxEnabled)
                    game.sfx2.play('openTools');
            }, this);

            this.colorSelectors.push(selector);
        }

        this.colorSelectors[0].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(0)}, this);
        this.colorSelectors[1].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(1)}, this);
        this.colorSelectors[2].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(2)}, this);
        this.colorSelectors[3].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(3)}, this);
        this.colorSelectors[4].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(4)}, this);
        this.colorSelectors[5].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(5)}, this);
        this.colorSelectors[6].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(6)}, this);
        this.colorSelectors[7].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(7)}, this);
        this.colorSelectors[8].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(8)}, this);
        this.colorSelectors[9].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(9)}, this);
        this.colorSelectors[10].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(10)}, this);
        this.colorSelectors[11].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(11)}, this);
        this.colorSelectors[12].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(12)}, this);
        this.colorSelectors[13].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(13)}, this);
        this.colorSelectors[14].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(14)}, this);
        this.colorSelectors[15].onInputUp.add(function(button, pointer, isOver) {if (isOver) this.changeColor(15)}, this);

        // BUTTONS
        this.overlayGraphics = game.add.graphics();

        if (typeof haunted !== 'undefined') {
            this.colorSelectors.forEach(function(selector) {
                selector.ghost = game.add.sprite(0, 0, 'icons', 49);
                selector.ghost.anchor.setTo(0.5);
                selector.ghost.alpha = 0.5;
                selector.ghost.visible = false;
            }, this);
        }

        this.selectedColorIcon = game.add.sprite(this.colorSelectors[15].x, this.colorSelectors[15].y, 'icons', 22);
        this.selectedColorIcon.anchor.setTo(0.5);
        this.selectedColorIcon.intendedX = 0;
        this.selectedColorIcon.intendedY = 0;

        this.ctrlKeyIcon = game.add.sprite(this.colorSelectors[0].x + this.colorSelectors[0].width, this.colorSelectors[0].y + this.colorSelectors[0].height, 'icons', 24);
        this.ctrlKeyIcon.anchor.setTo(1, 1);
        this.ctrlKeyIcon.exists = false;
        this.ctrlKeyIcon.intendedX = this.colorSelectors[0].x + this.colorSelectors[0].width;
        this.ctrlKeyIcon.intendedY = this.colorSelectors[0].y + this.colorSelectors[0].height;

        for (var x = 0; x < 16; x++) {
            var selector = this.colorSelectors[x];
            var label = game.add.bitmapText(0, 0, "euxoi_stroke", x.toString(), 24);
            label.anchor.setTo(0.5);
            selector.label = label;
            label.visible = false;
        }
        this.colorSelectors[0].label.setText("1");
        this.colorSelectors[1].label.setText("2");
        this.colorSelectors[2].label.setText("3");
        this.colorSelectors[3].label.setText("4");
        this.colorSelectors[4].label.setText("5");
        this.colorSelectors[5].label.setText("6");
        this.colorSelectors[6].label.setText("7");
        this.colorSelectors[7].label.setText("8");
        this.colorSelectors[8].label.setText("9");
        this.colorSelectors[9].label.setText("0");
        this.colorSelectors[10].label.setText("Q");
        this.colorSelectors[11].label.setText("W");
        this.colorSelectors[12].label.setText("E");
        this.colorSelectors[13].label.setText("R");
        this.colorSelectors[14].label.setText("T");
        this.colorSelectors[15].label.setText("Y");

        this.preview = game.add.sprite(0, 0, this.canvasKixel);

        this.buttons = [];

        // change palettes
        this.changePaletteButton = game.add.button(game.width / 8 * 0, game.height, null);
        this.changePaletteButton.width = game.width / 8;
        this.changePaletteButton.height = game.height * 0.1;
        this.changePaletteButton.anchor.setTo(0, 1);
        this.changePaletteButton.onInputDown.add(function() {
            buttonsDown = true; initButtonDown = 0;
        }, this);
        this.changePaletteButton.executeButtonFunction = function(button, pointer, isOver) {
            if (isOver) {
                if (currentMode == DRAW && typeof forcedPalette == 'undefined') {
                    framesSinceLastRelease = 0;
                    lastButtonReleased = this.changePaletteButton;

                    if (pointer.position.x < button.x + (button.width / 2)) { // left button
                        if (currentPaletteIndex == 0)
                            this.changePalette(7);
                        else
                            this.changePalette(currentPaletteIndex - 1);
                    }
                    else { // right button
                        if (currentPaletteIndex == 7)
                            this.changePalette(0);
                        else
                            this.changePalette(currentPaletteIndex + 1);
                    }

                    if (sfxEnabled) {
                        if (musicName == 'compo')
                            game.sfx2.play('palette-c-' + (currentPaletteIndex + 1));
                        else
                            game.sfx2.play('palette' + (currentPaletteIndex + 1));
                    }

                    this.changePaletteButton.icon.frame = 4;
                }
                else if (currentMode == SELECTION) {
                    if (selectMode == CUT) {
                        selectMode = COPY;
                        this.changePaletteButton.icon.frame = 42;
                        if (sfxEnabled)
                            game.sfx2.play('copyMode');
                    }
                    else if (selectMode == COPY) {
                        selectMode = CUT;
                        this.changePaletteButton.icon.frame = 41;
                        if (sfxEnabled)
                            game.sfx2.play('cutMode');
                    }
                }
            }
        };
        this.changePaletteButton.executeButtonFunction = this.changePaletteButton.executeButtonFunction.bind(this);

        this.buttons.push(this.changePaletteButton);

        this.changePaletteButton.icon = game.add.sprite(this.changePaletteButton.x, this.changePaletteButton.y, 'icons', 4);
        this.changePaletteButton.icon.anchor.setTo(0.5);

        this.changePaletteButton.label = game.add.bitmapText(this.changePaletteButton.x, this.changePaletteButton.y - 20, "euxoi_stroke", "N / M", 24);
        if (device == MOBILE || typeof forcedPalette !== 'undefined') {
            this.changePaletteButton.label.visible = false;
        }

        // undo
        this.undoButton = game.add.button(game.width / 8 * 1, game.height, null);
        this.undoButton.width = game.width / 8;
        this.undoButton.height = game.height * 0.1;
        this.undoButton.anchor.setTo(0, 1);
        this.undoButton.onInputDown.add(function() {
            buttonsDown = true; initButtonDown = 1;
        }, this);
        this.undoButton.executeButtonFunction = function(button, pointer, isOver) {
            if (isOver) {
                framesSinceLastRelease = 0;
                lastButtonReleased = this.undoButton;

                this.undo();
            }
        };
        this.undoButton.executeButtonFunction = this.undoButton.executeButtonFunction.bind(this);
        this.buttons.push(this.undoButton);

        this.undoButton.icon = game.add.sprite(this.undoButton.x, this.undoButton.y, 'icons', 0);
        this.undoButton.icon.anchor.setTo(0.5);

        this.undoButton.label = game.add.bitmapText(this.undoButton.x, this.undoButton.y - 20, "euxoi_stroke", "Z", 24);
        if (device == MOBILE)
            this.undoButton.label.exists = false;

        // redo
        this.redoButton = game.add.button(game.width / 8 * 2, game.height, null);
        this.redoButton.width = game.width / 8;
        this.redoButton.height = game.height * 0.1;
        this.redoButton.anchor.setTo(0, 1);
        this.redoButton.onInputDown.add(function() {
            buttonsDown = true; initButtonDown = 2;
        }, this);
        this.redoButton.executeButtonFunction = function(button, pointer, isOver) {
            if (isOver) {
                framesSinceLastRelease = 0;
                lastButtonReleased = this.redoButton;
                this.redoButton.icon.rotation = 0;

                this.redo();
            }
        };
        this.redoButton.executeButtonFunction = this.redoButton.executeButtonFunction.bind(this);
        this.buttons.push(this.redoButton);

        this.redoButton.icon = game.add.sprite(this.redoButton.x, this.redoButton.y, 'icons', 1);
        this.redoButton.icon.anchor.setTo(0.5);

        this.redoButton.label = game.add.bitmapText(this.redoButton.x, this.redoButton.y - 20, "euxoi_stroke", "X", 24);
        if (device == MOBILE)
            this.redoButton.label.exists = false;

        // selection
        this.selectionButton = game.add.button(game.width / 8 * 3, game.height, null);
        this.selectionButton.width = game.width / 8;
        this.selectionButton.height = game.height * 0.1;
        this.selectionButton.anchor.setTo(0, 1);
        this.selectionButton.onInputDown.add(function() {
            buttonsDown = true; initButtonDown = 3;
        }, this);
        this.selectionButton.executeButtonFunction = function(button, pointer, isOver) {
            if (isOver) {
                if (currentMode == SELECTION)
                    currentMode = DRAW;
                else if (currentMode == DRAW)
                    currentMode = SELECTION;

                if (currentMode == DRAW) {
                    this.maskProduct.clear();
                    this.maskProduct.update();
                    this.canvasMaskProduct.clear();
                    this.maskArea.clear();

                    currentTool = BRUSH;

                    if (sfxEnabled)
                        game.sfx2.play('drawTool');

                    if (typeof forcedPalette !== 'undefined') {
                        this.changePaletteButton.exists = false;
                        this.changePaletteButton.icon.exists = false;
                        this.changePaletteButton.label.visible = false;
                    }

                    this.changePaletteButton.icon.frame = 4;
                    this.selectionButton.icon.frame = 39;
                    this.brushButton.icon.frame = 5;
                    this.brushButton.icon.rotation = 0.35;
                    if (currentShape == LINE) {
                        this.shapesButton.icon.frame = 15;
                    }
                    else if (currentShape == OPEN_RECTANGLE) {
                        this.shapesButton.icon.frame = 16;
                    }
                    else if (currentShape == CLOSED_RECTANGLE) {
                        this.shapesButton.icon.frame = 17;
                    }
                    else if (currentShape == OPEN_ELLIPSE) {
                        this.shapesButton.icon.frame = 18;
                    }
                    if (currentShape == CLOSED_ELLIPSE) {
                        this.shapesButton.icon.frame = 19;
                    }
                    this.bucketButton.icon.frame = 6;
                    this.optionsButton.icon.frame = 20;

                    //this.brushSizeText.visible = true;

                    this.selectedColorIcon.exists = true;
                    this.ctrlKeyIcon.exists = true;
                    this.eyedropButton.icon.frame = 29;

                    this.selectionOverlay.visible = false;
                }
                else if (currentMode == SELECTION) {
                    currentTool = SELECTION_BRUSH;

                    if (sfxEnabled) {
                        if (selectMode == CUT)
                            game.sfx2.play('cutMode');
                        else if (selectMode == COPY)
                            game.sfx2.play('copyMode');
                    }

                    if (typeof forcedPalette !== 'undefined') {
                        this.changePaletteButton.exists = true;
                        this.changePaletteButton.icon.exists = true;
                        this.changePaletteButton.label.visible = true;
                    }

                    if (selectMode == CUT)
                        this.changePaletteButton.icon.frame = 41;
                    else if (selectMode == COPY)
                        this.changePaletteButton.icon.frame = 42;

                    this.selectionButton.icon.frame = 44;
                    this.brushButton.icon.frame = 32;
                    this.brushButton.icon.rotation = 0;
                    this.shapesButton.icon.frame = 33;
                    this.bucketButton.icon.frame = 34;
                    this.optionsButton.icon.frame = 40;

                    //this.brushSizeText.visible = false;

                    this.selectedColorIcon.exists = false;
                    this.ctrlKeyIcon.exists = false;
                    this.eyedropButton.icon.frame = 21;

                    this.selectionOverlay.visible = true;
                }
            }
        };
        this.selectionButton.executeButtonFunction = this.selectionButton.executeButtonFunction.bind(this);
        this.buttons.push(this.selectionButton);

        this.selectionButton.icon = game.add.sprite(this.undoButton.x, this.undoButton.y, 'icons', 39);
        this.selectionButton.icon.anchor.setTo(0.5);

        this.selectionButton.label = game.add.bitmapText(this.selectionButton.x, this.selectionButton.y - 20, "euxoi_stroke", "SHIFT", 24);
        if (device == MOBILE)
            this.selectionButton.label.exists = false;

        // brush size
        this.brushButton = game.add.button(game.width / 8 * 4, game.height, null);
        this.brushButton.width = game.width / 8;
        this.brushButton.height = game.height * 0.1;
        this.brushButton.anchor.setTo(0, 1);
        this.brushButton.onInputDown.add(function() {
            buttonsDown = true; initButtonDown = 4;
        }, this);
        this.brushButton.executeButtonFunction = function(button, pointer, isOver) {
            if (isOver) {
                framesSinceLastRelease = 0;
                lastButtonReleased = this.brushButton;

                if (currentMode == DRAW) {
                    if (currentTool == BRUSH) {
                        brushSize++;
                        if (brushSize > 3)
                            brushSize = 1;
                        switch (brushSize) {
                            case 1: this.brushButton.tint = 0xffffff;
                                if (sfxEnabled)
                                    game.sfx2.play('changeBrushSize1');
                                break;
                            case 2: this.brushButton.tint = 0x888888;
                                if (sfxEnabled)
                                    game.sfx2.play('changeBrushSize2');
                                break;
                            case 3: this.brushButton.tint = 0x333333;
                                if (sfxEnabled)
                                    game.sfx2.play('changeBrushSize3');
                            break;
                        }
                    }
                    else {
                        currentTool = BRUSH;

                        if (sfxEnabled)
                            game.sfx2.play('drawTool');
                    }
                }
                else if (currentMode == SELECTION) {
                    currentTool = SELECTION_BRUSH;

                    if (sfxEnabled)
                        game.sfx2.play('handSelectTool');
                }
            }
        };
        this.brushButton.executeButtonFunction = this.brushButton.executeButtonFunction.bind(this);
        this.buttons.push(this.brushButton);

        this.brushButton.icon = game.add.sprite(this.brushButton.x, this.brushButton.y, 'icons', 5);
        this.brushButton.icon.anchor.setTo(0.5);

        this.brushButton.label = game.add.bitmapText(this.brushButton.x, this.brushButton.y - 20, "euxoi_stroke", "A", 24);
        if (device == MOBILE)
            this.brushButton.label.exists = false;

        //this.brushSizeText = game.add.text(0, 0, "1", {font: 'bold 12px Arial'});
        //this.brushSizeText.anchor.setTo(1, 1);
        //this.brushSizeText.visible = true;

        // shapes
        this.shapesButton = game.add.button(game.width / 8 * 5, game.height, null);
        this.shapesButton.width = game.width / 8;
        this.shapesButton.height = game.height * 0.1;
        this.shapesButton.anchor.setTo(0, 1);
        this.shapesButton.onInputDown.add(function() {
            buttonsDown = true; initButtonDown = 5;
        }, this);
        this.shapesButton.executeButtonFunction = function(button, pointer, isOver) {
            if (isOver) {
                framesSinceLastRelease = 0;
                lastButtonReleased = this.shapesButton;
                
                if (currentMode == DRAW) {
                    if (currentTool == SHAPES) {
                        if (currentShape == LINE) {
                            if (sfxEnabled)
                                game.sfx2.play('openBox');
                            currentShape = OPEN_RECTANGLE;
                        }
                        else if (currentShape == OPEN_RECTANGLE) {
                            if (sfxEnabled)
                                game.sfx2.play('solidBox');
                            currentShape = CLOSED_RECTANGLE;
                        }
                        else if (currentShape == CLOSED_RECTANGLE) {
                            if (sfxEnabled)
                                game.sfx2.play('openEllipse');
                            currentShape = OPEN_ELLIPSE;
                        }
                        else if (currentShape == OPEN_ELLIPSE) {
                            if (sfxEnabled)
                                game.sfx2.play('solidEllipse');
                            currentShape = CLOSED_ELLIPSE;
                        }
                        else if (currentShape == CLOSED_ELLIPSE) {
                            if (sfxEnabled)
                                game.sfx2.play('line');
                            currentShape = LINE;
                        }
                    }
                    else {
                        if (sfxEnabled)
                            game.sfx2.play('shapeTool');
                        currentTool = SHAPES;
                    }
                }
                else if (currentMode == SELECTION) {
                    currentTool = SELECTION_MARQUEE;

                    if (sfxEnabled)
                        game.sfx2.play('boxSelectTool');
                }
            }
        };
        this.shapesButton.executeButtonFunction = this.shapesButton.executeButtonFunction.bind(this);

        this.shapesButton.icon = game.add.sprite(this.shapesButton.x, this.shapesButton.y, 'icons', 15);
        this.shapesButton.icon.anchor.setTo(0.5);

        this.buttons.push(this.shapesButton);

        this.shapesButton.label = game.add.bitmapText(this.shapesButton.x, this.shapesButton.y - 20, "euxoi_stroke", "S", 24);
        if (device == MOBILE)
            this.shapesButton.label.exists = false;

        // bucket
        this.bucketButton = game.add.button(game.width / 8 * 6, game.height, null);
        this.bucketButton.width = game.width / 8;
        this.bucketButton.height = game.height * 0.1;
        this.bucketButton.anchor.setTo(0, 1);
        this.bucketButton.onInputDown.add(function() {
            buttonsDown = true; initButtonDown = 6;
        }, this);
        this.bucketButton.executeButtonFunction = function(button, pointer, isOver) {
            if (isOver) {
                framesSinceLastRelease = 0;
                lastButtonReleased = this.bucketButton;

                if (currentMode == DRAW) {
                    currentTool = BUCKET;

                    if (sfxEnabled)
                        game.sfx2.play('bucketTool');
                }
                else if (currentMode == SELECTION) {
                    currentTool = SELECTION_BUCKET;

                    if (sfxEnabled)
                        game.sfx2.play('fillSelectTool');
                }
            }
        };
        this.buttons.push(this.bucketButton);
        this.bucketButton.executeButtonFunction = this.bucketButton.executeButtonFunction.bind(this);

        this.bucketButton.icon = game.add.sprite(this.brushButton.x, this.brushButton.y, 'icons', 6);
        this.bucketButton.icon.anchor.setTo(0.5);

        this.bucketButton.label = game.add.bitmapText(this.bucketButton.x, this.bucketButton.y - 20, "euxoi_stroke", "D", 24);
        if (device == MOBILE)
            this.bucketButton.label.exists = false;

        // options
        this.optionsButton = game.add.button(game.width / 8 * 7, game.height, null);
        this.optionsButton.width = game.width / 8;
        this.optionsButton.height = game.height * 0.1;
        this.optionsButton.anchor.setTo(0, 1);
        this.optionsButton.onInputDown.add(function() {
            buttonsDown = true; initButtonDown = 7;
        }, this);
        this.optionsButton.executeButtonFunction = function(button, pointer, isOver) {
            framesSinceLastRelease = 0;
            lastButtonReleased = this.optionsButton;

            if (isOver) {
                if (currentMode == SELECTION) {
                    // clear selection
                    this.maskProduct.clear();
                    this.maskProduct.update();
                    this.canvasMaskProduct.clear();
                    this.maskArea.clear();

                    if (sfxEnabled)
                        game.sfx2.play('unselectAll');
                }
                else {
                    this.colorSelectors.forEach(function(button) {
                        button.inputEnabled = false;
                    }, this);
                    this.buttons.forEach(function(button) {
                        button.inputEnabled = false;
                    }, this);

                    currentState = MAIN_MENU;
                    controlsDisabled = true;

                    if (device == DESKTOP) {
                        document.getElementById('kixel-program-title-field').focus();
                    }

                    this.mainMenu.exists = true;
                    this.mainMenu.y = -game.height;
                    this.mainMenuButtons.setAll('exists', true);

                    this.countColorsUsed();

                    if (typeof username === 'undefined') {
                        this.submitButton.exists = false;
                        this.submitButtonText.setText("LOG IN TO SUBMIT");
                        this.submitButtonTextShadow.setText("LOG IN TO SUBMIT");
                    }
                    else if (numColorsUsed < 2) {
                        this.submitButton.exists = false;
                        this.submitButtonText.setText("MAKE SOMETHING!");
                        this.submitButtonTextShadow.setText("MAKE SOMETHING!");
                    }
                    else if (typeof haunted !== 'undefined' && numColorsUsed > 5) {
                        this.submitButton.exists = false;
                        this.submitButtonText.setText("5 COLORS ONLY!");
                        this.submitButtonTextShadow.setText("5 COLORS ONLY!");
                    }
                    else {
                        this.submitButton.inputEnabled = true;
                        this.submitButton.input.useHandCursor = true;
                        this.submitButtonText.setText("SUBMIT KIXEL");
                        this.submitButtonTextShadow.setText("SUBMIT KIXEL");
                    }
                    
                    this.cancelButton.inputEnabled = true;
                    this.cancelButton.input.useHandCursor = true;
                }
            }
        };
        this.optionsButton.executeButtonFunction = this.optionsButton.executeButtonFunction.bind(this);

        this.optionsButton.icon = game.add.sprite(this.optionsButton.x, this.optionsButton.y, 'icons', 20);
        this.optionsButton.icon.anchor.setTo(0.5);

        this.optionsButton.label = game.add.bitmapText(this.optionsButton.x, this.optionsButton.y - 20, "euxoi_stroke", "ENTER", 24);
        if (device == MOBILE)
            this.optionsButton.label.exists = false;

        this.buttons.push(this.optionsButton);

        this.pushButton = game.add.button(0, 0, null);

        if (device == DESKTOP) {
            this.pushButton.exists = false;
        }
        else if (device == MOBILE) {
            this.pushButton.exists = true;
        }

        this.drawing = false;
        this.suckingColor = false;
        this.erasingSelection = false;

        this.pushButton.onInputDown.add(function() {
            if (currentState == PAINTING && !controlsDisabled) {
                this.drawing = true;
                this.pushButton.isDown = true;

                justClicked = true;
                currentMouseButton = LEFT_MOUSE;
                this.timeOfLastPaletteSwap = -Infinity;
            }
        }, this);
        this.pushButton.onInputUp.add(function() {
            if (currentState == PAINTING && !controlsDisabled) {
                if (currentTool == SHAPES) {
                    this.printMaskProductToKixel();

                    if (sfxEnabled)
                        game.sfx2.play('finishShape');
                }

                wasDown = false;
                justClicked = false;
                this.drawing = false;
                currentMouseButton = null;

                if (currentMode == DRAW && currentTool !== BUCKET)
                    this.createUndoState();
            }
            this.pushButton.isDown = false;
        }, this);

        this.pushButtonText = game.add.bitmapText(0, 0, "euxoi_stroke", "P U S H !", 40);
        this.pushButtonText.anchor.setTo(0.5);
        this.pushButtonText.align = "center";

        if (device == DESKTOP)
            this.pushButtonText.exists = false;
        else if (device == MOBILE)
            this.pushButtonText.exists = true;

        this.eyedropButton = game.add.button(0, 0, null);

        if (device == DESKTOP) {
            this.eyedropButton.exists = false;
        }
        else if (device == MOBILE) {
            this.eyedropButton.exists = true;
        }

        this.eyedropButton.onInputDown.add(function() {
            if (currentState == PAINTING && !controlsDisabled) {
                justClicked = true;
                currentMouseButton = RIGHT_MOUSE;

                if (currentMode == DRAW) {
                    this.suckingColor = true;

                    if (sfxEnabled)
                        game.sfx2.play('suckColor', 0, 0, true);
                }
                else if (currentMode == SELECTION) {
                    this.erasingSelection = true;
                }

                this.eyedropButton.isDown = true;
            }
        }, this);
        this.eyedropButton.onInputUp.add(function() {
            this.suckingColor = false;

            game.sfx2.stop();

            currentMouseButton = null;
            this.eyedropButton.isDown = false;
        }, this);

        this.eyedropButton.icon = game.add.sprite(0, 0, 'icons', 29);
        this.eyedropButton.icon.anchor.setTo(0.5);
        if (device == DESKTOP)
            this.eyedropButton.icon.exists = false;
        else if (device == MOBILE)
            this.eyedropButton.icon.exists = true;

        this.middleGraphics = game.add.graphics(0, 0);

        //
        if (typeof username !== 'undefined') {
            this.trueColorsKixels = null;
            this.trueColorsChoices = "";
            this.trueColorsEventStep = 0;
            this.trueColorsCorrect = 0;
            this.trueColorsCurrentRecord = 0;
            this.trueColorsStarting = false;
            this.trueColorsControlsEnabled = false;

            this.trueColorsSelector = game.add.button(0, 0, 'trueColorsLogo');
            this.trueColorsSelector.anchor.setTo(0, 1);
            this.trueColorsSelector.scale.setTo(0.5);
            this.trueColorsSelector.exists = false;
            if (typeof trueColorsRecharge !== 'undefined') {
                this.trueColorsSelector.alpha = 0.5;
                this.trueColorsSelector.inputEnabled = false;
            }
            this.trueColorsSelector.onInputUp.add(function(button, pointer, isOver) {
                if (isOver) {
                    this.launchTrueColors();
                }
            }, this);
            this.trueColorsSelector.label = game.add.bitmapText(this.trueColorsSelector.x, this.trueColorsSelector.y - 20, "euxoi_stroke", "SHIFT", 30);
            this.trueColorsSelector.label.anchor.setTo(0, 1);
            this.trueColorsSelector.label.exists = false;

            this.trueColorsStatus = game.add.text(0, 0, "Playable now!");
            this.trueColorsStatus.exists = false;
            this.trueColorsStatus.anchor.setTo(1, 1);
            this.trueColorsStatus.font = "Oswald";
            this.trueColorsStatus.padding.set(10, 10);
            this.trueColorsStatus.lineSpacing = -10;
            this.trueColorsStatus.align = "center";
            this.trueColorsStatus.addColor('white', 0);
            this.trueColorsStatus.setShadow(2, 2, 'rgba(0, 0, 0, 255)');

            this.trueColorsTitleGroup = game.add.group();

            this.trueColorsTitleBmd = game.make.bitmapData(160, 160);

            this.titleAnimationShuffler = [];
            let listOf1024Numbers = [];
            for (var x = 0; x < 1024; x++)
                listOf1024Numbers.push(x);

            for (var x = 0; x < 1024; x++)
                this.titleAnimationShuffler.push(listOf1024Numbers.splice(Math.floor(Math.random() * listOf1024Numbers.length), 1)[0]);

            this.trueColorsTitleKixel = game.add.sprite(0, 0, this.trueColorsTitleBmd, 0);
            this.trueColorsTitleKixel.anchor.setTo(0.5);
            this.trueColorsTitleKixel.alpha = 0.0;

            this.trueColorsTitleGroup.add(this.trueColorsTitleKixel);

            this.trueColorsLogo = game.add.sprite(0, 0, 'trueColorsLogo');
            this.trueColorsLogo.anchor.setTo(0.5);
            this.trueColorsLogo.alpha = 0.0;
            this.trueColorsTitleGroup.add(this.trueColorsLogo);

            this.trueColorsOptionBacking1 = game.add.sprite(0, 0, 'trueColorsOptionBacking');
            this.trueColorsOptionBacking1.anchor.setTo(0.5);
            this.trueColorsTitleGroup.add(this.trueColorsOptionBacking1);
            this.trueColorsOptionBacking2 = game.add.sprite(0, 0, 'trueColorsOptionBacking');
            this.trueColorsOptionBacking2.anchor.setTo(0.5);
            this.trueColorsTitleGroup.add(this.trueColorsOptionBacking2);

            this.trueColorsSelectedIndex = null;
            this.trueColorsCurrentKixelIndex = -1;

            this.trueColorsButton1 = game.add.button(0, 0, null);
            this.trueColorsButton1.onInputOver.add(function() {
                if (currentState == TRUE_COLORS_TITLE && this.eventTimer > 3000) {
                    if (this.trueColorsSelectedIndex !== 0 && sfxEnabled)
                        game.sfx1.play('trueColorsMenuMove');

                    this.trueColorsSelectedIndex = 0;
                }
            }, this);
            this.trueColorsButton1.onInputDown.add(function() {
                if (currentState == TRUE_COLORS_TITLE && this.trueColorsSelectedIndex == 0) {
                    this.startTrueColors();
                }
                else if (currentState == TRUE_COLORS_GAMEPLAY) {
                    this.trueColorsButton1.isDown = true;
                    if (this.trueColorsControlsEnabled)
                        this.trueColorsSelectPrev();
                }
                else if (currentState == TRUE_COLORS_RESULTS && this.trueColorsEventStep == 9) {
                    this.closeTrueColors();
                }
            }, this);
            this.trueColorsButton1.onInputUp.add(function() {
                this.trueColorsButton1.isDown = false;
            }, this);
            this.trueColorsTitleGroup.add(this.trueColorsButton1);

            this.trueColorsButton2 = game.add.button(0, 0, null);
            this.trueColorsButton2.onInputOver.add(function() {
                if (currentState == TRUE_COLORS_TITLE && this.eventTimer > 3000) {
                    if (this.trueColorsSelectedIndex !== 1 && sfxEnabled)
                        game.sfx1.play('trueColorsMenuMove');

                    this.trueColorsSelectedIndex = 1;
                }
            }, this);
            this.trueColorsButton2.onInputDown.add(function() {
                if (currentState == TRUE_COLORS_TITLE && this.trueColorsSelectedIndex == 1) {
                    this.closeTrueColors();
                }
                else if (currentState == TRUE_COLORS_GAMEPLAY) {
                    this.trueColorsButton2.isDown = true;
                    if (this.trueColorsControlsEnabled)
                        this.trueColorsSelectNext();
                }
            }, this);
            this.trueColorsButton2.onInputUp.add(function() {
                this.trueColorsButton2.isDown = false;
            }, this);
            this.trueColorsTitleGroup.add(this.trueColorsButton1);

            this.trueColorsBmds = [];
            this.trueColorsKixelSprites = game.add.group();
            for (var x = 0; x < 8; x++) {
                var bmd = game.make.bitmapData(160, 160);
                this.trueColorsBmds.push(bmd);
                var bmdSprite = game.add.sprite(0, 0, bmd);
                bmdSprite.index = x;
                bmdSprite.bmd = bmd;
                bmdSprite.anchor.setTo(0.5, 1);
                bmdSprite.y = game.height + bmdSprite.height;
                bmdSprite.exists = false;
                this.trueColorsKixelSprites.add(bmdSprite);
            }
            this.trueColorsCopyBmd = game.make.bitmapData(160, 160);
            this.trueColorsCopySprite = game.add.sprite(0, 0, this.trueColorsCopyBmd);
            this.trueColorsCopySprite.anchor.setTo(0.5, 1);
            this.trueColorsCopySprite.exists = false;

            this.trueColorsExample1 = game.add.sprite(0, 0, 'trueColorsExample', 0);
            this.trueColorsExample1.anchor.setTo(1, 0.5);
            this.trueColorsExample1.exists = false;

            this.trueColorsExample2 = game.add.sprite(0, 0, 'trueColorsExample', 1);
            this.trueColorsExample2.anchor.setTo(0.5, 0.5);
            this.trueColorsExample2.exists = false;

            this.trueColorsExample3 = game.add.sprite(0, 0, 'trueColorsExample', 2);
            this.trueColorsExample3.anchor.setTo(0, 0.5);
            this.trueColorsExample3.exists = false;

            this.trueColorsTextGroup = game.add.group();

            this.trueColorsText1 = game.add.text(0, 0, "START");
            this.trueColorsText1.anchor.setTo(0.5);
            this.trueColorsText1.font = "Oswald";
            this.trueColorsText1.fontWeight = "bold";
            this.trueColorsText1.fontSize = 50;
            this.trueColorsText1.padding.set(10, 10);
            this.trueColorsText1.lineSpacing = -20;
            this.trueColorsText1.align = "center";
            this.trueColorsText1.addColor('white', 0);
            this.trueColorsText1.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.trueColorsText1.wordWrap = true;
            this.trueColorsTextGroup.add(this.trueColorsText1);

            this.trueColorsText2 = game.add.text(0, 0, "FLEE");
            this.trueColorsText2.anchor.setTo(0.5);
            this.trueColorsText2.font = "Oswald";
            this.trueColorsText2.fontWeight = "bold";
            this.trueColorsText2.fontSize = 50;
            this.trueColorsText2.padding.set(10, 10);
            this.trueColorsText2.lineSpacing = -20;
            this.trueColorsText2.align = "center";
            this.trueColorsText2.addColor('white', 0);
            this.trueColorsText2.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.trueColorsText2.wordWrap = true;
            this.trueColorsTextGroup.add(this.trueColorsText2);

            this.trueColorsButton1.x = this.trueColorsText1.x;
            this.trueColorsButton1.y = this.trueColorsText1.y;
            this.trueColorsButton1.width = this.trueColorsText1.width;
            this.trueColorsButton1.height = this.trueColorsText1.height;

            this.trueColorsButton2.x = this.trueColorsText2.x;
            this.trueColorsButton2.y = this.trueColorsText2.y;
            this.trueColorsButton2.width = this.trueColorsText2.width;
            this.trueColorsButton2.height = this.trueColorsText2.height;

            this.trueColorsText3 = game.add.text(0, 0, "( No pausing once it begins! )");
            this.trueColorsText3.anchor.setTo(0.5, 1);
            this.trueColorsText3.font = "Oswald";
            this.trueColorsText3.fontSize = 20;
            this.trueColorsText3.padding.set(10, 10);
            this.trueColorsText3.align = "center";
            this.trueColorsText3.addColor('white', 0);
            this.trueColorsText3.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.trueColorsText3.wordWrap = true;
            this.trueColorsText3.wordWrapWidth = game.width;
            this.trueColorsTextGroup.add(this.trueColorsText3);

            this.trueColorsText4 = game.add.text(0, 0, "Really? During a battle...?");
            this.trueColorsText4.anchor.setTo(0.5, 0);
            this.trueColorsText4.font = "Oswald";
            this.trueColorsText4.fontSize = 30;
            this.trueColorsText4.padding.set(10, 10);
            this.trueColorsText4.lineSpacing = -20;
            this.trueColorsText4.align = "center";
            this.trueColorsText4.addColor('white', 0);
            this.trueColorsText4.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.trueColorsText4.wordWrap = true;
            this.trueColorsText4.wordWrapWidth = game.width;
            this.trueColorsTextGroup.add(this.trueColorsText4);

            this.trueColorsText5 = game.add.text(0, 0, "not set");
            this.trueColorsText5.anchor.setTo(0.5);
            this.trueColorsText5.font = "Oswald";
            this.trueColorsText5.fontWeight = "italic";
            this.trueColorsText5.padding.set(10, 10);
            this.trueColorsText5.lineSpacing = -20;
            this.trueColorsText5.align = "center";
            this.trueColorsText5.addColor('white', 0);
            this.trueColorsText5.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            this.trueColorsTextGroup.add(this.trueColorsText5);

            this.trueColorsMenuIcon = game.add.sprite(0, 0, 'icons', 22);
            this.trueColorsMenuIcon.anchor.setTo(0.5);
            this.trueColorsMenuIcon.alpha = 0.0;
            this.trueColorsTitleGroup.add(this.trueColorsMenuIcon);

            this.trueColorsTitleGroup.setAll('exists', false);
            this.trueColorsTextGroup.setAll('exists', false);
        }
        //

        this.uiGraphics = game.add.graphics(0, 0);

        // interface text stuff
        //this.text = game.add.text(game.width - 300, game.height - 100, device == DESKTOP ? "DESKTOP" : "MOBILE", this.style);
        this.paletteNameText = game.add.bitmapText(this.canvas.right, this.canvas.top + 1, "04b30", "NOT SET YET", 31);
        this.paletteNameText.anchor.setTo(1, 0);

        this.buttonText = game.add.bitmapText(-500, -500, "04b30", "TEXT NOT SET YET", 31);

        this.selectionPreview = game.add.sprite(this.canvas.right, this.canvas.top, this.selectionKixel);

        // virtual cursor
        this.virtualCursor = game.add.sprite(this.canvas.left + (this.canvasScale / 2), this.canvas.top + (this.canvasScale / 2), 'icons', 7);
        this.virtualCursor.anchor.setTo(0.5, 1);
        this.virtualCursor.rotation = 0.4;
        this.virtualCursor.grid = new Phaser.Point(0, 0);
        this.virtualCursor.canvasPosition = new Phaser.Point(0, 0);
        this.virtualCursor.visible = false;

        this.colorUnderCursor = null;

        this.drawerOpen = false;
        this.drawerPosition = 0;

        this.drawer = game.add.button(0, 0, null);
        this.drawer.exists = false;
        this.drawer.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && typeof username !== 'undefined') {
                if (sfxEnabled)
                    game.sfx1.play('drawerOpening');

                this.drawerOpen = true;
                this.trueColorsSelector.exists = true;
                this.trueColorsStatus.exists = true;
                this.drawer.exists = false;
                this.eventTimer = 0;
            }
        }, this);

        this.mainMenu = game.add.sprite(game.width / 2, game.height / 2, null);
        this.mainMenu.anchor.setTo(0.5);
        this.mainMenu.exists = false;

        // main menu elements
        this.mainMenuButtons = game.add.group();
        this.saveMenuButtons = game.add.group();

        this.clearCanvasButton = game.add.button(0, 0, null);
        this.clearCanvasButton.anchor.setTo(0, 0);
        this.clearCanvasButtonText = game.add.bitmapText(this.clearCanvasButton.x, -500, "04b30", "CLEAR", 20);
        this.clearCanvasButtonText.anchor.setTo(1, 1);
        this.clearCanvasButton.icon = game.add.sprite(0, 0, 'icons', 30);
        this.clearCanvasButton.icon.anchor.setTo(0.5);
        this.clearCanvasButton.label = game.add.bitmapText(this.clearCanvasButton.x, this.clearCanvasButton.y - 20, "euxoi_stroke", "Q", 30);
        this.clearCanvasButton.onInputDown.add(function() {
            if (!optionsDown) {
                optionsDown = true;
                this.clearCanvasButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.clearCanvasButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.clearCanvasButton.isDown && isOver && currentState == MAIN_MENU) {
                this.clearCanvasButton.executeButtonFunction();
            }

            optionsDown = false;
            this.clearCanvasButton.isDown = false;
        }, this);
        this.clearCanvasButton.executeButtonFunction = function() {
            if (sfxEnabled)
                game.sfx2.play('startClear');

            game.music.stop();

            clearMode = clearModes[Math.floor(Math.random() * clearModes.length)];

            this.mainMenu.exists = false;
            this.drawerOpen = false;
            this.drawerPosition = 0;
            this.trueColorsSelector.exists = false;
            this.trueColorsSelector.label.exists = false;
            this.trueColorsStatus.exists = false;

            currentState = CLEARING;
            controlsDisabled = true;
            clearStep = 0;
            this.eventTimer = 0;
            this.mainMenuButtons.setAll('exists', false);
        };
        this.clearCanvasButton.executeButtonFunction = this.clearCanvasButton.executeButtonFunction.bind(this);
        this.mainMenuButtons.add(this.clearCanvasButton);
        this.mainMenuButtons.add(this.clearCanvasButton.icon);
        this.mainMenuButtons.add(this.clearCanvasButtonText);
        this.mainMenuButtons.add(this.clearCanvasButton.label);

        this.offsetButton = game.add.button(0, 0, null);
        this.offsetButton.anchor.setTo(0.5, 0);
        this.offsetButtonText = game.add.bitmapText(this.offsetButton.x, -500, "04b30", "OFFSET", 20);
        this.offsetButtonText.anchor.setTo(1, 1);
        this.offsetButton.icon = game.add.sprite(0, 0, 'icons', 31);
        this.offsetButton.icon.anchor.setTo(0.5);
        this.offsetButton.label = game.add.bitmapText(this.offsetButton.x, this.offsetButton.y - 20, "euxoi_stroke", "W", 30);
        this.offsetButton.onInputDown.add(function() {
            if (!optionsDown) {
                optionsDown = true;
                this.offsetButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.offsetButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.offsetButton.isDown && isOver && currentState == MAIN_MENU)
                this.offsetButton.executeButtonFunction();

            optionsDown = false;
            this.offsetButton.isDown = false;
        }, this);
        this.offsetButton.executeButtonFunction = function() {
            if (sfxEnabled)
                game.sfx2.play('openOffsetMenu');

            if (device == MOBILE) {
                this.canvas.intendedX = window.innerWidth / 2;

                if (radioIsOpen) {
                    if (axis == LANDSCAPE) {
                        this.canvas.intendedY = (window.innerHeight - 45) / 2;
                    }
                    else if (axis == PORTRAIT) {
                        this.canvas.intendedY = window.innerHeight * 0.9 / 2;
                    }
                }
                else {
                    this.canvas.intendedY = window.innerHeight / 2;
                }
            }

            if (axis == LANDSCAPE) {
                this.preview.intendedX = 0 - this.preview.width - 30;
                this.preview.intendedY = this.canvas.top;
            }
            else if (axis == PORTRAIT) {
                this.preview.intendedX = this.canvas.left;
                this.preview.intendedY = 0 - this.preview.height - 30;
            }

            this.colorSelectors.forEach(function(selector) {
                if (axis == PORTRAIT) {
                    selector.intendedY = 0 - selector.height - 30;
                }
                else if (axis == LANDSCAPE) {
                    selector.intendedX = 0 - selector.width - 30;
                }
            }, this);
            this.buttons.forEach(function(button) {
                if (axis == PORTRAIT) {
                    button.intendedY = game.height + button.height + 5;
                }
                else if (axis == LANDSCAPE) {
                    button.intendedX = game.width + button.width + 5;
                }
            }, this);

            var availableHeight = this.getAvailableHeight();

            this.offsetUpButton.exists = true;
            this.offsetDownButton.exists = true;
            this.offsetLeftButton.exists = true;
            this.offsetRightButton.exists = true;
            this.cancelOffsetButton.exists = true;
            this.confirmOffsetButton.exists = true;

            if (axis == PORTRAIT) {
                let halfWidth = ((game.width / 2) - (this.canvasScale * 32 * 0.6 / 2) - this.offsetLeftButton.width) / 2;
                this.offsetUpButton.intendedY = (availableHeight / 2) - (this.canvasScale * 32 * 0.6 / 2) - halfWidth;
                this.offsetDownButton.intendedY = (availableHeight / 2) + (this.canvasScale * 32 * 0.6 / 2) + halfWidth;
                this.offsetLeftButton.intendedX = (game.width / 2) - (this.canvasScale * 32 * 0.6 / 2) - halfWidth;
                this.offsetRightButton.intendedX = (game.width / 2) + (this.canvasScale * 32 * 0.6 / 2) + halfWidth;
            }
            else if (axis == LANDSCAPE) {
                let halfHeight = ((availableHeight / 2) - (this.canvasScale * 32 * 0.6 / 2) - this.offsetUpButton.height) / 2;
                this.offsetUpButton.intendedY = (availableHeight / 2) - (this.canvasScale * 32 * 0.6 / 2) - halfHeight;
                this.offsetDownButton.intendedY = (availableHeight / 2) + (this.canvasScale * 32 * 0.6 / 2) + halfHeight;
                this.offsetLeftButton.intendedX = (game.width / 2) - (this.canvasScale * 32 * 0.6 / 2) - halfHeight;
                this.offsetRightButton.intendedX = (game.width / 2) + (this.canvasScale * 32 * 0.6 / 2) + halfHeight;
            }
            

            this.maskProduct.copy(this.kixel);
            this.maskProduct.update();
            this.canvasMaskProduct.copy(this.canvasKixel);

            currentState = OFFSET_MENU;
            this.mainMenuButtons.setAll('exists', false);
            this.drawerOpen = false;
            this.drawerPosition = 0;
            this.trueColorsSelector.exists = false;
            this.trueColorsSelector.label.exists = false;
            this.trueColorsStatus.exists = false;
        };
        this.offsetButton.executeButtonFunction = this.offsetButton.executeButtonFunction.bind(this);
        this.mainMenuButtons.add(this.offsetButton);
        this.mainMenuButtons.add(this.offsetButton.icon);
        this.mainMenuButtons.add(this.offsetButtonText);
        this.mainMenuButtons.add(this.offsetButton.label);

        this.symmetryButton = game.add.button(0, 0, null);
        this.symmetryButton.anchor.setTo(1, 0);
        this.symmetryButtonText = game.add.bitmapText(this.symmetryButton.x, -500, "04b30", "SYMMETRY", 20);
        this.symmetryButtonText.anchor.setTo(1, 1);
        this.symmetryButton.icon = game.add.sprite(0, 0, 'icons', 35);
        this.symmetryButton.icon.anchor.setTo(0.5);
        this.symmetryButton.label = game.add.bitmapText(this.symmetryButton.x, this.symmetryButton.y - 20, "euxoi_stroke", "E", 30);
        this.symmetryButton.onInputDown.add(function(button, pointer, isOver) {
            if (!optionsDown) {
                optionsDown = true;
                this.symmetryButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.symmetryButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.symmetryButton.isDown && isOver && currentState == MAIN_MENU)
                this.symmetryButton.executeButtonFunction();

            optionsDown = false;
            this.symmetryButton.isDown = false;
        }, this);
        this.symmetryButton.executeButtonFunction = function() {
            switch (symmetryMode) {
                case SYM_NONE:
                    symmetryMode = SYM_X;
                    this.symmetryButton.icon.frame = 36;
                    if (sfxEnabled)
                        game.sfx2.play('symmetryX');
                    break;
                case SYM_X:
                    symmetryMode = SYM_Y;
                    this.symmetryButton.icon.frame = 37;
                    if (sfxEnabled)
                        game.sfx2.play('symmetryY');
                    break;
                case SYM_Y:
                    symmetryMode = SYM_BOTH;
                    this.symmetryButton.icon.frame = 38;
                    if (sfxEnabled)
                        game.sfx2.play('symmetryBoth');
                    break;
                case SYM_BOTH:
                    symmetryMode = SYM_NONE;
                    this.symmetryButton.icon.frame = 35;
                    if (sfxEnabled)
                        game.sfx2.play('symmetryNone');
                    break;
            }

            this.symmetryButton.isDown = false;
        };
        this.symmetryButton.executeButtonFunction = this.symmetryButton.executeButtonFunction.bind(this);
        this.mainMenuButtons.add(this.symmetryButton);
        this.mainMenuButtons.add(this.symmetryButton.icon);
        this.mainMenuButtons.add(this.symmetryButtonText);
        this.mainMenuButtons.add(this.symmetryButton.label);

        this.gridButton = game.add.button(0, 0, null);
        this.gridButton.buttonDown = false;
        this.gridButtonText = game.add.bitmapText(this.gridButton.x, -500, "04b30", "GRID", 20);
        this.gridButtonText.anchor.setTo(1, 1);
        this.gridButton.icon = game.add.sprite(0, 0, 'icons', 10);
        this.gridButton.icon.anchor.setTo(0.5);
        this.gridButton.label = game.add.bitmapText(this.gridButton.x, this.gridButton.y - 20, "euxoi_stroke", "A", 30);
        this.gridButton.onInputDown.add(function(button, pointer, isOver) {
            if (!optionsDown) {
                optionsDown = true;
                this.gridButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.gridButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.gridButton.isDown && isOver && currentState == MAIN_MENU)
                this.gridButton.executeButtonFunction();

            optionsDown = false;
            this.gridButton.isDown = false;
        }, this);
        this.gridButton.executeButtonFunction = function() {
            gridMode++;
            if (gridMode > OFF)
                gridMode = EVEN;

            if (sfxEnabled) {
                switch (gridMode) {
                    case EVEN: game.sfx2.play('changeGrid1'); this.gridButton.icon.frame = 10; break;
                    case SEGMENTS: game.sfx2.play('changeGrid2'); this.gridButton.icon.frame = 11; break;
                    case OFF: game.sfx2.play('changeGrid3'); this.gridButton.icon.frame = 12; break;
                }
            }
            this.drawGrid(this.canvas.width);
        }
        this.gridButton.executeButtonFunction = this.gridButton.executeButtonFunction.bind(this);
        this.mainMenuButtons.add(this.gridButton);
        this.mainMenuButtons.add(this.gridButtonText);
        this.mainMenuButtons.add(this.gridButton.icon);
        this.mainMenuButtons.add(this.gridButton.label);

        this.audioButton = game.add.button(0, 0, null);
        this.audioButton.anchor.setTo(1, 0);
        this.audioButtonText = game.add.bitmapText(this.audioButton.x, -500, "04b30", "AUDIO", 20);
        this.audioButtonText.anchor.setTo(1, 1);
        this.audioButton.icon = game.add.sprite(0, 0, 'icons', 25);
        this.audioButton.icon.anchor.setTo(0.5);
        this.audioButton.label = game.add.bitmapText(this.audioButton.x, this.audioButton.y - 20, "euxoi_stroke", "S", 30);
        this.audioButton.onInputDown.add(function(button, pointer, isOver) {
            if (!optionsDown) {
                optionsDown = true;
                this.audioButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.audioButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.audioButton.isDown && isOver && currentState == MAIN_MENU)
                this.audioButton.executeButtonFunction();

            optionsDown = false;
            this.audioButton.isDown = false;
        }, this);
        this.audioButton.executeButtonFunction = function() {
            audioMode++;
            if (audioMode > NO_AUDIO)
                audioMode = MUSIC_SFX;

            if (audioMode == MUSIC_SFX) {
                musicEnabled = true;
                sfxEnabled = true;

                game.music.play('', 0, songVolume, true);
                audioStartTime = this.game.time.time;
                lastReportedTime = game.music.currentTime;

                this.audioButton.icon.frame = 25;
            }
            else if (audioMode == RADIO_SFX) {
                musicEnabled = false;
                sfxEnabled = true;

                game.music.stop();
                openRadio();
                setRadioVolume(null, 0.7);
                this.resizeScreen();

                this.audioButton.icon.frame = 43;
            }
            else if (audioMode == SFX_ONLY) {
                musicEnabled = false;
                sfxEnabled = true;

                game.music.stop();
                closeRadio(true);
                this.resizeScreen();
                
                this.audioButton.icon.frame = 26;
            }
            else {
                musicEnabled = false;
                sfxEnabled = false;
                this.audioButton.icon.frame = 27;
                
            }
        };
        this.audioButton.executeButtonFunction = this.audioButton.executeButtonFunction.bind(this);
        this.mainMenuButtons.add(this.audioButton);
        this.mainMenuButtons.add(this.audioButton.icon);
        this.mainMenuButtons.add(this.audioButtonText);
        this.mainMenuButtons.add(this.audioButton.label);

        this.saveButton = game.add.button(0, 0, null);
        this.saveButtonText = game.add.bitmapText(this.saveButton.x, -500, "04b30", "SAVE", 20);
        this.saveButtonText.anchor.setTo(1, 1);
        this.saveButton.icon = game.add.sprite(0, 0, 'icons', 13);
        this.saveButton.icon.anchor.setTo(0.5);
        this.saveButton.label = game.add.bitmapText(this.saveButton.x, this.saveButton.y - 20, "euxoi_stroke", "Z", 30);
        this.saveButton.onInputDown.add(function(button, pointer, isOver) {
            if (!optionsDown) {
                optionsDown = true;
                this.saveButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.saveButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.saveButton.isDown && isOver && currentState == MAIN_MENU)
                this.saveButton.executeButtonFunction();

            optionsDown = false;
            this.saveButton.isDown = false;
        }, this);
        this.saveButton.executeButtonFunction = function() {
            currentState = SAVE_MENU;

            if (sfxEnabled)
                game.sfx2.play('openSaveMenu');

            this.mainMenuButtons.setAll('exists', false);
            this.saveMenuButtons.setAll('exists', true);
            this.cancelButton.exists = true;
        };
        this.saveButton.executeButtonFunction = this.saveButton.executeButtonFunction.bind(this);
        this.mainMenuButtons.add(this.saveButton);
        this.mainMenuButtons.add(this.saveButton.icon);
        this.mainMenuButtons.add(this.saveButtonText);
        this.mainMenuButtons.add(this.saveButton.label);

        this.saveLittleButton = game.add.button(0, 0, null);
        this.saveLittleButton.anchor.setTo(0, 0);
        this.saveLittleButtonText = game.add.bitmapText(this.saveButton.x, -500, "04b30", "LITTLE", 20);
        this.saveLittleButtonText.anchor.setTo(1, 1);
        this.saveLittleButton.icon = game.add.sprite(0, 0, this.kixel);
        this.saveLittleButton.icon.anchor.setTo(0.5);
        this.saveLittleButton.label = game.add.bitmapText(this.saveLittleButton.x, this.saveLittleButton.y - 20, "euxoi_stroke", "Q", 30);
        this.saveLittleButton.onInputDown.add(function(button, pointer, isOver) {
            if (!optionsDown) {
                optionsDown = true;
                this.saveLittleButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.saveLittleButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.saveLittleButton.isDown && isOver && currentState == SAVE_MENU)
                this.saveLittleButton.executeButtonFunction();

            optionsDown = false;
            this.saveLittleButton.isDown = false;
        }, this);
        this.saveLittleButton.executeButtonFunction = function() {
            if (sfxEnabled)
                game.sfx2.play('saveKixel');

            this.saveKixelToComputer(false);

            currentState = MAIN_MENU;

            this.mainMenuButtons.setAll('exists', true);
            this.saveMenuButtons.setAll('exists', false);
        };
        this.saveLittleButton.executeButtonFunction = this.saveLittleButton.executeButtonFunction.bind(this);
        this.saveMenuButtons.add(this.saveLittleButton);
        this.saveMenuButtons.add(this.saveLittleButton.icon);
        this.saveMenuButtons.add(this.saveLittleButtonText);
        this.saveMenuButtons.add(this.saveLittleButton.label);

        this.saveBigButton = game.add.button(0, 0, null);
        this.saveBigButton.anchor.setTo(1, 0);
        this.saveBigButtonText = game.add.bitmapText(0, 0, "04b30", "BIG", 20);
        this.saveBigButtonText.anchor.setTo(1, 1);
        this.saveBigButton.icon = game.add.sprite(0, 0, this.canvasKixel);
        this.saveBigButton.icon.anchor.setTo(0.5);
        this.saveBigButton.label = game.add.bitmapText(this.saveBigButton.x, this.saveBigButton.y - 20, "euxoi_stroke", "W", 30);
        this.saveBigButton.onInputDown.add(function(button, pointer, isOver) {
            if (!optionsDown) {
                optionsDown = true;
                this.saveBigButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.saveBigButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.saveBigButton.isDown && isOver && currentState == SAVE_MENU)
                this.saveBigButton.executeButtonFunction();

            optionsDown = false;
            this.saveBigButton.isDown = false;
        }, this);
        this.saveBigButton.executeButtonFunction = function() {
            if (sfxEnabled)
                game.sfx2.play('saveKixel');

            this.saveKixelToComputer(true);

            currentState = MAIN_MENU;

            this.mainMenuButtons.setAll('exists', true);
            this.saveMenuButtons.setAll('exists', false);
        };
        this.saveBigButton.executeButtonFunction = this.saveBigButton.executeButtonFunction.bind(this);
        this.saveMenuButtons.add(this.saveBigButton);
        this.saveMenuButtons.add(this.saveBigButton.icon);
        this.saveMenuButtons.add(this.saveBigButtonText);
        this.saveMenuButtons.add(this.saveBigButton.label);

        this.loadButton = game.add.button(0, 0, null);
        this.loadButton.anchor.setTo(1, 0);
        this.loadButtonText = game.add.bitmapText(this.loadButton.x, -500, "04b30", "LOAD", 20);
        this.loadButtonText.anchor.setTo(1, 1);
        this.loadButton.icon = game.add.sprite(0, 0, 'icons', 14);
        this.loadButton.icon.anchor.setTo(0.5);
        this.loadButton.label = game.add.bitmapText(this.loadButton.x, this.loadButton.y - 20, "euxoi_stroke", "X", 30);
        this.loadButton.onInputDown.add(function(button, pointer, isOver) {
            if (!optionsDown) {
                optionsDown = true;
                this.loadButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.loadButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.loadButton.isDown && isOver && currentState == MAIN_MENU)
                this.loadButton.executeButtonFunction();

            optionsDown = false;
            this.loadButton.isDown = false;
        }, this);
        this.loadButton.executeButtonFunction = function() {
            if (sfxEnabled)
                game.sfx2.play('openLoadMenu');

            this.fileInput.click();
        };
        this.loadButton.executeButtonFunction = this.loadButton.executeButtonFunction.bind(this);
        this.mainMenuButtons.add(this.loadButton);
        this.mainMenuButtons.add(this.loadButton.icon);
        this.mainMenuButtons.add(this.loadButtonText);
        this.mainMenuButtons.add(this.loadButton.label);

        this.submitButton = game.add.button(0, 0, null);
        this.submitButton.anchor.setTo(1, 1);
        this.submitButtonTextShadow = game.add.bitmapText(0, 0, "04b30", "SUBMIT KIXEL", 20);
        this.submitButtonTextShadow.anchor.setTo(0.5);
        this.submitButtonText = game.add.bitmapText(0, 0, "04b30-white", "SUBMIT KIXEL", 20);
        this.submitButtonText.anchor.setTo(0.5);
        this.submitButton.onInputDown.add(function() {
            if (!optionsDown) {
                optionsDown = true;
                this.submitButton.isDown = true;

                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.submitButton.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.submitButton.isDown) {
                if (currentState == SUBMISSION_MENU) {
                    if (document.getElementById('kixel-program-title-field').value.length > 0) {
                        title = document.getElementById('kixel-program-title-field').value;
                        description = document.getElementById('kixel-program-description-field').value;
                        this.submitKixel();
                    }
                    else {
                        if (sfxEnabled)
                            game.sfx2.play('menuBack');
                    }
                }
                else if (currentState == MAIN_MENU) {
                    this.openSubmissionMenu();
                }
                
            }

            optionsDown = false;
            this.submitButton.isDown = false;
        }, this);
        this.submitButton.label = game.add.bitmapText(this.submitButton.x, this.submitButton.y - 20, "euxoi_stroke", "ENTER", 30);

        this.mainMenuButtons.add(this.submitButton);
        this.mainMenuButtons.add(this.submitButtonTextShadow);
        this.mainMenuButtons.add(this.submitButtonText);
        this.mainMenuButtons.add(this.submitButton.label);
        
        this.mainMenuButtons.setAll('exists', false);
        this.saveMenuButtons.setAll('exists', false);

        // submission menu elements
        this.titleText = game.add.bitmapText(0, 0, "euxoi", "TITLE", 40);
        this.titleText.exists = false;
        this.titleText.anchor.setTo(0.5);

        this.descriptionText = game.add.bitmapText(0, 0, "euxoi", "DESCRIPTION\n(optional, max 300 characters)", 40);
        this.descriptionText.align = "center";
        this.descriptionText.exists = false;
        this.descriptionText.anchor.setTo(0.5);

        this.titleLabel = game.add.bitmapText(0, 0, "euxoi_stroke", "UP");
        this.titleLabel.exists = false;
        this.descriptionLabel = game.add.bitmapText(0, 0, "euxoi_stroke", "DOWN");
        this.descriptionLabel.exists = false;

        this.cancelButton = game.add.button(0, 0, null);
        this.cancelButton.width = game.width / 4 * 3 / 4;
        this.cancelButton.height = 40;
        this.cancelButton.anchor.setTo(0, 1);
        this.cancelButton.onInputDown.add(function(button, pointer, isOver) {
            if (!optionsDown) {
                optionsDown = true;
                this.cancelButton.isDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.cancelButton.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.cancelButton.isDown) {
                this.cancelButton.executeButtonFunction();
            }
            this.cancelButton.isDown = false;
            optionsDown = false;
        }, this);
        this.cancelButton.inputEnabled = false;
        this.cancelButton.executeButtonFunction = function(button, pointer, isOver) {
            this.cancelButton.isDown = false;

            if (currentState == MAIN_MENU) {
                currentState = PAINTING;
                this.mainMenu.exists = false;
                controlsDisabled = false;

                if (device === MOBILE || controlType === KEYBOARD) {
                    this.virtualCursor.visible = true;
                    this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                    this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
                }

                this.colorSelectors.forEach(function(button) {
                    button.inputEnabled = true;
                    button.input.useHandCursor = true;
                }, this);
                this.buttons.forEach(function(button) {
                    button.inputEnabled = true;
                    button.input.useHandCursor = true;
                }, this);

                this.mainMenuButtons.setAll('exists', false);
                this.drawerOpen = false;
                this.drawerPosition = 0;
                this.trueColorsSelector.exists = false;
                this.trueColorsSelector.label.exists = false;
                this.trueColorsStatus.exists = false;

                if (sfxEnabled)
                    game.sfx2.play('jawharp');
            }
            else {
                if (currentState == SUBMISSION_MENU || currentState == SAVE_MENU) {
                    currentState = MAIN_MENU;
                    this.mainMenuButtons.setAll('exists', true);
                    this.saveMenuButtons.setAll('exists', false);
                    this.submitButtonText.exists = true;
                    this.titleText.exists = false;
                    this.descriptionText.exists = false;

                    if (musicEnabled)
                        game.music.resume();

                    if (sfxEnabled)
                        game.sfx2.play('menuBack');

                    this.submitButton.width = this.mainMenu.width - (this.mainMenu.width / 8) - 30;
                    this.submitButton.height = (this.mainMenu.height / 4) - 40;

                    if (typeof username === 'undefined') {
                        this.submitButton.exists = false;
                        this.submitButtonText.setText("LOG IN TO SUBMIT");
                        this.submitButtonTextShadow.setText("LOG IN TO SUBMIT");
                    }
                    else if (typeof haunted !== 'undefined' && numColorsUsed > 5) {
                        this.submitButton.exists = false;
                        this.submitButtonText.setText("5 COLORS ONLY!");
                        this.submitButtonTextShadow.setText("5 COLORS ONLY!");
                    }
                    else {
                        this.submitButton.inputEnabled = true;
                        this.submitButton.input.useHandCursor = true;
                    }

                    document.getElementById('kixel-program-title-field').style.left = "0%";
                    document.getElementById('kixel-program-title-field').style.top = "-100%";
                    document.getElementById('kixel-program-title-field').blur();

                    document.getElementById('kixel-program-description-field').style.left = "0%";
                    document.getElementById('kixel-program-description-field').style.top = "-100%";
                    document.getElementById('kixel-program-description-field').blur();

                    this.descriptionText.x = this.mainMenu.left + 10;
                    this.descriptionText.y = this.titleText.bottom + 10;
                }

                this.titleText.exists = false;
                this.descriptionText.exists = false;
            }
        };
        this.cancelButton.executeButtonFunction = this.cancelButton.executeButtonFunction.bind(this);
        this.cancelButton.label = game.add.bitmapText(this.cancelButton.x, this.cancelButton.y - 20 + (this.cancelButton.isDown ? OPTION_DOWN_OFFSET : 0), "euxoi_stroke", "ESC", 30);
        this.cancelButton.label.exists = false;
        this.mainMenuButtons.add(this.cancelButton);
        this.mainMenuButtons.add(this.cancelButton.label);

        this.openingWindow = game.add.sprite((-game.width * 2) + 3, game.height / 2, null);
        this.openingWindow.anchor.setTo(0.5);
        
        this.openingWindow.intendedX = game.width / 2;
        this.openingWindow.intendedY = game.height / 2;

        if (typeof username !== 'undefined') {
            loggedInName = username;
            this.openingWindowUsernameText = game.add.bitmapText(0, -500, "euxoi", "USER:\n" + loggedInName, 50);
            this.openingWindowStatsText = game.add.bitmapText(0, -500, "euxoi", userStats, 40);
            this.openingWindowStatsText.maxWidth = (game.width) / 2 - 10;
        }
        else {
            loggedInName = "NOT\nLOGGED\nIN";
            this.openingWindowUsernameText = game.add.bitmapText(0, -500, "euxoi", loggedInName, 50);
            this.openingWindowStatsText = game.add.bitmapText(0, -500, "euxoi", "", 40);
        }
        
        this.openingWindowUsernameText.anchor.setTo(1, 0);
        this.openingWindowUsernameText.align = 'right';
        this.openingWindowStatsText.anchor.setTo(1, 0);
        this.openingWindowStatsText.align = 'right';

        if (typeof compoNumber !== 'undefined') {
            this.openingWindowBattleText = game.add.bitmapText(0, -500, "euxoi", "BATTLE:\n" + get("kixel-compo-title").innerHTML, 50);
            this.openingWindowBattleText.anchor.setTo(1, 0);
            this.openingWindowBattleText.align = 'right';
            this.openingWindowBattleText.maxWidth = (game.width / 2) - 10;
            this.openingWindowCompoType = game.add.bitmapText(0, -500, "euxoi",  get("kixel-compo-type").innerHTML, 40);
            this.openingWindowCompoType.anchor.setTo(1, 0);
            this.openingWindowCompoType.maxWidth = (game.width / 2) - 10;
            this.openingWindowCompoIcon = game.add.sprite(0, -500, 'compoIcon');
            this.openingWindowCompoIcon.anchor.setTo(0, 0);
            this.openingWindowCompoIcon.tint = 0;
        }

        this.phaserLogo = game.add.sprite(0, -500, 'phaserLogo');
        this.phaserLogo.anchor.setTo(0, 1);

        this.openingWindowNotice = game.add.bitmapText(0, game.height + 500, "04b30", "NOTICE", 40);
        this.openingWindowNotice.anchor.setTo(0.5);
        this.openingWindowNotice.align = 'center';
        this.openingWindowText = game.add.bitmapText(0, game.height + 500, "euxoi", "Not set yet", 32);
        this.openingWindowText.anchor.setTo(0.5);
        this.openingWindowText.intendedY = this.openingWindow.bottom - 20;

        this.arrow1 = game.add.sprite(-100, -100, 'icons', 28);
        this.arrow1.anchor.setTo(1, 1);
        this.arrow2 = game.add.sprite(-100, -100, 'icons', 28);
        this.arrow2.anchor.setTo(0, 1);

        if (typeof errorMessage !== 'undefined') {
            //this.openingWindow.y = -game.height * 2;
            this.openingWindowText.setText(errorMessage);
        }
        if (typeof maxKixelNotice !== 'undefined' && typeof compoNumber == 'undefined') {
            //this.openingWindow.y = -game.height * 2;
            this.openingWindowText.setText(maxKixelNotice);
            errorMessage = maxKixelNotice;
        }

        this.avatarKixel = game.add.image(-100, -100, 'playerAvatar');
        this.avatarKixel.anchor.setTo(0);

        this.audioButton1 = game.add.button(0, -200, 'icons');
        if (radioIsOpen)
            this.audioButton1.frame = 43;
        else
            this.audioButton1.frame = 25;

        this.audioButton1.anchor.setTo(0.5);
        this.audioButton1.onInputDown.add(function() {
            this.audioButton1.isDown = true;
        }, this);
        this.audioButton1.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.audioButton1.isDown) {
                this.startEditor(0);
            }
            this.audioButton1.isDown = false;
        }, this);
        this.audioButton1.label = game.add.bitmapText(0, 0, "euxoi_stroke", "1", 24);
        if (device == MOBILE)
            this.audioButton1.label.exists = false;
        this.audioButton2 = game.add.button(0, -300, 'icons');
        this.audioButton2.frame = 26;
        this.audioButton2.anchor.setTo(0.5);
        this.audioButton2.onInputDown.add(function() {
            this.audioButton2.isDown = true;
        }, this);
        this.audioButton2.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.audioButton2.isDown) {
                this.startEditor(1);
            }
        }, this);
        this.audioButton2.label = game.add.bitmapText(0, 0, "euxoi_stroke", "2", 24);
        if (device == MOBILE)
            this.audioButton2.label.exists = false;
        this.audioButton3 = game.add.button(0, -400, 'icons');
        this.audioButton3.frame = 27;
        this.audioButton3.anchor.setTo(0.5);
        this.audioButton3.onInputDown.add(function() {
            this.audioButton3.isDown = true;
        }, this);
        this.audioButton3.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.audioButton3.isDown) {
                this.startEditor(2);
            }
        }, this);
        this.audioButton3.label = game.add.bitmapText(0, 0, "euxoi_stroke", "3", 24);
        if (device == MOBILE)
            this.audioButton3.label.exists = false;
        this.audioButton1.intendedY = game.height / 2;
        this.audioButton2.intendedY = game.height / 2;
        this.audioButton3.intendedY = game.height / 2;

        // offset buttons
        this.offsetUpButton = game.add.button(game.width / 2, -game.height / 10, null);
        this.offsetUpButton.exists = false;
        this.offsetUpButton.anchor.setTo(0.5, 1);
        this.offsetUpButton.width = game.width * 0.8;
        this.offsetUpButton.height = game.height * 0.1;
        this.offsetUpButton.intendedX = null;
        this.offsetUpButton.intendedY = null;
        this.offsetUpButton.onInputDown.add(function () {
            if (!optionsDown) {
                this.offsetUpButton.isDown = true;
                optionsDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.offsetUpButton.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.offsetUpButton.isDown) {
                this.offsetKixel("up");
            }
            this.offsetUpButton.isDown = false;
            optionsDown = false;
        }, this);
        this.offsetUpButton.icon = game.add.sprite(this.offsetUpButton.centerX, this.offsetUpButton.centerY, 'icons', 45);
        this.offsetUpButton.icon.anchor.setTo(0.5);

        this.offsetDownButton = game.add.button(game.width / 2, game.height + (game.height / 10), null);
        this.offsetDownButton.exists = false;
        this.offsetDownButton.anchor.setTo(0.5, 0);
        this.offsetDownButton.width = game.width * 0.8;
        this.offsetDownButton.height = game.height * 0.1;
        this.offsetDownButton.intendedX = null;
        this.offsetDownButton.intendedY = null;
        this.offsetDownButton.onInputDown.add(function () {
            if (!optionsDown) {
                this.offsetDownButton.isDown = true;
                optionsDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.offsetDownButton.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.offsetDownButton.isDown) {
                this.offsetKixel("down");
            }
            this.offsetDownButton.isDown = false;
            optionsDown = false;
        }, this);
        this.offsetDownButton.icon = game.add.sprite(this.offsetDownButton.centerX, this.offsetDownButton.centerY, 'icons', 45);
        this.offsetDownButton.icon.anchor.setTo(0.5);
        this.offsetDownButton.icon.angle = 180;

        this.offsetLeftButton = game.add.button(-game.width / 10, game.height / 2, null);
        this.offsetLeftButton.exists = false;
        this.offsetLeftButton.anchor.setTo(1, 0.5);
        this.offsetLeftButton.width = game.width * 0.1;
        this.offsetLeftButton.height = game.height * 0.8;
        this.offsetLeftButton.intendedX = null;
        this.offsetLeftButton.intendedY = null;
        this.offsetLeftButton.onInputDown.add(function () {
            if (!optionsDown) {
                this.offsetLeftButton.isDown = true;
                optionsDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.offsetLeftButton.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.offsetLeftButton.isDown) {
                this.offsetKixel("left");
            }
            this.offsetLeftButton.isDown = false;
            optionsDown = false;
        }, this);
        this.offsetLeftButton.icon = game.add.sprite(this.offsetLeftButton.centerX, this.offsetLeftButton.centerY, 'icons', 45);
        this.offsetLeftButton.icon.anchor.setTo(0.5);
        this.offsetLeftButton.icon.angle = 270;

        this.offsetRightButton = game.add.button(game.width + (game.width / 10), game.height / 2, null);
        this.offsetRightButton.exists = false;
        this.offsetRightButton.anchor.setTo(0, 0.5);
        this.offsetRightButton.width = game.width * 0.1;
        this.offsetRightButton.height = game.height * 0.8;
        this.offsetRightButton.intendedX = null;
        this.offsetRightButton.intendedY = null;
        this.offsetRightButton.onInputDown.add(function () {
            if (!optionsDown) {
                this.offsetRightButton.isDown = true;
                optionsDown = true;
                if (sfxEnabled)
                    game.sfx1.play('optionDown');
            }
        }, this);
        this.offsetRightButton.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.offsetRightButton.isDown) {
                this.offsetKixel("right");
            }
            this.offsetRightButton.isDown = false;
            optionsDown = false;
        }, this);
        this.offsetRightButton.icon = game.add.sprite(this.offsetRightButton.centerX, this.offsetRightButton.centerY, 'icons', 45);
        this.offsetRightButton.icon.anchor.setTo(0.5);
        this.offsetRightButton.icon.angle = 90;

        this.cancelOffsetButton = game.add.button(0, 0, null);
        this.cancelOffsetButton.exists = false;
        this.cancelOffsetButton.anchor.setTo(1, 0);
        this.cancelOffsetButton.onInputDown.add(function () {
            this.cancelOffsetButton.isDown = true;
            optionsDown = true;
            if (sfxEnabled)
                game.sfx1.play('optionDown');
        }, this);
        this.cancelOffsetButton.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.cancelOffsetButton.isDown) {
                this.cancelOffsetButton.executeButtonFunction();
            }
            this.cancelOffsetButton.isDown = false;
            optionsDown = false;
        }, this);
        this.cancelOffsetButton.executeButtonFunction = function() {
            currentState = PAINTING;
            this.virtualCursor.visible = false;

            if (sfxEnabled)
                game.sfx2.play('closeOffsetMenu');

            if (device == MOBILE) {
                if (axis == PORTRAIT)
                    this.canvas.intendedX = game.width / 2;
                else if (axis == LANDSCAPE)
                    this.canvas.intendedX = (game.width / 2) - (game.width * 0.05);


                if (radioIsOpen) {
                    if (axis == LANDSCAPE) {
                        this.canvas.intendedY = (window.innerHeight - 45) / 2;
                    }
                    else if (axis == PORTRAIT) {
                        this.canvas.intendedY = window.innerHeight * 0.9 / 2;
                    }
                }
                else {
                    this.canvas.intendedY = window.innerHeight / 2;
                }
            }

            this.colorSelectors.forEach(function(button) {
                button.inputEnabled = true;
                button.input.useHandCursor = true;
            }, this);
            this.buttons.forEach(function(button) {
                button.inputEnabled = true;
                button.input.useHandCursor = true;
            }, this);

            this.offsetUpButton.exists = false;
            this.offsetDownButton.exists = false;
            this.offsetLeftButton.exists = false;
            this.offsetRightButton.exists = false;
            this.cancelOffsetButton.exists = false;
            this.confirmOffsetButton.exists = false;

            this.offsetUpButton.intendedY = -20;
            this.offsetDownButton.intendedY = game.height + 20;
            this.offsetLeftButton.intendedX = -20;
            this.offsetRightButton.intendedX = game.width + 20;

            this.maskProduct.clear();
            this.maskProduct.update();
            this.canvasMaskProduct.clear();
        };
        this.cancelOffsetButton.executeButtonFunction = this.cancelOffsetButton.executeButtonFunction.bind(this);
        this.cancelOffsetButton.icon = game.add.sprite(0, 0, 'icons', 46);
        this.cancelOffsetButton.icon.anchor.setTo(0.5);

        this.confirmOffsetButton = game.add.button(0, 0, null);
        this.confirmOffsetButton.exists = false;
        this.confirmOffsetButton.anchor.setTo(0, 0);
        this.confirmOffsetButton.onInputDown.add(function () {
            this.confirmOffsetButton.isDown = true;
            optionsDown = true;
            if (sfxEnabled)
                game.sfx1.play('optionDown');
        }, this);
        this.confirmOffsetButton.onInputUp.add(function(button, pointer, isOver) {
            if (isOver && this.confirmOffsetButton.isDown) {
                this.confirmOffsetButton.executeButtonFunction();
            }
            this.confirmOffsetButton.isDown = false;
            optionsDown = false;
        }, this);
        this.confirmOffsetButton.executeButtonFunction = function() {
            currentState = PAINTING;
            this.virtualCursor.visible = false;

            this.printMaskProductToKixel();
            this.createUndoState();

            if (device == MOBILE) {
                if (axis == PORTRAIT)
                    this.canvas.intendedX = game.width / 2;
                else if (axis == LANDSCAPE)
                    this.canvas.intendedX = (game.width / 2) - (game.width * 0.05);


                if (radioIsOpen) {
                    if (axis == LANDSCAPE) {
                        this.canvas.intendedY = (window.innerHeight - 45) / 2;
                    }
                    else if (axis == PORTRAIT) {
                        this.canvas.intendedY = window.innerHeight * 0.9 / 2;
                    }
                }
                else {
                    this.canvas.intendedY = window.innerHeight / 2;
                }
            }

            this.colorSelectors.forEach(function(button) {
                button.inputEnabled = true;
                button.input.useHandCursor = true;
            }, this);
            this.buttons.forEach(function(button) {
                button.inputEnabled = true;
                button.input.useHandCursor = true;
            }, this);

            this.offsetUpButton.exists = false;
            this.offsetDownButton.exists = false;
            this.offsetLeftButton.exists = false;
            this.offsetRightButton.exists = false;
            this.cancelOffsetButton.exists = false;
            this.confirmOffsetButton.exists = false;

            this.offsetUpButton.intendedY = -20;
            this.offsetDownButton.intendedY = game.height + 20;
            this.offsetLeftButton.intendedX = -20;
            this.offsetRightButton.intendedX = game.width + 20;

            if (sfxEnabled)
                game.sfx2.play('confirmOffset');
        };
        this.confirmOffsetButton.executeButtonFunction = this.confirmOffsetButton.executeButtonFunction.bind(this);
        this.confirmOffsetButton.icon = game.add.sprite(0, 0, 'icons', 47);
        this.confirmOffsetButton.icon.anchor.setTo(0.5);

        this.messageWindowGroup = game.add.group();

        this.messageWindowText = game.add.bitmapText(0, 0, "euxoi", "not set yet", 50);
        this.messageWindowText.anchor.setTo(0.5);
        
        this.messageWindowButton = game.add.button(0, 0, null);
        this.messageWindowButton.anchor.setTo(0.5);
        this.messageWindowButtonText = game.add.bitmapText(0, 0, "04b30", "UNDERSTOOD, BOSS", 30);
        this.messageWindowButtonText.anchor.setTo(0.5);
        this.messageWindowButton.label = game.add.bitmapText(0, 0, "euxoi_stroke", "ENTER", 24);
        this.messageWindowButton.label.anchor.setTo(0, 1);
        this.messageWindowButton.onInputDown.add(function() {
            this.messageWindowButton.isDown = true;

            if (sfxEnabled)
                game.sfx2.play('messageWindowClick1');
        }, this);
        this.messageWindowButton.onInputUp.add(function(button, pointer, isOver) {
            if (this.messageWindowButton.isDown && isOver) {
                this.messageWindowButton.executeButtonFunction();
            }
            this.messageWindowButton.isDown = false;
        }, this);
        this.messageWindowButton.executeButtonFunction = function() {
            if (sfxEnabled)
                game.sfx2.play('messageWindowClick2');

            switch (tutorialIndex) {
                case 1:
                    this.giveMessage("This will be stamped on your user card when you submit it. It can be swapped out later.", "Sounds good");
                    tutorialIndex++;
                    break;
                case 2:
                    this.identityRuleSprite.exists = true;
                    this.giveMessage("THE IDENTITY RULE\nYou may not submit someone else's work, nor a transcription of someone else's work.", "Understood, boss");
                    tutorialIndex++;
                    break;
                default:
                    if (audioMode == MUSIC_SFX) {
                        musicEnabled = true;
                        game.music.resume();
                    }

                    this.messageWindowGroup.setAll('exists', false);
                    this.identityRuleSprite.exists = false;

                    currentState = PAINTING;
                    controlsDisabled = false;

                    if (device === MOBILE || controlType === KEYBOARD) {
                        this.virtualCursor.visible = true;
                        this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
                        this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
                        this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                        this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
                    }

                    this.colorSelectors.forEach(function(button) {
                        button.inputEnabled = true;
                        button.input.useHandCursor = true;
                    }, this);
                    this.buttons.forEach(function(button) {
                        button.inputEnabled = true;
                        button.input.useHandCursor = true;
                    }, this);
                    break;
            }

            if (typeof compoNumber !== 'undefined' && compoLateElapsed) {
                window.location.replace("wall.php?c=" + compoNumber);
            }
        }
        this.messageWindowButton.executeButtonFunction = this.messageWindowButton.executeButtonFunction.bind(this);

        this.messageWindowGroup.add(this.messageWindowText);
        this.messageWindowGroup.add(this.messageWindowButton);
        this.messageWindowGroup.add(this.messageWindowButtonText);
        this.messageWindowGroup.add(this.messageWindowButton.label);

        this.identityRuleSprite = game.add.sprite(0, 0, 'icons', 48);
        this.identityRuleSprite.anchor.setTo(0.5, 1);
        this.identityRuleSprite.exists = false;

        this.messageWindowGroup.setAll('exists', false);
        
        this.clearGroup = game.add.group();

        gridMode = EVEN;
        symmetryMode = SYM_NONE;

        let saveKixel = true;

        try {
            if (localStorage.getItem("temp-kixel") !== null) { // IMPORTING KIXELS FROM TEMPORARY STORAGE
                var kixelString = localStorage.getItem("temp-kixel");

                var checkInvalid = false;

                switch (parseInt(kixelString.charAt(0))) {
                    case 0: currentPaletteIndex = 0; break;
                    case 1: currentPaletteIndex = 1; break;
                    case 2: currentPaletteIndex = 2; break;
                    case 3: currentPaletteIndex = 3; break;
                    case 4: currentPaletteIndex = 4; break;
                    case 5: currentPaletteIndex = 5; break;
                    case 6: currentPaletteIndex = 6; break;
                    case 7: currentPaletteIndex = 7; break;
                    default: checkInvalid = true;
                }

                if (typeof compoNumber !== 'undefined' && currentPaletteIndex == 2) {
                    this.compoTitle.addColor('black', 0);
                    this.compoTitle.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
                    this.compoType.addColor('black', 0);
                    this.compoType.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
                    this.compoObjective1.addColor('black', 0);
                    this.compoObjective1.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
                    this.compoObjective2.addColor('black', 0);
                    this.compoObjective2.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
                    this.compoTimeLeft.addColor('black', 0);
                    this.compoTimeLeft.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
                }

                kixelString = base64ToHex(kixelString.substring(1));

                for (var x = 0; x < 32; x++) {
                    for (var y = 0; y < 32; y++) {
                        var colorIndex;

                        switch (kixelString.charAt((x * 32) + y)) {
                            case "0": colorIndex = 0; break;
                            case "1": colorIndex = 1; break;
                            case "2": colorIndex = 2; break;
                            case "3": colorIndex = 3; break;
                            case "4": colorIndex = 4; break;
                            case "5": colorIndex = 5; break;
                            case "6": colorIndex = 6; break;
                            case "7": colorIndex = 7; break;
                            case "8": colorIndex = 8; break;
                            case "9": colorIndex = 9; break;
                            case "a": colorIndex = 10; break;
                            case "b": colorIndex = 11; break;
                            case "c": colorIndex = 12; break;
                            case "d": colorIndex = 13; break;
                            case "e": colorIndex = 14; break;
                            case "f": colorIndex = 15; break;
                            default: checkInvalid = true; break;
                        }

                        if (checkInvalid) {
                            break;
                        }
                        else {
                            this.kixel.rect(x, y, 1, 1, palettes.colors[currentPaletteIndex][colorIndex]);
                        }
                    }

                    if (checkInvalid) {
                        break;
                    }
                }

                if (checkInvalid) {
                    currentPaletteIndex = 0;
                    this.kixel.rect(0, 0, 32, 32, "#ffffff");
                    saveKixel = false;
                    console.log("Invalid kixel imported from local storage.");
                }
                else {
                    console.log("Kixel restored from local storage.");
                }
            }
        }
        catch {
            saveKixel = false;
            console.log("Local storage access was blocked. Can't retrieve kixel.");
        }

        this.paletteNameText.setText(palettes.titles[currentPaletteIndex] + "\nby " + palettes.creators[currentPaletteIndex]);

        this.game.scale.onSizeChange.add(this.resizeScreen, this);
        this.resizeScreen();

        currentTool = BRUSH;
        currentMode = DRAW;
        currentShape = OPEN_RECTANGLE;
        selectMode = CUT;

        currentMouseButton = null;

        if (openingScreenIsOpen) {
            this.colorSelectors.forEach(function(button) {
                button.inputEnabled = false;
            }, this);
            this.buttons.forEach(function(button) {
                button.inputEnabled = false;
            }, this);
        }

        this.createUndoState(saveKixel);
        canUndo = false;

        this.timeOfLastPaletteSwap = 0;
        this.frameTimer = 0;
        this.eventTimer = 0;
        this.trueTimer = 0;
        this.trueTimerStart = 0;
        this.trueColorsTimer = 0;
        this.trueDelta = 0;

        if (typeof forcedPalette !== 'undefined') {
            this.changePalette(forcedPalette);
            this.undoStates[0].palette = forcedPalette;
            this.changePaletteButton.exists = false;
            this.changePaletteButton.icon.exists = false;
            this.changePaletteButton.label.visible = false;
        }

        // DEBUG
        //this.kixel.fill(0, 0, 0, 1);
        //this.kixel.rect(0, 0, 1, 1, 0xff0000);
        /*
        this.undoPreviews = [];
        for (var x = 0; x < 16; x++) {
            var undoPreview = game.add.sprite(this.canvas.right, x * 33, this.undoStates[x]);
            this.undoPreviews.push(undoPreview);
        }
        */
        //this.launchTrueColors();
    },
    update: function() {
        if (currentState == TRUE_COLORS_TITLE || currentState == TRUE_COLORS_GAMEPLAY || currentState == TRUE_COLORS_RESULTS) {
            for (var x = 0; x < this.bgSprites.length; x++) {
                this.bgSprites.children[x].x -= 2;
                this.bgSprites.children[x].y += 1;

                if (this.bgSprites.children[x].x < -370)
                    this.bgSprites.children[x].x = game.width;
                if (this.bgSprites.children[x].y > game.height + 130)
                    this.bgSprites.children[x].y = -138;
            }

            this.underlayGraphics.clear();
            this.uiGraphics.clear();
            this.middleGraphics.clear();

            if (typeof compoNumber !== 'undefined')
                this.drawCompoStuff();

            if (currentState == TRUE_COLORS_TITLE && this.trueColorsEventStep < 3000)
                this.middleGraphics.beginFill(0x000000, map(this.eventTimer, 0, 500, 0, 0.75, true));
            else if (currentState == TRUE_COLORS_TITLE && this.trueColorsEventStep == 3000 && !this.trueColorsStarting)
                this.middleGraphics.beginFill(0x000000, map(this.eventTimer, 750, 1000, 0.75, 0, true));
            else if (currentState == TRUE_COLORS_RESULTS && this.trueColorsEventStep == 3000)
                this.middleGraphics.beginFill(0x000000, map(this.eventTimer, 750, 1000, 0.75, 0, true));
            else if (currentState !== PAINTING)
                this.middleGraphics.beginFill(0x000000, 0.75);
            this.middleGraphics.drawRect(0, 0, game.width, game.height); // curtain
            this.middleGraphics.endFill();

            let availableHeight = this.getAvailableHeight();

            switch (currentState) {
                case TRUE_COLORS_TITLE:
                    if (this.trueColorsEventStep < 3000) {
                        this.trueColorsLogo.x = game.width / 3;
                        if (this.eventTimer > 500) {
                            this.trueColorsLogo.y += ((availableHeight / 4) - this.trueColorsLogo.y) * 0.05;
                            this.trueColorsLogo.alpha += (1.0 - this.trueColorsLogo.alpha) * 0.05;
                        }

                        this.trueColorsTitleKixel.x += ((game.width * 2 / 3) - this.trueColorsTitleKixel.x) * 0.05;
                        this.trueColorsTitleKixel.y = availableHeight / 4;
                        this.trueColorsTitleKixel.alpha += (1.0 - this.trueColorsTitleKixel.alpha) * 0.05;

                        this.trueColorsText1.x = map(this.eventTimer, 2000, 2500, game.width / 2, (game.width / 2) - 20, true);
                        this.trueColorsText1.alpha = map(this.eventTimer, 2000, 2500, 0, 1, true);
                        this.trueColorsText2.x = map(this.eventTimer, 2500, 3000, game.width / 2, (game.width / 2) + 20, true);
                        this.trueColorsText2.alpha = map(this.eventTimer, 2500, 3000, 0, 1, true);

                        if (this.eventTimer > 3000) {
                            this.trueColorsButton1.exists = true;
                            this.trueColorsButton2.exists = true;

                            this.trueColorsButton1.x = this.trueColorsText1.x;
                            this.trueColorsButton1.y = this.trueColorsText1.y;
                            this.trueColorsButton1.width = this.trueColorsText1.width;
                            this.trueColorsButton1.height = this.trueColorsText1.height;

                            this.trueColorsButton2.x = this.trueColorsText2.x;
                            this.trueColorsButton2.y = this.trueColorsText2.y;
                            this.trueColorsButton2.width = this.trueColorsText2.width;
                            this.trueColorsButton2.height = this.trueColorsText2.height;

                            if (this.trueColorsSelectedIndex !== null) {
                                this.trueColorsMenuIcon.alpha += map(game.time.delta, 0, 17, 0, 0.05, true);
                                if (this.trueColorsMenuIcon.alpha > 1.0)
                                    this.trueColorsMenuIcon.alpha = 1.0;
                            }
                        }

                        if (this.trueColorsEventStep < 1024) {
                            this.trueColorsText4.x = map(this.trueColorsEventStep, 724, 1024, game.width + (game.width / 2), game.width / 2, true);
                        }
                        else if (this.trueColorsEventStep < 1800) {
                            this.trueColorsText4.x = map(this.trueColorsEventStep, 1500, 1800, game.width / 2, -game.width / 2, true);

                        }
                        else {
                            if (this.trueColorsText4.x < 0) {
                                this.trueColorsCurrentRecord++;
                                if (this.trueColorsCurrentRecord >= trueColorsRecords.length)
                                    this.trueColorsCurrentRecord = 0;
                                
                                if (this.trueColorsCurrentRecord === 0) {
                                    this.trueColorsCopySprite.exists = false;
                                    this.trueColorsText4.anchor.setTo(0.5, 0);
                                    this.trueColorsText4.align = 'center';

                                    if (trueColorsRecords[0] !== null) {
                                        let text4 = "Last score: ★" + trueColorsRecords[0].prevScore + "\n";
                                        if (trueColorsRecords[0].perfectAchieved)
                                            text4 += "Perfect games: " + trueColorsRecords[0].perfectGames;
                                        else
                                            text4 += "Previous best: ★" + trueColorsRecords[0].bestScore;
                                        this.trueColorsText4.setText(text4);
                                    }
                                    else {
                                        this.trueColorsText4.setText("Last score: None\nPrevious best: None");
                                    }
                                }
                                else {
                                    this.trueColorsCopySprite.exists = true;
                                    this.trueColorsText4.anchor.setTo(0, 0);
                                    this.trueColorsText4.align = 'left';
                                    this.trueColorsText4.setText(trueColorsRecords[this.trueColorsCurrentRecord].username + "\nPerfect game\n" + trueColorsRecords[this.trueColorsCurrentRecord].date);
                                    this.trueColorsCopyBmd.draw('communityAvatar' + this.trueColorsCurrentRecord);
                                }
                            }
                            this.trueColorsText4.x = map(this.trueColorsEventStep, 1700, 1900, game.width + (game.width / 2), game.width / 2, true);
                        }

                        this.trueColorsCopySprite.x = this.trueColorsText4.x - 10;

                        this.trueColorsOptionBacking1.x = this.trueColorsText1.x;
                        this.trueColorsOptionBacking1.y = this.trueColorsText1.y;
                        if (this.trueColorsSelectedIndex == 0 && this.trueColorsText1.alpha === 1)
                            this.trueColorsOptionBacking1.alpha += (1 - this.trueColorsOptionBacking1.alpha) * 0.05;
                        else
                            this.trueColorsOptionBacking1.alpha += (0 - this.trueColorsOptionBacking1.alpha) * 0.25;
                        this.trueColorsOptionBacking2.x = this.trueColorsText2.x;
                        this.trueColorsOptionBacking2.y = this.trueColorsText2.y;
                        if (this.trueColorsSelectedIndex == 1 && this.trueColorsText2.alpha === 1)
                            this.trueColorsOptionBacking2.alpha += (1 - this.trueColorsOptionBacking2.alpha) * 0.05;
                        else
                            this.trueColorsOptionBacking2.alpha += (0 - this.trueColorsOptionBacking2.alpha) * 0.25;

                        if (this.trueColorsSelectedIndex == null || this.trueColorsSelectedIndex == 0) {
                            this.trueColorsMenuIcon.x += (this.trueColorsText1.left - this.trueColorsMenuIcon.width - this.trueColorsMenuIcon.x) * 0.33;
                            this.trueColorsMenuIcon.y += (this.trueColorsText1.centerY - this.trueColorsMenuIcon.y) * 0.33;
                        }
                        else if (this.trueColorsSelectedIndex == 1) {
                            this.trueColorsMenuIcon.x += (this.trueColorsText2.left - this.trueColorsMenuIcon.width - this.trueColorsMenuIcon.x) * 0.33;
                            this.trueColorsMenuIcon.y += (this.trueColorsText2.centerY - this.trueColorsMenuIcon.y) * 0.33;
                        }
                        this.trueColorsMenuIcon.rotation += map(game.time.delta, 0, 17, 0, 0.02);

                        if (this.trueColorsEventStep < 1024) {
                            for (this.trueColorsEventStep; this.trueColorsEventStep < map(this.eventTimer, 2000, 3000, 0, 1024, true); this.trueColorsEventStep++) {
                                let grabbedColorIndex = null;
                                let targetX = this.titleAnimationShuffler[this.trueColorsEventStep] % 32;
                                let targetY = Math.floor(this.titleAnimationShuffler[this.trueColorsEventStep] / 32);
                                let pixel = this.trueColorsTitleBmd.getPixelRGB(targetX * 5, targetY * 5);
                                let color = Phaser.Color.RGBtoString(pixel.r, pixel.g, pixel.b, 255, "#");

                                for (var x = 0; x < 16; x++) {
                                    if (color === palettes.colors[this.trueColorsTitleBmd.palette][x]) {
                                        grabbedColorIndex = x;
                                        break;
                                    }
                                }
                                this.trueColorsTitleBmd.rect(targetX * 5, targetY * 5, 5, 5, palettes.colors[this.trueColorsTitleBmd.targetPalette][grabbedColorIndex]);
                            }

                            if (this.trueColorsEventStep == 1024) {
                                this.trueColorsTitleBmd.update();

                                this.trueColorsTitleBmd.palette++;
                                if (this.trueColorsTitleBmd.palette >= 8)
                                    this.trueColorsTitleBmd.palette = 0;
                                this.trueColorsTitleBmd.targetPalette++;
                                if (this.trueColorsTitleBmd.targetPalette >= 8)
                                    this.trueColorsTitleBmd.targetPalette = 0;
                            }
                        }
                        if (this.eventTimer >= 3000) {
                            this.trueColorsText3.alpha += map(game.time.delta, 0, 17, 0, 0.02);
                            if (this.trueColorsText3.alpha > 1.0)
                                this.trueColorsText3.alpha = 1.0;

                            for (this.trueColorsEventStep; this.eventTimer >= 5000 && this.trueColorsEventStep < map(this.eventTimer, 5000, 6000, 1024, 2048, true); this.trueColorsEventStep++) {
                                let grabbedColorIndex = null;
                                let targetX = this.titleAnimationShuffler[this.trueColorsEventStep - 1024] % 32;
                                let targetY = Math.floor(this.titleAnimationShuffler[this.trueColorsEventStep - 1024] / 32);
                                let pixel = this.trueColorsTitleBmd.getPixelRGB(targetX * 5, targetY * 5);
                                let color = Phaser.Color.RGBtoString(pixel.r, pixel.g, pixel.b, 255, "#");

                                for (var x = 0; x < 16; x++) {
                                    if (color === palettes.colors[this.trueColorsTitleBmd.palette][x]) {
                                        grabbedColorIndex = x;
                                        break;
                                    }
                                }
                                this.trueColorsTitleBmd.rect(targetX * 5, targetY * 5, 5, 5, palettes.colors[this.trueColorsTitleBmd.targetPalette][grabbedColorIndex]);
                            }

                            if (this.eventTimer >= 7000) {
                                while (this.eventTimer >= 7000)
                                    this.eventTimer -= 4000;

                                this.trueColorsEventStep = 1024;

                                this.trueColorsTitleBmd.update();

                                this.trueColorsTitleBmd.palette++;
                                if (this.trueColorsTitleBmd.palette >= 8)
                                    this.trueColorsTitleBmd.palette = 0;
                                this.trueColorsTitleBmd.targetPalette++;
                                if (this.trueColorsTitleBmd.targetPalette >= 8)
                                    this.trueColorsTitleBmd.targetPalette = 0;
                            }
                        }
                    }
                    else { // this.trueColorsEventStep >= 3000
                        if (this.eventTimer % 100 < 50 && this.trueColorsStarting)
                            this.trueColorsOptionBacking1.visible = true;
                        else
                            this.trueColorsOptionBacking1.visible = false;

                        if (this.eventTimer % 100 < 50 && !this.trueColorsStarting)
                            this.trueColorsOptionBacking2.visible = true;
                        else
                            this.trueColorsOptionBacking2.visible = false;

                        this.trueColorsOptionBacking1.alpha = map(this.eventTimer, 0, 750, 1, 0, true);
                        this.trueColorsOptionBacking2.alpha = map(this.eventTimer, 0, 750, 1, 0, true);

                        if (this.eventTimer >= 750) {
                            this.trueColorsLogo.x += (-this.trueColorsLogo.width - 10 - this.trueColorsLogo.x) * 0.05;
                            this.trueColorsTitleKixel.x += (game.width + this.trueColorsTitleKixel.width + 10 - this.trueColorsTitleKixel.x) * 0.05;

                            this.trueColorsText1.x += (-this.trueColorsText1.width - this.trueColorsMenuIcon.width - this.trueColorsText1.x) * 0.15;
                            this.trueColorsText2.x += (game.width + this.trueColorsText2.width + this.trueColorsMenuIcon.width - this.trueColorsText2.x) * 0.15;
                            this.trueColorsText3.y += (availableHeight + this.trueColorsText3.height - this.trueColorsText3.y) * 0.15;
                            this.trueColorsText4.x += ((-game.width / 2) - this.trueColorsText4.x) * 0.15;
                            this.trueColorsCopySprite.x += ((-game.width / 2) - this.trueColorsCopySprite.x) * 0.1;
                        }

                        if (this.trueColorsSelectedIndex == 0) {
                            this.trueColorsMenuIcon.x = this.trueColorsText1.left - this.trueColorsMenuIcon.width;
                            this.trueColorsMenuIcon.y = this.trueColorsText1.centerY;
                        }
                        else if (this.trueColorsSelectedIndex == 1) {
                            this.trueColorsMenuIcon.x = this.trueColorsText2.left - this.trueColorsMenuIcon.width;
                            this.trueColorsMenuIcon.y = this.trueColorsText2.centerY;
                        }

                        if (this.trueColorsLogo.x <= -this.trueColorsLogo.width - this.trueColorsLogo.x + 1 &&
                                this.trueColorsTitleKixel.x >= game.width + this.trueColorsTitleKixel.width - 1) { // fetch true colors kixels
                            if (this.trueColorsStarting) {
                                currentState = TRUE_COLORS_GAMEPLAY;

                                this.trueColorsLogo.exists = false;
                                this.trueColorsTitleKixel.exists = false;

                                this.eventTimer = 1000;
                                this.trueColorsEventStep = 0;

                                this.trueColorsText3.exists = false;

                                this.trueColorsText5.x = game.width / 2;
                                this.trueColorsText5.y = availableHeight / 2;
                                this.trueColorsText5.setText("GETTING THE KIXELS...");
                                this.trueColorsText5.anchor.setTo(0.5);
                                this.trueColorsText5.font = "Oswald";
                                this.trueColorsText5.fontSize = 30;
                                this.trueColorsText5.fontWeight = "italic";
                                this.trueColorsText5.padding.set(10, 10);
                                this.trueColorsText5.lineSpacing = -20;
                                this.trueColorsText5.align = "center";
                                this.trueColorsText5.addColor('white', 0);
                                this.trueColorsText5.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                                httpRequest('getTrueColorsKixels', null, "GET", "kixel.php");
                            }
                            else { // exit True Colors
                                currentState = PAINTING;

                                this.trueColorsTitleGroup.setAll('exists', false);
                                this.trueColorsTextGroup.setAll('exists', false);

                                controlsDisabled = false;

                                if (device === MOBILE || controlType === KEYBOARD) {
                                    this.virtualCursor.visible = true;
                                    this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
                                    this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
                                    this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                                    this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
                                }

                                this.colorSelectors.forEach(function(button) {
                                    button.inputEnabled = true;
                                    button.input.useHandCursor = true;
                                }, this);
                                this.buttons.forEach(function(button) {
                                    button.inputEnabled = true;
                                    button.input.useHandCursor = true;
                                }, this);

                                game.music = this.mainMusic;
                                if (musicEnabled) {
                                    game.music.play();
                                }
                            }
                        }
                    }
                    break;
                case TRUE_COLORS_GAMEPLAY:
                    switch (this.trueColorsEventStep) {
                        case 0:
                            this.trueColorsSelectedIndex = null;
                            this.trueColorsText5.alpha = Math.abs(map(this.eventTimer % 2000, 0, 2000, -1.0, 1.0, true)); // bro i'm so smart
                            break;
                        case 1: // begin instructions
                            //this.trueColorsEventStep++; // DEBUG
                            this.trueColorsText1.x += (this.trueColorsText1.intendedX - this.trueColorsText1.x) * 0.1;
                            this.trueColorsText1.y += (this.trueColorsText1.intendedY - this.trueColorsText1.y) * 0.1;
                            this.trueColorsExample1.alpha = map(this.eventTimer, 1000, 1800, 0.0, 1.0, true);
                            this.trueColorsExample2.alpha = map(this.eventTimer, 3600, 4400, 0.0, 1.0, true);
                            this.trueColorsExample3.alpha = map(this.eventTimer, 4400, 5200, 0.0, 1.0, true);

                            if (this.eventTimer >= 3000) {
                                this.trueColorsText2.x += (this.trueColorsText2.intendedX - this.trueColorsText2.x) * 0.1;
                                this.trueColorsText2.y += (this.trueColorsText2.intendedY - this.trueColorsText2.y) * 0.1;
                            }
                            if (this.eventTimer >= 6200) {
                                this.trueColorsText1.intendedX = -this.trueColorsText1.width;
                                this.trueColorsText2.intendedX = game.width + this.trueColorsText2.width;
                            }
                            if (this.eventTimer >= 6700) {
                                this.trueColorsExample1.y = map(this.eventTimer, 6700, 6900, availableHeight / 2, 0, false);
                                this.trueColorsExample2.y = map(this.eventTimer, 6700, 6900, availableHeight / 2, 0, false);
                                this.trueColorsExample3.y = map(this.eventTimer, 6700, 6900, availableHeight / 2, 0, false);
                            }
                            if (this.eventTimer >= 7000) {
                                this.trueColorsEventStep++;
                                this.eventTimer = 0;

                                this.trueColorsText3.x = game.width / 2;
                                this.trueColorsText3.y = availableHeight / 2;
                                this.trueColorsText3.exists = true;
                                this.trueColorsText3.anchor.setTo(0.5);
                                this.trueColorsText3.alpha = 1.0
                                if (sfxEnabled)
                                    game.sfx1.play('trueColorsTimer');
                                this.trueColorsText3.setText("3");
                                this.trueColorsText3.align = "center";
                                this.trueColorsText3.fontSize = 70;
                                this.trueColorsText3.fontWeight = "bold";
                            }
                            break;
                        case 2: // countdown
                            if (this.eventTimer < 3000) {
                                this.middleGraphics.lineStyle(30, 0x8b0000, 1.0);
                                if (this.eventTimer > 2000) {
                                    this.middleGraphics.lineStyle(50, 0x397d02, 1.0);
                                    if (this.trueColorsText3.text !== "1" && sfxEnabled)
                                        game.sfx1.play('trueColorsTimer');
                                    this.trueColorsText3.setText("1");
                                }
                                else if (this.eventTimer > 1000) {
                                    this.middleGraphics.lineStyle(40, 0xd3c00a, 1.0);
                                    if (this.trueColorsText3.text !== "2" && sfxEnabled)
                                        game.sfx1.play('trueColorsTimer');
                                    this.trueColorsText3.setText("2");
                                }
                                
                                this.middleGraphics.arc(game.width / 2, availableHeight / 2, 150, -Math.PI / 2, map(1000 - (this.eventTimer % 1000), 0, 1000, -Math.PI / 2, Math.PI * 3 / 2, true), true);
                            }
                            else {
                                this.trueColorsEventStep++;
                                this.eventTimer = 0;
                                this.trueTimer = 0;
                                this.trueColorsTimer = 0;
                                this.trueTimerStart = Date.now();

                                this.trueColorsText1.fontSize = 70;
                                this.trueColorsText1.fontWeight = "bold";
                                this.trueColorsText1.addColor('black', 0);
                                this.trueColorsText1.setShadow();
                                this.trueColorsText1.setText("1");
                                this.trueColorsText1.anchor.setTo(1, 0);
                                this.trueColorsText1.x = game.width - 70;
                                this.trueColorsText1.y = -this.trueColorsText1.height;

                                this.trueColorsText2.fontSize = 100;
                                this.trueColorsText2.fontWeight = "bold";
                                this.trueColorsText2.addColor('black', 0);
                                this.trueColorsText2.setShadow();
                                this.trueColorsText2.setText("/");
                                this.trueColorsText2.anchor.setTo(1, 0);
                                this.trueColorsText2.x = game.width - 70;
                                this.trueColorsText2.y = -this.trueColorsText2.height;

                                this.trueColorsText5.exists = true;
                                this.trueColorsText5.alpha = 1.0;
                                this.trueColorsText5.fontSize = 50;
                                this.trueColorsText5.fontWeight = "bold";
                                this.trueColorsText5.addColor('black', 0);
                                this.trueColorsText5.setShadow();
                                this.trueColorsText5.setText("8");
                                this.trueColorsText5.anchor.setTo(1, 0);
                                this.trueColorsText5.x = game.width - 5;
                                this.trueColorsText5.y = -this.trueColorsText2.height;

                                this.trueColorsText4.exists = false;
                                this.trueColorsText4.fontSize = 90;
                                this.trueColorsText4.fontWeight = "bold";
                                this.trueColorsText4.setText("not set yet");
                                this.trueColorsText4.anchor.setTo(0.5, 1);
                                this.trueColorsText4.wordWrapWidth = game.width - 10;
                                this.trueColorsText4.x = game.width / 2;
                                this.trueColorsText4.y = (availableHeight / 2) - 180;

                                this.trueColorsOptionBacking1.alpha = 1.0;
                                this.trueColorsOptionBacking1.visible = false;

                                this.trueColorsCopySprite.anchor.setTo(0.5, 1);

                                if (sfxEnabled)
                                    game.sfx1.play('trueColorsRoundFinish');

                                this.trueColorsText3.setText("GO!");

                                this.nextTrueColorsStage();
                            }
                            break;
                        case 3: // actual gameplay
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                            let timeLimit = 17000; // 15 seconds actual play time
                            if (this.trueColorsEventStep > 7)
                                timeLimit = 12000; // 10 seconds actual play time

                            if (this.trueColorsTimer >= 500) {
                                if (this.trueColorsTimer >= timeLimit - 1500)
                                    this.trueColorsControlsEnabled = false;
                                else
                                    this.trueColorsControlsEnabled = true;
                                this.trueColorsText3.y += (-this.trueColorsText3.height - this.trueColorsText3.y) * 0.15;
                            }

                            this.trueColorsText1.x = game.width - 60; // "1"
                            this.trueColorsText1.y += (-10 - this.trueColorsText1.y) * 0.05;
                            if (this.trueColorsTimer < timeLimit - 750 || this.trueColorsEventStep == 10)
                                this.trueColorsText1.fontSize = map(this.trueColorsTimer, 1250, 1500, 120, 70, true);
                            else if (this.trueColorsEventStep < 10)
                                this.trueColorsText1.fontSize = map(this.trueColorsTimer, timeLimit - 750, timeLimit - 500, 70, 120, true);
                            this.trueColorsText2.x = game.width - 20; // "/"
                            this.trueColorsText2.y += (-10 - this.trueColorsText2.y) * 0.05;
                            this.trueColorsText5.x = game.width; // "8"
                            this.trueColorsText5.y += (55 - this.trueColorsText5.y) * 0.05;

                            let lineAxis;
                            if (axis == PORTRAIT)
                                lineAxis = availableHeight;
                            else if (axis == LANDSCAPE)
                                lineAxis = game.width;

                            this.middleGraphics.lineStyle(Math.abs(map(this.trueTimer % 5000, 0, 5000, -lineAxis / 9, lineAxis / 9, true)), 0x000000, map(this.eventTimer, 0, 1000, 0, 0.25, true)); // background lines

                            for (var x = 0; x < 11; x++) {
                                this.middleGraphics.moveTo(map(this.trueTimer % 5000, 0, 5000, -(lineAxis / 9) + (lineAxis / 9 * x), -(lineAxis / 9) + (lineAxis / 9 * (x + 1))), availableHeight + 50);
                                this.middleGraphics.lineTo(map(this.trueTimer % 5000, 0, 5000, -(lineAxis / 9) + (lineAxis / 9 * (x + 1)), -50 -(lineAxis / 9) + (lineAxis / 9 * (x + 2))), -lineAxis / 9);
                            }

                            this.middleGraphics.lineStyle(Math.abs(map((this.trueTimer + 2500) % 5000, 0, 5000, -lineAxis / 9, lineAxis / 9, true)), 0x000000, map(this.eventTimer, 0, 1000, 0, 0.25, true));

                            for (var y = 0; y < 11; y++) {
                                this.middleGraphics.moveTo(-50 -(lineAxis / 9), map(this.trueTimer % 5000, 0, 5000, -(lineAxis / 9) + (lineAxis / 9 * y), -(lineAxis / 9) + (lineAxis / 9 * (y + 1))));
                                this.middleGraphics.lineTo(game.width + 50, map(this.trueTimer % 5000, 0, 5000, -(lineAxis / 9) + (lineAxis / 9 * (y + 1)), -(lineAxis / 9) + (lineAxis / 9 * (y + 2))));
                            }
                            
                            let fourLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 4, 8));
                            let threeLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 3, 8));
                            let twoLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 2, 8));
                            let lastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 1, 8));                            
                            let currentSprite = this.trueColorsKixelSprites.getChildAt(this.trueColorsSelectedIndex);
                            let nextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 1, 8));
                            let twoNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 2, 8));
                            let threeNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 3, 8));
                            let fourNextSprite = this.trueColorsCopySprite;

                            this.middleGraphics.endFill();

                            if (this.trueColorsTimer >= timeLimit - 1500) {
                                this.middleGraphics.lineStyle(200, 0x000000, 0.75);
                                this.middleGraphics.arc(game.width / 2, availableHeight * 3, availableHeight * 2.5, map(this.trueColorsTimer, timeLimit - 1500, timeLimit - 500, Math.PI, Math.PI * 2, true), Math.PI * 2);
                            }
                            else {
                                this.middleGraphics.lineStyle(200, 0x000000, 0.75);
                                this.middleGraphics.arc(game.width / 2, availableHeight * 3, availableHeight * 2.5, Math.PI, map(this.trueColorsTimer, 0, 1000, Math.PI, Math.PI * 2, true));
                            }

                            this.middleGraphics.lineStyle(0, 0, 0); // upper-right stage counter
                            this.middleGraphics.beginFill(0xffffff, 1.0);
                            if (this.trueColorsTimer <= 500 && this.trueColorsEventStep == 3)
                                this.middleGraphics.drawCircle(game.width, 0, map(this.trueColorsTimer, 0, 500, 0, 400, true));
                            else if (this.trueColorsTimer < timeLimit - 750 || this.trueColorsEventStep == 10)
                                this.middleGraphics.drawCircle(game.width, 0, map(this.trueColorsTimer, 1250, 1500, 400, 300, true));
                            else if (this.trueColorsEventStep < 10)
                                this.middleGraphics.drawCircle(game.width, 0, map(this.trueColorsTimer, timeLimit - 750, timeLimit - 500, 300, 400, true));
                            this.middleGraphics.endFill();

                            this.uiGraphics.beginFill(0xffffff, 1.0); // timer bar
                            this.uiGraphics.drawRect(map(this.trueColorsTimer, 500, timeLimit - 1500, 0, game.width - 140, true), 20, map(this.trueColorsTimer, 500, timeLimit - 1500, game.width - 140, 0, true), 30);
                            if (this.trueColorsEventStep < 10 && this.trueColorsTimer >= timeLimit - 250)
                                this.uiGraphics.drawRect(0, 20, map(this.trueColorsTimer, timeLimit - 250, timeLimit, 0, game.width - 140, true), 30);
                            this.uiGraphics.endFill();

                            this.uiGraphics.lineStyle(5, 0xcc3d87, 1.0);
                            if (this.trueColorsTimer >= timeLimit - 1500) {
                                this.uiGraphics.drawRect(this.trueColorsKixelSprites.getChildAt(this.trueColorsSelectedIndex).left - 20,
                                    this.trueColorsKixelSprites.getChildAt(this.trueColorsSelectedIndex).top - 20, 200, 200);
                            }
                            else {
                                this.uiGraphics.drawRect(this.trueColorsKixelSprites.getChildAt(this.trueColorsSelectedIndex).left - 20,
                                    this.trueColorsKixelSprites.getChildAt(this.trueColorsSelectedIndex).top - 20 + (Math.sin(this.trueColorsTimer / 1000) * 10),
                                    200, 200);
                            }

                            let uiWidth = game.width;
                            if (uiWidth > 800)
                                uiWidth = 800;

                            let firstBoxPosition = (game.width / 2) - (uiWidth / 2) + (uiWidth / 48);

                            for (var x = 0; x < 8; x++) { // boxes below kixels
                                let vertPosition = (availableHeight / 2) + 60 + map(this.trueColorsTimer, 0, 100 * x, availableHeight / 2, 0, true);

                                if (this.trueColorsTimer >= timeLimit - 1500) {
                                    vertPosition = (availableHeight / 2) + 60 + map(this.trueColorsTimer, timeLimit - 1500, timeLimit - 1300, 0, availableHeight / 2, true);
                                }

                                this.uiGraphics.lineStyle(2, 0xffffff, 1.0);
                                if (x == this.trueColorsSelectedIndex) {
                                    this.uiGraphics.beginFill(0x00ffff);
                                    this.uiGraphics.drawRect(firstBoxPosition + (uiWidth / 8 * x) - 3, vertPosition - 3, (uiWidth / 12) + 6, (uiWidth / 12) + 6);
                                }
                                else {
                                    this.uiGraphics.beginFill(0x0000ff);
                                    this.uiGraphics.drawRect(firstBoxPosition + (uiWidth / 8 * x), vertPosition, uiWidth / 12, uiWidth / 12);
                                }
                                if (x > 0) {
                                    this.uiGraphics.lineStyle(0, 0, 0);
                                    this.uiGraphics.beginFill(0xffffff);
                                    this.uiGraphics.drawCircle(firstBoxPosition + (uiWidth / 8 * x) - (uiWidth / 48), vertPosition + (uiWidth / 24), 4);
                                }
                            }
                            this.uiGraphics.endFill();

                            // buttons
                            this.trueColorsButton1.exists = true;
                            this.trueColorsButton1.anchor.setTo(0, 0);
                            this.trueColorsButton1.x = (game.width / 2) - uiWidth / 2;
                            if (this.trueColorsTimer < timeLimit - 1500)
                                this.trueColorsButton1.y = map(this.trueColorsTimer, 300, 500, availableHeight + 10, (availableHeight / 2) + 60 + (uiWidth / 12) + 20, true);
                            else
                                this.trueColorsButton1.y = map(this.trueColorsTimer, timeLimit - 1500, timeLimit - 1300, (availableHeight / 2) + 60 + (uiWidth / 12) + 20, availableHeight + 10, true);
                            this.trueColorsButton1.width = (uiWidth / 2) - 10;
                            this.trueColorsButton1.height = availableHeight / 4;

                            this.trueColorsButton2.exists = true;
                            this.trueColorsButton2.anchor.setTo(1, 0);
                            this.trueColorsButton2.x = (game.width / 2) + uiWidth / 2;
                            if (this.trueColorsTimer < timeLimit - 1500)
                                this.trueColorsButton2.y = map(this.trueColorsTimer, 300, 500, availableHeight + 10, (availableHeight / 2) + 60 + (uiWidth / 12) + 20, true);
                            else
                                this.trueColorsButton2.y = map(this.trueColorsTimer, timeLimit - 1500, timeLimit - 1300, (availableHeight / 2) + 60 + (uiWidth / 12) + 20, availableHeight + 10, true);
                            this.trueColorsButton2.width = (uiWidth / 2) - 10;
                            this.trueColorsButton2.height = availableHeight / 4;

                            this.uiGraphics.lineStyle(5, 0x000000, 1.0);
                            this.uiGraphics.drawRoundedRect(this.trueColorsButton1.left, this.trueColorsButton1.top + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0), this.trueColorsButton1.width, this.trueColorsButton1.height + 5 - (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0), 20);
                            this.uiGraphics.beginFill(0x82439c, 1.0);
                            this.uiGraphics.drawRoundedRect(this.trueColorsButton1.left, this.trueColorsButton1.top + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0), this.trueColorsButton1.width, this.trueColorsButton1.height, 20);
                            this.uiGraphics.endFill();

                            this.uiGraphics.lineStyle(0, 0, 0);
                            this.uiGraphics.beginFill(0xcc3d87, 1.0);
                            this.uiGraphics.moveTo(this.trueColorsButton1.left + 10, this.trueColorsButton1.centerY + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton1.left + (this.trueColorsButton1.width / 4), this.trueColorsButton1.top + 10 + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton1.left + (this.trueColorsButton1.width / 4), this.trueColorsButton1.top + (this.trueColorsButton1.height / 3) + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton1.right - 10, this.trueColorsButton1.top + (this.trueColorsButton1.height / 3) + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton1.right - 10, this.trueColorsButton1.top + (this.trueColorsButton1.height * 2 / 3) + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton1.left + (this.trueColorsButton1.width / 4), this.trueColorsButton1.top + (this.trueColorsButton1.height * 2 / 3) + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton1.left + (this.trueColorsButton1.width / 4), this.trueColorsButton1.bottom - 10 + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton1.left + 10, this.trueColorsButton1.centerY + (this.trueColorsButton1.isDown ? OPTION_DOWN_OFFSET : 0));

                            this.uiGraphics.lineStyle(5, 0x000000, 1.0);
                            this.uiGraphics.drawRoundedRect(this.trueColorsButton2.left, this.trueColorsButton2.top + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0), this.trueColorsButton2.width, this.trueColorsButton2.height + 5 - (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0), 20);
                            this.uiGraphics.beginFill(0x82439c, 1.0);
                            this.uiGraphics.drawRoundedRect(this.trueColorsButton2.left, this.trueColorsButton2.top + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0), this.trueColorsButton2.width, this.trueColorsButton2.height, 20);
                            this.uiGraphics.endFill();

                            this.uiGraphics.lineStyle(0, 0, 0);
                            this.uiGraphics.beginFill(0xcc3d87, 1.0);
                            this.uiGraphics.moveTo(this.trueColorsButton2.right - 10, this.trueColorsButton2.centerY + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton2.right - (this.trueColorsButton2.width / 4), this.trueColorsButton2.top + 10 + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton2.right - (this.trueColorsButton2.width / 4), this.trueColorsButton2.top + (this.trueColorsButton2.height / 3) + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton2.left + 10, this.trueColorsButton2.top + (this.trueColorsButton2.height / 3) + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton2.left + 10, this.trueColorsButton2.top + (this.trueColorsButton2.height * 2 / 3) + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton2.right - (this.trueColorsButton2.width / 4), this.trueColorsButton2.top + (this.trueColorsButton2.height * 2 / 3) + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton2.right - (this.trueColorsButton2.width / 4), this.trueColorsButton2.bottom - 10 + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0));
                            this.uiGraphics.lineTo(this.trueColorsButton2.right - 10, this.trueColorsButton2.centerY + (this.trueColorsButton2.isDown ? OPTION_DOWN_OFFSET : 0));

                            if (this.trueColorsTimer >= timeLimit - 6500) {
                                this.trueColorsText4.exists = true;
                                this.trueColorsText4.y = currentSprite.top - 10;

                                if (this.trueColorsTimer >= timeLimit - 1500) {
                                    this.trueColorsOptionBacking1.x = this.trueColorsText4.centerX;
                                    this.trueColorsOptionBacking1.y = this.trueColorsText4.centerY;

                                    if (this.trueColorsTimer % 100 < 50)
                                        this.trueColorsOptionBacking1.visible = true;
                                    else
                                        this.trueColorsOptionBacking1.visible = false;

                                    this.trueColorsOptionBacking1.alpha -= map(game.time.delta, 0, 17, 0, 0.02);
                                    if (this.trueColorsOptionBacking1.alpha < 0)
                                        this.trueColorsOptionBacking1.alpha = 0;

                                    if (this.trueColorsText4.text !== "SPEED UP!"
                                        && this.trueColorsText4.text !== "LAST ONE!"
                                        && this.trueColorsText4.text !== "FINISH!!"
                                        && this.trueColorsText4.text !== "OK!"
                                        && sfxEnabled)
                                        game.sfx1.play('trueColorsRoundFinish');

                                    if (this.trueColorsEventStep == 7)
                                        this.trueColorsText4.setText("SPEED UP!");
                                    else if (this.trueColorsEventStep == 9)
                                        this.trueColorsText4.setText("LAST ONE!");
                                    else if (this.trueColorsEventStep == 10)
                                        this.trueColorsText4.setText("FINISH!!");
                                    else
                                        this.trueColorsText4.setText("OK!");
                                }
                                else if (this.trueColorsTimer >= timeLimit - 2500) {
                                    if (this.trueColorsText4.text !== "1") {
                                        if (sfxEnabled)
                                            game.sfx1.play('trueColorsTimer');

                                        this.trueColorsText4.fontSize = 130;
                                        this.trueColorsText4.setText("1");
                                    }
                                }
                                else if (this.trueColorsTimer >= timeLimit - 3500) {
                                    if (this.trueColorsText4.text !== "2") {
                                        if (sfxEnabled)
                                            game.sfx1.play('trueColorsTimer');

                                        this.trueColorsText4.fontSize = 120;
                                        this.trueColorsText4.setText("2");
                                    }
                                }
                                else if (this.trueColorsTimer >= timeLimit - 4500) {
                                    if (this.trueColorsText4.text !== "3") {
                                        if (sfxEnabled)
                                            game.sfx1.play('trueColorsTimer');

                                        this.trueColorsText4.fontSize = 110;
                                        this.trueColorsText4.setText("3");
                                    }
                                }
                                else if (this.trueColorsTimer >= timeLimit - 5500) {
                                    if (this.trueColorsText4.text !== "4") {
                                        if (sfxEnabled)
                                            game.sfx1.play('trueColorsTimer');

                                        this.trueColorsText4.fontSize = 100;
                                        this.trueColorsText4.setText("4");
                                    }
                                }
                                else if (this.trueColorsTimer >= timeLimit - 6500) {
                                    if (this.trueColorsText4.text !== "5") {
                                        if (sfxEnabled)
                                            game.sfx1.play('trueColorsTimer');

                                        this.trueColorsText4.fontSize = 90;
                                        this.trueColorsText4.setText("5");
                                    }
                                }
                            }
                            else {
                                this.trueColorsText4.exists = false;
                                this.trueColorsOptionBacking1.visible = false;
                            }

                            fourLastSprite.x += (fourLastSprite.intendedX - fourLastSprite.x) * 0.35;
                            threeLastSprite.x += (threeLastSprite.intendedX - threeLastSprite.x) * 0.35;
                            twoLastSprite.x += (twoLastSprite.intendedX - twoLastSprite.x) * 0.35;
                            lastSprite.x += (lastSprite.intendedX - lastSprite.x) * 0.35;
                            currentSprite.x += (currentSprite.intendedX - currentSprite.x) * 0.35;
                            nextSprite.x += (nextSprite.intendedX - nextSprite.x) * 0.35;
                            twoNextSprite.x += (twoNextSprite.intendedX - twoNextSprite.x) * 0.35;
                            threeNextSprite.x += (threeNextSprite.intendedX - threeNextSprite.x) * 0.35;
                            fourNextSprite.x += (fourNextSprite.intendedX - fourNextSprite.x) * 0.35;

                            if (this.trueColorsTimer < timeLimit - 1500) {
                                fourLastSprite.y = map(this.trueColorsTimer, 0, 100, -160, map(Math.abs((game.width / 2) - fourLastSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), true);
                                threeLastSprite.y = map(this.trueColorsTimer, 100, 200, -160, map(Math.abs((game.width / 2) - threeLastSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), true);
                                twoLastSprite.y = map(this.trueColorsTimer, 200, 300, -160, map(Math.abs((game.width / 2) - twoLastSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), true);
                                lastSprite.y = map(this.trueColorsTimer, 300, 400, -160, map(Math.abs((game.width / 2) - lastSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), true);
                                currentSprite.y = map(this.trueColorsTimer, 400, 500, -160, map(Math.abs((game.width / 2) - currentSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), true);
                                nextSprite.y = map(this.trueColorsTimer, 500, 600, -160, map(Math.abs((game.width / 2) - nextSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), true);
                                twoNextSprite.y = map(this.trueColorsTimer, 600, 700, -160, map(Math.abs((game.width / 2) - twoNextSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), true);
                                threeNextSprite.y = map(this.trueColorsTimer, 700, 800, -160, map(Math.abs((game.width / 2) - threeNextSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), true);
                                fourNextSprite.y = map(this.trueColorsTimer, 800, 900, -160, map(Math.abs((game.width / 2) - fourNextSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), true);
                            }
                            else { // this.trueColorsTimer > 15500
                                currentSprite.y = map(this.trueColorsTimer, timeLimit - 1000, timeLimit - 900, availableHeight / 2, -currentSprite.height, true);

                                lastSprite.y = map(this.trueColorsTimer, timeLimit - 900, timeLimit - 800, map(Math.abs((game.width / 2) - lastSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), availableHeight + currentSprite.height, true);
                                nextSprite.y = map(this.trueColorsTimer, timeLimit - 900, timeLimit - 800, map(Math.abs((game.width / 2) - nextSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), availableHeight + currentSprite.height, true);

                                twoLastSprite.y = map(this.trueColorsTimer, timeLimit - 800, timeLimit - 700, map(Math.abs((game.width / 2) - twoLastSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), availableHeight + currentSprite.height, true);
                                twoNextSprite.y = map(this.trueColorsTimer, timeLimit - 800, timeLimit - 700, map(Math.abs((game.width / 2) - twoNextSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), availableHeight + currentSprite.height, true);

                                threeLastSprite.y = map(this.trueColorsTimer, timeLimit - 700, timeLimit - 600, map(Math.abs((game.width / 2) - threeLastSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), availableHeight + currentSprite.height, true);
                                threeNextSprite.y = map(this.trueColorsTimer, timeLimit - 700, timeLimit - 600, map(Math.abs((game.width / 2) - threeNextSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), availableHeight + currentSprite.height, true);

                                fourLastSprite.y = map(this.trueColorsTimer, timeLimit - 600, timeLimit - 500, map(Math.abs((game.width / 2) - fourLastSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), availableHeight + currentSprite.height, true);
                                fourNextSprite.y = map(this.trueColorsTimer, timeLimit - 600, timeLimit - 500, map(Math.abs((game.width / 2) - fourNextSprite.x), 0, game.width / 2, availableHeight / 2, (availableHeight / 2) + 50), availableHeight + currentSprite.height, true);

                                if (this.trueColorsTimer >= timeLimit) { // next stage
                                    this.trueColorsTimer -= timeLimit;
                                    this.trueColorsChoices += this.trueColorsSelectedIndex + ",";

                                    if (this.trueColorsEventStep < 10) {
                                        this.trueColorsEventStep++;
                                        this.nextTrueColorsStage();
                                    }
                                    else {
                                        this.trueColorsEventStep = 0;
                                        this.eventTimer = 1000;
                                        this.trueColorsTimer = 0;
                                        currentState = TRUE_COLORS_RESULTS;
                                        
                                        this.trueColorsText3.x = game.width / 2;
                                        this.trueColorsText3.y = availableHeight / 2;
                                        this.trueColorsText3.anchor.setTo(0.5);
                                        this.trueColorsText3.font = "Oswald";
                                        this.trueColorsText3.fontSize = 30;
                                        this.trueColorsText3.fontWeight = "italic";
                                        this.trueColorsText3.padding.set(10, 10);
                                        this.trueColorsText3.lineSpacing = -20;
                                        this.trueColorsText3.align = "center";
                                        this.trueColorsText3.addColor('white', 0);
                                        this.trueColorsText3.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                                        this.trueColorsText3.setText("GETTING THE RESULTS...");
                                        this.trueColorsText3.alpha = 0.0;

                                        httpRequest("getTrueColorsResults", this.trueColorsChoices, "GET", "kixel.php");
                                    }
                                }
                            }
                            break;
                    }
                    break;
                case TRUE_COLORS_RESULTS:
                    switch (this.trueColorsEventStep) {
                        case 0:
                            let lineAxis;
                            if (axis == PORTRAIT)
                                lineAxis = availableHeight;
                            else if (axis == LANDSCAPE)
                                lineAxis = game.width;

                            this.middleGraphics.lineStyle(Math.abs(map(this.trueTimer % 5000, 0, 5000, -lineAxis / 9, lineAxis / 9, true)), 0x000000, map(this.eventTimer, 1000, 2000, 0.25, 0, true)); // background lines

                            for (var x = 0; x < 11; x++) {
                                this.middleGraphics.moveTo(map(this.trueTimer % 5000, 0, 5000, -(lineAxis / 9) + (lineAxis / 9 * x), -(lineAxis / 9) + (lineAxis / 9 * (x + 1))), availableHeight + 50);
                                this.middleGraphics.lineTo(map(this.trueTimer % 5000, 0, 5000, -(lineAxis / 9) + (lineAxis / 9 * (x + 1)), -50 -(lineAxis / 9) + (lineAxis / 9 * (x + 2))), -lineAxis / 9);
                            }

                            this.middleGraphics.lineStyle(Math.abs(map((this.trueTimer + 2500) % 5000, 0, 5000, -lineAxis / 9, lineAxis / 9, true)), 0x000000, map(this.eventTimer, 1000, 2000, 0.25, 0, true));

                            for (var y = 0; y < 11; y++) {
                                this.middleGraphics.moveTo(-50 -(lineAxis / 9), map(this.trueTimer % 5000, 0, 5000, -(lineAxis / 9) + (lineAxis / 9 * y), -(lineAxis / 9) + (lineAxis / 9 * (y + 1))));
                                this.middleGraphics.lineTo(game.width + 50, map(this.trueTimer % 5000, 0, 5000, -(lineAxis / 9) + (lineAxis / 9 * (y + 1)), -(lineAxis / 9) + (lineAxis / 9 * (y + 2))));
                            }

                            this.middleGraphics.lineStyle(0, 0, 0);
                            this.middleGraphics.beginFill(0xffffff, 1.0);
                            this.middleGraphics.drawCircle(game.width, map(this.trueColorsTimer, 0, 500, 0, availableHeight, true), 300);
                            this.middleGraphics.endFill();

                            this.trueColorsText1.x = game.width - 60; // "1"
                            this.trueColorsText1.y += (-this.trueColorsText1.height - this.trueColorsText1.y) * 0.05;
                            this.trueColorsText2.x = game.width - 20; // "/"
                            this.trueColorsText2.y += (-this.trueColorsText2.height - this.trueColorsText2.y) * 0.05;
                            this.trueColorsText5.x = game.width; // "8"
                            this.trueColorsText5.y += (-this.trueColorsText5.height - this.trueColorsText5.y) * 0.05;

                            this.trueColorsText4.exists = false;
                            this.trueColorsOptionBacking1.visible = false;
                            this.trueColorsText3.alpha = Math.abs(map(this.eventTimer % 2000, 0, 2000, -1.0, 1.0, true));
                            break;
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                            let index = this.trueColorsEventStep - 1;

                            this.middleGraphics.lineStyle(0, 0, 0);
                            this.middleGraphics.beginFill(0xffffff, 1.0);
                            if (this.eventTimer < 7000)
                                this.middleGraphics.drawCircle(game.width, map(this.trueColorsTimer, 0, 500, 0, availableHeight, true), 300);
                            else
                                this.middleGraphics.drawCircle(game.width, availableHeight, map(this.eventTimer, 7000, 7500, 300, 0, true));
                            this.middleGraphics.endFill();

                            if (this.eventTimer < 7000)
                                this.trueColorsText5.y += (availableHeight - this.trueColorsText5.y) * 0.1;
                            else
                                this.trueColorsText5.y += (availableHeight + this.trueColorsText5.height + 10 - this.trueColorsText5.y) * 0.1;

                            if (this.eventTimer < 6000) {
                                this.trueColorsCopySprite.y += ((availableHeight / 3) - this.trueColorsCopySprite.y) * 0.05;
                                if (this.eventTimer >= 2000)
                                    this.trueColorsKixelSprites.getChildAt(index).y += ((availableHeight * 2 / 3) - this.trueColorsKixelSprites.getChildAt(index).y) * 0.05;
                                else
                                    this.trueColorsKixelSprites.getChildAt(index).y = this.trueColorsCopySprite.y;

                                this.trueColorsText1.x = this.trueColorsCopySprite.x + 10;
                                this.trueColorsText1.y = this.trueColorsCopySprite.y;

                                if (this.eventTimer >= 2500)
                                    this.trueColorsText2.x += ((game.width / 2) + 10 - this.trueColorsText2.x) * 0.05;
                                else
                                    this.trueColorsText2.x = game.width + 10;

                                this.trueColorsText3.x = this.trueColorsText2.x;

                                if (sfxEnabled && this.trueColorsText4.alpha < 1.0 && this.eventTimer >= 4000) {
                                    if (this.trueColorsResults[index].correct)
                                        game.sfx1.play('trueColorsCorrect');
                                    else
                                        game.sfx1.play('trueColorsIncorrect');
                                }

                                this.trueColorsText4.alpha = map(this.eventTimer, 3500, 4000, 0.0, 1.0, true);
                                if (this.trueColorsResults[index].correct) 
                                    this.trueColorsText4.fontSize = map(this.eventTimer, 3500, 4000, 250, 180, true);
                                else
                                    this.trueColorsText4.fontSize = map(this.eventTimer, 3500, 4000, 100, 80, true);

                                if (this.eventTimer >= 4000) {
                                    this.trueColorsText5.setText("★" + this.trueColorsCorrect + "\n" + this.trueColorsEventStep + "/8");
                                }
                            }
                            else {
                                this.trueColorsCopySprite.x += ((-game.width / 2) - this.trueColorsCopySprite.x) * 0.15;
                                this.trueColorsText1.x = this.trueColorsCopySprite.x + 10;

                                this.trueColorsKixelSprites.getChildAt(index).x += (game.width + (game.width / 2) - this.trueColorsKixelSprites.getChildAt(index).x) * 0.15;
                                this.trueColorsText2.x = this.trueColorsKixelSprites.getChildAt(index).x + 10;
                                this.trueColorsText3.x = this.trueColorsKixelSprites.getChildAt(index).x + 10;

                                this.trueColorsText4.alpha = map(this.eventTimer, 6000, 7000, 1.0, 0.0, true);

                                if (this.eventTimer >= 7000) {
                                    if (this.trueColorsEventStep < 8)
                                        this.nextTrueColorsResult();
                                    else if (this.eventTimer >= 7500) { // move on
                                        this.trueColorsEventStep++;
                                        this.eventTimer = 0;

                                        this.trueColorsKixelSprites.setAll('exists', false);
                                        var x = 0;
                                        this.trueColorsKixelSprites.forEach(function(sprite) {
                                            sprite.anchor.setTo(0.5, 0);
                                            sprite.x = ((game.width / 2) - 240) + (160 * (x % 4));
                                            sprite.y = 10;
                                            if (x >= 4)
                                                sprite.y += 160;

                                            x++;
                                        }, this);

                                        this.trueColorsText1.exists = false;
                                        this.trueColorsText1.x = (game.width / 2) - 60;
                                        this.trueColorsText1.y = availableHeight * 2 / 3;
                                        this.trueColorsText1.anchor.setTo(0, 0);
                                        this.trueColorsText1.fontSize = game.width / 15;
                                        if (this.trueColorsText1.fontSize > 80)
                                            this.trueColorsText1.fontSize = 80;
                                        this.trueColorsText1.fontWeight = "bold italic";
                                        this.trueColorsText1.padding.set(15, 10);
                                        this.trueColorsText1.align = "left";
                                        this.trueColorsText1.addColor('white', 0);
                                        this.trueColorsText1.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                                        if (this.trueColorsCorrect == 8)
                                            this.trueColorsText1.setText("★ PERFECT!");
                                        else
                                            this.trueColorsText1.setText("★" + this.trueColorsCorrect);
                                        this.trueColorsText1.alpha = 0.0;

                                        this.trueColorsText2.exists = false;
                                        this.trueColorsText2.x = (game.width / 2) - 20;
                                        this.trueColorsText2.y = availableHeight * 2 / 3;
                                        this.trueColorsText2.anchor.setTo(0, 0);
                                        this.trueColorsText2.fontSize = game.width / 25;
                                        if (this.trueColorsText2.fontSize > 50)
                                            this.trueColorsText2.fontSize = 50;
                                        this.trueColorsText2.fontWeight = "bold";
                                        this.trueColorsText2.padding.set(10, 10);
                                        this.trueColorsText2.align = "left";
                                        this.trueColorsText2.addColor('white', 0);
                                        this.trueColorsText2.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                                        if (this.trueColorsResults[8].prevBest == 8)
                                            this.trueColorsText2.setText("Perfect games: " + this.trueColorsResults[8].numPerfectGames);
                                        else
                                            this.trueColorsText2.setText("Prev. best: " + this.trueColorsResults[8].prevBest);
                                        this.trueColorsText2.alpha = 0.0;

                                        this.trueColorsText3.exists = false;
                                        this.trueColorsText3.x = (game.width / 2) + 20;
                                        this.trueColorsText3.y = availableHeight * 2 / 3;
                                        this.trueColorsText3.anchor.setTo(0, 0);
                                        this.trueColorsText3.fontSize = game.width / 25;
                                        if (this.trueColorsText3.fontSize > 50)
                                            this.trueColorsText3.fontSize = 50;
                                        this.trueColorsText3.fontWeight = "bold";
                                        this.trueColorsText3.padding.set(10, 10);
                                        this.trueColorsText3.align = "left";
                                        this.trueColorsText3.addColor('white', 0);
                                        this.trueColorsText3.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                                        this.trueColorsText3.setText("All-time correct: " + this.trueColorsResults[8].allTimeCorrect);
                                        this.trueColorsText3.alpha = 0.0;

                                        this.trueColorsText4.exists = false;
                                        this.trueColorsText4.x = (game.width / 2) + 60;
                                        this.trueColorsText4.y = availableHeight * 2 / 3;
                                        this.trueColorsText4.rotation = 0;
                                        this.trueColorsText4.anchor.setTo(0, 0);
                                        this.trueColorsText4.fontSize = game.width / 25;
                                        if (this.trueColorsText4.fontSize > 50)
                                            this.trueColorsText4.fontSize = 50;
                                        this.trueColorsText4.fontWeight = "bold";
                                        this.trueColorsText4.padding.set(10, 10);
                                        this.trueColorsText4.lineSpacing = -15;
                                        this.trueColorsText4.align = "left";
                                        this.trueColorsText4.addColor('white', 0);
                                        this.trueColorsText4.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                                        let additional = "";
                                        if (this.trueColorsCorrect == 8)
                                            additional += "\n +3 hearts";
                                        else if (this.trueColorsCorrect >= 6)
                                            additional += "\n +2 hearts";
                                        else if (this.trueColorsCorrect >= 3)
                                            additional += "\n +1 heart";
                                        if (this.trueColorsCorrect == 8)
                                            additional += "\n  +1 candy";
                                        this.trueColorsText4.setText("+" + this.trueColorsCorrect + " EXP" + additional);
                                        this.trueColorsText4.alpha = 0.0;

                                        this.trueColorsText5.exists = false;
                                        this.trueColorsText5.setText("LEAVE");
                                        this.trueColorsText5.anchor.setTo(1, 1);
                                        this.trueColorsText5.fontSize = 50;
                                        this.trueColorsText5.fontWeight = "bold italic";
                                        this.trueColorsText5.align = 'left';
                                        this.trueColorsText5.padding.set(10, 10);
                                        this.trueColorsText5.addColor('white', 0);
                                        this.trueColorsText5.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                                        this.trueColorsText5.alpha = 0.0;

                                        if (musicEnabled && this.trueColorsCorrect == 8)
                                            game.music.play('perfect');
                                    }
                                }
                            }
                            break;
                        case 9: // final results
                            for (var x = 0; x < 8; x++) {
                                if (this.eventTimer >= 100 * x) {
                                    if (!this.trueColorsKixelSprites.getChildAt(x).exists) {
                                        if (sfxEnabled)
                                            game.sfx1.play('trueColorsKixelAppear');

                                        this.trueColorsKixelSprites.getChildAt(x).exists = true;
                                    }
                                }

                                this.trueColorsKixelSprites.getChildAt(x).x = ((game.width / 2) - 240) + (160 * (x % 4));
                                this.trueColorsKixelSprites.getChildAt(x).y = 10;
                                if (x >= 4)
                                    this.trueColorsKixelSprites.getChildAt(x).y += 160;
                            }

                            this.trueColorsText1.y = 330;
                            this.trueColorsText2.y = this.trueColorsText1.bottom - 20;
                            this.trueColorsText3.y = this.trueColorsText2.bottom - 20;
                            this.trueColorsText4.y = this.trueColorsText3.bottom - 20;

                            if (this.eventTimer >= 1000) {
                                if (!this.trueColorsText1.exists) {
                                    this.trueColorsText1.exists = true;

                                    if (sfxEnabled)
                                        game.sfx1.play('trueColorsResult');
                                }
                                this.trueColorsText1.x = map(this.eventTimer, 1000, 1250, (game.width / 2) - 170, (game.width / 2) - 150, true);
                                this.trueColorsText1.alpha = map(this.eventTimer, 1000, 1250, 0, 1.0, true);
                            }
                            if (this.eventTimer >= 1250) {
                                if (!this.trueColorsText2.exists) {
                                    this.trueColorsText2.exists = true;

                                    if (sfxEnabled)
                                        game.sfx1.play('trueColorsResult');
                                }
                                this.trueColorsText2.x = map(this.eventTimer, 1250, 1500, (game.width / 2) - 150, (game.width / 2) - 120, true);
                                this.trueColorsText2.alpha = map(this.eventTimer, 1250, 1500, 0, 1.0, true);
                            }
                            if (this.eventTimer >= 1500) {
                                if (!this.trueColorsText3.exists) {
                                    this.trueColorsText3.exists = true;

                                    if (sfxEnabled)
                                        game.sfx1.play('trueColorsResult');
                                }
                                this.trueColorsText3.x = map(this.eventTimer, 1500, 1750, (game.width / 2) - 120, (game.width / 2) - 90, true);
                                this.trueColorsText3.alpha = map(this.eventTimer, 1500, 1750, 0, 1.0, true);
                            }
                            if (this.eventTimer >= 1750) {
                                if (!this.trueColorsText4.exists) {
                                    this.trueColorsText4.exists = true;

                                    if (sfxEnabled)
                                        game.sfx1.play('trueColorsResult');
                                }
                                this.trueColorsText4.x = map(this.eventTimer, 1750, 2000, (game.width / 2) + 90, (game.width / 2) - 60, true);
                                this.trueColorsText4.alpha = map(this.eventTimer, 1750, 2000, 0, 1.0, true);
                            }

                            if (this.eventTimer >= 2000) {
                                this.trueColorsText5.exists = true;
                                this.trueColorsText5.x = map(this.eventTimer, 2000, 2250, game.width - 70, game.width - 30, true);
                                this.trueColorsText5.y = availableHeight - 10;
                                this.trueColorsText5.alpha = map(this.eventTimer, 2000, 2250, 0.0, 1.0, true);
                                this.trueColorsButton1.exists = true;
                                this.trueColorsButton1.x = this.trueColorsText5.centerX;
                                this.trueColorsButton1.y = this.trueColorsText5.centerY;
                                this.trueColorsButton1.width = this.trueColorsText5.width;
                                this.trueColorsButton1.height = this.trueColorsText5.height;
                                this.trueColorsButton1.anchor.setTo(0.5);
                                this.trueColorsOptionBacking1.visible = true;
                                this.trueColorsOptionBacking1.x = this.trueColorsText5.centerX;
                                this.trueColorsOptionBacking1.y = this.trueColorsText5.centerY;
                                this.trueColorsOptionBacking1.anchor.setTo(0.5);
                                this.trueColorsOptionBacking1.alpha = map(this.eventTimer, 2000, 2250, 0.0, 1.0, true);
                                this.trueColorsMenuIcon.x = this.trueColorsText5.left - this.trueColorsMenuIcon.width;
                                this.trueColorsMenuIcon.y = this.trueColorsText5.centerY;
                                this.trueColorsMenuIcon.alpha = map(this.eventTimer, 2000, 2250, 0.0, 1.0, true);
                                this.trueColorsMenuIcon.rotation += map(game.time.delta, 0, 17, 0, 0.02);
                            }
                            break;
                        case 3000: // finish true colors
                            if (this.eventTimer % 100 < 50)
                                this.trueColorsOptionBacking1.visible = true;
                            else
                                this.trueColorsOptionBacking1.visible = false;

                            this.trueColorsOptionBacking1.alpha = map(this.eventTimer, 0, 750, 1, 0, true);

                            if (this.eventTimer >= 750) {
                                this.trueColorsTitleGroup.x += (-game.width - this.trueColorsTitleGroup.x) * 0.15;
                                this.trueColorsTextGroup.x += (-game.width - this.trueColorsTextGroup.x) * 0.15;
                                this.trueColorsKixelSprites.x += (-game.width - this.trueColorsKixelSprites.x) * 0.15;
                            }

                            if (this.trueColorsTextGroup.right < 0) {
                                currentState = PAINTING;

                                this.trueColorsTitleGroup.setAll('exists', false);
                                this.trueColorsTextGroup.setAll('exists', false);
                                this.trueColorsKixelSprites.setAll('exists', false);

                                controlsDisabled = false;

                                if (device === MOBILE || controlType === KEYBOARD) {
                                    this.virtualCursor.visible = true;
                                    this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
                                    this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
                                    this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                                    this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
                                }

                                this.colorSelectors.forEach(function(button) {
                                    button.inputEnabled = true;
                                    button.input.useHandCursor = true;
                                }, this);
                                this.buttons.forEach(function(button) {
                                    button.inputEnabled = true;
                                    button.input.useHandCursor = true;
                                }, this);

                                game.music = this.mainMusic;
                                if (musicEnabled) {
                                    game.music.play();
                                }
                            }
                            break;
                    }
                    break;
            }

            this.eventTimer += game.time.delta;
            this.trueDelta = Date.now() - this.trueTimerStart - this.trueTimer;
            this.trueTimer = Date.now() - this.trueTimerStart;
            this.trueColorsTimer += this.trueDelta;

            if (currentState !== PAINTING)
                return; // stop all other updates
        }

        if (audioStartTime !== null) {
            if (lastReportedTime !== game.music.currentTime) {
                lastReportedTime = game.music.currentTime;
                musicTime = (this.game.time.time - audioStartTime - pauseTime + lastReportedTime) / 2;
            }
            else {
                musicTime = this.game.time.time - audioStartTime - pauseTime;
            }
            
            if (Math.abs(musicTime - game.music.currentTime) > 200)
                musicTime = game.music.currentTime;

            if (beatNumber !== (Math.floor(musicTime / quarterNote) % beatAmount) + 1) {
                beatNumber = (Math.floor(musicTime / quarterNote) % beatAmount) + 1;

                if (patternNumber !== Math.floor(musicTime / quarterNote / beatAmount) + 1) {
                    patternNumber = Math.floor(musicTime / quarterNote / beatAmount) + 1;

                    if (patternNumber == numSongPatterns + 1)
                        patternNumber = 1;
                }

                //console.log(patternNumber + "-" + beatNumber);
            }
        }

        if (buttonsDown) { // preventing too many inputs
            colorsDown = false;
            this.suckingColor = false;
            currentColorDown = null;
            this.timeOfLastPaletteSwap = -Infinity;
        }
        if (colorsDown) {
            buttonsDown = false;
            this.suckingColor = false;
            currentButtonDown = null;
            this.timeOfLastPaletteSwap = -Infinity;
        }
        if (this.drawing || canvasPointer !== null) {
            colorsDown = false;
            currentColorDown = null;
            buttonsDown = false;
            currentButtonDown = null;
        }

        if (device == DESKTOP) {
            if (game.input.activePointer.leftButton.isDown)
                currentMouseButton = LEFT_MOUSE;
            else if (game.input.activePointer.rightButton.isDown)
                currentMouseButton = RIGHT_MOUSE;
            else
                currentMouseButton = null;
        }

        this.canvas.x += (this.canvas.intendedX - this.canvas.x) * 0.4;
        this.canvas.y += (this.canvas.intendedY - this.canvas.y) * 0.4;

        this.gridGraphics.x = this.canvas.x - this.canvas.intendedX;
        this.gridGraphics.y = this.canvas.y - this.canvas.intendedY;

        this.paletteNameText.y = Math.ceil(this.canvas.top + 1);

        if (device == DESKTOP) {
            if (this.virtualCursor.visible) { // keyboard controls for virtual cursor
                if (this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) {
                    framesSinceArrowPressed++;

                    if (framesSinceArrowPressed >= 15 && this.frameTimer % 2 == 0) {
                        if (this.cursors.up.isDown) {
                            this.virtualCursor.grid.y--;
                        }
                        if (this.cursors.down.isDown) {
                            this.virtualCursor.grid.y++;
                        }
                        if (this.cursors.left.isDown) {
                            this.virtualCursor.grid.x--;
                        }
                        if (this.cursors.right.isDown) {
                            this.virtualCursor.grid.x++;
                        }

                        if (this.virtualCursor.grid.x < 0)
                            this.virtualCursor.grid.x = 31;
                        if (this.virtualCursor.grid.x > 31)
                            this.virtualCursor.grid.x = 0;
                        if (this.virtualCursor.grid.y < 0)
                            this.virtualCursor.grid.y = 31;
                        if (this.virtualCursor.grid.y > 31)
                            this.virtualCursor.grid.y = 0;

                        this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
                        this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);

                        this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                        this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
                    }
                }
            }
            else {
                this.virtualCursor.x = game.input.x;
                this.virtualCursor.y = game.input.y;
            }
        }
        
        if (!controlsDisabled && device == MOBILE && canvasPointer === null) { // moving the virtual cursor
            if (game.input.pointer1.isDown && !game.input.pointer1.wasDown && game.input.pointer1.x >= this.canvas.left && game.input.pointer1.x <= this.canvas.right && game.input.pointer1.y >= this.canvas.top && game.input.pointer1.y <= this.canvas.bottom) {
                canvasPointer = game.input.pointer1;
                prevMouseX = canvasPointer.x;
                prevMouseY = canvasPointer.y;
            }
            else if (game.input.pointer2.isDown && !game.input.pointer2.wasDown && game.input.pointer2.x >= this.canvas.left && game.input.pointer2.x <= this.canvas.right && game.input.pointer2.y >= this.canvas.top && game.input.pointer2.y <= this.canvas.bottom) {
                canvasPointer = game.input.pointer2;
                prevMouseX = canvasPointer.x;
                prevMouseY = canvasPointer.y;
            }
        }

        if (device == MOBILE && canvasPointer !== null) {
            if (canvasPointer.isUp) {
                canvasPointer = null;
            }
            else {
                if (canvasPointer.x !== prevMouseX)
                    this.virtualCursor.canvasPosition.x += (canvasPointer.x - prevMouseX) / 4 * 3;
                if (canvasPointer.y !== prevMouseY)
                    this.virtualCursor.canvasPosition.y += (canvasPointer.y - prevMouseY) / 4 * 3;

                if (this.virtualCursor.canvasPosition.x < 0)
                    this.virtualCursor.canvasPosition.x = 0;
                if (this.virtualCursor.canvasPosition.x > this.canvas.width)
                    this.virtualCursor.canvasPosition.x = this.canvas.width;
                if (this.virtualCursor.canvasPosition.y < 0)
                    this.virtualCursor.canvasPosition.y = 0;
                if (this.virtualCursor.canvasPosition.y > this.canvas.height)
                    this.virtualCursor.canvasPosition.y = this.canvas.height;

                this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;

                this.virtualCursor.grid.x = Math.floor((this.virtualCursor.x - this.canvas.left) / this.canvasScale);
                this.virtualCursor.grid.y = Math.floor((this.virtualCursor.y - this.canvas.top) / this.canvasScale);
            }
        }

        if (!this.drawing && !buttonsDown && !colorsDown && (this.virtualCursor.visible || (game.input.x >= this.canvas.left && game.input.x <= this.canvas.left + this.canvas.width // input happening within canvas
            && game.input.y >= this.canvas.top && game.input.y <= this.canvas.top + this.canvas.height))) {
            
            if (controlType == MOUSE && game.input.x >= this.canvas.left && game.input.x <= this.canvas.left + this.canvas.width
            && game.input.y >= this.canvas.top && game.input.y <= this.canvas.top + this.canvas.height && (game.input.x !== prevMouseX || game.input.y !== prevMouseY))
                this.timeOfLastPaletteSwap = -Infinity;

            if (device == DESKTOP && (game.input.x !== prevMouseX || game.input.y !== prevMouseY)) {
                this.setControlType(MOUSE);

                this.virtualCursor.canvasPosition.x = game.input.x - this.canvas.left;
                this.virtualCursor.canvasPosition.y = game.input.y - this.canvas.top;

                this.virtualCursor.x = game.input.x;
                this.virtualCursor.y = game.input.y;
            }

            currentX = Math.floor((this.virtualCursor.x - this.canvas.left) / this.canvasScale);
            currentY = Math.floor((this.virtualCursor.y - this.canvas.top) / this.canvasScale);
            
            if (currentX < 0 || currentX > 31)
                currentX = null;
            if (currentY < 0 || currentY > 31)
                currentY = null;

            if (currentX !== null && currentY !== null) {
                var color = this.kixel.getPixelRGB(currentX, currentY);
                this.colorUnderCursor = Phaser.Color.RGBtoString(color.r, color.g, color.b, 255, '0x').replace('0xff', '0x');
                for (var x = 0; x < 16; x++) {
                    if (this.colorUnderCursor.substr(2) == palettes.colors[currentPaletteIndex][x].substr(1)) {
                        this.ctrlKeyIcon.intendedX = this.colorSelectors[x].x + this.colorSelectors[x].width;
                        this.ctrlKeyIcon.intendedY = this.colorSelectors[x].y + this.colorSelectors[x].height;
                        break;
                    }
                }
            }
            else
                this.colorUnderCursor = null;

            this.uiGraphics.clear();
            this.uiGraphics.lineStyle(1, 0x000000, 1.0);
            this.uiGraphics.endFill();

            if (!controlsDisabled) {
                if (currentTool == BRUSH) {
                    switch (brushSize) {
                        case 1:
                            this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), this.canvasScale, this.canvasScale);

                            if (symmetryMode === SYM_X || symmetryMode === SYM_BOTH)
                                this.uiGraphics.drawRect(this.canvas.left + ((31 - currentX) * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), this.canvasScale, this.canvasScale);
                            if (symmetryMode === SYM_Y || symmetryMode === SYM_BOTH)
                                this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + ((31 - currentY) * this.canvasScale), this.canvasScale, this.canvasScale);
                            if (symmetryMode === SYM_BOTH)
                                this.uiGraphics.drawRect(this.canvas.left + ((31 - currentX) * this.canvasScale), this.canvas.top + ((31 - currentY) * this.canvasScale), this.canvasScale, this.canvasScale);
                            break;
                        case 2:
                            var width;
                            var height;

                            if (currentX == 31 && currentY == 31) {
                                this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), this.canvasScale, this.canvasScale);
                                width = 1;
                                height = 1;
                            }
                            else if (currentX == 31) {
                                this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), this.canvasScale, this.canvasScale * 2);
                                width = 1;
                                height = 2;
                            }
                            else if (currentY == 31) {
                                this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), this.canvasScale * 2, this.canvasScale);
                                width = 2;
                                height = 1;
                            }
                            else {
                                this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), this.canvasScale * 2, this.canvasScale * 2);
                                width = 2;
                                height = 2;
                            }

                            if (symmetryMode === SYM_X || symmetryMode === SYM_BOTH)
                                this.uiGraphics.drawRect(this.canvas.left + ((31 - currentX - (width - 1)) * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), width * this.canvasScale, height * this.canvasScale);
                            if (symmetryMode === SYM_Y || symmetryMode === SYM_BOTH)
                                this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + ((31 - currentY - (height - 1)) * this.canvasScale), width * this.canvasScale, height * this.canvasScale);
                            if (symmetryMode === SYM_BOTH)
                                this.uiGraphics.drawRect(this.canvas.left + ((31 - currentX - (width - 1)) * this.canvasScale), this.canvas.top + ((31 - currentY - (height - 1)) * this.canvasScale), width * this.canvasScale, height * this.canvasScale);
                            break;
                        case 3:
                            var brushPreviewScaleX = 3;
                            var brushPreviewScaleY = 3;

                            if (currentX == 31)
                                brushPreviewScaleX--;
                            if (currentY == 31)
                                brushPreviewScaleY--;

                            if (currentX > 0) {
                                currentX -= 1;
                            }
                            else {
                                brushPreviewScaleX--;
                            }
                            if (currentY > 0) {
                                currentY -= 1;
                            }
                            else {
                                brushPreviewScaleY--;
                            }

                            this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), this.canvasScale * brushPreviewScaleX, this.canvasScale * brushPreviewScaleY);

                            if (symmetryMode === SYM_X || symmetryMode === SYM_BOTH)
                                this.uiGraphics.drawRect(this.canvas.left + ((31 - currentX - (brushPreviewScaleX - 1)) * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), brushPreviewScaleX * this.canvasScale, brushPreviewScaleY * this.canvasScale);
                            if (symmetryMode === SYM_Y || symmetryMode === SYM_BOTH)
                                this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + ((31 - currentY - (brushPreviewScaleY - 1)) * this.canvasScale), brushPreviewScaleX * this.canvasScale, brushPreviewScaleY * this.canvasScale);
                            if (symmetryMode === SYM_BOTH)
                                this.uiGraphics.drawRect(this.canvas.left + ((31 - currentX - (brushPreviewScaleX - 1)) * this.canvasScale), this.canvas.top + ((31 - currentY - (brushPreviewScaleY - 1)) * this.canvasScale), brushPreviewScaleX * this.canvasScale, brushPreviewScaleY * this.canvasScale);
                            break;
                    }
                }
                else { // if any other tool is selected
                    this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), this.canvasScale, this.canvasScale);

                    if (currentTool === SHAPES) {
                        if (symmetryMode === SYM_X || symmetryMode === SYM_BOTH)
                            this.uiGraphics.drawRect(this.canvas.left + ((31 - currentX) * this.canvasScale), this.canvas.top + (currentY * this.canvasScale), this.canvasScale, this.canvasScale);
                        if (symmetryMode === SYM_Y || symmetryMode === SYM_BOTH)
                            this.uiGraphics.drawRect(this.canvas.left + (currentX * this.canvasScale), this.canvas.top + ((31 - currentY) * this.canvasScale), this.canvasScale, this.canvasScale);
                        if (symmetryMode === SYM_BOTH)
                            this.uiGraphics.drawRect(this.canvas.left + ((31 - currentX) * this.canvasScale), this.canvas.top + ((31 - currentY) * this.canvasScale), this.canvasScale, this.canvasScale);
                    }
                }
            }

            this.uiGraphics.lineStyle(0, 0x000000, 1.0);

            if (device == DESKTOP) {
                if (!wasDown && (currentMouseButton == LEFT_MOUSE || currentMouseButton == RIGHT_MOUSE || this.spaceKey.isDown || this.ctrlKey.isDown)) {
                    justClicked = true;
                }
            }

            if (!controlsDisabled && !this.suckingColor && sfxEnabled && !this.drawing && currentX !== null && currentY !== null && (currentX !== lastX || currentY !== lastY)) {
                game.sfx1.play('click-' + getNote());
            }

            if (!controlsDisabled) {
                if (justClicked && (currentMouseButton !== null || this.spaceKey.isDown) && this.virtualCursor.x >= this.canvas.left && this.virtualCursor.x <= this.canvas.left + this.canvas.width
                && this.virtualCursor.y >= this.canvas.top && this.virtualCursor.y <= this.canvas.top + this.canvas.height) {
                    if (device == DESKTOP) {
                        if (currentTool == BRUSH || currentTool == SHAPES || currentTool == SELECTION_BRUSH || currentTool == SELECTION_MARQUEE) {
                            if (currentMouseButton == LEFT_MOUSE || this.spaceKey.isDown)
                                this.drawing = true;
                            else if (currentMode == SELECTION && currentMouseButton == RIGHT_MOUSE) 
                                this.erasingSelection = true;

                            if (this.virtualCursor.visible) {
                                startX = this.virtualCursor.grid.x;
                                startY = this.virtualCursor.grid.y;
                            }
                            else {
                                startX = Math.floor((game.input.x - this.canvas.left) / this.canvasScale);
                                startY = Math.floor((game.input.y - this.canvas.top) / this.canvasScale);
                            }
                        }
                        else if (currentTool == SELECTION_BUCKET) {
                            if (currentMouseButton == LEFT_MOUSE || this.spaceKey.isDown)
                                this.drawing = true;
                            else if (currentMouseButton == RIGHT_MOUSE || this.ctrlKey.isDown)
                                this.erasingSelection = true;
                        }
                        else if (currentTool == BUCKET && currentMouseButton == LEFT_MOUSE) {
                            this.floodFill(currentX, currentY);
                        }
                    }
                }
                else if (currentMouseButton == RIGHT_MOUSE || this.ctrlKey.isDown) {
                    if (currentMode == DRAW) {
                        if (!this.suckingColor && sfxEnabled)
                            game.sfx2.play('suckColor', 0, 0, true);
                        this.suckingColor = true;

                        game.sfx2.volume += 0.02;
                        if (game.sfx2.volume > 1)
                            game.sfx2.volume = 1;
                    }
                    else if (currentMode == SELECTION) {
                        this.erasingSelection = true;
                    }
                }
                else {
                    if (this.suckingColor)
                        game.sfx2.stop();
                    game.sfx2.volume = 1.0;
                    this.suckingColor = false;
                }
            }
            
        }
        else { // if mouse is not held over canvas
            this.uiGraphics.clear();
            //document.body.style.cursor = "default";
        }

        if (colorsDown) {
            for (var x = 0; x < 16; x++) {
                if (axis == PORTRAIT) {
                    if (currentColorDown == x || (!keyboardButtonDown && game.input.activePointer.x >= this.colorSelectors[x].x &&
                    game.input.activePointer.x < this.colorSelectors[x].x + this.colorSelectors[x].width)) {
                        if (sfxEnabled && currentColorDown !== x)
                            game.sfx1.play('changeColor');
                        
                        currentColorDown = x;
                    }
                }
                else if (axis == LANDSCAPE) {
                    if (currentColorDown == x || (!keyboardButtonDown && game.input.activePointer.y >= this.colorSelectors[x].y &&
                    game.input.activePointer.y < this.colorSelectors[x].y + this.colorSelectors[x].height)) {
                        if (sfxEnabled && currentColorDown !== x)
                            game.sfx1.play('changeColor');
                        
                        currentColorDown = x;
                    }
                }
            }
        }

        if (this.drawing) {
            this.uiGraphics.clear();
            //document.body.style.cursor = "none";

            if (device == DESKTOP) {
                if (currentMouseButton == null && this.spaceKey.isUp) {
                    if (currentTool == SHAPES) {
                        this.printMaskProductToKixel();
                        if (sfxEnabled)
                            game.sfx2.play('finishShape');
                    }

                    this.drawing = false;

                    if (currentMode == DRAW)
                        this.createUndoState();
                    //document.body.style.cursor = "default";
                }
            }

            if (this.drawing && this.virtualCursor.x >= this.canvas.left && this.virtualCursor.x <= this.canvas.left + this.canvas.width
                && this.virtualCursor.y >= this.canvas.top && this.virtualCursor.y <= this.canvas.top + this.canvas.height) {
                currentX = Math.floor((this.virtualCursor.x - this.canvas.left) / this.canvasScale);
                currentY = Math.floor((this.virtualCursor.y - this.canvas.top) / this.canvasScale);
                
                if (currentX < 0 || currentX > 31)
                    currentX = null;
                if (currentY < 0 || currentY > 31)
                    currentY = null;

                //console.log(currentX + ", " + currentY);
                //console.log(game.input.x + ", " + game.input.y);

                this.suckingColor = false;

                if (currentTool == BRUSH && currentX !== null && currentY !== null) {
                    if (brushSize == 3) {
                        currentX -= 1;
                        currentY -= 1;
                    }

                    if (sfxEnabled && (justClicked || lastX !== currentX || lastY !== currentY)) {
                        game.sfx2.play('paint-left-' + getNote());
                    }

                    this.kixel.rect(currentX, currentY, brushSize, brushSize, palettes.colors[currentPaletteIndex][currentColorIndex]);
                    this.canvasKixel.rect(currentX * this.canvasScale, currentY * this.canvasScale, this.canvasScale * brushSize, this.canvasScale * brushSize, palettes.colors[currentPaletteIndex][currentColorIndex]);

                    if (symmetryMode === SYM_X || symmetryMode === SYM_BOTH) {
                        this.kixel.rect(31 - currentX - brushSize + 1, currentY, brushSize, brushSize, palettes.colors[currentPaletteIndex][currentColorIndex]);
                        this.canvasKixel.rect((31 - currentX - brushSize + 1) * this.canvasScale, currentY * this.canvasScale, this.canvasScale * brushSize, this.canvasScale * brushSize, palettes.colors[currentPaletteIndex][currentColorIndex]);
                    }
                    if (symmetryMode === SYM_Y || symmetryMode === SYM_BOTH) {
                        this.kixel.rect(currentX, 31 - currentY - brushSize + 1, brushSize, brushSize, palettes.colors[currentPaletteIndex][currentColorIndex]);
                        this.canvasKixel.rect(currentX * this.canvasScale, (31 - currentY - brushSize + 1) * this.canvasScale, this.canvasScale * brushSize, this.canvasScale * brushSize, palettes.colors[currentPaletteIndex][currentColorIndex]);
                    }
                    if (symmetryMode === SYM_BOTH) {
                        this.kixel.rect(31 - currentX - brushSize + 1, 31 - currentY - brushSize + 1, brushSize, brushSize, palettes.colors[currentPaletteIndex][currentColorIndex]);
                        this.canvasKixel.rect((31 - currentX - brushSize + 1) * this.canvasScale, (31 - currentY - brushSize + 1) * this.canvasScale, this.canvasScale * brushSize, this.canvasScale * brushSize, palettes.colors[currentPaletteIndex][currentColorIndex]);
                    }
                }
                else if (this.drawing && currentTool == SHAPES && currentX !== null && currentY !== null) {
                    this.maskProduct.clear();
                    this.maskProduct.update();
                    this.canvasMaskProduct.clear();

                    var width = currentX - startX;
                    var height = currentY - startY;
                    var color = currentColorIndex;

                    if (justClicked && sfxEnabled) {
                        game.sfx2.play('startShapeLeft', 0, 1.0, true);
                    }

                    if (sfxEnabled && (currentX !== lastX || currentY !== lastY)) {
                        game.sfx1.play('click-C#1');
                    }
                    
                    switch (currentShape) {
                        case OPEN_RECTANGLE:
                            var drawOpenRectangle = function(xPos, yPos, w, h, maskProduct, canvasMaskProduct, canvasScale) {
                                var offsetX;
                                var offsetY;
                                
                                if (w < 0)
                                    offsetX = 1;
                                else
                                    offsetX = 0;
                                if (h < 0)
                                    offsetY = 1;
                                else
                                    offsetY = 0;

                                if (w < 0)
                                    w -= 1;
                                else
                                    w += 1;
                                
                                if (h < 0)
                                    h -= 1;
                                else
                                    h += 1;
                                

                                if (w == 0)
                                    w = 1;
                                if (h == 0)
                                    h = 1;
                                //console.log("w " + w + " h " + h);

                                maskProduct.rect(xPos, yPos, w + (offsetX * 2), 1, palettes.colors[currentPaletteIndex][color]);
                                maskProduct.rect(xPos, yPos + offsetY, 1, h, palettes.colors[currentPaletteIndex][color]);
                                maskProduct.rect(xPos + (offsetX * 2) + w - 1, yPos + offsetY, 1, h, palettes.colors[currentPaletteIndex][color]);
                                maskProduct.rect(xPos, yPos + (offsetY * 2) + (h -  1), w + (offsetX * 2), 1, palettes.colors[currentPaletteIndex][color]);

                                canvasMaskProduct.rect(xPos * canvasScale, yPos * canvasScale, (w + (offsetX * 2)) * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]); // top
                                canvasMaskProduct.rect(xPos * canvasScale, (yPos + offsetY) * canvasScale, 1 * canvasScale, h * canvasScale, palettes.colors[currentPaletteIndex][color]);
                                canvasMaskProduct.rect((xPos + (offsetX * 2) + w - 1) * canvasScale, (yPos + offsetY) * canvasScale, 1 * canvasScale, h * canvasScale, palettes.colors[currentPaletteIndex][color]);
                                canvasMaskProduct.rect(xPos * canvasScale, (yPos + (offsetY * 2) + h - 1) * canvasScale, (w + (offsetX * 2)) * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]); // bottom
                            }

                            drawOpenRectangle(startX, startY, width, height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);

                            if (symmetryMode == SYM_X || symmetryMode == SYM_BOTH) {
                                drawOpenRectangle(31 - startX, startY, -width, height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);
                            }
                            if (symmetryMode == SYM_Y || symmetryMode == SYM_BOTH) {
                                drawOpenRectangle(startX, 31 - startY, width, -height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);
                            }
                            if (symmetryMode == SYM_BOTH) {
                                drawOpenRectangle(31 - startX, 31 - startY, -width, -height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);
                            }
                            break;
                        case CLOSED_RECTANGLE:
                            var offsetX;
                            var offsetY;

                            if (startX > currentX)
                                offsetX = 1;
                            else
                                offsetX = 0;
                            if (startY > currentY)
                                offsetY = 1;
                            else
                                offsetY = 0;

                            if (width < 0)
                                width -= 1;
                            else
                                width += 1;

                            if (height < 0)
                                height -= 1;
                            else
                                height += 1;

                            if (width == 0)
                                width = 1;
                            if (height == 0)
                                height = 1;

                            
                            this.maskProduct.rect(startX + offsetX, startY + offsetY, width, height, palettes.colors[currentPaletteIndex][color]);
                            this.canvasMaskProduct.rect((startX + offsetX) * this.canvasScale, (startY + offsetY) * this.canvasScale, width * this.canvasScale, height * this.canvasScale, palettes.colors[currentPaletteIndex][color]);

                            if (symmetryMode == SYM_X || symmetryMode == SYM_BOTH) {
                                var tempOffsetX;
                                if (offsetX === 1)
                                    tempOffsetX = 0;
                                else
                                    tempOffsetX = 1;

                                this.maskProduct.rect(31 - startX + tempOffsetX, startY + offsetY, -width, height, palettes.colors[currentPaletteIndex][color]);
                                this.canvasMaskProduct.rect((31 - startX + tempOffsetX) * this.canvasScale, (startY + offsetY) * this.canvasScale, -width * this.canvasScale, height * this.canvasScale, palettes.colors[currentPaletteIndex][color]);
                            }
                            if (symmetryMode == SYM_Y || symmetryMode == SYM_BOTH) {
                                var tempOffsetY;
                                if (offsetY === 1)
                                    tempOffsetY = 0;
                                else
                                    tempOffsetY = 1;
                                
                                this.maskProduct.rect(startX + offsetX, 31 - startY + tempOffsetY, width, -height, palettes.colors[currentPaletteIndex][color]);
                                this.canvasMaskProduct.rect((startX + offsetX) * this.canvasScale, (31 - startY + tempOffsetY) * this.canvasScale, width * this.canvasScale, -height * this.canvasScale, palettes.colors[currentPaletteIndex][color]);
                            }
                            if (symmetryMode == SYM_BOTH) {
                                this.maskProduct.rect(31 - startX + tempOffsetX, 31 - startY + tempOffsetY, -width, -height, palettes.colors[currentPaletteIndex][color]);
                                this.canvasMaskProduct.rect((31 - startX + tempOffsetX) * this.canvasScale, (31 - startY + tempOffsetY) * this.canvasScale, -width * this.canvasScale, -height * this.canvasScale, palettes.colors[currentPaletteIndex][color]);
                            }
                            
                            break;
                        case OPEN_ELLIPSE:
                            width = Math.abs(width);
                            height = Math.abs(height);

                            var drawOpenEllipse = function(xPos, yPos, w, h, maskProduct, canvasMaskProduct, canvasScale) {
                                // extreme sides
                                maskProduct.rect(xPos, yPos + h, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                canvasMaskProduct.rect(xPos * canvasScale, (yPos + h) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);

                                maskProduct.rect(xPos, yPos - h, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                canvasMaskProduct.rect(xPos * canvasScale, (yPos - h) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);

                                maskProduct.rect(xPos + w, yPos, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                canvasMaskProduct.rect((xPos + w) * canvasScale, yPos * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);

                                maskProduct.rect(xPos - w, yPos, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                canvasMaskProduct.rect((xPos - w) * canvasScale, yPos * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);
                                
                                var yRange;

                                if (w == 0) {
                                    for (var i = -h; i < h; i++) {
                                        maskProduct.rect(xPos, yPos + i, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                        canvasMaskProduct.rect(xPos * canvasScale, (yPos + i) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);
                                    }
                                }
                                yRange = 0;
                                for (var tempX = -w; tempX < w; tempX++) {
                                    yRange = Math.round(Math.sqrt(h*h * (1.0 - (tempX*tempX) / (w * w))));

                                    if (-h * tempX / (w * Math.sqrt((w*w) - (tempX * tempX))) < 0)
                                        break;

                                    maskProduct.rect(xPos + tempX, yPos + yRange, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    canvasMaskProduct.rect((xPos + tempX) * canvasScale, (yPos + yRange) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);

                                    maskProduct.rect(xPos - tempX, yPos + yRange, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    canvasMaskProduct.rect((xPos - tempX) * canvasScale, (yPos + yRange) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);

                                    maskProduct.rect(xPos + tempX, yPos - yRange, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    canvasMaskProduct.rect((xPos + tempX) * canvasScale, (yPos - yRange) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);

                                    maskProduct.rect(xPos - tempX, yPos - yRange, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    canvasMaskProduct.rect((xPos - tempX) * canvasScale, (yPos - yRange) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);
                                }
                                
                                for (var tempY = 1; tempY < yRange + 4; tempY++) {
                                    var dx = Math.round(Math.sqrt(w*w * (1.0 - (tempY*tempY) / (h * h))));

                                    maskProduct.rect(xPos + dx, yPos + tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    canvasMaskProduct.rect((xPos + dx) * canvasScale, (yPos + tempY) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);

                                    maskProduct.rect(xPos - dx, yPos + tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    canvasMaskProduct.rect((xPos - dx) * canvasScale, (yPos + tempY) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);

                                    maskProduct.rect(xPos + dx, yPos - tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    canvasMaskProduct.rect((xPos + dx) * canvasScale, (yPos - tempY) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);

                                    maskProduct.rect(xPos - dx, yPos - tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    canvasMaskProduct.rect((xPos - dx) * canvasScale, (yPos - tempY) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);
                                }
                            }

                            drawOpenEllipse(startX, startY, width, height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);

                            if (symmetryMode == SYM_X || symmetryMode == SYM_BOTH) {
                                drawOpenEllipse(31 - startX, startY, width, height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);
                            }

                            if (symmetryMode == SYM_Y || symmetryMode == SYM_BOTH) {
                                drawOpenEllipse(startX, 31 - startY, width, height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);
                            }

                            if (symmetryMode == SYM_BOTH) {
                                drawOpenEllipse(31 - startX, 31 - startY, width, height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);
                            }
                            
                            break;
                        case CLOSED_ELLIPSE:
                            width = Math.abs(width);
                            height = Math.abs(height);

                            for (var tempX = -width; tempX < width + 1; tempX++) {
                                var yRange = Math.round(Math.sqrt(height*height * (1.0 - ((tempX*tempX) / ((width + 1) * (width + 1))))));
                                //var yRange = Math.floor(Math.sqrt((width*width) - (tempX*tempX)));

                                for (var tempY = startY - yRange; tempY < startY + yRange + 1; tempY++) {
                                    this.maskProduct.rect(startX + tempX, tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    this.canvasMaskProduct.rect((startX + tempX) * this.canvasScale, tempY * this.canvasScale, 1 * this.canvasScale, 1 * this.canvasScale, palettes.colors[currentPaletteIndex][color]);        
                                }
                            }

                            if (symmetryMode == SYM_X || symmetryMode == SYM_BOTH) {
                                var mirrorX = 31 - startX;

                                for (var tempX = -width; tempX < width + 1; tempX++) {
                                    var yRange = Math.round(Math.sqrt(height*height * (1.0 - ((tempX*tempX) / ((width + 1) * (width + 1))))));
                                    //var yRange = Math.floor(Math.sqrt((width*width) - (tempX*tempX)));

                                    for (var tempY = startY - yRange; tempY < startY + yRange + 1; tempY++) {
                                        this.maskProduct.rect(mirrorX + tempX, tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                        this.canvasMaskProduct.rect((mirrorX + tempX) * this.canvasScale, tempY * this.canvasScale, 1 * this.canvasScale, 1 * this.canvasScale, palettes.colors[currentPaletteIndex][color]);        
                                    }
                                }
                            }

                            if (symmetryMode == SYM_Y || symmetryMode == SYM_BOTH) {
                                var mirrorY = 31 - startY;

                                for (var tempX = -width; tempX < width + 1; tempX++) {
                                    var yRange = Math.round(Math.sqrt(height*height * (1.0 - ((tempX*tempX) / ((width + 1) * (width + 1))))));

                                    for (var tempY = mirrorY - yRange; tempY < mirrorY + yRange + 1; tempY++) {
                                        this.maskProduct.rect(startX + tempX, tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                        this.canvasMaskProduct.rect((startX + tempX) * this.canvasScale, tempY * this.canvasScale, 1 * this.canvasScale, 1 * this.canvasScale, palettes.colors[currentPaletteIndex][color]);        
                                    }
                                }
                            }

                            if (symmetryMode == SYM_BOTH) {
                                var mirrorX = 31 - startX;
                                var mirrorY = 31 - startY;

                                for (var tempX = -width; tempX < width + 1; tempX++) {
                                    var yRange = Math.round(Math.sqrt(height*height * (1.0 - ((tempX*tempX) / ((width + 1) * (width + 1))))));
                                    //var yRange = Math.floor(Math.sqrt((width*width) - (tempX*tempX)));

                                    for (var tempY = mirrorY - yRange; tempY < mirrorY + yRange + 1; tempY++) {
                                        this.maskProduct.rect(mirrorX + tempX, tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                        this.canvasMaskProduct.rect((mirrorX + tempX) * this.canvasScale, tempY * this.canvasScale, 1 * this.canvasScale, 1 * this.canvasScale, palettes.colors[currentPaletteIndex][color]);        
                                    }
                                }
                            }

                            break;
                        case LINE:
                            var drawLine = function(xPos, yPos, w, h, maskProduct, canvasMaskProduct, canvasScale) {
                                if (w == 0 && h == 0) {
                                    maskProduct.rect(xPos, yPos, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                    canvasMaskProduct.rect(xPos * canvasScale, yPos * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);
                                }
                                else if (Math.abs(w) > Math.abs(h)) {
                                    for (var tempX = 0; tempX < Math.abs(w) + 1; tempX = Math.abs(tempX) + 1) {
                                        var tempY = Math.round(Math.abs(h) / Math.abs(w) * tempX);

                                        if (w < 0)
                                            tempX = Math.abs(tempX) * -1;
                                        if (h < 0)
                                            tempY = Math.abs(tempY) * -1;

                                        maskProduct.rect(xPos + tempX, yPos + tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                        canvasMaskProduct.rect((xPos + tempX) * canvasScale, (yPos + tempY) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);        
                                    }
                                }
                                else {
                                    for (var tempY = 0; tempY < Math.abs(h) + 1; tempY = Math.abs(tempY) + 1) {
                                        var tempX = Math.round(Math.abs(w) / Math.abs(h) * tempY);

                                        if (w < 0)
                                            tempX = Math.abs(tempX) * -1;
                                        if (h < 0)
                                            tempY = Math.abs(tempY) * -1;

                                        maskProduct.rect(xPos + tempX, yPos + tempY, 1, 1, palettes.colors[currentPaletteIndex][color]);
                                        canvasMaskProduct.rect((xPos + tempX) * canvasScale, (yPos + tempY) * canvasScale, 1 * canvasScale, 1 * canvasScale, palettes.colors[currentPaletteIndex][color]);        
                                    }
                                }     
                            };
                            
                            drawLine(startX, startY, width, height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);

                            if (symmetryMode == SYM_X || symmetryMode == SYM_BOTH) {
                                drawLine(31 - startX, startY, -width, height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);
                            }

                            if (symmetryMode == SYM_Y || symmetryMode == SYM_BOTH) {
                                drawLine(startX, 31 - startY, width, -height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);
                            }

                            if (symmetryMode == SYM_BOTH) {
                                drawLine(31 - startX, 31 - startY, -width, -height, this.maskProduct, this.canvasMaskProduct, this.canvasScale);
                            }

                            break;
                    }

                }
                else if (currentMode == SELECTION && currentX !== null && currentY !== null) {
                    if (justClicked && this.maskProduct.getPixel(currentX, currentY).a !== 0) { // start dragging selection
                        draggingSelection = true;
                        this.undoMaskProduct.clear();
                        this.undoMaskProduct.copy(this.maskProduct);

                        if (sfxEnabled) {
                            lastChord = [ getChord()[0], getChord()[1], getChord()[2] ];
                            game.sfx1.play('choir-' + getChord()[0], 0, 0.5, true);
                            game.sfx2.play('choir-' + getChord()[1], 0, 0.5, true);
                            game.sfx3.play('choir-' + getChord()[2], 0, 0.5, true);
                        }

                        if (selectMode == CUT) { // "cut" selected pixels
                            for (var x = 0; x < 32; x++) {
                                for (var y = 0; y < 32; y++) {
                                    if (this.maskProduct.getPixel(x, y).a !== 0) {
                                        this.kixel.rect(x, y, 1, 1, palettes.colors[currentPaletteIndex][0]);
                                        this.canvasKixel.rect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale, palettes.colors[currentPaletteIndex][0]);
                                    }
                                }
                            }
                        }

                        startX = currentX;
                        startY = currentY;

                        this.maskArea.clear();
                    }
                    else if (!draggingSelection && !compareColors(this.maskProduct.getPixel(currentX, currentY), this.kixel.getPixel(currentX, currentY))) {
                        if (currentTool == SELECTION_BRUSH && (justClicked || lastX !== currentX || lastY !== currentY)) {
                            if (sfxEnabled)
                                game.sfx2.play('paint-right-' + getNote());

                            let underlyingColor = Phaser.Color.updateColor(this.kixel.getPixel(currentX, currentY)).color.toString(16);
                            underlyingColor = "000000".substr(0, 6 - underlyingColor.length) + underlyingColor;

                            this.maskProduct.rect(currentX, currentY, 1, 1, "#" + underlyingColor);
                            this.maskArea.beginFill(0x000000, 1.0);
                            this.maskArea.drawRect(currentX * this.canvasScale, currentY * this.canvasScale, this.canvasScale, this.canvasScale);
                            this.maskArea.endFill();
                            this.maskProduct.update();
                        }
                        else if (currentTool == SELECTION_MARQUEE && justClicked) {
                            startX = currentX;
                            startY = currentY;

                            if (sfxEnabled)
                                game.sfx2.play('startShapeRight', 0, 1.0, true);

                            drawingSelectionBox = true;
                        }
                        else if (currentTool == SELECTION_BUCKET && justClicked) {
                            this.floodFill(currentX, currentY, true);
                        }
                    }
                }

            }
        }
        else if (this.erasingSelection) {
            if (currentTool == SELECTION_BRUSH && (justClicked || lastX !== currentX || lastY !== currentY)) {
                if (this.maskProduct.getPixel(currentX, currentY).a !== 0) {
                    if (sfxEnabled)
                        game.sfx2.play('hand-deselect-' + getNote());

                    this.maskProduct.setPixel32(currentX, currentY, 0, 0, 0, 0);
                    this.maskProduct.update();
                    this.maskArea.clear();
                    this.maskArea.beginFill(0x000000, 0.0);
                    for (var x = 0; x < 32; x++) {
                        for (var y = 0; y < 32; y++) {
                            if (this.maskProduct.getPixel(x, y).a !== 0) {
                                this.maskArea.drawRect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale);
                            }
                        }
                    }
                    this.maskArea.endFill();
                }
            }
            else if (currentTool == SELECTION_MARQUEE && justClicked) {
                startX = currentX;
                startY = currentY;

                if (justClicked && sfxEnabled) {
                    game.sfx2.play('negativeSelectBox', 0, 1.0, true);
                }

                if (sfxEnabled && (currentX !== lastX || currentY !== lastY)) {
                    game.sfx1.play('click-C#1');
                }

                drawingSelectionBox = true;
            }
            else if (currentTool == SELECTION_BUCKET && justClicked) {
                this.floodFill(currentX, currentY, true, true);
            }
        }
        else if (this.suckingColor && this.virtualCursor.x >= this.canvas.left && this.virtualCursor.x <= this.canvas.left + this.canvas.width
                && this.virtualCursor.y >= this.canvas.top && this.virtualCursor.y <= this.canvas.top + this.canvas.height) {
            for (var x = 0; x < 16; x++) {
                if (this.colorUnderCursor.substring(2) == palettes.colors[currentPaletteIndex][x].substring(1)) {
                    if (sfxEnabled && currentColorIndex !== x)
                        game.sfx1.play('changeColor');

                    currentColorIndex = x;
                    break;
                }
            }
        }

        if (drawingSelectionBox && currentX !== null && currentY !== null) {
            var width = currentX - startX;
            var height = currentY - startY;
            var offsetX;
            var offsetY;

            if (startX > currentX)
                offsetX = 1;
            else
                offsetX = 0;

            if (startY > currentY)
                offsetY = 1;
            else
                offsetY = 0;

            if (width < 0)
                width -= 1;
            else
                width += 1;

            if (height < 0)
                height -= 1;
            else
                height += 1;

            if (width == 0)
                width = 1;
            if (height == 0)
                height = 1;

            if (this.erasingSelection) {
                this.maskArea.clear();
            
                this.maskArea.beginFill(0x000000, 1.0);

                let boxLeft = startX + offsetX;
                let boxTop = startY + offsetY;

                if (width < 0) {
                    boxLeft = startX + offsetX + width;
                    width = Math.abs(width);
                }
                if (height < 0) {
                    boxTop = startY + offsetY + height;
                    height = Math.abs(height);
                }
                
                for (var x = 0; x < 32; x++) {
                    for (var y = 0; y < 32; y++) {
                        if (this.maskProduct.getPixel(x, y).a !== 0) {
                            if (!(x >= boxLeft && x < boxLeft + width) || !(y >= boxTop && y < boxTop + height)) {
                                this.maskArea.drawRect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale);
                            }
                        }
                    }
                }

                if (currentMouseButton == null && this.ctrlKey.isUp) {
                    drawingSelectionBox = false;

                    this.maskProduct.clear(); // this relies on the bitmapdata not updating right away

                    for (var x = 0; x < 32; x++) {
                        for (var y = 0; y < 32; y++) {
                            if (this.maskProduct.getPixel(x, y).a !== 0) {
                                if (!(x >= boxLeft && x < boxLeft + width) || !(y >= boxTop && y < boxTop + height)) {
                                    this.maskProduct.copy(this.kixel, x, y, 1, 1);
                                    this.maskArea.drawRect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale);
                                }
                            }
                        }
                    }

                    game.sfx2.play('finishNegativeSelect');
                }

                this.maskProduct.update();
            }
            else {
                this.maskArea.clear();
            
                this.maskArea.beginFill(0x000000, 1.0);
                for (var x = 0; x < 32; x++) {
                    for (var y = 0; y < 32; y++) {
                        if (this.maskProduct.getPixel(x, y).a !== 0) {
                            this.maskArea.drawRect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale);
                        }
                    }
                }
                
                if (width < 0 && height > 0) // this counteracts a strange effect where the overlapping rectangles cancel each other out
                    this.maskArea.drawRect((startX + offsetX + width) * this.canvasScale, (startY + offsetY) * this.canvasScale, Math.abs(width) * this.canvasScale, height * this.canvasScale);    
                else if (width > 0 && height < 0)
                    this.maskArea.drawRect((startX + offsetX) * this.canvasScale, (startY + offsetY + height) * this.canvasScale, width * this.canvasScale, Math.abs(height) * this.canvasScale);
                else
                    this.maskArea.drawRect((startX + offsetX) * this.canvasScale, (startY + offsetY) * this.canvasScale, width * this.canvasScale, height * this.canvasScale);
                this.maskArea.endFill();

                if (currentMouseButton == null && this.spaceKey.isUp) {
                    this.maskProduct.copy(this.kixel, startX + offsetX, startY + offsetY, width, height);
                    this.maskProduct.update();

                    game.sfx2.play('finishShape');
                    drawingSelectionBox = false;
                }
            }
            
        }

        if (currentMouseButton == null && this.ctrlKey.isUp) {
            this.erasingSelection = false;
        }

        if (draggingSelection) {
            if (currentX === null)
                currentX = lastX;
            if (currentY === null)
                currentY = lastY;

            var differenceX = currentX - startX;
            var differenceY = currentY - startY;

            this.canvasMaskProduct.clear();
            for (var x = 0; x < 32; x++) {
                for (var y = 0; y < 32; y++) {
                    if (this.maskProduct.getPixel(x, y).a !== 0) {
                        let color = Phaser.Color.updateColor(this.maskProduct.getPixel(x, y)).color.toString(16);
                        color = "000000".substr(0, 6 - color.length) + color;

                        this.canvasMaskProduct.rect((x + differenceX) * this.canvasScale, (y + differenceY) * this.canvasScale, this.canvasScale, this.canvasScale, "#" + color);
                    }
                }
            }
            //this.canvasMaskProduct.copy(this.maskProduct, 0, 0, 32, 32, differenceX, differenceY, 32 * this.canvasScale, 32 * this.canvasScale, 0, 0, 0, 1, 1, 1, null, true); 

            if (sfxEnabled && (getChord()[0] !== lastChord[0] || getChord()[1] !== lastChord[1] || getChord()[2] !== lastChord[2])) {
                lastChord = [ getChord()[0], getChord()[1], getChord()[2] ];
                game.sfx1.play('choir-' + getChord()[0], 0, 0.5, true);
                game.sfx2.play('choir-' + getChord()[1], 0, 0.5, true);
                game.sfx3.play('choir-' + getChord()[2], 0, 0.5, true);
            }
            

            if (currentMouseButton == null && this.spaceKey.isUp) { // stop dragging
                game.sfx1.stop();
                if (differenceX === 0 && differenceY === 0)
                    game.sfx2.play('cancelDrag');
                else
                    game.sfx2.play('placeSelection');
                game.sfx3.stop();

                draggingSelection = false;
                for (var x = 0; x < 32; x++) {
                    for (var y = 0; y < 32; y++) {
                        if (this.maskProduct.getPixel(x, y).a !== 0) {
                            this.maskArea.beginFill(0x000000, 1.0);
                            this.maskArea.drawRect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale);
                            this.maskArea.endFill();
                        }
                    }
                }

                this.printMaskProductToKixel(true, differenceX, differenceY);

                if (differenceX !== 0 || differenceY !== 0) {
                    this.createUndoState();
                    createSelectionOnUndo = true;
                }
                else {
                    this.undoMaskProduct.clear();
                }
            }
        }

        if (device == MOBILE && justClicked) {
            startX = this.virtualCursor.grid.x;
            startY = this.virtualCursor.grid.y;

            if (currentTool == BUCKET)
                this.floodFill(currentX, currentY);
        }

        this.preview.x += (this.preview.intendedX - this.preview.x) * 0.33;
        this.preview.y += (this.preview.intendedY - this.preview.y) * 0.33;
        this.buttons.forEach(function(button) {
            button.x += (button.intendedX - button.x) * 0.33;
            button.y += (button.intendedY - button.y) * 0.33;
            button.icon.x = button.x + (button.width / 2);
            button.icon.y = button.y - (button.height / 2);
            button.label.x = button.x + (button.width / 8) + 4;
            button.label.y = button.y - (button.height / 8) - 18;
        }, this);

        if ((device == DESKTOP && currentMouseButton == null && wasDown) || (device == MOBILE && game.input.activePointer.isUp)) {
            if (colorsDown) {
                for (x = 0; x < this.colorSelectors.length; x++) {
                    if (axis == PORTRAIT) {
                        if (game.input.activePointer.x > this.colorSelectors[x].x && game.input.activePointer.x < this.colorSelectors[x].x + this.colorSelectors[x].width) {
                            this.changeColor(x);
                            break;
                        }
                    }
                    else if (axis == LANDSCAPE) {
                        if (game.input.activePointer.y > this.colorSelectors[x].y && game.input.activePointer.y < this.colorSelectors[x].y + this.colorSelectors[x].height) {
                            this.changeColor(x);
                            break;
                        }
                    }
                }

                colorsDown = false;
            }
            else if (buttonsDown) {
                for (x = 0; x < this.buttons.length; x++) {
                    if (axis == PORTRAIT) {
                        if (game.input.activePointer.x > this.buttons[x].x && game.input.activePointer.x < this.buttons[x].x + this.buttons[x].width) {
                            this.buttons[x].executeButtonFunction(this.buttons[x], game.input.activePointer, true);

                            break;
                        }
                    }
                    else if (axis == LANDSCAPE) {
                        if (game.input.activePointer.y < this.buttons[x].y && game.input.activePointer.y > this.buttons[x].y - this.buttons[x].height) {
                            this.buttons[x].executeButtonFunction(this.buttons[x], game.input.activePointer, true);

                            break;
                        }
                    }
                }

                buttonsDown = false;
                currentButtonDown = null;
            }
            else if (optionsDown) {

            }
        }

        lastX = currentX;
        lastY = currentY;

        currentX = Math.floor((this.virtualCursor.x - this.canvas.left) / this.canvasScale); // repeat to correct for brushSize 3
        currentY = Math.floor((this.virtualCursor.y - this.canvas.top) / this.canvasScale);

        if (currentX < 0 || currentX > 31)
            currentX = null;
        if (currentY < 0 || currentY > 31)
            currentY = null;

        // DRAW GRAPHICS

        for (var x = 0; x < this.bgSprites.length; x++) {
            this.bgSprites.children[x].x -= 2;
            this.bgSprites.children[x].y += 1;

            if (this.bgSprites.children[x].x < -370)
                this.bgSprites.children[x].x = game.width;
            if (this.bgSprites.children[x].y > game.height + 130)
                this.bgSprites.children[x].y = -138;
        }

        this.underlayGraphics.clear();
        this.overlayGraphics.clear();

        // COLOR SELECTORS
        this.drawColorSelectors();

        // RIGHT-SIDE BUTTONS
        this.drawButtons();

        // LOADING IMAGE

        if (currentState == LOADING_ANIM) {
            for (var pixel = loadAnimProgress; pixel < Math.floor(map(this.eventTimer, 0, 3000, 0, 1024, true)); pixel++) {
                var x = pixel % 32;
                var y = Math.floor(pixel / 32);
                this.kixel.copy(this.maskProduct, x, y, 1, 1);
            }

            this.refreshCanvas();

            loadAnimProgress = Math.floor(map(this.eventTimer, 0, 3000, 0, 1024, true));

            if (loadAnimProgress >= 1024) { // finish loading
                currentState = PAINTING;
                controlsDisabled = false;

                game.sfx1.stop();

                state.colorSelectors.forEach(function(button) {
                    button.inputEnabled = true;
                    button.input.useHandCursor = true;
                }, this);
                state.buttons.forEach(function(button) {
                    button.inputEnabled = true;
                    button.input.useHandCursor = true;
                }, this);

                if (sfxEnabled)
                    game.sfx2.play('saveKixel');

                if (audioMode == MUSIC_SFX) {
                    musicEnabled = true;
                    game.music.play();
                }

                if (loadedPalette !== null) {
                    this.changePalette(loadedPalette, false);
                    loadedPalette = null;
                }

                if (device === MOBILE || controlType === KEYBOARD) {
                    this.virtualCursor.visible = true;
                    this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                    this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
                }

                this.maskProduct.clear();
                this.createUndoState();
            }
        }

        // COMPO INFO
        if (typeof compoNumber !== 'undefined')
            this.drawCompoStuff();
        
        // MAIN MENU STUFF
        this.middleGraphics.clear();
        this.drawer.exists = false;

        if (currentState == MAIN_MENU || currentState == SAVE_MENU || currentState == SUBMISSION_MENU || currentState == MESSAGE || currentState == LOADING) {
            this.virtualCursor.visible = false;

            if (menuShakeIntensity > 0) {
                menuShakeAngle += 180 + Math.random(-60, 60);
                menuShakeOffsetX = Math.sin(menuShakeAngle) * menuShakeIntensity;
                menuShakeOffsetY = Math.cos(menuShakeAngle) * menuShakeIntensity;

                menuShakeIntensity *= 0.95;

                if (menuShakeIntensity < 1) {
                    menuShakeIntensity = 0;
                    menuShakeOffsetX = 0;
                    menuShakeOffsetY = 0;
                }
            }

            if (this.drawerOpen) {
                this.drawerPosition = map(this.eventTimer, 0, 650, 0, this.trueColorsSelector.height + 30, true);
            }

            if (typeof username !== 'undefined' && currentState !== MESSAGE && currentState !== LOADING) { // drawer
                if (!this.drawerOpen) {
                    this.drawer.exists = true;
                    this.drawer.x = this.mainMenu.left;
                    this.drawer.y = this.mainMenu.bottom;
                    this.drawer.width = this.mainMenu.width;
                    this.drawer.height = 30;
                }

                this.trueColorsSelector.x = this.mainMenu.left + 10;
                this.trueColorsSelector.y = this.mainMenu.bottom - 30 + this.drawerPosition;

                this.trueColorsStatus.x = this.mainMenu.right - 10;
                this.trueColorsStatus.y = this.mainMenu.bottom - 30 + this.drawerPosition;

                if (controlType === KEYBOARD) {
                    this.trueColorsSelector.label.x = this.trueColorsSelector.x;
                    this.trueColorsSelector.label.y = this.trueColorsSelector.y;
                    this.trueColorsSelector.label.exists = true;
                }
                else
                    this.trueColorsSelector.label.exists = false;

                if (typeof trueColorsRecharge !== 'undefined') {
                    let timer = this.getCountdownTimer(trueColorsRecharge);
                    if (timer[4] == true)
                        this.trueColorsStatus.setText("Can play again in:\nRefresh!");
                    else
                        this.trueColorsStatus.setText("Can play again in:\n" + timer[1] + "h " + timer[2] + "m " + timer[3] + "s");
                }

                this.middleGraphics.beginFill(0x964b00, 1.0);
                this.middleGraphics.drawRoundedRect(this.mainMenu.left, this.mainMenu.centerY + this.drawerPosition, this.mainMenu.width, (this.mainMenu.height / 2) + 30, 30);
                this.middleGraphics.beginFill(0xbc8c5c, 1.0);
                this.middleGraphics.drawRoundedRect(this.mainMenu.left, this.mainMenu.centerY + this.drawerPosition, this.mainMenu.width, (this.mainMenu.height / 2), 30);
                this.middleGraphics.beginFill(0x000000, 1.0);
                this.middleGraphics.drawRect(this.mainMenu.left + 10, this.mainMenu.centerY + this.drawerPosition, this.mainMenu.width - 20, (this.mainMenu.height / 2) - 30);
            }

            this.mainMenu.x = game.width / 2 + menuShakeOffsetX;
            this.mainMenu.y += ((this.getAvailableHeight() / 2) - this.mainMenu.y) * 0.33;
            this.mainMenu.y = this.mainMenu.y + menuShakeOffsetY;

            this.middleGraphics.beginFill(0x000000, 0.5);
            this.middleGraphics.drawRect(0, 0, game.width, game.height); // curtain

            if (currentState == MESSAGE || currentState == LOADING)
                this.uiGraphics.beginFill(0xeeeeee, 1.0);
            else
                this.uiGraphics.beginFill(0x9999cc, 1.0);
            this.uiGraphics.drawRoundedRect(this.mainMenu.left, this.mainMenu.top, this.mainMenu.width, this.mainMenu.height, 20);

            this.cancelButton.x = this.mainMenu.left + 10;
            this.cancelButton.y = this.mainMenu.bottom - 10;

            if (currentState == MAIN_MENU || currentState == SUBMISSION_MENU || currentState == SAVE_MENU) { // draw cancel button
                this.uiGraphics.lineStyle(5, 0x000000, 1.0);
                this.uiGraphics.beginFill(0x000000, 1.0);
                this.uiGraphics.drawRoundedRect(this.cancelButton.left, this.cancelButton.top + (this.cancelButton.isDown ? OPTION_DOWN_OFFSET : 0), this.cancelButton.width, this.cancelButton.height + 5 - (this.cancelButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                this.uiGraphics.lineStyle(0, 0x000000, 1.0);
                this.uiGraphics.beginFill(0xcc0000, 1.0);
                this.uiGraphics.drawRoundedRect(this.cancelButton.left, this.cancelButton.top + (this.cancelButton.isDown ? OPTION_DOWN_OFFSET : 0), this.cancelButton.width, this.cancelButton.height, 10);
                this.uiGraphics.endFill();

                this.uiGraphics.lineStyle(10, 0xffffff, 1.0);
                this.uiGraphics.moveTo(this.cancelButton.left + 10, this.cancelButton.top + 10 + (this.cancelButton.isDown ? OPTION_DOWN_OFFSET : 0));
                this.uiGraphics.lineTo(this.cancelButton.left + this.cancelButton.width - 10, this.cancelButton.top + this.cancelButton.height - 10 + (this.cancelButton.isDown ? OPTION_DOWN_OFFSET : 0));
                this.uiGraphics.moveTo(this.cancelButton.left + 10, this.cancelButton.bottom - 10 + (this.cancelButton.isDown ? OPTION_DOWN_OFFSET : 0));
                this.uiGraphics.lineTo(this.cancelButton.left + this.cancelButton.width - 10, this.cancelButton.top + 10 + (this.cancelButton.isDown ? OPTION_DOWN_OFFSET : 0));
                this.uiGraphics.lineStyle(0, 0x000000, 1.0);

                if (controlType == KEYBOARD) {
                    this.cancelButton.label.exists = true;
                    this.cancelButton.label.x = this.cancelButton.left + 10;
                    this.cancelButton.label.y = this.cancelButton.bottom - 26 + (this.cancelButton.isDown ? OPTION_DOWN_OFFSET : 0);
                }
                else {
                    this.cancelButton.label.exists = false;
                }
            }
            else {
                this.cancelButton.label.exists = false;
            }
            
            if (currentState == MAIN_MENU || currentState == SUBMISSION_MENU) {
                if (controlType == KEYBOARD && this.submitButton.exists) {
                    this.submitButton.label.exists = true;
                    this.submitButton.label.x = this.submitButton.left + 10;
                    this.submitButton.label.y = this.submitButton.bottom - 26 + (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0);
                }
                else {
                    this.submitButton.label.exists = false;
                }
            }

            switch (currentState) {
                case MAIN_MENU:
                    this.clearCanvasButton.x = this.mainMenu.left + 10;
                    this.clearCanvasButton.y = this.mainMenu.top + 10;
                    this.clearCanvasButtonText.x = this.clearCanvasButton.right - 5;
                    this.clearCanvasButtonText.y = this.clearCanvasButton.bottom - 5 + (this.clearCanvasButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.clearCanvasButton.icon.x = this.clearCanvasButton.centerX;
                    this.clearCanvasButton.icon.y = this.clearCanvasButton.centerY + (this.clearCanvasButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    if (controlType == KEYBOARD) {
                        this.clearCanvasButton.label.exists = true;
                        this.clearCanvasButton.label.x = this.clearCanvasButton.left + 10;
                        this.clearCanvasButton.label.y = this.clearCanvasButton.bottom - 26 + (this.clearCanvasButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else {
                        this.clearCanvasButton.label.exists = false;
                    }

                    this.offsetButton.x = this.mainMenu.centerX;
                    this.offsetButton.y = this.mainMenu.top + 10;
                    this.offsetButtonText.x = this.offsetButton.right - 5;
                    this.offsetButtonText.y = this.offsetButton.bottom - 5 + (this.offsetButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.offsetButton.icon.x = this.offsetButton.centerX;
                    this.offsetButton.icon.y = this.offsetButton.centerY + (this.offsetButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    if (controlType == KEYBOARD) {
                        this.offsetButton.label.exists = true;
                        this.offsetButton.label.x = this.offsetButton.left + 10;
                        this.offsetButton.label.y = this.offsetButton.bottom - 26 + (this.offsetButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else {
                        this.offsetButton.label.exists = false;
                    }

                    this.symmetryButton.x = this.mainMenu.right - 10;
                    this.symmetryButton.y = this.mainMenu.top + 10;
                    this.symmetryButtonText.x = this.symmetryButton.right - 5;
                    this.symmetryButtonText.y = this.symmetryButton.bottom - 5 + (this.symmetryButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.symmetryButton.icon.x = this.symmetryButton.centerX;
                    this.symmetryButton.icon.y = this.symmetryButton.centerY + (this.symmetryButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    if (controlType == KEYBOARD) {
                        this.symmetryButton.label.exists = true;
                        this.symmetryButton.label.x = this.symmetryButton.left + 10;
                        this.symmetryButton.label.y = this.symmetryButton.bottom - 26 + (this.symmetryButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else {
                        this.symmetryButton.label.exists = false;
                    }

                    this.gridButton.x = this.mainMenu.left + 10;
                    this.gridButton.y = this.mainMenu.top + (this.mainMenu.height / 4) + 20;
                    this.gridButtonText.x = this.gridButton.right - 5;
                    this.gridButtonText.y = this.gridButton.bottom - 5 + (this.gridButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.gridButton.icon.x = this.gridButton.centerX;
                    this.gridButton.icon.y = this.gridButton.centerY + (this.gridButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    if (controlType == KEYBOARD) {
                        this.gridButton.label.exists = true;
                        this.gridButton.label.x = this.gridButton.left + 10;
                        this.gridButton.label.y = this.gridButton.bottom - 26 + (this.gridButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else {
                        this.gridButton.label.exists = false;
                    }

                    this.audioButton.x = this.mainMenu.right - 10;
                    this.audioButton.y = this.mainMenu.top + (this.mainMenu.height / 4) + 20;
                    this.audioButtonText.x = this.audioButton.right - 5;
                    this.audioButtonText.y = this.audioButton.bottom - 5 + (this.audioButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.audioButton.icon.x = this.audioButton.centerX;
                    this.audioButton.icon.y = this.audioButton.centerY + (this.audioButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    if (controlType == KEYBOARD) {
                        this.audioButton.label.exists = true;
                        this.audioButton.label.x = this.audioButton.left + 10;
                        this.audioButton.label.y = this.audioButton.bottom - 26 + (this.audioButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else {
                        this.audioButton.label.exists = false;
                    }

                    this.saveButton.x = this.mainMenu.left + 10;
                    this.saveButton.y = this.mainMenu.top + (this.mainMenu.height / 2) + 30;
                    this.saveButtonText.x = this.saveButton.right - 5;
                    this.saveButtonText.y = this.saveButton.bottom - 5 + (this.saveButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.saveButton.icon.x = this.saveButton.centerX;
                    this.saveButton.icon.y = this.saveButton.centerY + (this.saveButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    if (controlType == KEYBOARD) {
                        this.saveButton.label.exists = true;
                        this.saveButton.label.x = this.saveButton.left + 10;
                        this.saveButton.label.y = this.saveButton.bottom - 26 + (this.saveButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else {
                        this.saveButton.label.exists = false;
                    }

                    this.loadButton.x = this.mainMenu.right - 10;
                    this.loadButton.y = this.mainMenu.top + (this.mainMenu.height / 2) + 30;
                    this.loadButtonText.x = this.loadButton.right - 5;
                    this.loadButtonText.y = this.loadButton.bottom - 5 + (this.loadButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.loadButton.icon.x = this.loadButton.centerX;
                    this.loadButton.icon.y = this.loadButton.centerY + (this.loadButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    if (controlType == KEYBOARD) {
                        this.loadButton.label.exists = true;
                        this.loadButton.label.x = this.loadButton.left + 10;
                        this.loadButton.label.y = this.loadButton.bottom - 26 + (this.loadButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else {
                        this.loadButton.label.exists = false;
                    }

                    this.submitButton.x = this.mainMenu.right - 10;
                    this.submitButton.y = this.mainMenu.bottom - 10;
                    this.submitButtonText.x = this.submitButton.left + (this.submitButton.width / 2);
                    this.submitButtonText.y = this.submitButton.top + (this.submitButton.height / 2) + (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.submitButtonTextShadow.x = this.submitButtonText.x + 5;
                    this.submitButtonTextShadow.y = this.submitButtonText.y + 5;
                    this.submitButtonText.fontSize = this.submitButton.width / 15;
                    this.submitButtonTextShadow.fontSize = this.submitButtonText.fontSize;
                    if (controlType == KEYBOARD && this.submitButton.exists) {
                        this.submitButton.label.exists = true;
                        this.submitButton.label.x = this.submitButton.left + 10;
                        this.submitButton.label.y = this.submitButton.bottom - 26 + (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else {
                        this.submitButton.label.exists = false;
                    }

                    this.uiGraphics.lineStyle(5, 0x333333, 1.0);
                    this.uiGraphics.beginFill(0x333333, 1.0);
                    this.uiGraphics.drawRoundedRect(this.clearCanvasButton.left, this.clearCanvasButton.top + (this.clearCanvasButton.isDown ? OPTION_DOWN_OFFSET : 0), this.clearCanvasButton.width, this.clearCanvasButton.height + 5 - (this.clearCanvasButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                    this.uiGraphics.drawRoundedRect(this.offsetButton.left, this.offsetButton.top + (this.offsetButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetButton.width, this.offsetButton.height + 5 - (this.offsetButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                    this.uiGraphics.drawRoundedRect(this.symmetryButton.left, this.symmetryButton.top + (this.symmetryButton.isDown ? OPTION_DOWN_OFFSET : 0), this.symmetryButton.width, this.symmetryButton.height + 5 - (this.symmetryButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                    this.uiGraphics.drawRoundedRect(this.gridButton.left, this.gridButton.top + (this.gridButton.isDown ? OPTION_DOWN_OFFSET : 0), this.gridButton.width, this.gridButton.height + 5 - (this.gridButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                    this.uiGraphics.drawRoundedRect(this.audioButton.left, this.audioButton.top + (this.audioButton.isDown ? OPTION_DOWN_OFFSET : 0), this.audioButton.width, this.audioButton.height + 5 - (this.audioButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                    this.uiGraphics.drawRoundedRect(this.saveButton.left, this.saveButton.top + (this.saveButton.isDown ? OPTION_DOWN_OFFSET : 0), this.saveButton.width, this.saveButton.height + 5 - (this.saveButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                    this.uiGraphics.drawRoundedRect(this.loadButton.left, this.loadButton.top + (this.loadButton.isDown ? OPTION_DOWN_OFFSET : 0), this.loadButton.width, this.loadButton.height + 5 - (this.loadButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                    this.uiGraphics.beginFill(0xffffff, 1.0);
                    this.uiGraphics.drawRoundedRect(this.clearCanvasButton.left, this.clearCanvasButton.top + (this.clearCanvasButton.isDown ? OPTION_DOWN_OFFSET : 0), this.clearCanvasButton.width, this.clearCanvasButton.height, 10);
                    this.uiGraphics.drawRoundedRect(this.offsetButton.left, this.offsetButton.top + (this.offsetButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetButton.width, this.offsetButton.height, 10);
                    this.uiGraphics.drawRoundedRect(this.symmetryButton.left, this.symmetryButton.top + (this.symmetryButton.isDown ? OPTION_DOWN_OFFSET : 0), this.symmetryButton.width, this.symmetryButton.height, 10);
                    this.uiGraphics.drawRoundedRect(this.gridButton.left, this.gridButton.top + (this.gridButton.isDown ? OPTION_DOWN_OFFSET : 0), this.gridButton.width, this.gridButton.height, 10);
                    this.uiGraphics.drawRoundedRect(this.audioButton.left, this.audioButton.top + (this.audioButton.isDown ? OPTION_DOWN_OFFSET : 0), this.audioButton.width, this.audioButton.height, 10);
                    this.uiGraphics.drawRoundedRect(this.saveButton.left, this.saveButton.top + (this.saveButton.isDown ? OPTION_DOWN_OFFSET : 0), this.saveButton.width, this.saveButton.height, 10);
                    this.uiGraphics.drawRoundedRect(this.loadButton.left, this.loadButton.top + (this.loadButton.isDown ? OPTION_DOWN_OFFSET : 0), this.loadButton.width, this.loadButton.height, 10);
                    if (this.submitButton.exists) {
                        this.uiGraphics.lineStyle(5, 0x000000, 1.0);
                        this.uiGraphics.beginFill(0x000000, 1.0);
                        this.uiGraphics.drawRoundedRect(this.submitButton.left, this.submitButton.top + (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0), this.submitButton.width, this.submitButton.height + 5 - (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                        this.uiGraphics.lineStyle(0, 0x000000, 1.0);
                        this.uiGraphics.beginFill(0x00cc00, 1.0);
                        this.uiGraphics.drawRoundedRect(this.submitButton.left, this.submitButton.top + (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0), this.submitButton.width, this.submitButton.height, 10);
                    }
                    this.uiGraphics.endFill();
                    break;
                case SUBMISSION_MENU:
                    this.submitButton.x = this.mainMenu.right - 10;
                    this.submitButton.y = this.mainMenu.bottom - 10;

                    this.titleText.x = this.mainMenu.left + (this.mainMenu.width / 2);
                    this.titleText.y = this.mainMenu.top + 50;
                    /*
                    this.titleField.x = this.titleText.right + 20;
                    this.titleField.y = this.titleText.y;
                    */
                    var width = this.mainMenu.width / 2;
                    document.getElementById('kixel-program-title-field').style.width = (width) + "px";
                    document.getElementById('kixel-program-title-field').style.left = (this.mainMenu.left + (this.mainMenu.width / 2) - (width / 2)) + "px";
                    document.getElementById('kixel-program-title-field').style.top = (this.mainMenu.top + (this.mainMenu.height / 6 * 1)) + "px";

                    this.descriptionText.x = this.mainMenu.left + (this.mainMenu.width / 2);
                    this.descriptionText.y = this.mainMenu.top + (this.mainMenu.height / 6 * 2) + 20;
                    this.descriptionText.maxWidth = this.mainMenu.width;
                    /*
                    this.descriptionField.x = this.descriptionText.left;
                    this.descriptionField.y = this.descriptionText.bottom + 10;
                    */

                    var width = this.mainMenu.width / 4 * 3;
                    document.getElementById('kixel-program-description-field').style.width = (width) + "px";
                    document.getElementById('kixel-program-description-field').style.height = (this.mainMenu.height / 6) + "px";
                    document.getElementById('kixel-program-description-field').style.left = (this.mainMenu.left + (this.mainMenu.width / 2) - (width / 2)) + "px";
                    document.getElementById('kixel-program-description-field').style.top = (this.mainMenu.top + (this.mainMenu.height / 6 * 3)) + "px";

                    this.uiGraphics.lineStyle(5, 0x000000, 1.0);
                    this.uiGraphics.beginFill(0x000000, 1.0);
                    this.uiGraphics.drawRoundedRect(this.submitButton.left, this.submitButton.top + (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0), this.submitButton.width, this.submitButton.height + 5 - (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);

                    this.uiGraphics.lineStyle(0, 0x000000, 1.0);

                    if (document.getElementById('kixel-program-title-field').value.length > 0)
                        this.uiGraphics.beginFill(0x00cc00, 1.0);
                    else
                        this.uiGraphics.beginFill(0x005500, 1.0);
                    this.uiGraphics.drawRoundedRect(this.submitButton.left, this.submitButton.top + (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0), this.submitButton.width, this.submitButton.height, 10);
                    this.uiGraphics.endFill();

                    if (document.getElementById('kixel-program-title-field').value.length > 0)
                        this.uiGraphics.lineStyle(20, 0xffffff, 1.0);
                    else
                        this.uiGraphics.lineStyle(20, 0x000000, 1.0);
                    this.uiGraphics.drawEllipse(this.submitButton.left + (this.submitButton.width / 2), this.submitButton.top + (this.submitButton.height / 2) + (this.submitButton.isDown ? OPTION_DOWN_OFFSET : 0), (this.submitButton.width / 2) - 20, (this.submitButton.height / 2) - 20);
                    this.uiGraphics.lineStyle(0, 0x000000, 1.0);
                    break;
                case SAVE_MENU:
                    this.saveLittleButton.x = this.mainMenu.left + 10;
                    this.saveLittleButton.y = this.mainMenu.top + (this.mainMenu.height / 4) + 20;
                    this.saveBigButton.x = this.mainMenu.right - 10;
                    this.saveBigButton.y = this.mainMenu.top + (this.mainMenu.height / 4) + 20;

                    this.saveLittleButtonText.x = this.saveLittleButton.right - 5;
                    this.saveLittleButtonText.y = this.saveLittleButton.bottom - 5 + (this.saveLittleButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.saveBigButtonText.x = this.saveBigButton.right - 5;
                    this.saveBigButtonText.y = this.saveBigButton.bottom - 5 + (this.saveBigButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.saveLittleButton.icon.x = this.saveLittleButton.centerX;
                    this.saveLittleButton.icon.y = this.saveLittleButton.centerY + (this.saveLittleButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    this.saveBigButton.icon.x = this.saveBigButton.centerX;
                    this.saveBigButton.icon.y = this.saveBigButton.centerY + (this.saveBigButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    

                    if (controlType == KEYBOARD) {
                        this.saveLittleButton.label.exists = true;
                        this.saveBigButton.label.exists = true;
                        this.saveLittleButton.label.x = this.saveLittleButton.left + 10;
                        this.saveLittleButton.label.y = this.saveLittleButton.bottom - 26 + (this.saveLittleButton.isDown ? OPTION_DOWN_OFFSET : 0);
                        this.saveBigButton.label.x = this.saveBigButton.left + 10;
                        this.saveBigButton.label.y = this.saveBigButton.bottom - 26 + (this.saveBigButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else {
                        this.saveLittleButton.label.exists = false;
                        this.saveBigButton.label.exists = false;
                    }

                    this.uiGraphics.lineStyle(5, 0x333333, 1.0);
                    this.uiGraphics.beginFill(0x333333, 1.0);
                    this.uiGraphics.drawRoundedRect(this.saveLittleButton.left, this.saveLittleButton.top + (this.saveLittleButton.isDown ? OPTION_DOWN_OFFSET : 0), this.saveLittleButton.width, this.saveLittleButton.height + 5 - (this.saveLittleButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                    this.uiGraphics.drawRoundedRect(this.saveBigButton.left, this.saveBigButton.top + (this.saveBigButton.isDown ? OPTION_DOWN_OFFSET : 0), this.saveBigButton.width, this.saveBigButton.height + 5 - (this.saveBigButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
                    this.uiGraphics.beginFill(0xffffff, 1.0);
                    this.uiGraphics.drawRoundedRect(this.saveLittleButton.left, this.saveLittleButton.top + (this.saveLittleButton.isDown ? OPTION_DOWN_OFFSET : 0), this.saveLittleButton.width, this.saveLittleButton.height, 10);
                    this.uiGraphics.drawRoundedRect(this.saveBigButton.left, this.saveBigButton.top + (this.saveBigButton.isDown ? OPTION_DOWN_OFFSET : 0), this.saveBigButton.width, this.saveBigButton.height, 10);
                    break;
                case MESSAGE:
                    this.messageWindowText.x = this.mainMenu.centerX;
                    this.messageWindowText.y = this.mainMenu.centerY;
                    if (this.messageWindowButtonText.width + 40 > this.mainMenu.width - 30)
                        this.messageWindowButton.width = this.mainMenu.width - 30;
                    else
                        this.messageWindowButton.width = this.messageWindowButtonText.width + 40;
                    this.messageWindowButton.height = this.messageWindowButtonText.height + 20;
                    this.messageWindowButton.x = this.mainMenu.centerX;
                    this.messageWindowButton.y = this.mainMenu.bottom - (this.messageWindowButton.height);
                    this.messageWindowButtonText.x = this.messageWindowButton.x;
                    this.messageWindowButtonText.y = this.messageWindowButton.y + (this.messageWindowButton.isDown ? OPTION_DOWN_OFFSET : 0);

                    this.identityRuleSprite.x = this.mainMenu.centerX;
                    this.identityRuleSprite.y = this.messageWindowText.top - 10;

                    if (controlType == KEYBOARD) {
                        this.messageWindowButton.label.exists = true;
                        this.messageWindowButton.label.x = this.messageWindowButton.left + 10;
                        this.messageWindowButton.label.y = this.messageWindowButton.bottom + (this.messageWindowButton.isDown ? OPTION_DOWN_OFFSET : 0);
                    }
                    else
                        this.messageWindowButton.label.exists = false;

                    this.uiGraphics.lineStyle(5, 0x333333, 1.0);
                    this.uiGraphics.beginFill(0x333333, 1.0);
                    this.uiGraphics.drawRoundedRect(this.messageWindowButton.left, this.messageWindowButton.top + (this.messageWindowButton.isDown ? OPTION_DOWN_OFFSET : 0), this.messageWindowButton.width, this.messageWindowButton.height + 5 - (this.messageWindowButton.isDown ? OPTION_DOWN_OFFSET : 0), 30);
                    this.uiGraphics.beginFill(0xffffff, 1.0);
                    this.uiGraphics.drawRoundedRect(this.messageWindowButton.left, this.messageWindowButton.top + (this.messageWindowButton.isDown ? OPTION_DOWN_OFFSET : 0), this.messageWindowButton.width, this.messageWindowButton.height, 30);
                    break;
            }
        }
        else if (currentState == CLEARING) {
            this.updateClear();
        }
        else if (currentState == OFFSET_MENU) {
            this.canvas.width += ((this.canvasScale * 32 * 0.6) - this.canvas.width) * 0.3;
            this.canvas.height += ((this.canvasScale * 32 * 0.6) - this.canvas.height) * 0.3;
            this.canvasProductPreview.width = this.canvas.width;
            this.canvasProductPreview.height = this.canvas.height;
            this.canvasProductPreview.x = this.canvas.x;
            this.canvasProductPreview.y = this.canvas.y;
            this.drawGrid(this.canvas.height);
        }
        else if (this.canvas.width < this.canvasScale * 32) {
            this.canvas.width += ((this.canvasScale * 32) - this.canvas.width) * 0.3;
            this.canvas.height += ((this.canvasScale * 32) - this.canvas.height) * 0.3;
            this.canvasProductPreview.width = this.canvas.width;
            this.canvasProductPreview.height = this.canvas.height;
            this.canvasProductPreview.x = this.canvas.x;
            this.canvasProductPreview.y = this.canvas.y;
            this.drawGrid(this.canvas.height);

            if (this.canvas.width > (this.canvasScale * 32) - 0.5) { // set button intended positions once the canvas size is restored
                this.canvas.width = this.canvasScale * 32;
                this.canvas.height = this.canvasScale * 32;
                this.canvasProductPreview.width = this.canvas.width;
                this.canvasProductPreview.height = this.canvas.height;
                this.canvasProductPreview.x = this.canvas.x;
                this.canvasProductPreview.y = this.canvas.y;
                this.drawGrid(this.canvas.height);

                controlsDisabled = false;

                if (device === MOBILE || controlType === KEYBOARD) {
                    this.virtualCursor.visible = true;
                    this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                    this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
                }

                var availableSpace;

                if (axis == LANDSCAPE) {
                    this.preview.intendedX = this.canvas.left - this.preview.width - 5;
                    this.preview.intendedY = this.canvas.top;

                    availableSpace = this.canvas.height - this.preview.height - 6;

                    this.colorSelectors.forEach(function(selector, index) {
                        selector.intendedX = this.canvas.left - (this.preview.width) - 5;
                        selector.intendedY = 6 + this.canvas.top + this.preview.height + (availableSpace / 16 * index);
                    }, this);
                    this.buttons.forEach(function(button, index) {
                        button.intendedX = this.canvas.right + 5;
                        button.intendedY = this.canvas.top + (this.canvas.height / 8) * (index + 1);
                    }, this);
                }
                else if (axis == PORTRAIT) {
                    this.preview.intendedX = this.canvas.left;
                    this.preview.intendedY = this.canvas.top - this.preview.height - 5;

                    availableSpace = this.canvas.width - this.preview.width - 6;

                    this.colorSelectors.forEach(function(selector, index) {
                        selector.intendedX = 6 + this.canvas.left + this.preview.width + (availableSpace / 16 * index);
                        selector.intendedY = this.canvas.top - (this.preview.height) - 5;
                    }, this);
                    this.buttons.forEach(function(button, index) {
                        button.intendedY = this.canvas.bottom + 5 + (this.canvas.height * 0.1);
                        button.intendedX = this.canvas.left + (this.canvas.width / 8 * index);
                    }, this);
                }
            }
        }

        this.offsetUpButton.y += (this.offsetUpButton.intendedY - this.offsetUpButton.y) * 0.3;
        this.offsetDownButton.y += (this.offsetDownButton.intendedY - this.offsetDownButton.y) * 0.3;
        this.offsetLeftButton.x += (this.offsetLeftButton.intendedX - this.offsetLeftButton.x) * 0.3;
        this.offsetRightButton.x += (this.offsetRightButton.intendedX - this.offsetRightButton.x) * 0.3;

        this.cancelOffsetButton.x = this.offsetLeftButton.x;
        this.cancelOffsetButton.y = this.offsetDownButton.y;
        this.confirmOffsetButton.x = this.offsetRightButton.x;
        this.confirmOffsetButton.y = this.offsetDownButton.y;

        this.offsetUpButton.icon.x = this.offsetUpButton.centerX;
        this.offsetUpButton.icon.y = this.offsetUpButton.centerY + (this.offsetUpButton.isDown ? OPTION_DOWN_OFFSET : 0);
        this.offsetDownButton.icon.x = this.offsetDownButton.centerX;
        this.offsetDownButton.icon.y = this.offsetDownButton.centerY + (this.offsetDownButton.isDown ? OPTION_DOWN_OFFSET : 0);
        this.offsetLeftButton.icon.x = this.offsetLeftButton.centerX;
        this.offsetLeftButton.icon.y = this.offsetLeftButton.centerY + (this.offsetLeftButton.isDown ? OPTION_DOWN_OFFSET : 0);
        this.offsetRightButton.icon.x = this.offsetRightButton.centerX;
        this.offsetRightButton.icon.y = this.offsetRightButton.centerY + (this.offsetRightButton.isDown ? OPTION_DOWN_OFFSET : 0);

        this.cancelOffsetButton.icon.x = this.cancelOffsetButton.centerX;
        this.cancelOffsetButton.icon.y = this.cancelOffsetButton.centerY + (this.cancelOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0);
        this.confirmOffsetButton.icon.x = this.confirmOffsetButton.centerX;
        this.confirmOffsetButton.icon.y = this.confirmOffsetButton.centerY + (this.confirmOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0);

        this.uiGraphics.lineStyle(5, 0x000000, 1.0);
        this.uiGraphics.beginFill(0x000000, 1.0);
        this.uiGraphics.drawRoundedRect(this.offsetUpButton.left, this.offsetUpButton.top + (this.offsetUpButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetUpButton.width, this.offsetUpButton.height + 5 - (this.offsetUpButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
        this.uiGraphics.beginFill(0x3333ff, 1.0);
        this.uiGraphics.drawRoundedRect(this.offsetUpButton.left, this.offsetUpButton.top + (this.offsetUpButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetUpButton.width, this.offsetUpButton.height, 10);
        this.uiGraphics.beginFill(0x000000, 1.0);
        this.uiGraphics.drawRoundedRect(this.offsetDownButton.left, this.offsetDownButton.top + (this.offsetDownButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetDownButton.width, this.offsetDownButton.height + 5 - (this.offsetDownButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
        this.uiGraphics.beginFill(0x3333ff, 1.0);
        this.uiGraphics.drawRoundedRect(this.offsetDownButton.left, this.offsetDownButton.top + (this.offsetDownButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetDownButton.width, this.offsetDownButton.height, 10);
        this.uiGraphics.beginFill(0x000000, 1.0);
        this.uiGraphics.drawRoundedRect(this.offsetLeftButton.left, this.offsetLeftButton.top + (this.offsetLeftButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetLeftButton.width, this.offsetLeftButton.height + 5 - (this.offsetLeftButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
        this.uiGraphics.beginFill(0x3333ff, 1.0);
        this.uiGraphics.drawRoundedRect(this.offsetLeftButton.left, this.offsetLeftButton.top + (this.offsetLeftButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetLeftButton.width, this.offsetLeftButton.height, 10);
        this.uiGraphics.beginFill(0x000000, 1.0);
        this.uiGraphics.drawRoundedRect(this.offsetRightButton.left, this.offsetRightButton.top + (this.offsetRightButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetRightButton.width, this.offsetRightButton.height + 5 - (this.offsetRightButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
        this.uiGraphics.beginFill(0x3333ff, 1.0);
        this.uiGraphics.drawRoundedRect(this.offsetRightButton.left, this.offsetRightButton.top + (this.offsetRightButton.isDown ? OPTION_DOWN_OFFSET : 0), this.offsetRightButton.width, this.offsetRightButton.height, 10);

        this.uiGraphics.beginFill(0x000000, 1.0);
        this.uiGraphics.drawRoundedRect(this.cancelOffsetButton.left, this.cancelOffsetButton.top + (this.cancelOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0), this.cancelOffsetButton.width, this.cancelOffsetButton.height + 5 - (this.cancelOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
        this.uiGraphics.beginFill(0x3333ff, 1.0);
        this.uiGraphics.drawRoundedRect(this.cancelOffsetButton.left, this.cancelOffsetButton.top + (this.cancelOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0), this.cancelOffsetButton.width, this.cancelOffsetButton.height, 10);

        this.uiGraphics.beginFill(0x000000, 1.0);
        this.uiGraphics.drawRoundedRect(this.confirmOffsetButton.left, this.confirmOffsetButton.top + (this.confirmOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0), this.confirmOffsetButton.width, this.confirmOffsetButton.height + 5 - (this.confirmOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0), 10);
        this.uiGraphics.beginFill(0x3333ff, 1.0);
        this.uiGraphics.drawRoundedRect(this.confirmOffsetButton.left, this.confirmOffsetButton.top + (this.confirmOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0), this.confirmOffsetButton.width, this.confirmOffsetButton.height, 10);

        if (!editorStarted && this.openingWindow.x > -game.width * 2) {
            this.timeOfLastPaletteSwap = -Infinity;

            if (openingScreenIsOpen && this.openingWindow.x < game.width) {
                this.uiGraphics.beginFill(0x777777, 1.0);
                this.uiGraphics.drawRect(0, 0, game.width, game.height); // curtain
            }

            this.openingWindow.y = game.height / 2;

            this.audioButton1.x = game.width / 4 * 1;
            this.audioButton2.x = game.width / 4 * 2;
            this.audioButton3.x = game.width / 4 * 3;

            this.audioButton1.y += (this.audioButton1.intendedY - this.audioButton1.y) * 0.165;
            this.audioButton2.y += (this.audioButton2.intendedY - this.audioButton2.y) * 0.11;
            this.audioButton3.y += (this.audioButton3.intendedY - this.audioButton3.y) * 0.08;

            this.audioButton1.label.x = this.audioButton1.left;
            this.audioButton1.label.y = this.audioButton1.bottom;
            this.audioButton2.label.x = this.audioButton2.left;
            this.audioButton2.label.y = this.audioButton2.bottom;
            this.audioButton3.label.x = this.audioButton3.left;
            this.audioButton3.label.y = this.audioButton3.bottom;

            if (openingScreenIsOpen)
                this.openingWindow.x += (this.openingWindow.intendedX - this.openingWindow.x) * 0.33;
            else
                this.openingWindow.x += (this.openingWindow.intendedX - this.openingWindow.x) * 0.1;
            this.openingWindowUsernameText.x = this.openingWindow.x - 3;
            this.openingWindowUsernameText.y = 50;
            this.openingWindowStatsText.x = this.openingWindow.x - 3;
            this.openingWindowStatsText.y = this.openingWindowUsernameText.bottom + 10;
            this.avatarKixel.x = game.width - this.openingWindow.x + 12;
            this.avatarKixel.y = 50;

            if (typeof compoNumber !== 'undefined') {
                this.openingWindowBattleText.x = this.openingWindow.x - 3;
                this.openingWindowBattleText.y = game.height / 2 + 100;

                this.openingWindowCompoType.x = this.openingWindow.x - 3;
                this.openingWindowCompoType.y = this.openingWindowBattleText.bottom + 10;

                this.openingWindowCompoIcon.x = game.width - this.openingWindow.x + 3;
                this.openingWindowCompoIcon.y = this.openingWindowBattleText.y
            }
            
            this.openingWindow.width = game.width / 3 * 2;
            this.openingWindow.height = game.height / 3 * 2;

            this.uiGraphics.lineStyle(2, 0x000000, 1.0);
            this.uiGraphics.beginFill(0xeeeeee, 1.0);
            this.uiGraphics.drawRect(-1, -1, this.openingWindow.x, game.height);
            this.uiGraphics.drawRect(game.width + 1, -1, -this.openingWindow.x, game.height);

            if (openingScreenIsOpen) {
                this.openingWindow.intendedX = game.width / 2;

                this.audioButton1.intendedY = game.height / 2;
                this.audioButton2.intendedY = game.height / 2;
                this.audioButton3.intendedY = game.height / 2;
            }
            else {
                if (this.frameTimer % 2 == 0 && this.eventTimer < 500) {
                    this.uiGraphics.lineStyle(5, 0xffffff);
                    if (chosenButton == 1)
                        this.uiGraphics.drawRect(this.audioButton1.x - (this.audioButton1.width / 2), this.audioButton1.y - (this.audioButton1.height / 2), this.audioButton1.width, this.audioButton1.height);
                    else if (chosenButton == 2)
                        this.uiGraphics.drawRect(this.audioButton2.x - (this.audioButton2.width / 2), this.audioButton2.y - (this.audioButton2.height / 2), this.audioButton2.width, this.audioButton2.height);
                    else if (chosenButton == 3)
                        this.uiGraphics.drawRect(this.audioButton3.x - (this.audioButton3.width / 2), this.audioButton3.y - (this.audioButton3.height / 2), this.audioButton3.width, this.audioButton3.height);
                }

                if (!doorOpened && this.eventTimer >= 500) {
                    doorOpened = true;

                    if (sfxEnabled)
                        game.sfx3.play('door');

                    this.openingWindow.intendedX = -100;
                    this.audioButton1.intendedY = game.height + 200;
                    this.audioButton2.intendedY = game.height + 200;
                    this.audioButton3.intendedY = game.height + 200;
                    this.openingWindowText.intendedY = game.height + 200;
                }
            }

            this.phaserLogo.x = this.openingWindow.x - (game.width / 2) + 5;
            this.phaserLogo.y = this.getAvailableHeight() - 5;

            if (typeof errorMessage !== 'undefined') {
                this.openingWindowText.y += (this.openingWindowText.intendedY - this.openingWindowText.y) * 0.2;

                this.uiGraphics.lineStyle(2, 0x000000);
                this.uiGraphics.beginFill(0xffffff, 1.0);
                this.uiGraphics.drawRect(this.openingWindowText.x - (this.openingWindowText.width / 2) - 10, this.openingWindowText.y - (this.openingWindowText.height / 2) - 15, this.openingWindowText.width + 20, this.openingWindowText.height + 30);
                this.openingWindowText.x = game.width / 2;
                if (openingScreenIsOpen)
                    this.openingWindowText.intendedY = this.openingWindow.bottom - 20;
                this.openingWindowText.maxWidth = this.openingWindow.width - 30;
                this.openingWindowNotice.x = this.openingWindowText.x;
                this.openingWindowNotice.y = this.openingWindowText.top - 50;
                this.arrow1.x = this.openingWindowNotice.left - 30;
                this.arrow1.y = this.openingWindowNotice.y + (Math.sin(this.frameTimer / 7) * 20);
                this.arrow2.x = this.openingWindowNotice.right + 30;
                this.arrow2.y = this.openingWindowNotice.y + (Math.sin(Math.PI + (this.frameTimer / 7)) * 20);
            }

            this.uiGraphics.endFill();
            this.uiGraphics.lineStyle(5, 0x777777);
            this.uiGraphics.drawRect(this.avatarKixel.x, this.avatarKixel.y, this.avatarKixel.width, this.avatarKixel.height);
            this.uiGraphics.lineStyle(2, 0x222222);
            this.uiGraphics.drawRect(this.avatarKixel.x, this.avatarKixel.y, this.avatarKixel.width, this.avatarKixel.height);

            if (!editorStarted && !openingScreenIsOpen && this.openingWindow.x <= 0) {
                this.avatarKixel.exists = false;
                if (musicEnabled) {
                    game.music.play('', 0, songVolume, true);
                    audioStartTime = this.game.time.time;
                    lastReportedTime = game.music.currentTime;
                }

                controlsDisabled = false;

                editorStarted = true;
                currentState = PAINTING;

                this.colorSelectors.forEach(function(button) {
                    button.inputEnabled = true;
                    button.input.useHandCursor = true;
                }, this);
                this.buttons.forEach(function(button) {
                    button.inputEnabled = true;
                    button.input.useHandCursor = true;
                }, this);

                if (device === MOBILE || controlType === KEYBOARD) {
                    this.virtualCursor.visible = true;
                    this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
                    this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
                    this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
                }

                this.openingWindow.destroy();
                this.audioButton1.destroy();
                this.audioButton1.label.destroy();
                this.audioButton2.destroy();
                this.audioButton2.label.destroy();
                this.audioButton3.destroy();
                this.audioButton3.label.destroy();

                this.arrow1.destroy();
                this.arrow2.destroy();

                this.avatarKixel.destroy();
                this.openingWindowUsernameText.destroy();
                this.openingWindowStatsText.destroy();
                this.openingWindowNotice.destroy();
                this.openingWindowText.destroy();

                this.phaserLogo.destroy();

                if (typeof compoNumber !== 'undefined') {
                    this.openingWindowBattleText.destroy();
                    this.openingWindowCompoType.destroy();
                    this.openingWindowCompoIcon.destroy();
                }

                if (typeof haunted !== 'undefined') {
                    this.giveMessage("This battle is haunted! You'll be limited to 5 colors!", "OH NO!!!!");
                }
                else if (typeof firstKixel !== 'undefined') {
                    tutorialIndex++;
                    this.giveMessage("You're about to make your first kixel!", "I know");
                }
            }
        }

        if (device == MOBILE) {
            if (axis == PORTRAIT) {
                this.pushButton.x = this.buttons[0].x + 3;
                this.pushButton.y = this.buttons[4].y + 10;

                this.eyedropButton.x = this.pushButton.right + 10;
                this.eyedropButton.y = this.pushButton.y;
            }
            else if (axis == LANDSCAPE) {
                this.pushButton.x = this.buttons[4].x + this.buttons[4].width + 10;
                this.pushButton.y = this.buttons[0].y - this.buttons[0].height + 3;

                this.eyedropButton.x = this.pushButton.x;
                this.eyedropButton.y = this.pushButton.bottom + 10;
            }

            this.pushButtonText.x = this.pushButton.x + (this.pushButton.width / 2);
            this.pushButtonText.y = this.pushButton.y + (this.pushButton.height / 2);

            this.eyedropButton.icon.x = this.eyedropButton.x + (this.eyedropButton.width / 2);
            if (this.suckingColor)
                this.eyedropButton.icon.y = this.eyedropButton.y + (this.eyedropButton.height / 2) + 10;
            else
                this.eyedropButton.icon.y = this.eyedropButton.y + (this.eyedropButton.height / 2);
        }

        if (device == MOBILE) {
            if (this.pushButton.isDown) {
                this.overlayGraphics.lineStyle(10, 0x000000, 1.0);
                this.overlayGraphics.drawRoundedRect(this.pushButton.x, this.pushButton.y, this.pushButton.width, this.pushButton.height, 10);
                this.overlayGraphics.lineStyle(5, 0xffffff, 1.0);
                this.overlayGraphics.beginFill(Phaser.Color.hexToRGB(palettes.colors[currentPaletteIndex][currentColorIndex]), 1.0);
                this.overlayGraphics.drawRoundedRect(this.pushButton.x, this.pushButton.y, this.pushButton.width, this.pushButton.height, 10);
                this.overlayGraphics.endFill();

                this.pushButtonText.y = this.pushButton.y + (this.pushButton.height / 2) + 10;
            }
            else {
                this.overlayGraphics.lineStyle(10, 0x000000, 1.0);
                this.overlayGraphics.drawRoundedRect(this.pushButton.x, this.pushButton.y, this.pushButton.width, this.pushButton.height, 10);
                this.overlayGraphics.lineStyle(5, 0xffffff, 1.0);
                this.overlayGraphics.beginFill(Phaser.Color.hexToRGB(palettes.colors[currentPaletteIndex][currentColorIndex]), 1.0);
                this.overlayGraphics.drawRoundedRect(this.pushButton.x, this.pushButton.y - 6, this.pushButton.width, this.pushButton.height, 10);
                this.overlayGraphics.endFill();

                this.pushButtonText.y = this.pushButton.y + (this.pushButton.height / 2);
            }

            if (this.eyedropButton.isDown) {
                this.overlayGraphics.lineStyle(10, 0x000000, 1.0);
                this.overlayGraphics.drawRoundedRect(this.eyedropButton.x, this.eyedropButton.y, this.eyedropButton.width, this.eyedropButton.height, 10);
                this.overlayGraphics.lineStyle(5, 0xffffff, 1.0);
                this.overlayGraphics.beginFill(Phaser.Color.hexToRGB(palettes.colors[currentPaletteIndex][currentColorIndex]), 1.0);
                this.overlayGraphics.drawRoundedRect(this.eyedropButton.x, this.eyedropButton.y, this.eyedropButton.width, this.eyedropButton.height, 10);
                this.overlayGraphics.endFill();

                this.eyedropButton.icon.y = this.eyedropButton.y + (this.eyedropButton.height / 2) + 10;
            }
            else {
                this.overlayGraphics.lineStyle(10, 0x000000, 1.0);
                this.overlayGraphics.drawRoundedRect(this.eyedropButton.x, this.eyedropButton.y, this.eyedropButton.width, this.eyedropButton.height, 10);
                this.overlayGraphics.lineStyle(5, 0xffffff, 1.0);
                if (this.colorUnderCursor == null || currentMode == SELECTION)
                    this.overlayGraphics.beginFill(0xffffff, 1.0);
                else if (currentMode == DRAW)
                    this.overlayGraphics.beginFill(this.colorUnderCursor, 1.0);
                this.overlayGraphics.drawRoundedRect(this.eyedropButton.x, this.eyedropButton.y - 6, this.eyedropButton.width, this.eyedropButton.height, 10);
                this.overlayGraphics.endFill();

                this.eyedropButton.icon.y = this.eyedropButton.y + (this.eyedropButton.height / 2);
            }
        }

        //game.debug.pointer(game.input.pointer1);
        //game.debug.pointer(game.input.pointer2);

        if (device == DESKTOP) {
            prevMouseX = game.input.x;
            prevMouseY = game.input.y;
        }
        else if (device == MOBILE && canvasPointer !== null) {
            prevMouseX = canvasPointer.x;
            prevMouseY = canvasPointer.y;
        }

        if (device == DESKTOP) {
            wasDown = currentMouseButton == LEFT_MOUSE || currentMouseButton == RIGHT_MOUSE || this.spaceKey.isDown || this.ctrlKey.isDown;
        }
        else if (device == MOBILE) {
            game.input.pointer1.wasDown = game.input.pointer1.isDown;
            game.input.pointer2.wasDown = game.input.pointer2.isDown;
        }
        
        justClicked = false;
        this.frameTimer++;
        this.eventTimer += game.time.delta;
        framesSinceLastRelease++;
    },
    drawColorSelectors: function() {
        let index;

        for (var x = 0; x <= 16; x++) { // this draws the currentColorDown/currentColorIndex last so that it's on top
            if (colorsDown) {
                if (x == currentColorDown)
                    continue;
            }
            else if (x == currentColorIndex)
                continue;

            if (x == 16) {
                if (colorsDown)
                    index = currentColorDown;
                else
                    index = currentColorIndex;
            }
            else
                index = x;

            if (!colorsDown && currentColorIndex == index)
                this.overlayGraphics.lineStyle(5, 0x000000, 1.0);
            else 
                this.overlayGraphics.lineStyle(1, 0xffffff, 1.0);

            this.overlayGraphics.beginFill(Phaser.Color.hexToRGB(palettes.colors[currentPaletteIndex][index]));

            if (index % 2 == 0) { // THIS SECTION IS A FUCKING MESS
                if (axis == LANDSCAPE) {
                    if (colorsDown && (currentColorDown == index || (!keyboardButtonDown && game.input.activePointer.y > this.colorSelectors[index].y && game.input.activePointer.y < this.colorSelectors[index].y + this.colorSelectors[index].height))) {
                        if (sfxEnabled && currentColorDown !== index)
                            game.sfx1.play('changeColor');
                        
                        currentColorDown = index;

                        this.selectedColorIcon.intendedY = this.colorSelectors[index].y + (this.colorSelectors[index].height / 2) - 3;

                        this.overlayGraphics.lineStyle(5, 0x000000, 1.0);
                        if (index == 0) {
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y);
                        }
                        else {
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y - 5);
                            this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y + 5);
                        }
                        this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y + this.colorSelectors[index].height - 5);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height + 5);

                        this.overlayGraphics.lineStyle(2, 0xffffff, 1.0);
                        if (index == 0) {
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y);
                        }
                        else {
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y - 5);
                            this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y + 5);
                        }
                        this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y + this.colorSelectors[index].height - 5);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height + 5);
                    }
                    else {
                        if (index == 0) {
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y);
                        }
                        else {
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y - 5);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + 5);
                        }
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + this.colorSelectors[index].height - 5);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height + 5);

                        if (!colorsDown && currentColorIndex == index) {
                            this.overlayGraphics.lineStyle(2, 0xffffff, 1.0);

                            if (index == 0) {
                                this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y);
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y);
                            }
                            else {
                                this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y - 5);
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + 5);
                            }
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + this.colorSelectors[index].height - 5);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height + 5);
                        }
                    }

                    this.colorSelectors[index].label.x = this.colorSelectors[index].x + 12;
                    this.colorSelectors[index].label.y = this.colorSelectors[index].y + 14;
                }
                else if (axis == PORTRAIT) {
                    if (colorsDown && (currentColorDown == index || (!keyboardButtonDown && game.input.activePointer.x > this.colorSelectors[index].x && game.input.activePointer.x < this.colorSelectors[index].x + this.colorSelectors[index].width))) {
                        if (sfxEnabled && currentColorDown !== index)
                            game.sfx1.play('changeColor');

                        currentColorDown = index;

                        this.selectedColorIcon.intendedX = this.colorSelectors[index].x + (this.colorSelectors[index].width / 2);
                        this.selectedColorIcon.intendedY = this.colorSelectors[index].y + (this.colorSelectors[index].height / 2) - 3;

                        this.overlayGraphics.lineStyle(5, 0x000000, 1.0);
                        if (index == 0)
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y);
                        else
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x + 5, this.colorSelectors[index].y);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width - 5, this.colorSelectors[index].y);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width + 5, this.canvas.bottom);
                        if (index == 0)
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x - 5, this.canvas.bottom);
                        else    
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x - 5, this.canvas.bottom);

                        this.overlayGraphics.lineStyle(2, 0xffffff, 1.0);
                        if (index == 0)
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y);
                        else
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x + 5, this.colorSelectors[index].y);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width - 5, this.colorSelectors[index].y);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width + 5, this.canvas.bottom);
                        if (index == 0)
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x - 5, this.canvas.bottom);
                        else    
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x - 5, this.canvas.bottom);
                    }
                    else {
                        if (index == 0)
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y);
                        else
                            this.overlayGraphics.moveTo(this.colorSelectors[index].x + 5, this.colorSelectors[index].y);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width - 5, this.colorSelectors[index].y);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width + 5, this.colorSelectors[index].y + this.colorSelectors[index].height);
                        if (index == 0)
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height);
                        else
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x - 5, this.colorSelectors[index].y + this.colorSelectors[index].height);

                        if (!colorsDown && currentColorIndex == index) {
                            this.overlayGraphics.lineStyle(2, 0xffffff, 1.0);

                            if (index == 0)
                                this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y);
                            else
                                this.overlayGraphics.moveTo(this.colorSelectors[index].x + 5, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width - 5, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width + 5, this.colorSelectors[index].y + this.colorSelectors[index].height);
                            if (index == 0)
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height);
                            else
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x - 5, this.colorSelectors[index].y + this.colorSelectors[index].height);
                        }
                    }

                    this.colorSelectors[index].label.x = this.colorSelectors[index].x + (this.colorSelectors[index].width / 2);
                    this.colorSelectors[index].label.y = this.colorSelectors[index].y + 14;
                }
            }
            else {
                if (axis == LANDSCAPE) {
                    if (colorsDown && (currentColorDown == index || (!keyboardButtonDown && game.input.activePointer.y > this.colorSelectors[index].y && game.input.activePointer.y < this.colorSelectors[index].y + this.colorSelectors[index].height))) {
                        if (sfxEnabled && currentColorDown !== index)
                            game.sfx1.play('changeColor');

                        currentColorDown = index;

                        this.selectedColorIcon.intendedY = this.colorSelectors[index].y + (this.colorSelectors[index].height / 2) - 3;
                        this.selectedColorIcon.intendedX = this.colorSelectors[index].x + (this.colorSelectors[index].width / 2);

                        this.overlayGraphics.lineStyle(5, 0x000000, 1.0);
                        this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y + 5);
                        this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y - 5);
                        this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y + this.colorSelectors[index].height + 5);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height - 5);

                        this.overlayGraphics.lineStyle(2, 0xffffff, 1.0);
                        this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y + 5);
                        this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y - 5);
                        if (index == 15) {
                            this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y + this.colorSelectors[index].height);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height);
                        }
                        else {
                            this.overlayGraphics.lineTo(this.canvas.right, this.colorSelectors[index].y + this.colorSelectors[index].height + 5);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height - 5);
                        }
                    }
                    else {
                        this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y + 5);
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y - 5);
                        if (index == 15) {
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + this.colorSelectors[index].height);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height);
                        }
                        else {
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + this.colorSelectors[index].height + 5);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height - 5);
                        }

                        if (!colorsDown && currentColorIndex == index) {
                            this.overlayGraphics.lineStyle(2, 0xffffff, 1.0);

                            this.overlayGraphics.moveTo(this.colorSelectors[index].x, this.colorSelectors[index].y + 5);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y - 5);
                            if (index == 15) {
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + this.colorSelectors[index].height);
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height);
                            }
                            else {
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + this.colorSelectors[index].height + 5);
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x, this.colorSelectors[index].y + this.colorSelectors[index].height - 5);
                            }
                        }
                    }

                    this.colorSelectors[index].label.x = this.colorSelectors[index].x + 12;
                    this.colorSelectors[index].label.y = this.colorSelectors[index].y + 18;
                }
                else if (axis == PORTRAIT) {
                    if (colorsDown && (currentColorDown == index || (!keyboardButtonDown && game.input.activePointer.x > this.colorSelectors[index].x && game.input.activePointer.x < this.colorSelectors[index].x + this.colorSelectors[index].width))) {
                        if (sfxEnabled && currentColorDown !== index)
                            game.sfx1.play('changeColor');

                        currentColorDown = index;

                        this.selectedColorIcon.intendedX = this.colorSelectors[index].x + (this.colorSelectors[index].width / 2);
                        this.selectedColorIcon.intendedY = this.colorSelectors[index].y + (this.colorSelectors[index].height / 2) - 3;

                        this.overlayGraphics.lineStyle(5, 0x000000, 1.0);
                        this.overlayGraphics.moveTo(this.colorSelectors[index].x - 5, this.colorSelectors[index].y);
                        if (index == 15) {
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.canvas.bottom);
                        }
                        else {
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width + 5, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width - 5, this.canvas.bottom);
                        }
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + 5, this.canvas.bottom);

                        this.overlayGraphics.lineStyle(2, 0xffffff, 1.0);
                        this.overlayGraphics.moveTo(this.colorSelectors[index].x - 5, this.colorSelectors[index].y);
                        if (index == 15) {
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.canvas.bottom);
                        }
                        else {
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width + 5, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width - 5, this.canvas.bottom);
                        }
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + 5, this.canvas.bottom);
                    }
                    else {
                        this.overlayGraphics.moveTo(this.colorSelectors[index].x - 5, this.colorSelectors[index].y);
                        if (index == 15) {
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + this.colorSelectors[index].height);
                        }
                        else {
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width + 5, this.colorSelectors[index].y);
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width - 5, this.colorSelectors[index].y + this.colorSelectors[index].height);
                        }
                        this.overlayGraphics.lineTo(this.colorSelectors[index].x + 5, this.colorSelectors[index].y + this.colorSelectors[index].height);

                        if (!colorsDown && currentColorIndex == index) {
                            this.overlayGraphics.lineStyle(2, 0xffffff, 1.0);

                            this.overlayGraphics.moveTo(this.colorSelectors[index].x - 5, this.colorSelectors[index].y);
                            if (index == 15) {
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y);
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width, this.colorSelectors[index].y + this.colorSelectors[index].height);
                            }
                            else {
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width + 5, this.colorSelectors[index].y);
                                this.overlayGraphics.lineTo(this.colorSelectors[index].x + this.colorSelectors[index].width - 5, this.colorSelectors[index].y + this.colorSelectors[index].height);
                            }
                            this.overlayGraphics.lineTo(this.colorSelectors[index].x + 5, this.colorSelectors[index].y + this.colorSelectors[index].height);
                        }
                    }

                    this.colorSelectors[index].label.x = this.colorSelectors[index].x + (this.colorSelectors[index].width / 2);
                    this.colorSelectors[index].label.y = this.colorSelectors[index].y + 14;
                }
            }

            this.colorSelectors[index].x += (this.colorSelectors[index].intendedX - this.colorSelectors[index].x) * 0.33;
            this.colorSelectors[index].y += (this.colorSelectors[index].intendedY - this.colorSelectors[index].y) * 0.33;

            if (typeof haunted !== 'undefined') {
                this.colorSelectors[index].ghost.x = this.colorSelectors[index].centerX;
                this.colorSelectors[index].ghost.y = this.colorSelectors[index].centerY + (Math.sin((this.frameTimer + (index * 4)) / 20) * 2);
            }
        }

        var workingSize;

        if (this.colorSelectors[0].width > this.colorSelectors[0].height)
            workingSize = this.colorSelectors[0].height;
        else if (this.colorSelectors[0].width <= this.colorSelectors[0].height)
            workingSize = this.colorSelectors[0].width;

        if (controlType == KEYBOARD)
            workingSize = this.colorSelectors[0].width;

        if (!colorsDown) {
            this.selectedColorIcon.intendedX = this.colorSelectors[currentColorIndex].x + (this.colorSelectors[currentColorIndex].width / 2);
            this.selectedColorIcon.intendedY = this.colorSelectors[currentColorIndex].y + (this.colorSelectors[currentColorIndex].height / 2);
        }
        this.selectedColorIcon.width = workingSize;
        this.selectedColorIcon.height = workingSize;

        this.selectedColorIcon.x += (this.selectedColorIcon.intendedX - this.selectedColorIcon.x) * 0.35;
        this.selectedColorIcon.y += (this.selectedColorIcon.intendedY - this.selectedColorIcon.y) * 0.35;
        if (axis == LANDSCAPE) {
            this.ctrlKeyIcon.x = this.colorSelectors[0].x + this.colorSelectors[0].width;
            this.ctrlKeyIcon.y += (this.ctrlKeyIcon.intendedY - this.ctrlKeyIcon.y) * 0.35;
        }
        else if (axis == PORTRAIT) {
            this.ctrlKeyIcon.x += (this.ctrlKeyIcon.intendedX - this.ctrlKeyIcon.x) * 0.35;
            this.ctrlKeyIcon.y = this.colorSelectors[0].y + this.colorSelectors[0].height;
        }
        
        this.ctrlKeyIcon.width = workingSize;
        this.ctrlKeyIcon.height = workingSize;

        if (controlType == KEYBOARD)
            this.selectedColorIcon.rotation = 0.0;
        else
            this.selectedColorIcon.rotation += map(game.time.delta, 0, 17, 0, 0.02);

        this.overlayGraphics.lineStyle(0, 0x000000, 1.0);
        this.overlayGraphics.endFill();
    },
    drawButtons: function() {
        this.buttonText.visible = false;

        if (buttonsDown) {
            if (sfxEnabled && currentButtonDown == null)
                game.sfx2.play('openTools');

            if (axis == PORTRAIT) {
                if (this.changePaletteButton.exists && (this.mKey.isDown || this.nKey.isDown || (!keyboardButtonDown && game.input.activePointer.x > this.changePaletteButton.x && game.input.activePointer.x < this.changePaletteButton.x + this.changePaletteButton.width))) {
                    this.overlayGraphics.beginFill(0x000000);
                    this.overlayGraphics.moveTo(this.changePaletteButton.x - 10, this.canvas.top);
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + this.changePaletteButton.width + 10, this.canvas.top);
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + this.changePaletteButton.width, this.changePaletteButton.y);
                    this.overlayGraphics.lineTo(this.changePaletteButton.x, this.changePaletteButton.y);
                    this.overlayGraphics.lineTo(this.changePaletteButton.x - 10, this.canvas.top);            
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.changePaletteButton.x + (this.changePaletteButton.width / 8) - 10, this.canvas.top + (this.changePaletteButton.height / 8));
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + this.changePaletteButton.width - (this.changePaletteButton.width / 8) + 10, this.canvas.top + (this.changePaletteButton.height / 8));
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + this.changePaletteButton.width - (this.changePaletteButton.width / 8), this.changePaletteButton.y - (this.changePaletteButton.height / 8));
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + (this.changePaletteButton.width / 8), this.changePaletteButton.y - (this.changePaletteButton.height / 8));
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + (this.changePaletteButton.width / 8) - 10, this.canvas.top + (this.changePaletteButton.height / 8));            
                    this.overlayGraphics.endFill();

                    if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.changePaletteButton)
                        game.sfx1.play('changeTool');

                    currentButtonDown = this.changePaletteButton;

                    if (keyboardButtonDown) {
                        if (currentMode == DRAW) {
                            if (this.nKey.isDown) {
                                this.changePaletteButton.icon.frame = 8;

                                this.buttonText.setText("L\nA\nS\nT\n \nP\nA\nL\nE\nT\nT\nE");
                                fakePointer.position.x = 0;
                            }
                            else {
                                this.changePaletteButton.icon.frame = 9;

                                this.buttonText.setText("N\nE\nX\nT\n \nP\nA\nL\nE\nT\nT\nE");
                                fakePointer.position.x = game.width;
                            }
                        }
                        else if (currentMode == SELECTION) {
                            if (selectMode == CUT)
                                this.buttonText.setText("C\nO\nP\nY");
                            else if (selectMode == COPY)
                                this.buttonText.setText("C\nU\nT");
                        }
                    }
                    else {
                        if (currentMode == DRAW) {
                            if (game.input.activePointer.x < this.changePaletteButton.x + (this.changePaletteButton.width / 2)) {
                                this.changePaletteButton.icon.frame = 8;

                                this.buttonText.setText("L\nA\nS\nT\n \nP\nA\nL\nE\nT\nT\nE");
                            }
                            else {
                                this.changePaletteButton.icon.frame = 9;

                                this.buttonText.setText("N\nE\nX\nT\n \nP\nA\nL\nE\nT\nT\nE");
                            }
                        }
                        else if (currentMode == SELECTION) {
                            if (selectMode == CUT)
                                this.buttonText.setText("C\nO\nP\nY");
                            else if (selectMode == COPY)
                                this.buttonText.setText("C\nU\nT");
                        }
                    }
                    

                    this.buttonText.visible = true;
                    this.buttonText.anchor.setTo(0.5);
                    this.buttonText.x = this.changePaletteButton.x + (this.changePaletteButton.width / 2);
                    this.buttonText.y = this.canvas.top + (this.canvas.height / 2);
                }
                else {
                    if (currentMode == DRAW) {
                        this.changePaletteButton.icon.frame = 4;
                    }

                    if (keyboardButtonDown) {
                        if (this.zKey.isDown)
                            currentButtonDown = this.undoButton;
                        else if (this.xKey.isDown)
                            currentButtonDown = this.redoButton;
                        else if (this.shiftKey.isDown)
                            currentButtonDown = this.selectionButton;
                        else if (this.aKey.isDown)
                            currentButtonDown = this.brushButton;
                        else if (this.sKey.isDown)
                            currentButtonDown = this.shapesButton;
                        else if (this.dKey.isDown)
                            currentButtonDown = this.bucketButton;
                        else if (this.enterKey.isDown)
                            currentButtonDown = this.optionsButton;
                        else {
                            keyboardButtonDown = false;
                            buttonsDown = false;

                            for (var x = 0; x < this.buttons.length; x++) {
                                if (currentButtonDown === this.buttons[x]) {
                                    this.buttons[x].executeButtonFunction(this.buttons[x], fakePointer, true);
                                }
                            }

                            currentButtonDown = null;
                        }
                    }
                    else {
                        if (this.zKey.isDown || (game.input.activePointer.x > this.undoButton.x && game.input.activePointer.x < this.undoButton.x + this.changePaletteButton.width)) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.undoButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.undoButton;
                        }
                        else if (this.xKey.isDown || (game.input.activePointer.x > this.redoButton.x && game.input.activePointer.x < this.redoButton.x + this.changePaletteButton.width)) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.redoButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.redoButton;
                        }
                        else if (this.shiftKey.isDown || (game.input.activePointer.x > this.selectionButton.x && game.input.activePointer.x < this.selectionButton.x + this.changePaletteButton.width)) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.selectionButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.selectionButton;
                        }
                        else if (this.aKey.isDown || (game.input.activePointer.x > this.brushButton.x && game.input.activePointer.x < this.brushButton.x + this.changePaletteButton.width)) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.brushButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.brushButton;
                        }
                        else if (this.sKey.isDown || (game.input.activePointer.x > this.shapesButton.x && game.input.activePointer.x < this.shapesButton.x + this.changePaletteButton.width)) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.shapesButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.shapesButton;
                        }
                        else if (this.dKey.isDown || (game.input.activePointer.x > this.bucketButton.x && game.input.activePointer.x < this.bucketButton.x + this.changePaletteButton.width)) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.bucketButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.bucketButton;
                        }
                        else if (this.enterKey.isDown || (game.input.activePointer.x > this.optionsButton.x && game.input.activePointer.x < this.optionsButton.x + this.changePaletteButton.width)) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.optionsButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.optionsButton;
                        }
                    }
                }
            }
            else if (axis == LANDSCAPE) {
                if (this.changePaletteButton.exists && (this.mKey.isDown || this.nKey.isDown || (!keyboardButtonDown && game.input.activePointer.y > this.changePaletteButton.y - this.changePaletteButton.height && game.input.activePointer.y < this.changePaletteButton.y))) {
                    this.overlayGraphics.beginFill(0x000000);
                    this.overlayGraphics.moveTo(this.canvas.left, this.changePaletteButton.y - this.changePaletteButton.height - 10);
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + this.changePaletteButton.width, this.changePaletteButton.y - this.changePaletteButton.height);
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + this.changePaletteButton.width, this.changePaletteButton.y);
                    this.overlayGraphics.lineTo(this.canvas.left, this.changePaletteButton.y + 10);
                    this.overlayGraphics.lineTo(this.canvas.left, this.changePaletteButton.y - this.changePaletteButton.height - 10);            
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.canvas.left + (this.changePaletteButton.width / 8), this.changePaletteButton.y - this.changePaletteButton.height + (this.changePaletteButton.height / 8) - 10);
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + this.changePaletteButton.width - (this.changePaletteButton.width / 8), this.changePaletteButton.y - this.changePaletteButton.height + (this.changePaletteButton.height / 8));
                    this.overlayGraphics.lineTo(this.changePaletteButton.x + this.changePaletteButton.width - (this.changePaletteButton.width / 8), this.changePaletteButton.y - (this.changePaletteButton.height / 8));
                    this.overlayGraphics.lineTo(this.canvas.left + (this.changePaletteButton.width / 8), this.changePaletteButton.y - (this.changePaletteButton.height / 8) + 10);
                    this.overlayGraphics.lineTo(this.canvas.left + (this.changePaletteButton.width / 8), this.changePaletteButton.y - this.changePaletteButton.height + (this.changePaletteButton.height / 8) - 10);

                    if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.changePaletteButton)
                        game.sfx1.play('changeTool');

                    currentButtonDown = this.changePaletteButton;

                    if (keyboardButtonDown) {
                        if (currentMode == DRAW) {
                            if (this.nKey.isDown) {
                                this.changePaletteButton.icon.frame = 8;

                                this.buttonText.setText("LAST PALETTE");
                                fakePointer.position.x = 0;
                            }
                            else {
                                this.changePaletteButton.icon.frame = 9;

                                this.buttonText.setText("NEXT PALETTE");
                                fakePointer.position.x = game.width;
                            }
                        }
                        else if (currentMode == SELECTION) {
                            if (selectMode == CUT)
                                this.buttonText.setText("COPY");
                            else if (selectMode == COPY)
                                this.buttonText.setText("CUT");
                        }
                    }
                    else {
                        if (currentMode == DRAW) {
                            if (game.input.activePointer.x < this.changePaletteButton.x + (this.changePaletteButton.width / 2)) {
                                this.changePaletteButton.icon.frame = 8;

                                this.buttonText.setText("LAST PALETTE");
                            }
                            else {
                                this.changePaletteButton.icon.frame = 9;

                                this.buttonText.setText("NEXT PALETTE");
                            }
                        }
                        else if (currentMode == SELECTION) {
                            if (selectMode == CUT)
                                this.buttonText.setText("COPY");
                            else if (selectMode == COPY)
                                this.buttonText.setText("CUT");
                        }
                    }

                    this.buttonText.visible = true;
                    this.buttonText.anchor.setTo(0.5);
                    this.buttonText.x = this.canvas.left + (this.canvas.width / 2);
                    this.buttonText.y = this.changePaletteButton.y - (this.changePaletteButton.height / 2);
                }
                else {
                    if (currentMode == DRAW) {
                        this.changePaletteButton.icon.frame = 4;
                    }

                    if (keyboardButtonDown) {
                        if (this.zKey.isDown)
                            currentButtonDown = this.undoButton;
                        else if (this.xKey.isDown)
                            currentButtonDown = this.redoButton;
                        else if (this.shiftKey.isDown)
                            currentButtonDown = this.selectionButton;
                        else if (this.aKey.isDown)
                            currentButtonDown = this.brushButton;
                        else if (this.sKey.isDown)
                            currentButtonDown = this.shapesButton;
                        else if (this.dKey.isDown)
                            currentButtonDown = this.bucketButton;
                        else if (this.enterKey.isDown)
                            currentButtonDown = this.optionsButton;
                        else {
                            keyboardButtonDown = false;
                            buttonsDown = false;
                            
                            for (var x = 0; x < this.buttons.length; x++) {
                                if (currentButtonDown === this.buttons[x]) {
                                    this.buttons[x].executeButtonFunction(this.buttons[x], fakePointer, true);
                                }
                            }

                            currentButtonDown = null;
                        }
                    }
                    else {
                        if (game.input.activePointer.y < this.undoButton.y && game.input.activePointer.y > this.undoButton.y - this.changePaletteButton.height) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.undoButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.undoButton;
                        }
                        else if (game.input.activePointer.y < this.redoButton.y && game.input.activePointer.y > this.redoButton.y - this.changePaletteButton.height) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.redoButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.redoButton;
                        }
                        else if (game.input.activePointer.y < this.selectionButton.y && game.input.activePointer.y > this.selectionButton.y - this.changePaletteButton.height) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.selectionButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.selectionButton;
                        }
                        else if (game.input.activePointer.y < this.brushButton.y && game.input.activePointer.y > this.brushButton.y - this.changePaletteButton.height) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.brushButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.brushButton;
                        }
                        else if (game.input.activePointer.y < this.shapesButton.y && game.input.activePointer.y > this.shapesButton.y - this.changePaletteButton.height) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.shapesButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.shapesButton;
                        }
                        else if (game.input.activePointer.y < this.bucketButton.y && game.input.activePointer.y > this.bucketButton.y - this.changePaletteButton.height) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.bucketButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.bucketButton;
                        }
                        else if (game.input.activePointer.y < this.optionsButton.y && game.input.activePointer.y > this.optionsButton.y - this.changePaletteButton.height) {
                            if (sfxEnabled && currentButtonDown !== null && currentButtonDown !== this.optionsButton)
                                game.sfx1.play('changeTool');
                            currentButtonDown = this.optionsButton;
                        }
                    }
                }
            }
        }
        else {
            this.currentButtonDown = null;
        }

        // UNDO BUTTON

        if (canUndo) {
            this.overlayGraphics.beginFill(0x000000);
            this.undoButton.icon.frame = 0;
        }
        else {
            this.overlayGraphics.beginFill(0xcccccc);
            this.undoButton.icon.frame = 2;
        }

        if (undid && lastButtonReleased == this.undoButton && framesSinceLastRelease < 16) {
            if (framesSinceLastRelease % 2 == 0)
                this.undoButton.icon.rotation = 0.1;
            else
                this.undoButton.icon.rotation = -0.1;
        }
        else {
            this.undoButton.icon.rotation = 0;
        }

        if (axis == PORTRAIT) {
            if (buttonsDown && currentButtonDown == this.undoButton) {
                this.overlayGraphics.moveTo(this.undoButton.x - 10, this.canvas.top);
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width + 10, this.canvas.top);
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width, this.undoButton.y);
                this.overlayGraphics.lineTo(this.undoButton.x, this.undoButton.y);
                this.overlayGraphics.lineTo(this.undoButton.x - 10, this.canvas.top);            
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.undoButton.x + (this.undoButton.width / 8) - 10, this.canvas.top + (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width - (this.undoButton.width / 8) + 10, this.canvas.top + (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width - (this.undoButton.width / 8), this.undoButton.y - (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + (this.undoButton.width / 8), this.undoButton.y - (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + (this.undoButton.width / 8) - 10, this.canvas.top + (this.undoButton.height / 8));            
                this.overlayGraphics.endFill();

                if (canUndo)
                    this.buttonText.setText("U\nN\nD\nO");
                else
                    this.buttonText.setText("c\na\nn'\nt\n \nU\nN\nD\nO");

                this.buttonText.visible = true;
                this.buttonText.anchor.setTo(0.5);
                this.buttonText.x = this.undoButton.x + (this.undoButton.width / 2);
                this.buttonText.y = this.canvas.top + (this.canvas.height / 2);
            }
            else {
                this.overlayGraphics.moveTo(this.undoButton.x, this.undoButton.y - this.undoButton.height);
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width, this.undoButton.y - this.undoButton.height);
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width, this.undoButton.y);
                this.overlayGraphics.lineTo(this.undoButton.x, this.undoButton.y);
                this.overlayGraphics.lineTo(this.undoButton.x, this.undoButton.y - this.undoButton.height);
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.undoButton.x + (this.undoButton.width / 8), this.undoButton.y - this.undoButton.height + (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width - (this.undoButton.width / 8), this.undoButton.y - this.undoButton.height + (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width - (this.undoButton.width / 8), this.undoButton.y - (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + (this.undoButton.width / 8), this.undoButton.y - (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + (this.undoButton.width / 8), this.undoButton.y - this.undoButton.height + (this.undoButton.height / 8));
            }
        }
        else if (axis == LANDSCAPE) {
            if (buttonsDown && currentButtonDown == this.undoButton) {
                this.overlayGraphics.moveTo(this.canvas.left, this.undoButton.y - this.undoButton.height - 10);
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width, this.undoButton.y - this.undoButton.height);
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width, this.undoButton.y);
                this.overlayGraphics.lineTo(this.canvas.left, this.undoButton.y + 10);
                this.overlayGraphics.lineTo(this.canvas.left, this.undoButton.y - this.undoButton.height - 10);            
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.canvas.left + (this.undoButton.width / 8), this.undoButton.y - this.undoButton.height + (this.undoButton.height / 8) - 10);
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width - (this.undoButton.width / 8), this.undoButton.y - this.undoButton.height + (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width - (this.undoButton.width / 8), this.undoButton.y - (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.canvas.left + (this.undoButton.width / 8), this.undoButton.y - (this.undoButton.height / 8) + 10);
                this.overlayGraphics.lineTo(this.canvas.left + (this.undoButton.width / 8), this.undoButton.y - this.undoButton.height + (this.undoButton.height / 8) - 10);

                if (canUndo)
                    this.buttonText.setText("UNDO");
                else
                    this.buttonText.setText("can't UNDO");

                this.buttonText.visible = true;
                this.buttonText.anchor.setTo(0.5);
                this.buttonText.x = this.canvas.left + (this.canvas.width / 2);
                this.buttonText.y = this.undoButton.y - (this.undoButton.height / 2);
            }
            else {
                this.overlayGraphics.moveTo(this.undoButton.x, this.undoButton.y - this.undoButton.height);
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width, this.undoButton.y - this.undoButton.height);
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width, this.undoButton.y);
                this.overlayGraphics.lineTo(this.undoButton.x, this.undoButton.y);
                this.overlayGraphics.lineTo(this.undoButton.x, this.undoButton.y - this.undoButton.height);
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.undoButton.x + (this.undoButton.width / 8), this.undoButton.y - this.undoButton.height + (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width - (this.undoButton.width / 8), this.undoButton.y - this.undoButton.height + (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + this.undoButton.width - (this.undoButton.width / 8), this.undoButton.y - (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + (this.undoButton.width / 8), this.undoButton.y - (this.undoButton.height / 8));
                this.overlayGraphics.lineTo(this.undoButton.x + (this.undoButton.width / 8), this.undoButton.y - this.undoButton.height + (this.undoButton.height / 8));
            }
        }

        this.overlayGraphics.endFill();

        // REDO BUTTON

        this.overlayGraphics.lineStyle(0, 0x000000, 1.0);

        if (canRedo) {
            this.overlayGraphics.beginFill(0x000000);
            this.redoButton.icon.frame = 1;
        }
        else {
            this.overlayGraphics.beginFill(0xcccccc);
            this.redoButton.icon.frame = 3;
        }

        if (redid && lastButtonReleased == this.redoButton && framesSinceLastRelease < 30) {
            this.redoButton.icon.rotation += ((Math.PI * 2) - this.redoButton.icon.rotation) * 0.15;
        }
        else {
            this.redoButton.icon.rotation = 0;
        }

        if (axis == PORTRAIT) {
            if (buttonsDown && currentButtonDown == this.redoButton) {
                this.overlayGraphics.moveTo(this.redoButton.x - 10, this.canvas.top);
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width + 10, this.canvas.top);
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width, this.redoButton.y);
                this.overlayGraphics.lineTo(this.redoButton.x, this.redoButton.y);
                this.overlayGraphics.lineTo(this.redoButton.x - 10, this.canvas.top);            
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.redoButton.x + (this.redoButton.width / 8) - 10, this.canvas.top + (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width - (this.redoButton.width / 8) + 10, this.canvas.top + (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width - (this.redoButton.width / 8), this.redoButton.y - (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + (this.redoButton.width / 8), this.redoButton.y - (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + (this.redoButton.width / 8) - 10, this.canvas.top + (this.redoButton.height / 8));            
                this.overlayGraphics.endFill();

                if (canRedo)
                    this.buttonText.setText("R\nE\nD\nO");
                else
                    this.buttonText.setText("c\na\nn'\nt\n \nR\nE\nD\nO");

                this.buttonText.visible = true;
                this.buttonText.anchor.setTo(0.5);
                this.buttonText.x = this.redoButton.x + (this.redoButton.width / 2);
                this.buttonText.y = this.canvas.top + (this.canvas.height / 2);
            }
            else {
                this.overlayGraphics.moveTo(this.redoButton.x, this.redoButton.y - this.redoButton.height);
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width, this.redoButton.y - this.redoButton.height);
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width, this.redoButton.y);
                this.overlayGraphics.lineTo(this.redoButton.x, this.redoButton.y);
                this.overlayGraphics.lineTo(this.redoButton.x, this.redoButton.y - this.redoButton.height);
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.redoButton.x + (this.redoButton.width / 8), this.redoButton.y - this.redoButton.height + (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width - (this.redoButton.width / 8), this.redoButton.y - this.redoButton.height + (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width - (this.redoButton.width / 8), this.redoButton.y - (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + (this.redoButton.width / 8), this.redoButton.y - (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + (this.redoButton.width / 8), this.redoButton.y - this.redoButton.height + (this.redoButton.height / 8));
            }
        }
        else if (axis == LANDSCAPE) {
            if (buttonsDown && currentButtonDown == this.redoButton) {
                this.overlayGraphics.moveTo(this.canvas.left, this.redoButton.y - this.redoButton.height - 10);
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width, this.redoButton.y - this.redoButton.height);
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width, this.redoButton.y);
                this.overlayGraphics.lineTo(this.canvas.left, this.redoButton.y + 10);
                this.overlayGraphics.lineTo(this.canvas.left, this.redoButton.y - this.redoButton.height - 10);            
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.canvas.left + (this.redoButton.width / 8), this.redoButton.y - this.redoButton.height + (this.redoButton.height / 8) - 10);
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width - (this.redoButton.width / 8), this.redoButton.y - this.redoButton.height + (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width - (this.redoButton.width / 8), this.redoButton.y - (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.canvas.left + (this.redoButton.width / 8), this.redoButton.y - (this.redoButton.height / 8) + 10);
                this.overlayGraphics.lineTo(this.canvas.left + (this.redoButton.width / 8), this.redoButton.y - this.redoButton.height + (this.redoButton.height / 8) - 10);

                if (canRedo)
                    this.buttonText.setText("REDO");
                else
                    this.buttonText.setText("can't REDO");

                this.buttonText.visible = true;
                this.buttonText.anchor.setTo(0.5);
                this.buttonText.x = this.canvas.left + (this.canvas.width / 2);
                this.buttonText.y = this.redoButton.y - (this.redoButton.height / 2);
            }
            else {
                this.overlayGraphics.moveTo(this.redoButton.x, this.redoButton.y - this.redoButton.height);
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width, this.redoButton.y - this.redoButton.height);
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width, this.redoButton.y);
                this.overlayGraphics.lineTo(this.redoButton.x, this.redoButton.y);
                this.overlayGraphics.lineTo(this.redoButton.x, this.redoButton.y - this.redoButton.height);
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.redoButton.x + (this.redoButton.width / 8), this.redoButton.y - this.redoButton.height + (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width - (this.redoButton.width / 8), this.redoButton.y - this.redoButton.height + (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + this.redoButton.width - (this.redoButton.width / 8), this.redoButton.y - (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + (this.redoButton.width / 8), this.redoButton.y - (this.redoButton.height / 8));
                this.overlayGraphics.lineTo(this.redoButton.x + (this.redoButton.width / 8), this.redoButton.y - this.redoButton.height + (this.redoButton.height / 8));
            }
        }
        this.overlayGraphics.endFill();

        // SELECTION BUTTON
        if (currentMode == DRAW)
            this.overlayGraphics.beginFill(0x0088ff);
        else if (currentMode == SELECTION)
            this.overlayGraphics.beginFill(0xff8800);

        if (axis == PORTRAIT) {
            if (buttonsDown && currentButtonDown == this.selectionButton) {
                this.overlayGraphics.moveTo(this.selectionButton.x - 10, this.canvas.top);
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width + 10, this.canvas.top);
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width, this.selectionButton.y);
                this.overlayGraphics.lineTo(this.selectionButton.x, this.selectionButton.y);
                this.overlayGraphics.lineTo(this.selectionButton.x - 10, this.canvas.top);            
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.selectionButton.x + (this.selectionButton.width / 8) - 10, this.canvas.top + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8) + 10, this.canvas.top + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8) - 10, this.canvas.top + (this.selectionButton.height / 8));            
                this.overlayGraphics.endFill();

                if (currentMode == DRAW)
                    this.buttonText.setText("S\nE\nL\nE\nC\nT\nI\nO\nN");
                else if (currentMode == SELECTION)
                    this.buttonText.setText("D\nR\nA\nW\nI\nN\nG");

                this.buttonText.visible = true;
                this.buttonText.anchor.setTo(0.5);
                this.buttonText.x = this.selectionButton.x + (this.selectionButton.width / 2);
                this.buttonText.y = this.canvas.top + (this.canvas.height / 2);
            }
            else {
                this.overlayGraphics.moveTo(this.selectionButton.x, this.selectionButton.y - this.selectionButton.height);
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width, this.selectionButton.y - this.selectionButton.height);
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width, this.selectionButton.y);
                this.overlayGraphics.lineTo(this.selectionButton.x, this.selectionButton.y);
                this.overlayGraphics.lineTo(this.selectionButton.x, this.selectionButton.y - this.selectionButton.height);
                this.overlayGraphics.endFill();
                if (currentMode == DRAW)
                    this.overlayGraphics.beginFill(0x0088ff);
                else if (currentMode == SELECTION)
                    this.overlayGraphics.beginFill(0xff8800);
                this.overlayGraphics.moveTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
            }
        }
        else if (axis == LANDSCAPE) {
            if (buttonsDown && currentButtonDown == this.selectionButton) {
                this.overlayGraphics.moveTo(this.canvas.left, this.selectionButton.y - this.selectionButton.height - 10);
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width, this.selectionButton.y - this.selectionButton.height);
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width, this.selectionButton.y);
                this.overlayGraphics.lineTo(this.canvas.left, this.selectionButton.y + 10);
                this.overlayGraphics.lineTo(this.canvas.left, this.selectionButton.y - this.selectionButton.height - 10);            
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.canvas.left + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8) - 10);
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.canvas.left + (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8) + 10);
                this.overlayGraphics.lineTo(this.canvas.left + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8) - 10);

                if (currentMode == DRAW)
                    this.buttonText.setText("SELECTION");
                else if (currentMode == SELECTION)
                    this.buttonText.setText("DRAWING");

                this.buttonText.visible = true;
                this.buttonText.anchor.setTo(0.5);
                this.buttonText.x = this.canvas.left + (this.canvas.width / 2);
                this.buttonText.y = this.selectionButton.y - (this.selectionButton.height / 2);
            }
            else {
                this.overlayGraphics.moveTo(this.selectionButton.x, this.selectionButton.y - this.selectionButton.height);
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width, this.selectionButton.y - this.selectionButton.height);
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width, this.selectionButton.y);
                this.overlayGraphics.lineTo(this.selectionButton.x, this.selectionButton.y);
                this.overlayGraphics.lineTo(this.selectionButton.x, this.selectionButton.y - this.selectionButton.height);
                this.overlayGraphics.endFill();
                if (currentMode == DRAW)
                    this.overlayGraphics.beginFill(0x0088ff);
                else if (currentMode == SELECTION)
                    this.overlayGraphics.beginFill(0xff8800);
                this.overlayGraphics.moveTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + this.selectionButton.width - (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - (this.selectionButton.height / 8));
                this.overlayGraphics.lineTo(this.selectionButton.x + (this.selectionButton.width / 8), this.selectionButton.y - this.selectionButton.height + (this.selectionButton.height / 8));
            }
        }

        // DRAW BUTTON

        var workingSize;
        if (this.brushButton.width > this.brushButton.height)
            workingSize = this.brushButton.height * 2 / 3;
        else
            workingSize = this.brushButton.width * 2 / 3;

        switch (brushSize) {
            case 1: this.brushButton.icon.width = this.brushButton.icon.height / 2; break;
            case 2: this.brushButton.icon.width = this.brushButton.icon.height * 3 / 4; break;
            case 3: this.brushButton.icon.width = this.brushButton.icon.height; break;
        }

        /*
        if ((!buttonsDown && currentTool == BRUSH) || (currentMode == DRAW && buttonsDown && currentButtonDown == this.brushButton)) {
            this.brushSizeText.visible = true;
            this.brushSizeText.setText(brushSize);
            this.brushSizeText.x = this.brushButton.right - (this.brushButton.width / 8) - 2;
            this.brushSizeText.y = this.brushButton.bottom - (this.brushButton.height / 10);
        }
        else
            this.brushSizeText.visible = false;
        */
        
        if ((currentButtonDown !== this.shapesButton && currentButtonDown !== this.bucketButton) && ((currentButtonDown == this.brushButton) || currentTool == BRUSH || currentTool == SELECTION_BRUSH)) {
            this.overlayGraphics.lineStyle(0, 0x000000, 1.0);
            
            if (currentMode == DRAW)
                this.overlayGraphics.beginFill(0xff8800);
            else if (currentMode == SELECTION)
                this.overlayGraphics.beginFill(0x0088ff);

            if (axis == PORTRAIT) {
                if (buttonsDown && currentButtonDown == this.brushButton) {
                    this.overlayGraphics.moveTo(this.brushButton.x - 10, this.canvas.top);
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width + 10, this.canvas.top);
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width, this.brushButton.y);
                    this.overlayGraphics.lineTo(this.brushButton.x, this.brushButton.y);
                    this.overlayGraphics.lineTo(this.brushButton.x - 10, this.canvas.top);            
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.brushButton.x + (this.brushButton.width / 8) - 10, this.canvas.top + (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width - (this.brushButton.width / 8) + 10, this.canvas.top + (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width - (this.brushButton.width / 8), this.brushButton.y - (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + (this.brushButton.width / 8), this.brushButton.y - (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + (this.brushButton.width / 8) - 10, this.canvas.top + (this.brushButton.height / 8));
                    this.overlayGraphics.endFill();

                    if (currentTool == BRUSH)
                        this.buttonText.setText("C\nH\nA\nN\nG\nE\n \nS\nI\nZ\nE");
                    else if (currentMode == DRAW)
                        this.buttonText.setText("D\nR\nA\nW");
                    else if (currentMode == SELECTION)
                        this.buttonText.setText("H\nA\nN\nD\n\nS\nE\nL\nE\nC\nT");

                    this.buttonText.visible = true;
                    this.buttonText.anchor.setTo(0.5);
                    this.buttonText.x = this.brushButton.x + (this.brushButton.width / 2);
                    this.buttonText.y = this.canvas.top + (this.canvas.height / 2);
                }
                else {
                    this.overlayGraphics.moveTo(this.brushButton.x, this.brushButton.y - this.brushButton.height);
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width, this.brushButton.y - this.brushButton.height);
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width, this.brushButton.y);
                    this.overlayGraphics.lineTo(this.brushButton.x, this.brushButton.y);
                    this.overlayGraphics.lineTo(this.brushButton.x, this.brushButton.y - this.brushButton.height);
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.brushButton.x + (this.brushButton.width / 8), this.brushButton.y - this.brushButton.height + (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width - (this.brushButton.width / 8), this.brushButton.y - this.brushButton.height + (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width - (this.brushButton.width / 8), this.brushButton.y - (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + (this.brushButton.width / 8), this.brushButton.y - (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + (this.brushButton.width / 8), this.brushButton.y - this.brushButton.height + (this.brushButton.height / 8));
                }
            }
            else if (axis == LANDSCAPE) {
                if (buttonsDown && currentButtonDown == this.brushButton) {
                    this.overlayGraphics.moveTo(this.canvas.left, this.brushButton.y - this.brushButton.height - 10);
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width, this.brushButton.y - this.brushButton.height);
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width, this.brushButton.y);
                    this.overlayGraphics.lineTo(this.canvas.left, this.brushButton.y + 10);
                    this.overlayGraphics.lineTo(this.canvas.left, this.brushButton.y - this.brushButton.height - 10);            
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.canvas.left + (this.brushButton.width / 8), this.brushButton.y - this.brushButton.height + (this.brushButton.height / 8) - 10);
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width - (this.brushButton.width / 8), this.brushButton.y - this.brushButton.height + (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width - (this.brushButton.width / 8), this.brushButton.y - (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.canvas.left + (this.brushButton.width / 8), this.brushButton.y - (this.brushButton.height / 8) + 10);
                    this.overlayGraphics.lineTo(this.canvas.left + (this.brushButton.width / 8), this.brushButton.y - this.brushButton.height + (this.brushButton.height / 8) - 10);

                    if (currentTool == BRUSH)
                        this.buttonText.setText("CHANGE SIZE");
                    else if (currentMode == DRAW)
                        this.buttonText.setText("DRAW");
                    else if (currentMode == SELECTION)
                        this.buttonText.setText("HAND SELECT");

                    this.buttonText.visible = true;
                    this.buttonText.anchor.setTo(0.5);
                    this.buttonText.x = this.canvas.left + (this.canvas.width / 2);
                    this.buttonText.y = this.brushButton.y - (this.brushButton.height / 2);
                }
                else {
                    this.overlayGraphics.moveTo(this.brushButton.x, this.brushButton.y - this.brushButton.height);
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width, this.brushButton.y - this.brushButton.height);
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width, this.brushButton.y);
                    this.overlayGraphics.lineTo(this.brushButton.x, this.brushButton.y);
                    this.overlayGraphics.lineTo(this.brushButton.x, this.brushButton.y - this.brushButton.height);
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.brushButton.x + (this.brushButton.width / 8), this.brushButton.y - this.brushButton.height + (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width - (this.brushButton.width / 8), this.brushButton.y - this.brushButton.height + (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + this.brushButton.width - (this.brushButton.width / 8), this.brushButton.y - (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + (this.brushButton.width / 8), this.brushButton.y - (this.brushButton.height / 8));
                    this.overlayGraphics.lineTo(this.brushButton.x + (this.brushButton.width / 8), this.brushButton.y - this.brushButton.height + (this.brushButton.height / 8));
                }
            }

            this.brushButton.icon.height += ((workingSize * 3 / 2) - this.brushButton.icon.height) * 0.15;

            if (currentMode == DRAW) {
                this.brushButton.icon.rotation += ((0.35 + (Math.sin(this.frameTimer / 20) * 0.1)) - this.brushButton.icon.rotation) * 0.15;
            }
            else if (currentMode == SELECTION) {
                this.brushButton.icon.rotation += ((0 + (Math.sin(this.frameTimer / 20) * 0.1)) - this.brushButton.icon.rotation) * 0.15;
                this.brushButton.icon.width = this.brushButton.icon.height;
            }

            this.overlayGraphics.endFill();
        }
        else {
            this.overlayGraphics.lineStyle(0, 0xff8800, 1.0);

            this.overlayGraphics.beginFill(0xffffff);
            this.overlayGraphics.drawRect(this.brushButton.x, this.brushButton.y - this.brushButton.height, this.brushButton.width, this.brushButton.height);

            if (currentMode == DRAW)
                this.overlayGraphics.beginFill(0xff8800);
            else if (currentMode == SELECTION)
                this.overlayGraphics.beginFill(0x0088ff);

            this.overlayGraphics.drawRect(this.brushButton.x, this.brushButton.y - this.brushButton.height, this.brushButton.width / 4, this.brushButton.height / 6);
            this.overlayGraphics.drawRect(this.brushButton.x + (this.brushButton.width / 2) - (this.brushButton.width/4/2), this.brushButton.y - this.brushButton.height, this.brushButton.width / 4, this.brushButton.height / 6);
            this.overlayGraphics.drawRect(this.brushButton.x + this.brushButton.width, this.brushButton.y - this.brushButton.height, -this.brushButton.width / 4, this.brushButton.height / 6);

            this.overlayGraphics.drawRect(this.brushButton.x, this.brushButton.y - this.brushButton.height, this.brushButton.width / 6, this.brushButton.height / 4);
            this.overlayGraphics.drawRect(this.brushButton.x, this.brushButton.y - this.brushButton.height + (this.brushButton.height / 2) - (this.brushButton.height/4/2), this.brushButton.width / 6, this.brushButton.height / 4);
            this.overlayGraphics.drawRect(this.brushButton.x, this.brushButton.y, this.brushButton.width / 6, -this.brushButton.height / 4);

            this.overlayGraphics.drawRect(this.brushButton.x, this.brushButton.y, this.brushButton.width / 4, -this.brushButton.height / 6);
            this.overlayGraphics.drawRect(this.brushButton.x + (this.brushButton.width / 2) - (this.brushButton.width/4/2), this.brushButton.y, this.brushButton.width / 4, -this.brushButton.height / 6);
            this.overlayGraphics.drawRect(this.brushButton.x + this.brushButton.width, this.brushButton.y, -this.brushButton.width / 4, -this.brushButton.height / 6);

            this.overlayGraphics.drawRect(this.brushButton.x + this.brushButton.width, this.brushButton.y - this.brushButton.height, -this.brushButton.width / 6, this.brushButton.height / 4);
            this.overlayGraphics.drawRect(this.brushButton.x + this.brushButton.width, this.brushButton.y - this.brushButton.height + (this.brushButton.height / 2) - (this.brushButton.height/4/2), -this.brushButton.width / 6, this.brushButton.height / 4);
            this.overlayGraphics.drawRect(this.brushButton.x + this.brushButton.width, this.brushButton.y, -this.brushButton.width / 6, -this.brushButton.height / 4);

            this.brushButton.icon.height += (workingSize - this.brushButton.icon.height) * 0.15;

            if (currentMode == DRAW) {
                this.brushButton.icon.rotation += (0.35 - this.brushButton.icon.rotation) * 0.15;
            }
            else if (currentMode == SELECTION) {
                this.brushButton.icon.rotation += (0 - this.brushButton.icon.rotation) * 0.15;
                this.brushButton.icon.width = this.brushButton.icon.height;
            }

            this.overlayGraphics.endFill();
        }

        if ((currentButtonDown !== this.brushButton && currentButtonDown !== this.bucketButton) && (currentButtonDown == this.shapesButton || currentTool == SHAPES || currentTool == SELECTION_MARQUEE)) {
            this.overlayGraphics.lineStyle(0, 0x000000, 1.0);
            
            if (currentMode == DRAW)
                this.overlayGraphics.beginFill(0xff8800);
            else if (currentMode == SELECTION)
                this.overlayGraphics.beginFill(0x0088ff);

            if (axis == PORTRAIT) {
                if (buttonsDown && currentButtonDown == this.shapesButton) {
                    this.overlayGraphics.moveTo(this.shapesButton.x - 10, this.canvas.top);
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width + 10, this.canvas.top);
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y);
                    this.overlayGraphics.lineTo(this.shapesButton.x, this.shapesButton.y);
                    this.overlayGraphics.lineTo(this.shapesButton.x - 10, this.canvas.top);            
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.shapesButton.x + (this.shapesButton.width / 8) - 10, this.canvas.top + (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width - (this.shapesButton.width / 8) + 10, this.canvas.top + (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width - (this.shapesButton.width / 8), this.shapesButton.y - (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + (this.shapesButton.width / 8), this.shapesButton.y - (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + (this.shapesButton.width / 8) - 10, this.canvas.top + (this.shapesButton.height / 8));            
                    this.overlayGraphics.endFill();

                    if (currentTool == SHAPES) {
                        if (currentShape == LINE) {
                            this.buttonText.setText("O\nP\nE\nN\n \nB\nO\nX\n");
                        }
                        else if (currentShape == OPEN_RECTANGLE) {
                            this.buttonText.setText("S\nO\nL\nI\nD\n \nB\nO\nX\n");
                        }
                        else if (currentShape == CLOSED_RECTANGLE) {
                            this.buttonText.setText("O\nP\nE\nN\n \nE\nL\nL\nI\nP\nS\nE");
                        }
                        else if (currentShape == OPEN_ELLIPSE) {
                            this.buttonText.setText("S\nO\nL\nI\nD\n \nE\nL\nL\nI\nP\nS\nE");
                        }
                        else if (currentShape == CLOSED_ELLIPSE) {
                            this.buttonText.setText("L\nI\nN\nE\n");
                        }
                    }
                    else if (currentMode == DRAW) {
                        if (currentShape == LINE) {
                            this.buttonText.setText("L\nI\nN\nE\n");
                        }
                        else if (currentShape == OPEN_RECTANGLE) {
                            this.buttonText.setText("O\nP\nE\nN\n \nB\nO\nX\n");
                        }
                        else if (currentShape == CLOSED_RECTANGLE) {
                            this.buttonText.setText("\nS\nO\nL\nI\nD\n \nB\nO\nX\n");
                        }
                        else if (currentShape == OPEN_ELLIPSE) {
                            this.buttonText.setText("O\nP\nE\nN\n \nE\nL\nL\nI\nP\nS\nE");
                        }
                        else if (currentShape == CLOSED_ELLIPSE) {
                            this.buttonText.setText("S\nO\nL\nI\nD\n \nE\nL\nL\nI\nP\nS\nE");
                        }
                    }
                    else if (currentMode == SELECTION)
                        this.buttonText.setText("B\nO\nX\n\nS\nE\nL\nE\nC\nT");

                    this.buttonText.visible = true;
                    this.buttonText.anchor.setTo(0.5);
                    this.buttonText.x = this.shapesButton.x + (this.shapesButton.width / 2);
                    this.buttonText.y = this.canvas.top + (this.canvas.height / 2);
                }
                else {
                    this.overlayGraphics.moveTo(this.shapesButton.x, this.shapesButton.y - this.shapesButton.height);
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y - this.shapesButton.height);
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y);
                    this.overlayGraphics.lineTo(this.shapesButton.x, this.shapesButton.y);
                    this.overlayGraphics.lineTo(this.shapesButton.x, this.shapesButton.y - this.shapesButton.height);
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.shapesButton.x + (this.shapesButton.width / 8), this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width - (this.shapesButton.width / 8), this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width - (this.shapesButton.width / 8), this.shapesButton.y - (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + (this.shapesButton.width / 8), this.shapesButton.y - (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + (this.shapesButton.width / 8), this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 8));
                }
            }
            else if (axis == LANDSCAPE) {
                if (buttonsDown && currentButtonDown == this.shapesButton) {
                    this.overlayGraphics.moveTo(this.canvas.left, this.shapesButton.y - this.shapesButton.height - 10);
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y - this.shapesButton.height);
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y);
                    this.overlayGraphics.lineTo(this.canvas.left, this.shapesButton.y + 10);
                    this.overlayGraphics.lineTo(this.canvas.left, this.shapesButton.y - this.shapesButton.height - 10);            
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.canvas.left + (this.shapesButton.width / 8), this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 8) - 10);
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width - (this.shapesButton.width / 8), this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width - (this.shapesButton.width / 8), this.shapesButton.y - (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.canvas.left + (this.shapesButton.width / 8), this.shapesButton.y - (this.shapesButton.height / 8) + 10);
                    this.overlayGraphics.lineTo(this.canvas.left + (this.shapesButton.width / 8), this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 8) - 10);

                    if (currentTool == SHAPES) {
                        if (currentShape == LINE) {
                            this.buttonText.setText("OPEN BOX");
                        }
                        else if (currentShape == OPEN_RECTANGLE) {
                            this.buttonText.setText("SOLID BOX");
                        }
                        else if (currentShape == CLOSED_RECTANGLE) {
                            this.buttonText.setText("OPEN ELLIPSE");
                        }
                        else if (currentShape == OPEN_ELLIPSE) {
                            this.buttonText.setText("SOLID ELLIPSE");
                        }
                        else if (currentShape == CLOSED_ELLIPSE) {
                            this.buttonText.setText("LINE");
                        }
                    }
                    else if (currentMode == DRAW) {
                        if (currentShape == LINE) {
                            this.buttonText.setText("LINE");
                        }
                        else if (currentShape == OPEN_RECTANGLE) {
                            this.buttonText.setText("OPEN BOX");
                        }
                        else if (currentShape == CLOSED_RECTANGLE) {
                            this.buttonText.setText("SOLID BOX");
                        }
                        else if (currentShape == OPEN_ELLIPSE) {
                            this.buttonText.setText("OPEN ELLIPSE");
                        }
                        else if (currentShape == CLOSED_ELLIPSE) {
                            this.buttonText.setText("SOLID ELLIPSE");
                        }
                    }
                    else if (currentMode == SELECTION)
                        this.buttonText.setText("BOX SELECT");

                    this.buttonText.visible = true;
                    this.buttonText.anchor.setTo(0.5);
                    this.buttonText.x = this.canvas.left + (this.canvas.width / 2);
                    this.buttonText.y = this.shapesButton.y - (this.shapesButton.height / 2);
                }
                else {
                    this.overlayGraphics.moveTo(this.shapesButton.x, this.shapesButton.y - this.shapesButton.height);
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y - this.shapesButton.height);
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y);
                    this.overlayGraphics.lineTo(this.shapesButton.x, this.shapesButton.y);
                    this.overlayGraphics.lineTo(this.shapesButton.x, this.shapesButton.y - this.shapesButton.height);
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.shapesButton.x + (this.shapesButton.width / 8), this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width - (this.shapesButton.width / 8), this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + this.shapesButton.width - (this.shapesButton.width / 8), this.shapesButton.y - (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + (this.shapesButton.width / 8), this.shapesButton.y - (this.shapesButton.height / 8));
                    this.overlayGraphics.lineTo(this.shapesButton.x + (this.shapesButton.width / 8), this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 8));
                }
            }

            this.shapesButton.icon.rotation += ((0 + (Math.sin(this.frameTimer / 20) * 0.1)) - this.shapesButton.icon.rotation) * 0.15;
            this.shapesButton.icon.height += ((workingSize * 3 / 2) - this.shapesButton.icon.height) * 0.15;

            if (currentMode == DRAW) {
                if (currentShape == LINE) {
                    this.shapesButton.icon.frame = 15;
                }
                else if (currentShape == OPEN_RECTANGLE) {
                    this.shapesButton.icon.frame = 16;
                }
                else if (currentShape == CLOSED_RECTANGLE) {
                    this.shapesButton.icon.frame = 17;
                }
                else if (currentShape == OPEN_ELLIPSE) {
                    this.shapesButton.icon.frame = 18;
                }
                if (currentShape == CLOSED_ELLIPSE) {
                    this.shapesButton.icon.frame = 19;
                }
            }
            else if (currentMode == SELECTION) {

            }
        }
        else {
            this.overlayGraphics.lineStyle(0, 0xff8800, 1.0);

            this.overlayGraphics.beginFill(0xffffff);
            this.overlayGraphics.drawRect(this.shapesButton.x, this.shapesButton.y - this.shapesButton.height, this.shapesButton.width, this.shapesButton.height);

            if (currentMode == DRAW)
                this.overlayGraphics.beginFill(0xff8800);
            else if (currentMode == SELECTION)
                this.overlayGraphics.beginFill(0x0088ff);
            this.overlayGraphics.drawRect(this.shapesButton.x, this.shapesButton.y - this.shapesButton.height, this.shapesButton.width / 4, this.shapesButton.height / 6);
            this.overlayGraphics.drawRect(this.shapesButton.x + (this.shapesButton.width / 2) - (this.shapesButton.width/4/2), this.shapesButton.y - this.shapesButton.height, this.shapesButton.width / 4, this.shapesButton.height / 6);
            this.overlayGraphics.drawRect(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y - this.shapesButton.height, -this.shapesButton.width / 4, this.shapesButton.height / 6);

            this.overlayGraphics.drawRect(this.shapesButton.x, this.shapesButton.y - this.shapesButton.height, this.shapesButton.width / 6, this.shapesButton.height / 4);
            this.overlayGraphics.drawRect(this.shapesButton.x, this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 2) - (this.shapesButton.height/4/2), this.shapesButton.width / 6, this.shapesButton.height / 4);
            this.overlayGraphics.drawRect(this.shapesButton.x, this.shapesButton.y, this.shapesButton.width / 6, -this.shapesButton.height / 4);

            this.overlayGraphics.drawRect(this.shapesButton.x, this.shapesButton.y, this.shapesButton.width / 4, -this.shapesButton.height / 6);
            this.overlayGraphics.drawRect(this.shapesButton.x + (this.shapesButton.width / 2) - (this.shapesButton.width/4/2), this.shapesButton.y, this.shapesButton.width / 4, -this.shapesButton.height / 6);
            this.overlayGraphics.drawRect(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y, -this.shapesButton.width / 4, -this.shapesButton.height / 6);

            this.overlayGraphics.drawRect(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y - this.shapesButton.height, -this.shapesButton.width / 6, this.shapesButton.height / 4);
            this.overlayGraphics.drawRect(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y - this.shapesButton.height + (this.shapesButton.height / 2) - (this.shapesButton.height/4/2), -this.shapesButton.width / 6, this.shapesButton.height / 4);
            this.overlayGraphics.drawRect(this.shapesButton.x + this.shapesButton.width, this.shapesButton.y, -this.shapesButton.width / 6, -this.shapesButton.height / 4);

            if (currentMode == DRAW) {
                if (currentShape == LINE) {
                    this.shapesButton.icon.frame = 15;
                }
                else if (currentShape == OPEN_RECTANGLE) {
                    this.shapesButton.icon.frame = 16;
                }
                else if (currentShape == CLOSED_RECTANGLE) {
                    this.shapesButton.icon.frame = 17;
                }
                else if (currentShape == OPEN_ELLIPSE) {
                    this.shapesButton.icon.frame = 18;
                }
                if (currentShape == CLOSED_ELLIPSE) {
                    this.shapesButton.icon.frame = 19;
                }
            }
            else if (currentMode == SELECTION) {

            }

            this.shapesButton.icon.rotation += -this.shapesButton.icon.rotation * 0.15;
            this.shapesButton.icon.height += (workingSize - this.shapesButton.icon.height) * 0.15;

            this.overlayGraphics.endFill();
        }

        this.shapesButton.icon.width = this.shapesButton.icon.height;

        if ((currentButtonDown !== this.brushButton && currentButtonDown !== this.shapesButton) && (currentButtonDown == this.bucketButton || currentTool == BUCKET || currentTool == SELECTION_BUCKET)) {
            this.overlayGraphics.lineStyle(0, 0x000000, 1.0);
            
            if (currentMode == DRAW)
                this.overlayGraphics.beginFill(0xff8800);
            else if (currentMode == SELECTION)
                this.overlayGraphics.beginFill(0x0088ff);
            

            if (axis == PORTRAIT) {
                if (buttonsDown && currentButtonDown == this.bucketButton) {
                    this.overlayGraphics.moveTo(this.bucketButton.x - 10, this.canvas.top);
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width + 10, this.canvas.top);
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y);
                    this.overlayGraphics.lineTo(this.bucketButton.x, this.bucketButton.y);
                    this.overlayGraphics.lineTo(this.bucketButton.x - 10, this.canvas.top);            
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.bucketButton.x + (this.bucketButton.width / 8) - 10, this.canvas.top + (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width - (this.bucketButton.width / 8) + 10, this.canvas.top + (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width - (this.bucketButton.width / 8), this.bucketButton.y - (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + (this.bucketButton.width / 8), this.bucketButton.y - (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + (this.bucketButton.width / 8) - 10, this.canvas.top + (this.bucketButton.height / 8));            
                    this.overlayGraphics.endFill();

                    if (currentMode == DRAW)
                        this.buttonText.setText("F\nI\nL\nL");
                    else if (currentMode == SELECTION)
                        this.buttonText.setText("F\nI\nL\nL\n\nS\nE\nL\nE\nC\nT");

                    this.buttonText.visible = true;
                    this.buttonText.anchor.setTo(0.5);
                    this.buttonText.x = this.bucketButton.x + (this.bucketButton.width / 2);
                    this.buttonText.y = this.canvas.top + (this.canvas.height / 2);
                }
                else {
                    this.overlayGraphics.moveTo(this.bucketButton.x, this.bucketButton.y - this.bucketButton.height);
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y - this.bucketButton.height);
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y);
                    this.overlayGraphics.lineTo(this.bucketButton.x, this.bucketButton.y);
                    this.overlayGraphics.lineTo(this.bucketButton.x, this.bucketButton.y - this.bucketButton.height);
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.bucketButton.x + (this.bucketButton.width / 8), this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width - (this.bucketButton.width / 8), this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width - (this.bucketButton.width / 8), this.bucketButton.y - (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + (this.bucketButton.width / 8), this.bucketButton.y - (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + (this.bucketButton.width / 8), this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 8));
                }
            }
            else if (axis == LANDSCAPE) {
                if (buttonsDown && currentButtonDown == this.bucketButton) {
                    this.overlayGraphics.moveTo(this.canvas.left, this.bucketButton.y - this.bucketButton.height - 10);
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y - this.bucketButton.height);
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y);
                    this.overlayGraphics.lineTo(this.canvas.left, this.bucketButton.y + 10);
                    this.overlayGraphics.lineTo(this.canvas.left, this.bucketButton.y - this.bucketButton.height - 10);            
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.canvas.left + (this.bucketButton.width / 8), this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 8) - 10);
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width - (this.bucketButton.width / 8), this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width - (this.bucketButton.width / 8), this.bucketButton.y - (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.canvas.left + (this.bucketButton.width / 8), this.bucketButton.y - (this.bucketButton.height / 8) + 10);
                    this.overlayGraphics.lineTo(this.canvas.left + (this.bucketButton.width / 8), this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 8) - 10);

                    if (currentMode == DRAW)
                        this.buttonText.setText("FILL");
                    else if (currentMode == SELECTION)
                        this.buttonText.setText("FILL SELECT");

                    this.buttonText.visible = true;
                    this.buttonText.anchor.setTo(0.5);
                    this.buttonText.x = this.canvas.left + (this.canvas.width / 2);
                    this.buttonText.y = this.bucketButton.y - (this.bucketButton.height / 2);
                }
                else {
                    this.overlayGraphics.moveTo(this.bucketButton.x, this.bucketButton.y - this.bucketButton.height);
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y - this.bucketButton.height);
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y);
                    this.overlayGraphics.lineTo(this.bucketButton.x, this.bucketButton.y);
                    this.overlayGraphics.lineTo(this.bucketButton.x, this.bucketButton.y - this.bucketButton.height);
                    this.overlayGraphics.endFill();
                    this.overlayGraphics.beginFill(0xffffff);
                    this.overlayGraphics.moveTo(this.bucketButton.x + (this.bucketButton.width / 8), this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width - (this.bucketButton.width / 8), this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + this.bucketButton.width - (this.bucketButton.width / 8), this.bucketButton.y - (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + (this.bucketButton.width / 8), this.bucketButton.y - (this.bucketButton.height / 8));
                    this.overlayGraphics.lineTo(this.bucketButton.x + (this.bucketButton.width / 8), this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 8));
                }
            }

            this.overlayGraphics.endFill();

            this.bucketButton.icon.rotation += ((0 + (Math.sin(this.frameTimer / 20) * 0.1)) - this.bucketButton.icon.rotation) * 0.15;
            this.bucketButton.icon.height += ((workingSize * 3 / 2) - this.bucketButton.icon.height) * 0.15;
        }
        else {
            this.overlayGraphics.lineStyle(0, 0xff8800, 1.0);

            this.overlayGraphics.beginFill(0xffffff);
            this.overlayGraphics.drawRect(this.bucketButton.x, this.bucketButton.y - this.bucketButton.height, this.bucketButton.width, this.bucketButton.height);

            if (currentMode == DRAW)
                this.overlayGraphics.beginFill(0xff8800);
            else if (currentMode == SELECTION)
                this.overlayGraphics.beginFill(0x0088ff);
            this.overlayGraphics.drawRect(this.bucketButton.x, this.bucketButton.y - this.bucketButton.height, this.bucketButton.width / 4, this.bucketButton.height / 6);
            this.overlayGraphics.drawRect(this.bucketButton.x + (this.bucketButton.width / 2) - (this.bucketButton.width/4/2), this.bucketButton.y - this.bucketButton.height, this.bucketButton.width / 4, this.bucketButton.height / 6);
            this.overlayGraphics.drawRect(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y - this.bucketButton.height, -this.bucketButton.width / 4, this.bucketButton.height / 6);

            this.overlayGraphics.drawRect(this.bucketButton.x, this.bucketButton.y - this.bucketButton.height, this.bucketButton.width / 6, this.bucketButton.height / 4);
            this.overlayGraphics.drawRect(this.bucketButton.x, this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 2) - (this.bucketButton.height/4/2), this.bucketButton.width / 6, this.bucketButton.height / 4);
            this.overlayGraphics.drawRect(this.bucketButton.x, this.bucketButton.y, this.bucketButton.width / 6, -this.bucketButton.height / 4);

            this.overlayGraphics.drawRect(this.bucketButton.x, this.bucketButton.y, this.bucketButton.width / 4, -this.bucketButton.height / 6);
            this.overlayGraphics.drawRect(this.bucketButton.x + (this.bucketButton.width / 2) - (this.bucketButton.width/4/2), this.bucketButton.y, this.bucketButton.width / 4, -this.bucketButton.height / 6);
            this.overlayGraphics.drawRect(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y, -this.bucketButton.width / 4, -this.bucketButton.height / 6);

            this.overlayGraphics.drawRect(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y - this.bucketButton.height, -this.bucketButton.width / 6, this.bucketButton.height / 4);
            this.overlayGraphics.drawRect(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y - this.bucketButton.height + (this.bucketButton.height / 2) - (this.bucketButton.height/4/2), -this.bucketButton.width / 6, this.bucketButton.height / 4);
            this.overlayGraphics.drawRect(this.bucketButton.x + this.bucketButton.width, this.bucketButton.y, -this.bucketButton.width / 6, -this.bucketButton.height / 4);

            this.overlayGraphics.endFill();

            this.bucketButton.icon.rotation += -this.bucketButton.icon.rotation * 0.15;
            this.bucketButton.icon.height += (workingSize - this.bucketButton.icon.height) * 0.15;
        }

        this.bucketButton.icon.width = this.bucketButton.icon.height;

        this.overlayGraphics.lineStyle(0, 0x000000, 1.0);

        this.overlayGraphics.beginFill(0x000000);

        if (axis == PORTRAIT) {
            if (buttonsDown && currentButtonDown == this.optionsButton) {
                this.overlayGraphics.moveTo(this.optionsButton.x - 10, this.canvas.top);
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width + 10, this.canvas.top);
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width, this.optionsButton.y);
                this.overlayGraphics.lineTo(this.optionsButton.x, this.optionsButton.y);
                this.overlayGraphics.lineTo(this.optionsButton.x - 10, this.canvas.top);            
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.optionsButton.x + (this.optionsButton.width / 8) - 10, this.canvas.top + (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width - (this.optionsButton.width / 8) + 10, this.canvas.top + (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width - (this.optionsButton.width / 8), this.optionsButton.y - (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + (this.optionsButton.width / 8), this.optionsButton.y - (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + (this.optionsButton.width / 8) - 10, this.canvas.top + (this.optionsButton.height / 8));            
                this.overlayGraphics.endFill();

                if (currentMode == DRAW)
                    this.buttonText.setText("O\nP\nT\nI\nO\nN\nS");
                else if (currentMode == SELECTION)
                    this.buttonText.setText("U\nN\nS\nE\nL\nE\nC\nT\n\nA\nL\nL");

                this.buttonText.visible = true;
                this.buttonText.anchor.setTo(0.5);
                this.buttonText.x = this.optionsButton.x + (this.optionsButton.width / 2);
                this.buttonText.y = this.canvas.top + (this.canvas.height / 2);
            }
            else {
                this.overlayGraphics.moveTo(this.optionsButton.x, this.optionsButton.y - this.optionsButton.height);
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width, this.optionsButton.y - this.optionsButton.height);
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width, this.optionsButton.y);
                this.overlayGraphics.lineTo(this.optionsButton.x, this.optionsButton.y);
                this.overlayGraphics.lineTo(this.optionsButton.x, this.optionsButton.y - this.optionsButton.height);
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.optionsButton.x + (this.optionsButton.width / 8), this.optionsButton.y - this.optionsButton.height + (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width - (this.optionsButton.width / 8), this.optionsButton.y - this.optionsButton.height + (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width - (this.optionsButton.width / 8), this.optionsButton.y - (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + (this.optionsButton.width / 8), this.optionsButton.y - (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + (this.optionsButton.width / 8), this.optionsButton.y - this.optionsButton.height + (this.optionsButton.height / 8));
            }
        }
        else if (axis == LANDSCAPE) {
            if (buttonsDown && currentButtonDown == this.optionsButton) {
                this.overlayGraphics.moveTo(this.canvas.left, this.optionsButton.y - this.optionsButton.height - 10);
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width, this.optionsButton.y - this.optionsButton.height);
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width, this.optionsButton.y);
                this.overlayGraphics.lineTo(this.canvas.left, this.optionsButton.y + 10);
                this.overlayGraphics.lineTo(this.canvas.left, this.optionsButton.y - this.optionsButton.height - 10);            
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.canvas.left + (this.optionsButton.width / 8), this.optionsButton.y - this.optionsButton.height + (this.optionsButton.height / 8) - 10);
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width - (this.optionsButton.width / 8), this.optionsButton.y - this.optionsButton.height + (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width - (this.optionsButton.width / 8), this.optionsButton.y - (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.canvas.left + (this.optionsButton.width / 8), this.optionsButton.y - (this.optionsButton.height / 8) + 10);
                this.overlayGraphics.lineTo(this.canvas.left + (this.optionsButton.width / 8), this.optionsButton.y - this.optionsButton.height + (this.optionsButton.height / 8) - 10);

                if (currentMode == DRAW)
                    this.buttonText.setText("OPTIONS");
                else if (currentMode == SELECTION)
                    this.buttonText.setText("UNSELECT ALL");

                this.buttonText.visible = true;
                this.buttonText.anchor.setTo(0.5);
                this.buttonText.x = this.canvas.left + (this.canvas.width / 2);
                this.buttonText.y = this.optionsButton.y - (this.optionsButton.height / 2);
            }
            else {
                this.overlayGraphics.moveTo(this.optionsButton.x, this.optionsButton.y - this.optionsButton.height);
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width, this.optionsButton.y - this.optionsButton.height);
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width, this.optionsButton.y);
                this.overlayGraphics.lineTo(this.optionsButton.x, this.optionsButton.y);
                this.overlayGraphics.lineTo(this.optionsButton.x, this.optionsButton.y - this.optionsButton.height);
                this.overlayGraphics.endFill();
                this.overlayGraphics.beginFill(0xffffff);
                this.overlayGraphics.moveTo(this.optionsButton.x + (this.optionsButton.width / 8), this.optionsButton.y - this.optionsButton.height + (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width - (this.optionsButton.width / 8), this.optionsButton.y - this.optionsButton.height + (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + this.optionsButton.width - (this.optionsButton.width / 8), this.optionsButton.y - (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + (this.optionsButton.width / 8), this.optionsButton.y - (this.optionsButton.height / 8));
                this.overlayGraphics.lineTo(this.optionsButton.x + (this.optionsButton.width / 8), this.optionsButton.y - this.optionsButton.height + (this.optionsButton.height / 8));
            }
        }

        if (this.frameTimer - this.timeOfLastPaletteSwap < 90) {
            this.overlayGraphics.lineStyle(1, 0x000000, 1.0);
            this.overlayGraphics.beginFill(0x0088ff, 1.0);
            this.overlayGraphics.drawRect(this.canvas.left, this.canvas.top, this.canvas.width, 60);
            this.paletteNameText.visible = true;
        }
        else {
            this.paletteNameText.visible = false;
        }

        this.overlayGraphics.lineStyle(0, 0x000000, 1.0);

        // LABELS
        if (controlType == KEYBOARD) {
            this.selectedColorIcon.frame = 23;
            if (currentMode == DRAW)
                this.ctrlKeyIcon.exists = true;

            for (var x = 0; x < 16; x++) {
                this.colorSelectors[x].label.visible = true;
            }

            if (currentMode == SELECTION || typeof forcedPalette === "undefined") {
                this.changePaletteButton.label.visible = true;
            }
            this.undoButton.label.visible = true;
            this.redoButton.label.visible = true;
            this.selectionButton.label.visible = true;
            this.brushButton.label.visible = true;
            this.shapesButton.label.visible = true;
            this.bucketButton.label.visible = true;
            this.optionsButton.label.visible = true;
        }
        else {
            this.selectedColorIcon.frame = 22;
            this.ctrlKeyIcon.exists = false;

            for (var x = 0; x < 16; x++) {
                this.colorSelectors[x].label.visible = false;
            }

            this.changePaletteButton.label.visible = false;
            this.undoButton.label.visible = false;
            this.redoButton.label.visible = false;
            this.selectionButton.label.visible = false;
            this.brushButton.label.visible = false;
            this.shapesButton.label.visible = false;
            this.bucketButton.label.visible = false;
            this.optionsButton.label.visible = false;
        }
    },
    drawCompoStuff: function() {
        let previewLeft = this.canvasReference.left - this.preview.width - 5;
        let previewTop = this.canvasReference.top - this.preview.height - 5;
        let buttonsRight = this.canvasReference.right + 5 + this.buttons[0].width;
        let pushButtonRight = this.canvasReference.right + 5 + this.buttons[0].width + 3 + this.pushButton.width;

        let countdown = this.getCountdownTimer(compoEndTime);

        if (axis == PORTRAIT) {
            if (this.compoType.bottom < this.preview.top) {
                this.compoTitle.exists = true;
                this.compoType.exists = true;
                this.compoTimerH.exists = true;
                this.compoTimerM.exists = true;
                this.compoTimerS.exists = true;
                this.compoTimerHText.exists = true;
                this.compoTimerMText.exists = true;
                this.compoTimerSText.exists = true;

                if (countdown[0] > 0) {
                    this.compoTimerD.exists = true;
                    this.compoTimerDText.exists = true;
                }
                else {
                    this.compoTimerD.exists = false;
                    this.compoTimerDText.exists = false;
                }
            }
            else {
                this.compoTitle.exists = false;
                this.compoType.exists = false;
                this.compoTimerD.exists = false;
                this.compoTimerH.exists = false;
                this.compoTimerM.exists = false;
                this.compoTimerS.exists = false;
                this.compoTimerDText.exists = false;
                this.compoTimerHText.exists = false;
                this.compoTimerMText.exists = false;
                this.compoTimerSText.exists = false;
            }

            if (this.compoObjective1.bottom < this.preview.top) {
                this.compoObjective1.exists = true;
                if (get("kixel-compo-objective-2"))
                    this.compoObjective2.exists = true;
            }
            else {
                this.compoObjective1.exists = false;
                this.compoObjective2.exists = false;
            }

            this.compoTitle.x = game.width / 2;
            this.compoTitle.y = 10;
            this.compoType.y = this.compoTitle.bottom - 20;
            this.compoTimerS.x = game.width - 10;
            this.compoTimerS.y = this.compoTitle.bottom - 20;
            this.compoTimerS.height = this.compoType.height;
            this.compoTimerS.width = this.compoTimerS.height;
            this.compoTimerM.x = this.compoTimerS.left - 10;
            this.compoTimerM.y = this.compoTitle.bottom - 20;
            this.compoTimerM.height = this.compoTimerS.height;
            this.compoTimerM.width = this.compoTimerS.height;
            this.compoTimerH.x = this.compoTimerM.left - 10;
            this.compoTimerH.y = this.compoTitle.bottom - 20;
            this.compoTimerH.height = this.compoTimerS.height;
            this.compoTimerH.width = this.compoTimerS.height;
            if (this.compoTimerD.exists) {
                this.compoTimerD.x = this.compoTimerH.left - 10;
                this.compoTimerD.y = this.compoTitle.bottom - 20;
                this.compoTimerD.height = this.compoTimerS.height;
                this.compoTimerD.width = this.compoTimerS.height;
            }
            this.compoObjective1.x = 10;
            this.compoObjective1.y = this.compoType.bottom - 10;
            this.compoObjective2.x = 10;
            this.compoObjective2.y = this.compoObjective1.bottom - 10;
            this.compoTimeLeft.exists = false;
        }
        else if (axis == LANDSCAPE) {
            this.compoTitle.x = (previewLeft - 10) / 2;
            this.compoTitle.y = 10;
            this.compoType.x = (previewLeft - 10) / 2;
            this.compoType.y = this.compoTitle.bottom;
            this.compoObjective1.x = 10;
            this.compoObjective1.y = this.compoType.bottom;
            this.compoObjective2.x = 10;
            this.compoObjective2.y = this.compoObjective1.bottom;
            
            if (this.compoTimerD.exists) {
                this.compoTimerD.x = this.compoTimeLeft.x;
                this.compoTimerD.y = this.compoTimeLeft.bottom + 10;
                this.compoTimerH.x = this.compoTimerD.x;
                this.compoTimerH.y = this.compoTimerD.bottom + 10;
            }
            else {
                this.compoTimerH.x = this.compoTimeLeft.x;
                this.compoTimerH.y = this.compoTimeLeft.bottom + 10;
            }
            this.compoTimerM.x = this.compoTimeLeft.x;
            this.compoTimerM.y = this.compoTimerH.bottom + 10;
            this.compoTimerS.x = this.compoTimeLeft.x;
            this.compoTimerS.y = this.compoTimerM.bottom + 10;
        }

        if (currentState == PAINTING && countdown[4] == true) {
            if (!compoElapsed)
                this.enterLatePhase();
            else
                this.endCompo();
        }

        if (this.compoTimerH.exists) {
            this.compoTimerDText.fontSize = this.compoTimerD.width / 4;
            this.compoTimerHText.fontSize = this.compoTimerH.width / 4;
            this.compoTimerMText.fontSize = this.compoTimerM.width / 4;
            this.compoTimerSText.fontSize = this.compoTimerS.width / 4;

            if (this.compoTimerD.exists) {
                this.underlayGraphics.lineStyle(3, 0xeeeeee, 1.0);
                this.underlayGraphics.endFill();
                this.underlayGraphics.drawRect(this.compoTimerD.left, this.compoTimerD.top, this.compoTimerD.width, this.compoTimerD.height);
                if (countdown[0] >= 0)
                    this.compoTimerDText.setText(countdown[0] + "\nDAYS");
                this.compoTimerDText.x = this.compoTimerD.centerX;
                this.compoTimerDText.y = this.compoTimerD.centerY;
            }

            this.underlayGraphics.lineStyle(0, 0, 1.0);
            this.underlayGraphics.beginFill(0x8b0000, 1.0);
            this.underlayGraphics.drawEllipse(this.compoTimerH.centerX, this.compoTimerH.centerY, this.compoTimerH.width / 2, this.compoTimerH.height / 2);
            this.underlayGraphics.beginFill(0xd3c00a, 1.0);
            this.underlayGraphics.drawEllipse(this.compoTimerM.centerX, this.compoTimerM.centerY, this.compoTimerM.width / 2, this.compoTimerM.height / 2);
            this.underlayGraphics.beginFill(0x397d02, 1.0);
            this.underlayGraphics.drawEllipse(this.compoTimerS.centerX, this.compoTimerS.centerY, this.compoTimerS.width / 2, this.compoTimerS.height / 2);

            if (countdown[1] >= 0)
                this.compoTimerHText.setText(countdown[1]);
            if (countdown[2] >= 0)
                this.compoTimerMText.setText(countdown[2]);
            if (countdown[3] >= 0)
                this.compoTimerSText.setText(countdown[3]);

            this.compoTimerHText.x = this.compoTimerH.centerX;
            this.compoTimerHText.y = this.compoTimerH.centerY;
            this.compoTimerMText.x = this.compoTimerM.centerX;
            this.compoTimerMText.y = this.compoTimerM.centerY;
            this.compoTimerSText.x = this.compoTimerS.centerX;
            this.compoTimerSText.y = this.compoTimerS.centerY;
        }
    },
    resizeScreen: function() {
        var availableWidth = window.innerWidth;
        var availableHeight;

        if (window.innerWidth > window.innerHeight) {
            axis = LANDSCAPE;
        }
        else {
            axis = PORTRAIT;
        }

        if (!editorStarted && this.eventTimer > 100) {
            this.openingWindow.intendedX = availableWidth / 2;
            this.openingWindow.x = this.openingWindow.intendedX;
        }

        if (radioIsOpen) {
            if (axis == LANDSCAPE) {
                availableHeight = window.innerHeight - 45;
                get("footer").style.height = "45px";
            }
            else if (axis == PORTRAIT) {
                availableHeight = window.innerHeight * 0.9;
                get("footer").style.height = "10%";
            }
        }
        else {
            availableHeight = window.innerHeight;
            get("footer").style.height = "0";
        }

        if (currentState == OPENING) {
            if (typeof username !== 'undefined')
                this.openingWindowStatsText.maxWidth = (game.width) / 2 - 10;

            if (typeof compoNumber !== 'undefined') {
                if (axis == PORTRAIT)
                    this.openingWindowCompoType.maxWidth = (game.width / 2) - 10;
                else if (axis == LANDSCAPE)
                    this.openingWindowCompoType.maxWidth = (game.width / 4) - 10;
            }
        }

        this.bgGraphics.clear();
        this.bgGraphics.beginFill(Phaser.Color.hexToRGB(palettes.colors[currentPaletteIndex][10]));
        this.bgGraphics.drawRect(0, 0, game.width, game.height);
        this.bgGraphics.endFill();

        for (var x = 0; x < this.bgSprites.length; x++) {
            if (x % 2 == 0) {
                this.bgSprites.children[x].x = 0;
                this.bgSprites.children[x].y = game.height / 7 * x;
            }
            else {
                this.bgSprites.children[x].x = game.width / 2;
            }
            this.bgSprites.children[x].y = -(game.height / 6) + (game.height / 6 * x);
        }

        //this.bg.x = 0;
        //this.bg.y = 0;
        //this.bg.width = game.width;
        //this.bg.height = game.height;

        if (device == DESKTOP) {
            this.canvas.intendedX = availableWidth / 2;
            this.canvas.intendedY = availableHeight / 2;
            this.canvas.x = this.canvas.intendedX;
            this.canvas.y = this.canvas.intendedY;
        }
        else if (device == MOBILE) {
            if (axis == PORTRAIT) {
                this.canvas.intendedX = availableWidth / 2;
                if (currentState == OFFSET_MENU)
                    this.canvas.intendedY = availableHeight / 2;
                else
                    this.canvas.intendedY = (availableHeight / 2) - (availableHeight * 0.05);
                this.canvas.x = this.canvas.intendedX;
                this.canvas.y = this.canvas.intendedY;
            }
            else if (axis == LANDSCAPE) {
                if (currentState == OFFSET_MENU)
                    this.canvas.intendedX = availableWidth / 2;
                else
                    this.canvas.intendedX = (availableWidth / 2) - (availableWidth * 0.05);
                this.canvas.intendedY = availableHeight / 2;
                this.canvas.x = this.canvas.intendedX;
                this.canvas.y = this.canvas.intendedY;
            }
        }

        this.resizeCanvas();

        if (axis == LANDSCAPE) {
            this.preview.height = Math.floor(availableHeight / 18 * 2);
            while (this.preview.height % 32 !== 0 && this.preview.height > 32)
                this.preview.height--;
            this.preview.width = this.preview.height;
            
            if (currentState == OFFSET_MENU) {
                this.preview.intendedX = 0 - this.preview.width - 5;
                this.preview.intendedY = this.canvasReference.top;
            }
            else {
                this.preview.intendedX = this.canvasReference.left - this.preview.width - 5;
                this.preview.intendedY = this.canvasReference.top;
            }
            
            this.preview.x = this.preview.intendedX;
            this.preview.y = this.preview.intendedY;
        }
        else if (axis == PORTRAIT) {
            this.preview.width = Math.floor(availableWidth / 18 * 2);
            while (this.preview.width % 32 !== 0 && this.preview.width > 32)
                this.preview.width--;
            this.preview.height = this.preview.width;

            if (currentState == OFFSET_MENU) {
                this.preview.intendedX = this.canvasReference.left;
                this.preview.intendedY = 0 - this.preview.height - 5;
            }
            else {
                this.preview.intendedX = this.canvasReference.left;
                this.preview.intendedY = this.canvasReference.top - this.preview.height - 5;
            }
            
            this.preview.x = this.preview.intendedX;
            this.preview.y = this.preview.intendedY;
        }

        var availableSpace;

        if (axis == LANDSCAPE) {
            availableSpace = this.canvasReference.height - this.preview.height - 6;
        }
        else if (axis == PORTRAIT) {
            availableSpace = this.canvasReference.width - this.preview.width - 6;
        }

        this.colorSelectors.forEach(function(selector, index) {
            if (axis == LANDSCAPE) {
                selector.intendedY = 6 + this.canvasReference.top + this.preview.height + (availableSpace / 16 * index);

                selector.width = this.preview.width - 1;
                selector.height = availableSpace / 16;

                if (currentState == OFFSET_MENU) {
                    selector.intendedX = 0 - selector.width - 5;
                }
                else {
                    selector.intendedX = this.canvasReference.left - (this.preview.width) - 5;
                }
                
                selector.x = selector.intendedX;
                selector.y = selector.intendedY;

                if (typeof haunted !== 'undefined') {
                    selector.ghost.width = selector.height;
                    selector.ghost.height = selector.height;
                }
            }
            else if (axis == PORTRAIT) {
                selector.intendedX = 6 + this.canvasReference.left + this.preview.width + (availableSpace / 16 * index);

                selector.width = availableSpace / 16;
                selector.height = this.preview.height - 1;

                if (currentState == OFFSET_MENU) {
                    selector.intendedY = 0 - selector.height - 5;
                }
                else {
                    selector.intendedY = this.canvasReference.top - (this.preview.height) - 5;
                }
                
                selector.x = selector.intendedX;
                selector.y = selector.intendedY;

                if (typeof haunted !== 'undefined') {
                    selector.ghost.width = selector.width;
                    selector.ghost.height = selector.width;
                }
            }
        }, this);

        var workingSize;

        if (this.colorSelectors[0].width > this.colorSelectors[0].height)
            workingSize = this.colorSelectors[0].height;
        else if (this.colorSelectors[0].width < this.colorSelectors[0].height)
            workingSize = this.colorSelectors[0].width;
        
        this.selectedColorIcon.x = this.colorSelectors[currentColorIndex].x + (this.colorSelectors[currentColorIndex].width / 2);
        this.selectedColorIcon.y = this.colorSelectors[currentColorIndex].y + (this.colorSelectors[currentColorIndex].height / 2);
        this.selectedColorIcon.width = workingSize;
        this.selectedColorIcon.height = workingSize;

        this.buttons.forEach(function(button, index) {
            if (axis == LANDSCAPE) {
                if (currentState == OFFSET_MENU) {
                    button.intendedX = game.width + button.width + 5;
                }
                else {
                    button.intendedX = this.canvasReference.right + 5;
                    
                }
                button.intendedY = this.canvasReference.top + (this.canvasReference.height / 8) * (index + 1);

                button.width = this.canvasReference.width * 0.1;
                button.height = this.canvasReference.height / 8;
                button.x = button.intendedX;
                button.y = button.intendedY;
            }
            else if (axis == PORTRAIT) {
                if (currentState == OFFSET_MENU) {
                    button.intendedY = game.height + button.height + 5;
                }
                else {
                    button.intendedY = this.canvasReference.bottom + 5 + (this.canvasReference.height * 0.1);
                    
                }
                button.intendedX = this.canvasReference.left + (this.canvasReference.width / 8 * index);

                button.width = this.canvasReference.width / 8;
                button.height = this.canvasReference.width * 0.1;
                button.x = button.intendedX;
                button.y = button.intendedY;
            }
            
            if (button.icon) {
                button.icon.x = button.x + (button.width / 2);
                button.icon.y = button.y - (button.height / 2);

                if (button == this.changePaletteButton) {
                    if (button.width > button.height) {
                        button.icon.width = button.height;
                        button.icon.height = button.height;
                    }
                    else if (button.width < button.height) {
                        button.icon.width = button.width;
                        button.icon.height = button.width;
                    }
                }
                else {
                    if (button.width > button.height) {
                        button.icon.width = button.height * 2 / 3;
                        button.icon.height = button.height * 2 / 3;
                    }
                    else if (button.width < button.height) {
                        button.icon.width = button.width * 2 / 3;
                        button.icon.height = button.width * 2 / 3;
                    }
                }
                
            }

            if (button.label) {
                button.label.x = button.x + (button.width / 8) + 4;
                button.label.y = button.y - (button.height / 8) - 18;
            }
        }, this);

        if (device == MOBILE) {
            if (axis == PORTRAIT) {
                this.pushButton.x = this.buttons[0].x + 3;
                this.pushButton.y = this.buttons[4].y + 10;
                this.pushButton.width = (this.canvasReference.width * 2 / 3) - 6;
                this.pushButton.height = availableHeight * 0.1;

                this.pushButtonText.setText("P U S H !");

                this.eyedropButton.x = this.pushButton.right + 10;
                this.eyedropButton.y = this.pushButton.y;
                this.eyedropButton.width = (this.canvasReference.width / 3) - 10;
                this.eyedropButton.height = availableHeight * 0.1;
                this.eyedropButton.icon.scale.setTo(1);
                while (this.eyedropButton.icon.width > this.eyedropButton.width) {
                    this.eyedropButton.icon.width -= 1;
                    this.eyedropButton.icon.height -= 1;
                }
                while (this.eyedropButton.icon.height > this.eyedropButton.height) {
                    this.eyedropButton.icon.width -= 1;
                    this.eyedropButton.icon.height -= 1;
                }
            }
            else if (axis == LANDSCAPE) {
                this.pushButton.x = this.buttons[4].x + this.buttons[4].width + 10;
                this.pushButton.y = this.buttons[0].y - this.buttons[0].height + 3;
                this.pushButton.width = availableWidth * 0.1;
                this.pushButton.height = (this.canvasReference.height * 2 / 3) - 6;
                this.pushButtonText.setText("P\nU\nS\nH\n!");

                this.eyedropButton.x = this.pushButton.x;
                this.eyedropButton.y = this.pushButton.bottom + 10;
                this.eyedropButton.width = availableWidth * 0.1;
                this.eyedropButton.height = (this.canvasReference.height / 3) - 10;
                this.eyedropButton.icon.scale.setTo(1);
                while (this.eyedropButton.icon.width > this.eyedropButton.width) {
                    this.eyedropButton.icon.width -= 1;
                    this.eyedropButton.icon.height -= 1;
                }
                while (this.eyedropButton.icon.height > this.eyedropButton.height) {
                    this.eyedropButton.icon.width -= 1;
                    this.eyedropButton.icon.height -= 1;
                }
            }

            this.pushButtonText.x = this.pushButton.x + (this.pushButton.width / 2);
            this.pushButtonText.y = this.pushButton.y + (this.pushButton.height / 2);

            this.eyedropButton.icon.x = this.eyedropButton.x + (this.eyedropButton.width / 2);
            if (this.suckingColor)
                this.eyedropButton.icon.y = this.eyedropButton.y + (this.eyedropButton.height / 2) + 10;
            else
                this.eyedropButton.icon.y = this.eyedropButton.y + (this.eyedropButton.height / 2);
        }

        if (currentState == TRUE_COLORS_TITLE || currentState == TRUE_COLORS_GAMEPLAY || currentState == TRUE_COLORS_RESULTS) {
            this.overlayGraphics.clear();
            this.drawColorSelectors();
            this.drawButtons();
        }

        let previewLeft = this.canvasReference.left - this.preview.width - 5;
        let previewTop = this.canvasReference.top - this.preview.height - 5;
        let buttonsRight = this.canvasReference.right + 5 + this.buttons[0].width;
        let pushButtonRight = this.canvasReference.right + 5 + this.buttons[0].width + 3 + this.pushButton.width;
    
        this.paletteNameText.scale.setTo(map(workingSize, 0, 31, 0, 1, true));
        this.buttonText.scale.setTo(map(workingSize, 0, 30, 0, 1, true));

        this.virtualCursor.canvasPosition.x = (this.canvasScale * this.virtualCursor.grid.x) + (this.canvasScale / 2);
        this.virtualCursor.canvasPosition.y = (this.canvasScale * this.virtualCursor.grid.y) + (this.canvasScale / 2);

        this.virtualCursor.x = this.canvasReference.left + this.virtualCursor.canvasPosition.x;
        this.virtualCursor.y = this.canvasReference.top + this.virtualCursor.canvasPosition.y;

        // compo stuff
        if (typeof compoNumber !== 'undefined') {
            let countdown = this.getCountdownTimer(compoEndTime);

            if (axis == PORTRAIT) {
                this.compoTitle.fontSize = game.height / 30;
                this.compoType.fontSize = game.height / 35;
                this.compoType.anchor.setTo(0, 0);
                this.compoType.x = 10;
                this.compoObjective1.setText("Objective" + (get("kixel-compo-objective-2") ? " 1" : "") + ": " + get("kixel-compo-objective-1").innerHTML);
                this.compoObjective1.fontSize = game.width / 40;
                if (get("kixel-compo-objective-2"))
                    this.compoObjective2.setText("Objective 2: " + get("kixel-compo-objective-2").innerHTML);
                this.compoObjective2.fontSize = game.width / 40;
                this.compoTimeLeft.fontSize = game.width / 12;

                this.compoTimerD.anchor.setTo(1, 0);
                this.compoTimerH.anchor.setTo(1, 0);
                this.compoTimerM.anchor.setTo(1, 0);
                this.compoTimerS.anchor.setTo(1, 0);

                this.compoTitle.wordWrapWidth = availableWidth;
                this.compoType.wordWrapWidth = availableWidth;
                this.compoObjective1.wordWrapWidth = availableWidth;
                this.compoObjective2.wordWrapWidth = availableWidth;
                this.compoTimeLeft.wordWrapWidth = availableWidth;
            }
            else if (axis == LANDSCAPE) {
                if (this.preview.left > 100) {
                    this.compoTitle.fontSize = game.width / 40;
                    this.compoType.fontSize = game.width / 55;
                    this.compoType.anchor.setTo(0.5, 0);
                    this.compoObjective1.setText("Objective" + (get("kixel-compo-objective-2") ? "s" : "") + "\n" + get("kixel-compo-objective-1").innerHTML);
                    this.compoObjective1.fontSize = game.width / 80;
                    if (get("kixel-compo-objective-2"))
                        this.compoObjective2.setText(get("kixel-compo-objective-2").innerHTML);
                    this.compoObjective2.fontSize = game.width / 80;
                    if (device == DESKTOP)
                        this.compoTimeLeft.fontSize = game.width / 40;
                    else if (device == MOBILE)
                        this.compoTimeLeft.fontSize = game.width / 50;

                    if (countdown[0] > 0) {
                        this.compoTimerD.exists = true;
                        this.compoTimerDText.exists = true;
                    }
                    else {
                        this.compoTimerD.exists = false;
                        this.compoTimerDText.exists = false;
                    }
                    this.compoTimerH.exists = true;
                    this.compoTimerM.exists = true;
                    this.compoTimerS.exists = true;
                    this.compoTimerHText.exists = true;
                    this.compoTimerMText.exists = true;
                    this.compoTimerSText.exists = true;
                    
                    this.compoTimerD.anchor.setTo(0.5, 0);
                    this.compoTimerH.anchor.setTo(0.5, 0);
                    this.compoTimerM.anchor.setTo(0.5, 0);
                    this.compoTimerS.anchor.setTo(0.5, 0);

                    this.compoTitle.exists = true;
                    this.compoType.exists = true;
                    this.compoObjective1.exists = true;
                    if (get("kixel-compo-objective-2"))
                        this.compoObjective2.exists = true;

                    this.compoTitle.wordWrapWidth = this.preview.left - 20;
                    this.compoType.wordWrapWidth = this.preview.left - 20;
                    this.compoObjective1.wordWrapWidth = this.preview.left - 20;
                    this.compoObjective2.wordWrapWidth = this.preview.left - 20;
                    if (device == DESKTOP)
                        this.compoTimeLeft.wordWrapWidth = buttonsRight + ((game.width - buttonsRight) / 2) - 20;
                    else if (device == MOBILE)
                        this.compoTimeLeft.wordWrapWidth = pushButtonRight + ((game.width - pushButtonRight) / 2) - 20;
                }
                else {
                    this.compoTitle.exists = false;
                    this.compoType.exists = false;
                    this.compoObjective1.exists = false;
                    this.compoObjective2.exists = false;
                    this.compoTimeLeft.exists = false;
                    this.compoTimerD.exists = false;
                    this.compoTimerH.exists = false;
                    this.compoTimerM.exists = false;
                    this.compoTimerS.exists = false;
                    this.compoTimerDText.exists = false;
                    this.compoTimerHText.exists = false;
                    this.compoTimerMText.exists = false;
                    this.compoTimerSText.exists = false;
                }

                if (device == DESKTOP) {
                    if (game.width - buttonsRight - 20 > 100) {
                        this.compoTimeLeft.exists = true;
                        this.compoTimeLeft.x = buttonsRight + ((game.width - buttonsRight) / 2);
                        this.compoTimeLeft.y = 10;
                        this.compoTimeLeft.wordWrapWidth = game.width - buttonsRight - 20;

                        if (countdown[0] > 0) {
                            this.compoTimerD.exists = true;
                            this.compoTimerDText.exists = true;
                        }
                        else {
                            this.compoTimerD.exists = false;
                            this.compoTimerDText.exists = false;
                        }
                        this.compoTimerH.exists = true;
                        this.compoTimerM.exists = true;
                        this.compoTimerS.exists = true;
                        this.compoTimerHText.exists = true;
                        this.compoTimerMText.exists = true;
                        this.compoTimerSText.exists = true;

                        let timerWidth = (game.width - buttonsRight) / 2;
                        if (timerWidth > 100)
                            timerWidth = 100;
                        this.compoTimerD.width = timerWidth;
                        this.compoTimerD.height = timerWidth;
                        this.compoTimerH.width = timerWidth;
                        this.compoTimerH.height = timerWidth;
                        this.compoTimerM.width = timerWidth;
                        this.compoTimerM.height = timerWidth;
                        this.compoTimerS.width = timerWidth;
                        this.compoTimerS.height = timerWidth;
                    }
                    else {
                        this.compoTimeLeft.exists = false;
                        this.compoTimerD.exists = false;
                        this.compoTimerH.exists = false;
                        this.compoTimerM.exists = false;
                        this.compoTimerS.exists = false;
                        this.compoTimerDText.exists = false;
                        this.compoTimerHText.exists = false;
                        this.compoTimerMText.exists = false;
                        this.compoTimerSText.exists = false;
                    }
                }
                else if (device == MOBILE) {
                    if (game.width - pushButtonRight - 20 > 100) {
                        this.compoTimeLeft.exists = true;
                        this.compoTimeLeft.x = pushButtonRight + ((game.width - pushButtonRight) / 2);
                        this.compoTimeLeft.y = 10;
                        if (countdown[0] > 0) {
                            this.compoTimerD.exists = true;
                            this.compoTimerDText.exists = true;
                        }
                        else {
                            this.compoTimerD.exists = false;
                            this.compoTimerDText.exists = false;
                        }
                        this.compoTimerH.exists = true;
                        this.compoTimerM.exists = true;
                        this.compoTimerS.exists = true;
                        this.compoTimerHText.exists = true;
                        this.compoTimerMText.exists = true;
                        this.compoTimerSText.exists = true;
                        this.compoTimeLeft.wordWrapWidth = game.width - pushButtonRight.right - 20;

                        let timerWidth = (game.width - buttonsRight) / 2;
                        if (timerWidth > 100)
                            timerWidth = 100;
                        this.compoTimerD.width = timerWidth;
                        this.compoTimerD.height = timerWidth;
                        this.compoTimerH.width = timerWidth;
                        this.compoTimerH.height = timerWidth;
                        this.compoTimerM.width = timerWidth;
                        this.compoTimerM.height = timerWidth;
                        this.compoTimerS.width = timerWidth;
                        this.compoTimerS.height = timerWidth;
                    }
                    else {
                        this.compoTimeLeft.exists = false;
                        this.compoTimerD.exists = false;
                        this.compoTimerH.exists = false;
                        this.compoTimerM.exists = false;
                        this.compoTimerS.exists = false;
                        this.compoTimerDText.exists = false;
                        this.compoTimerHText.exists = false;
                        this.compoTimerMText.exists = false;
                        this.compoTimerSText.exists = false;
                    }
                }
                

                let timerNumberSize = 20;
            }
        }

        if (this.undoPreviews) {
            for (var x = 0; x < 16; x++) {
                this.undoPreviews[x].x = this.canvasReference.right + 4;
            }
        }

        if (currentMode == SELECTION) {
            this.maskArea.clear();
            this.maskArea.beginFill(0x000000, 0.0);
            for (var x = 0; x < 32; x++) {
                for (var y = 0; y < 32; y++) {
                    if (this.maskProduct.getPixel(x, y).a !== 0) {
                        this.maskArea.drawRect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale);
                    }
                }
            }
            this.maskArea.endFill();
        }

        this.mainMenu.x = game.width / 2;
        if (currentState == MAIN_MENU ||
            currentState == SAVE_MENU ||
            currentState == SUBMISSION_MENU ||
            currentState == MESSAGE ||
            currentState == LOADING)
            this.mainMenu.y = availableHeight / 2;
        else
            this.mainMenu.y = -availableHeight;
        this.mainMenu.width = game.width / 4 * 3;
        this.mainMenu.height = availableHeight / 4 * 3;

        this.messageWindowText.maxWidth = this.mainMenu.width * 3 / 4;

        this.clearCanvasButton.width = (this.mainMenu.width / 3) - 15;
        this.clearCanvasButton.height = (this.mainMenu.height / 4) - 40;
        this.offsetButton.width = (this.mainMenu.width / 3) - 15;
        this.offsetButton.height = (this.mainMenu.height / 4) - 40;
        this.symmetryButton.width = (this.mainMenu.width / 3) - 15;
        this.symmetryButton.height = (this.mainMenu.height / 4) - 40;
        this.gridButton.width = (this.mainMenu.width / 2) - 15;
        this.gridButton.height = (this.mainMenu.height / 4) - 40;
        this.audioButton.width = (this.mainMenu.width / 2) - 15;
        this.audioButton.height = (this.mainMenu.height / 4) - 40;
        this.saveButton.width = (this.mainMenu.width / 2) - 15;
        this.saveButton.height = (this.mainMenu.height / 4) - 40;
        this.loadButton.width = (this.mainMenu.width / 2) - 15;
        this.loadButton.height = (this.mainMenu.height / 4) - 40;

        this.clearCanvasButton.icon.scale.setTo(1);
        while (this.clearCanvasButton.icon.width > this.clearCanvasButton.width - 6) {
            this.clearCanvasButton.icon.width -= 1;
            this.clearCanvasButton.icon.height -= 1;
        }
        while (this.clearCanvasButton.icon.height > this.clearCanvasButton.height - 6) {
            this.clearCanvasButton.icon.width -= 1;
            this.clearCanvasButton.icon.height -= 1;
        }
        this.offsetButton.icon.scale.setTo(1);
        while (this.offsetButton.icon.width > this.offsetButton.width - 6) {
            this.offsetButton.icon.width -= 1;
            this.offsetButton.icon.height -= 1;
        }
        while (this.offsetButton.icon.height > this.offsetButton.height - 6) {
            this.offsetButton.icon.width -= 1;
            this.offsetButton.icon.height -= 1;
        }
        this.symmetryButton.icon.scale.setTo(1);
        while (this.symmetryButton.icon.width > this.symmetryButton.width - 6) {
            this.symmetryButton.icon.width -= 1;
            this.symmetryButton.icon.height -= 1;
        }
        while (this.symmetryButton.icon.height > this.symmetryButton.height - 6) {
            this.symmetryButton.icon.width -= 1;
            this.symmetryButton.icon.height -= 1;
        }
        this.gridButton.icon.scale.setTo(1);
        while (this.gridButton.icon.width > this.gridButton.width - 6) {
            this.gridButton.icon.width -= 1;
            this.gridButton.icon.height -= 1;
        }
        while (this.gridButton.icon.height > this.gridButton.height - 6) {
            this.gridButton.icon.width -= 1;
            this.gridButton.icon.height -= 1;
        }
        this.audioButton.icon.scale.setTo(1);
        while (this.audioButton.icon.width > this.audioButton.width - 6) {
            this.audioButton.icon.width -= 1;
            this.audioButton.icon.height -= 1;
        }
        while (this.audioButton.icon.height > this.audioButton.height - 6) {
            this.audioButton.icon.width -= 1;
            this.audioButton.icon.height -= 1;
        }
        this.saveButton.icon.scale.setTo(1);
        while (this.saveButton.icon.width > this.saveButton.width - 6) {
            this.saveButton.icon.width -= 1;
            this.saveButton.icon.height -= 1;
        }
        while (this.saveButton.icon.height > this.saveButton.height - 6) {
            this.saveButton.icon.width -= 1;
            this.saveButton.icon.height -= 1;
        }
        this.loadButton.icon.scale.setTo(1);
        while (this.loadButton.icon.width > this.loadButton.width - 6) {
            this.loadButton.icon.width -= 1;
            this.loadButton.icon.height -= 1;
        }
        while (this.loadButton.icon.height > this.loadButton.height - 6) {
            this.loadButton.icon.width -= 1;
            this.loadButton.icon.height -= 1;
        }
        
        this.cancelButton.height = this.mainMenu.width / 9;
        this.cancelButton.width = this.cancelButton.height;
        if (currentState == SUBMISSION_MENU) {
            this.submitButton.width = this.cancelButton.width;
            this.submitButton.height = this.cancelButton.height;
        }
        else {
            this.submitButton.width = this.mainMenu.width - (this.mainMenu.width / 8) - 30;
            this.submitButton.height = (this.mainMenu.height / 4) - 40;
        }

        this.saveLittleButton.width = (this.mainMenu.width / 2) - 15;
        this.saveLittleButton.height = (this.mainMenu.height / 2) - 40;
        this.saveBigButton.width = (this.mainMenu.width / 2) - 15;
        this.saveBigButton.height = (this.mainMenu.height / 2) - 40;

        this.saveBigButton.icon.width = 180;
        this.saveBigButton.icon.height = 180;
        if (this.saveBigButton.width < 180) {
            this.saveBigButton.icon.width = this.saveBigButton.width;
            this.saveBigButton.icon.height = this.saveBigButton.icon.width;
        }
        if (this.saveBigButton.height < 180) {
            this.saveBigButton.icon.height = this.saveBigButton.height;
            this.saveBigButton.icon.width = this.saveBigButton.icon.height;
        }

        let initWidth = this.symmetryButtonText.width;
        let initFontSize = this.symmetryButtonText.fontSize;
        let resultingWidth = initWidth;
        let intendedWidth;
        if (axis == PORTRAIT)
            intendedWidth = this.symmetryButton.width - 10;
        else if (axis == LANDSCAPE)
            intendedWidth = this.symmetryButton.width / 2;

        while (resultingWidth < intendedWidth) {
            optionTextSize += 1;

            resultingWidth = initWidth * optionTextSize / initFontSize;
            /* // this is like a whiteboard where i had to figure this out
            initFontSize : initWidth :: optionTextSize : resultingWidth
            initFontSize / initWidth = optionTextSize / resultingWidth
            initFontSize * resultingWidth = initWidth * optionTextSize
            resultingWidth = initWidth * optionTextSize / initFontSize
            */
        }

        while (resultingWidth > intendedWidth) {
            optionTextSize -= 1;

            resultingWidth = initWidth * optionTextSize / initFontSize;
        }

        this.symmetryButtonText.fontSize = optionTextSize;

        this.clearCanvasButtonText.fontSize = optionTextSize;
        this.offsetButtonText.fontSize = optionTextSize;
        this.gridButtonText.fontSize = optionTextSize;
        this.audioButtonText.fontSize = optionTextSize;
        this.saveButtonText.fontSize = optionTextSize;
        this.loadButtonText.fontSize = optionTextSize;
        this.saveLittleButtonText.fontSize = optionTextSize;
        this.saveBigButtonText.fontSize = optionTextSize;

        this.messageWindowText.fontSize = optionTextSize * 2;
        this.messageWindowButtonText.fontSize = optionTextSize * 2;

        this.offsetUpButton.width = this.canvasScale * 32 * 0.6;
        this.offsetDownButton.width = this.canvasScale * 32 * 0.6;
        this.offsetLeftButton.height = this.canvasScale * 32 * 0.6;
        this.offsetRightButton.height = this.canvasScale * 32 * 0.6;

        if (axis == LANDSCAPE) {
            this.offsetUpButton.height = availableHeight * 0.15;
            this.offsetDownButton.height = availableHeight * 0.15;
            this.offsetLeftButton.width = availableHeight * 0.15;
            this.offsetRightButton.width = availableHeight * 0.15;
        }
        else if (axis == PORTRAIT) {
            this.offsetUpButton.height = availableWidth * 0.15;
            this.offsetDownButton.height = availableWidth * 0.15;
            this.offsetLeftButton.width = availableWidth * 0.15;
            this.offsetRightButton.width = availableWidth * 0.15;
        }

        this.cancelOffsetButton.width = this.offsetLeftButton.width;
        this.cancelOffsetButton.height = this.offsetDownButton.height;
        this.confirmOffsetButton.width = this.offsetRightButton.width;
        this.confirmOffsetButton.height = this.offsetDownButton.height;

        this.offsetUpButton.intendedX = game.width / 2;
        this.offsetDownButton.intendedX = game.width / 2;
        this.offsetLeftButton.intendedY = availableHeight / 2;
        this.offsetRightButton.intendedY = availableHeight / 2;
        
        if (currentState == OFFSET_MENU) {
            if (axis == PORTRAIT) {
                let halfWidth = ((game.width / 2) - (this.canvasScale * 32 * 0.6 / 2) - this.offsetLeftButton.width) / 2;
                this.offsetUpButton.intendedY = (availableHeight / 2) - (this.canvasScale * 32 * 0.6 / 2) - halfWidth;
                this.offsetDownButton.intendedY = (availableHeight / 2) + (this.canvasScale * 32 * 0.6 / 2) + halfWidth;
                this.offsetLeftButton.intendedX = (game.width / 2) - (this.canvasScale * 32 * 0.6 / 2) - halfWidth;
                this.offsetRightButton.intendedX = (game.width / 2) + (this.canvasScale * 32 * 0.6 / 2) + halfWidth;
            }
            else if (axis == LANDSCAPE) {
                let halfHeight = ((availableHeight / 2) - (this.canvasScale * 32 * 0.6 / 2) - this.offsetUpButton.height) / 2;
                this.offsetUpButton.intendedY = (availableHeight / 2) - (this.canvasScale * 32 * 0.6 / 2) - halfHeight;
                this.offsetDownButton.intendedY = (availableHeight / 2) + (this.canvasScale * 32 * 0.6 / 2) + halfHeight;
                this.offsetLeftButton.intendedX = (game.width / 2) - (this.canvasScale * 32 * 0.6 / 2) - halfHeight;
                this.offsetRightButton.intendedX = (game.width / 2) + (this.canvasScale * 32 * 0.6 / 2) + halfHeight;
            }
        }
        else {
            this.offsetUpButton.intendedY = -20;
            this.offsetDownButton.intendedY = game.height + 20;
            this.offsetLeftButton.intendedX = -20;
            this.offsetRightButton.intendedX = game.width + 20;
        }

        this.offsetUpButton.x = this.offsetUpButton.intendedX;
        this.offsetUpButton.y = this.offsetUpButton.intendedY;
        this.offsetDownButton.x = this.offsetDownButton.intendedX;
        this.offsetDownButton.y = this.offsetDownButton.intendedY;
        this.offsetLeftButton.x = this.offsetLeftButton.intendedX;
        this.offsetLeftButton.y = this.offsetLeftButton.intendedY;
        this.offsetRightButton.x = this.offsetRightButton.intendedX;
        this.offsetRightButton.y = this.offsetRightButton.intendedY;

        this.cancelOffsetButton.x = this.offsetLeftButton.x;
        this.cancelOffsetButton.y = this.offsetDownButton.y;
        this.confirmOffsetButton.x = this.offsetRightButton.x;
        this.confirmOffsetButton.y = this.offsetDownButton.y;

        this.offsetUpButton.icon.height = this.offsetUpButton.height / 2;
        this.offsetUpButton.icon.width = this.offsetUpButton.icon.height;
        this.offsetDownButton.icon.height = this.offsetDownButton.height / 2;
        this.offsetDownButton.icon.width = this.offsetDownButton.icon.height;
        this.offsetLeftButton.icon.height = this.offsetLeftButton.width / 2;
        this.offsetLeftButton.icon.width = this.offsetLeftButton.icon.height;
        this.offsetRightButton.icon.height = this.offsetRightButton.width / 2;
        this.offsetRightButton.icon.width = this.offsetRightButton.icon.height;

        this.cancelOffsetButton.icon.height = this.cancelOffsetButton.height / 2;
        this.cancelOffsetButton.icon.width = this.cancelOffsetButton.icon.height;
        this.confirmOffsetButton.icon.height = this.confirmOffsetButton.height / 2;
        this.confirmOffsetButton.icon.width = this.confirmOffsetButton.icon.height;

        this.offsetUpButton.icon.x = this.offsetUpButton.centerX;
        this.offsetUpButton.icon.y = this.offsetUpButton.centerY + (this.offsetUpButton.isDown ? OPTION_DOWN_OFFSET : 0);
        this.offsetDownButton.icon.x = this.offsetDownButton.centerX;
        this.offsetDownButton.icon.y = this.offsetDownButton.centerY + (this.offsetDownButton.isDown ? OPTION_DOWN_OFFSET : 0);
        this.offsetLeftButton.icon.x = this.offsetLeftButton.centerX;
        this.offsetLeftButton.icon.y = this.offsetLeftButton.centerY + (this.offsetLeftButton.isDown ? OPTION_DOWN_OFFSET : 0);
        this.offsetRightButton.icon.x = this.offsetRightButton.centerX;
        this.offsetRightButton.icon.y = this.offsetRightButton.centerY + (this.offsetRightButton.isDown ? OPTION_DOWN_OFFSET : 0);

        this.cancelOffsetButton.icon.x = this.cancelOffsetButton.centerX;
        this.cancelOffsetButton.icon.y = this.cancelOffsetButton.centerY + (this.cancelOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0);
        this.confirmOffsetButton.icon.x = this.confirmOffsetButton.centerX;
        this.confirmOffsetButton.icon.y = this.confirmOffsetButton.centerY + (this.confirmOffsetButton.isDown ? OPTION_DOWN_OFFSET : 0);

        this.paletteNameText.x = this.canvas.right;
        this.paletteNameText.y = this.canvas.top + 1;
        //
        if (typeof username !== 'undefined') {
            this.trueColorsLogo.x = game.width / 3;
            this.trueColorsLogo.y = availableHeight / 4;
            this.trueColorsTitleKixel.x = game.width * 2 / 3;
            this.trueColorsTitleKixel.y = availableHeight / 4;

            this.trueColorsTitleKixel.y = availableHeight / 4;
            this.trueColorsTitleKixel.height = availableHeight / 3;
            this.trueColorsTitleKixel.width = this.trueColorsTitleKixel.height;

            switch (currentState) {
                case TRUE_COLORS_TITLE:
                    this.trueColorsText1.y = availableHeight * 4 / 6;
                    this.trueColorsText2.y = availableHeight * 5 / 6;
                    this.trueColorsText3.x = game.width / 2;
                    this.trueColorsText3.y = availableHeight - 10;
                    this.trueColorsText4.y = this.trueColorsTitleKixel.bottom + 10;
                    this.trueColorsCopySprite.y = this.trueColorsTitleKixel.bottom + 10;
                    break;
                case TRUE_COLORS_GAMEPLAY:
                    switch (this.trueColorsEventStep) {
                        case 0:
                            this.trueColorsText5.x = availableWidth / 2;
                            true.trueColorsText5.y = availableHeight / 2;
                            break;
                        case 1:
                            this.trueColorsExample1.x = (availableWidth / 2) - (this.trueColorsExample2.width / 2) - 30;
                            this.trueColorsExample2.x = availableWidth / 2;
                            this.trueColorsExample3.x = (availableWidth / 2) + (this.trueColorsExample2.width / 2) + 30;
                            
                            if (this.eventTimer < 7000) { // tutorial
                                this.trueColorsText1.intendedX = availableWidth / 2;
                                this.trueColorsText1.intendedY = 20;
                                this.trueColorsText2.intendedX = availableWidth / 2;
                                this.trueColorsText2.intendedY = availableHeight - 20;

                                this.trueColorsExample1.y = availableHeight / 2;
                                this.trueColorsExample2.y = availableHeight / 2;
                                this.trueColorsExample3.y = availableHeight / 2;
                            }
                            else {
                                this.trueColorsExample1.y = 0;
                                this.trueColorsExample2.y = 0;
                                this.trueColorsExample3.y = 0;

                                this.trueColorsText3.x = game.width / 2;
                                this.trueColorsText3.y = availableHeight / 2;
                            }

                            this.trueColorsText1.x = this.trueColorsText1.intendedX;
                            this.trueColorsText1.y = this.trueColorsText1.intendedY;
                            this.trueColorsText2.x = this.trueColorsText2.intendedX;
                            this.trueColorsText2.y = this.trueColorsText2.intendedY;

                            this.trueColorsText1.wordWrapWidth = availableWidth;
                            this.trueColorsText2.wordWrapWidth = availableWidth;
                            break;
                        case 2: // countdown
                            this.trueColorsText1.x = -this.trueColorsText1.width;
                            this.trueColorsText1.y = -this.trueColorsText1.height;
                            this.trueColorsText2.x = game.width + this.trueColorsText2.width;
                            this.trueColorsText2.y = -this.trueColorsText2.height;


                            this.trueColorsText3.x = availableWidth / 2;
                            this.trueColorsText3.y = availableHeight / 2;
                            break;
                        case 3: // gameplay
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                            this.trueColorsText1.x = availableWidth - 70;
                            this.trueColorsText1.y = -10;
                            this.trueColorsText2.x = availableWidth - 70;
                            this.trueColorsText2.y = -10;
                            this.trueColorsText5.x = availableWidth - 5;
                            this.trueColorsText5.y = 55;
                            this.trueColorsText4.x = availableWidth / 2;
                            this.trueColorsText4.y = (availableHeight / 2) - 180;

                            let fourLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 4, 8));
                            let threeLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 3, 8));
                            let twoLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 2, 8));
                            let lastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 1, 8));
                            let currentSprite = this.trueColorsKixelSprites.getChildAt(this.trueColorsSelectedIndex);
                            let nextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 1, 8));
                            let twoNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 2, 8));
                            let threeNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 3, 8));
                            let fourNextSprite = this.trueColorsCopySprite;

                            fourLastSprite.intendedX = (game.width / 2) - 720;
                            threeLastSprite.intendedX = (game.width / 2) - 540;
                            twoLastSprite.intendedX = (game.width / 2) - 360;
                            lastSprite.intendedX = (game.width / 2) - 180;
                            currentSprite.intendedX = game.width / 2;
                            nextSprite.intendedX = (game.width / 2) + 180;
                            twoNextSprite.intendedX = (game.width / 2) + 360;
                            threeNextSprite.intendedX = (game.width / 2) + 540;
                            fourNextSprite.intendedX = (game.width / 2) + 720;

                            this.trueColorsKixelSprites.forEach(function(sprite) {
                                sprite.x = sprite.intendedX;
                            }, this);
                            this.trueColorsCopySprite.x = this.trueColorsCopySprite.intendedX;
                            break;
                    }
                    break;
                case TRUE_COLORS_RESULTS:
                    switch (this.trueColorsEventStep) {
                        case 0:
                            this.trueColorsText3.x = game.width / 2;
                            this.trueColorsText3.y = availableHeight / 2;

                            this.trueColorsText1.x = game.width - 60; // "1"
                            this.trueColorsText1.y = -this.trueColorsText1.height;
                            this.trueColorsText2.x = game.width - 20; // "/"
                            this.trueColorsText2.y = -this.trueColorsText2.height;
                            this.trueColorsText5.x = game.width; // "8"
                            this.trueColorsText5.y = -this.trueColorsText5.height;
                            break;
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                            let index = this.trueColorsEventStep - 1;

                            for (var x = 0; x < 8; x++) {
                                if (x < index) {
                                    this.trueColorsKixelSprites.getChildAt(x).x = game.width + (game.width / 2);
                                }
                                else {
                                    this.trueColorsKixelSprites.getChildAt(x).x = game.width / 2;
                                    this.trueColorsKixelSprites.getChildAt(x).y = game.height + 170;
                                }
                            }

                            this.trueColorsCopySprite.x = game.width / 2;

                            this.trueColorsText1.x = this.trueColorsCopySprite.x + 10;
                            this.trueColorsText1.y = this.trueColorsCopySprite.y;

                            this.trueColorsText2.x = game.width + 10;
                            this.trueColorsText2.y = (availableHeight * 2 / 3) + 10;
                            this.trueColorsText2.wordWrapWidth = game.width;

                            this.trueColorsText3.x = game.width + 10;
                            this.trueColorsText3.y = this.trueColorsText2.bottom;

                            this.trueColorsText4.x = game.width / 2;
                            this.trueColorsText4.y = availableHeight / 2;

                            this.trueColorsText5.x = game.width - 10;
                            this.trueColorsText5.y = availableHeight;
                            break;
                        case 9:
                            for (var x = 0; x < 8; x++) {
                                this.trueColorsKixelSprites.getChildAt(x).x = ((game.width / 2) - 240) + (160 * (x % 4));
                            }

                            this.trueColorsCopySprite.x = -game.width / 2;

                            this.trueColorsText1.fontSize = game.width / 15;
                            if (this.trueColorsText1.fontSize < 40)
                                this.trueColorsText1.fontSize = 40;
                            if (this.trueColorsText1.fontSize > 80)
                                this.trueColorsText1.fontSize = 80;
                            this.trueColorsText2.fontSize = game.width / 25;
                            if (this.trueColorsText2.fontSize < 35)
                                this.trueColorsText2.fontSize = 35;
                            if (this.trueColorsText2.fontSize > 50)
                                this.trueColorsText2.fontSize = 50;
                            this.trueColorsText3.fontSize = game.width / 25;
                            if (this.trueColorsText3.fontSize < 35)
                                this.trueColorsText3.fontSize = 35;
                            if (this.trueColorsText3.fontSize > 50)
                                this.trueColorsText3.fontSize = 50;
                            this.trueColorsText4.fontSize = game.width / 25;
                            if (this.trueColorsText4.fontSize < 35)
                                this.trueColorsText4.fontSize = 35;
                            if (this.trueColorsText4.fontSize > 50)
                                this.trueColorsText4.fontSize = 50;

                            this.trueColorsText1.x = (game.width / 2) - 60;
                            this.trueColorsText2.x = (game.width / 2) - 20;
                            this.trueColorsText3.x = (game.width / 2) + 20;
                            this.trueColorsText4.x = (game.width / 2) + 60;
                            break;
                    }
                    break;
            }

            
        }

        console.log("Resized: " + game.width + " x " + game.height);
        this.update();
    },
    setControlType: function(type) {
        if (currentState !== SUBMISSION_MENU && type == KEYBOARD) {
            controlType = KEYBOARD;

            if (currentState === PAINTING)
                this.virtualCursor.visible = true;

            this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
            this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
            this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
            this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
        }
        else if (type === MOUSE) {
            controlType = MOUSE;

            if (device === DESKTOP)
                this.virtualCursor.visible = false;
        }
    },
    drawGrid: function(canvasSize) {
        this.gridGraphics.clear();

        switch (gridMode) {
            case EVEN:
                this.gridGraphics.lineStyle(1, 0x999999, 1.0);
                for (var x = 0; x < 33; x++) {
                    this.gridGraphics.moveTo(this.canvas.left + (x * canvasSize / 32), this.canvas.top);
                    this.gridGraphics.lineTo(this.canvas.left + (x * canvasSize / 32), this.canvas.top + canvasSize); // vertical
                    this.gridGraphics.moveTo(this.canvas.left, this.canvas.top + (x * canvasSize / 32));
                    this.gridGraphics.lineTo(this.canvas.left + canvasSize, this.canvas.top + (x * canvasSize / 32)); // horizontal
                }
                break;
            case SEGMENTS:
                for (var x = 0; x < 33; x++) {
                    if (x % 4 == 0)
                        this.gridGraphics.lineStyle(3, 0x888888, 1.0);
                    else
                        this.gridGraphics.lineStyle(1, 0x999999, 1.0);

                    this.gridGraphics.moveTo(this.canvas.left + (x * canvasSize / 32), this.canvas.top);
                    this.gridGraphics.lineTo(this.canvas.left + (x * canvasSize / 32), this.canvas.top + canvasSize + 1); // vertical
                    this.gridGraphics.moveTo(this.canvas.left, this.canvas.top + (x * canvasSize / 32));
                    this.gridGraphics.lineTo(this.canvas.left + canvasSize + 1, this.canvas.top + (x * canvasSize / 32)); // horizontal
                }
                break;
            case OFF:
                break;
        }
    },
    printMaskProductToKixel: function(keepMask = false, tx = 0, ty = 0) {
        this.kixel.copy(this.maskProduct, 0, 0, 32, 32, tx, ty, 32, 32, 0, 0, 0, 1, 1, 1, 0); // last number is blend mode

        if (keepMask) {
            this.cutMaskProduct.clear();
            this.cutMaskProduct.copy(this.maskProduct, 0, 0, 32, 32, tx, ty, 32, 32, 0, 0, 0, 1, 1, 1, 0);
            this.maskProduct.clear();
            this.maskProduct.copy(this.cutMaskProduct);
            this.maskProduct.update();
            this.maskArea.clear();
            for (var x = 0; x < 32; x++) {
                for (var y = 0; y < 32; y++) {
                    if (this.maskProduct.getPixel(x, y).a !== 0) {
                        this.maskArea.drawRect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale);
                    }
                }
            }
        }
        else {
            this.maskProduct.clear();
            this.maskProduct.update();
            this.maskArea.clear();
        }
        
        this.canvasMaskProduct.clear();
        
        this.refreshCanvas();
    },
    resizeCanvas: function() {
        var availableWidth = window.innerWidth;
        var availableHeight;

        if (radioIsOpen) {
            if (axis == LANDSCAPE) {
                availableHeight = window.innerHeight - 45;
            }
            else if (axis == PORTRAIT) {
                availableHeight = window.innerHeight * 0.9;
            }
        }
        else {
            availableHeight = window.innerHeight;
        }

        var canvasSize;
        
        if (device == DESKTOP) {
            if (axis == PORTRAIT) {
                canvasSize = Math.floor(availableWidth);

                if (canvasSize > availableHeight * 0.8)
                    canvasSize = Math.floor(availableHeight * 0.8);
            }
            else if (axis == LANDSCAPE) {
                canvasSize = Math.floor(availableHeight);

                if (canvasSize > availableWidth * 0.8)
                    canvasSize = Math.floor(availableWidth * 0.8);
            }
        }
        else if (device == MOBILE) {
            if (axis == PORTRAIT) {
                canvasSize = Math.floor(availableWidth);

                if (canvasSize > availableHeight * 0.7)
                    canvasSize = Math.floor(availableHeight * 0.7);
            }
            else if (axis == LANDSCAPE) {
                canvasSize = Math.floor(availableHeight);

                if (canvasSize > game.width * 0.7)
                    canvasSize = Math.floor(availableWidth * 0.7);
            }
        }

        while (canvasSize % 32 !== 0) {
            canvasSize--;
        }
        
        this.canvasScale = canvasSize / 32;
        this.copyCanvasKixel.resize(canvasSize, canvasSize);
        this.canvasMaskProduct.resize(canvasSize, canvasSize);
        this.canvasKixel.resize(canvasSize, canvasSize);
        this.canvasKixel.update();

        if (currentState == OFFSET_MENU) {
            this.canvas.width = canvasSize * 0.6;
            this.canvas.height = canvasSize * 0.6;
        }
        else {
            this.canvas.width = canvasSize;
            this.canvas.height = canvasSize;
        }

        this.canvasReference.x = this.canvas.x;
        this.canvasReference.y = this.canvas.y;
        this.canvasReference.width = canvasSize;
        this.canvasReference.height = canvasSize;
        
        this.canvasProductPreview.x = this.canvas.x;
        this.canvasProductPreview.y = this.canvas.y;
        this.canvasProductPreview.width = canvasSize;
        this.canvasProductPreview.height = canvasSize;
        this.maskArea.x = this.canvas.left;
        this.maskArea.y = this.canvas.top;
        this.maskArea.width = canvasSize;
        this.maskArea.height = canvasSize;
        this.selectionOverlay.x = this.canvas.x;
        this.selectionOverlay.y = this.canvas.y;
        this.selectionOverlay.width = canvasSize;
        this.selectionOverlay.height = canvasSize;
        
        this.drawGrid(canvasSize);
        this.refreshCanvas();
    },
    refreshCanvas: function() {
        this.canvasKixel.clear();
        this.kixel.update();
        
        for (var x = 0; x < 32; x++) {
            for (var y = 0; y < 32; y++) {
                var color = this.kixel.getPixelRGB(x, y);

                this.canvasKixel.rect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale, Phaser.Color.RGBtoString(color.r, color.g, color.b, 255, "#"));
            }
        }
    },
    createUndoState: function(saveKixel = true) {
        if (currentUndoState > 15) {
            this.undoStates.push(this.undoStates.shift());
            this.undoStates[15].clear();
            currentUndoState = 15;
        }
        else {
            for (var x = currentUndoState; x < 16; x++) {
                this.undoStates[x].clear();
            }
        }

        lastUndoIndex = currentUndoState;

        this.undoStates[currentUndoState].copy(this.kixel);
        this.undoStates[currentUndoState].palette = currentPaletteIndex;
        currentUndoState++;

        canUndo = true;
        canRedo = false;

        createSelectionOnUndo = false;

        this.kixel.update();

        if (saveKixel) {
            this.saveKixelLocally();
        }

        if (typeof haunted !== 'undefined') {
            this.countColorsUsed();
        }
    },
    undo: function() {
        if (!canUndo) {
            undid = false;
            return;
        }

        canRedo = true;

        currentUndoState--;

        this.kixel.copy(this.undoStates[currentUndoState - 1]);

        this.refreshCanvas();

        if (currentUndoState <= 1) {
            canUndo = false;
            currentUndoState = 1;
        }

        undid = true;

        this.maskProduct.clear();
        this.maskProduct.update();
        this.canvasMaskProduct.clear();
        this.maskArea.clear();

        if (createSelectionOnUndo && currentMode == SELECTION) {
            this.maskProduct.copy(this.undoMaskProduct);
            this.maskProduct.update();

            for (var x = 0; x < 32; x++) {
                for (var y = 0; y < 32; y++) {
                    if (this.maskProduct.getPixel(x, y).a !== 0) {
                        this.maskArea.drawRect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale);
                    }
                }
            }
        }
        createSelectionOnUndo = false;

        if (this.undoStates[currentUndoState - 1].palette !== currentPaletteIndex) {
            this.changePalette(this.undoStates[currentUndoState - 1].palette);
        }

        this.saveKixelLocally();

        if (sfxEnabled)
            game.sfx2.play('undo');

        if (typeof haunted !== 'undefined') {
            this.countColorsUsed();
        }
    },
    redo: function() {
        if (!canRedo) {
            redid = false;
            return;
        }

        canUndo = true;

        currentUndoState++;
        this.kixel.copy(this.undoStates[currentUndoState - 1]);

        this.refreshCanvas();

        if (currentUndoState > lastUndoIndex || currentUndoState > 15)
            canRedo = false;

        redid = true;

        this.maskProduct.clear();
        this.maskProduct.update();
        this.canvasMaskProduct.clear();
        this.maskArea.clear();

        if (this.undoStates[currentUndoState - 1].palette !== currentPaletteIndex) {
            this.changePalette(this.undoStates[currentUndoState - 1].palette);
        }

        this.saveKixelLocally();

        if (sfxEnabled)
            game.sfx2.play('redo');

        if (typeof haunted !== 'undefined') {
            this.countColorsUsed();
        }
    },
    floodFill: function(xStart, yStart, selectionMode = false, removeSelection = false) {
        var coordsToCheck = [];
        coordsToCheck.push({x: xStart, y: yStart});
        this.kixel.update();
        var color = this.kixel.getPixel(xStart, yStart);
        var scanX = xStart;
        var scanY = yStart;

        if (!selectionMode && compareColors(Phaser.Color.hexToColor(palettes.colors[currentPaletteIndex][currentColorIndex]), color)) {
            return;
        }

        if (selectionMode && !removeSelection && this.maskProduct.getPixel(scanX, scanY).a !== 0) {
            return;
        }

        if (removeSelection && this.maskProduct.getPixel(scanX, scanY).a === 0) {
            return;
        }

        while (coordsToCheck.length > 0) {
            var coords = coordsToCheck.pop();
            scanX = coords.x;
            scanY = coords.y;
            //console.log(coordsToCheck.length);
            if (selectionMode) {
                if (removeSelection) {
                    this.maskProduct.setPixel32(scanX, scanY, 0, 0, 0, 0);
                    this.maskProduct.update();
                }
                else {
                    let underlyingColor = Phaser.Color.updateColor(this.kixel.getPixel(currentX, currentY)).color.toString(16);
                    underlyingColor = "000000".substr(0, 6 - underlyingColor.length) + underlyingColor;
                    this.maskProduct.rect(scanX, scanY, 1, 1, "#" + underlyingColor);
                    this.maskProduct.update();
                    this.maskArea.beginFill(0x000000, 1.0);
                    this.maskArea.drawRect(scanX * this.canvasScale, scanY * this.canvasScale, this.canvasScale, this.canvasScale);
                    this.maskArea.endFill();
                }
                
            }
            else {
                this.kixel.rect(scanX, scanY, 1, 1, palettes.colors[currentPaletteIndex][currentColorIndex]);
                this.kixel.update();
            }

            var report = "";

            if (selectionMode) {
                if (removeSelection) {
                    if (scanX > 0) { // check left
                        if (compareColors(this.kixel.getPixel(scanX - 1, scanY), color) && compareColors(this.maskProduct.getPixel(scanX - 1, scanY), color)) {
                            coordsToCheck.push({x: scanX - 1, y: scanY});
                            report += "Left ";
                        }
                    }
                    if (scanX < 31) { // check right
                        if (compareColors(this.kixel.getPixel(scanX + 1, scanY), color) && compareColors(this.maskProduct.getPixel(scanX + 1, scanY), color)) {
                            coordsToCheck.push({x: scanX + 1, y: scanY});
                            report += "Right ";
                        }
                    }
                    if (scanY > 0) { // check up
                        if (compareColors(this.kixel.getPixel(scanX, scanY - 1), color) && compareColors(this.maskProduct.getPixel(scanX, scanY - 1), color)) {
                            coordsToCheck.push({x: scanX, y: scanY - 1});
                            report += "Up ";
                        }
                    }
                    if (scanY < 31) { // check down
                        if (compareColors(this.kixel.getPixel(scanX, scanY + 1), color) && compareColors(this.maskProduct.getPixel(scanX, scanY + 1), color)) {
                            coordsToCheck.push({x: scanX, y: scanY + 1});
                            report += "Down ";
                        }
                    }
                }
                else {
                    if (scanX > 0) { // check left
                        if (compareColors(this.kixel.getPixel(scanX - 1, scanY), color) && !compareColors(this.maskProduct.getPixel(scanX - 1, scanY), color)) {
                            coordsToCheck.push({x: scanX - 1, y: scanY});
                            report += "Left ";
                        }
                    }
                    if (scanX < 31) { // check right
                        if (compareColors(this.kixel.getPixel(scanX + 1, scanY), color) && !compareColors(this.maskProduct.getPixel(scanX + 1, scanY), color)) {
                            coordsToCheck.push({x: scanX + 1, y: scanY});
                            report += "Right ";
                        }
                    }
                    if (scanY > 0) { // check up
                        if (compareColors(this.kixel.getPixel(scanX, scanY - 1), color) && !compareColors(this.maskProduct.getPixel(scanX, scanY - 1), color)) {
                            coordsToCheck.push({x: scanX, y: scanY - 1});
                            report += "Up ";
                        }
                    }
                    if (scanY < 31) { // check down
                        if (compareColors(this.kixel.getPixel(scanX, scanY + 1), color) && !compareColors(this.maskProduct.getPixel(scanX, scanY + 1), color)) {
                            coordsToCheck.push({x: scanX, y: scanY + 1});
                            report += "Down ";
                        }
                    }
                }
            }
            else {
                if (scanX > 0) { // check left
                    if (compareColors(this.kixel.getPixel(scanX - 1, scanY), color)) {
                        coordsToCheck.push({x: scanX - 1, y: scanY});
                        report += "Left ";
                    }
                }
                if (scanX < 31) { // check right
                    if (compareColors(this.kixel.getPixel(scanX + 1, scanY), color)) {
                        coordsToCheck.push({x: scanX + 1, y: scanY});
                        report += "Right ";
                    }
                }
                if (scanY > 0) { // check up
                    if (compareColors(this.kixel.getPixel(scanX, scanY - 1), color)) {
                        coordsToCheck.push({x: scanX, y: scanY - 1});
                        report += "Up ";
                    }
                }
                if (scanY < 31) { // check down
                    if (compareColors(this.kixel.getPixel(scanX, scanY + 1), color)) {
                        coordsToCheck.push({x: scanX, y: scanY + 1});
                        report += "Down ";
                    }
                }
            }
            
            //console.log(report);
        }

        if (selectionMode && removeSelection) {
            this.maskArea.clear();
            for (var x = 0; x < 32; x++) {
                for (var y = 0; y < 32; y++) {
                    if (this.maskProduct.getPixel(x, y).a !== 0) {
                        this.maskArea.drawRect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale);
                    }
                }
            }
        }

        if (sfxEnabled) {
            if (selectionMode && removeSelection)
                game.sfx2.play('useBucketRight');
            else
                game.sfx2.play('useBucketLeft');
        }

        if (!selectionMode)
            this.createUndoState();
        this.refreshCanvas();
    },
    changeColor: function(index) {
        if (sfxEnabled && index !== currentColorIndex) {
            game.sfx1.play('paint-left-' + getChord()[0]);
            game.sfx2.play('paint-left-' + getChord()[2]);
        }

        currentColorIndex = index;
    },
    changePalette: function(index, swapPalettes = true) {
        var previousPaletteIndex = currentPaletteIndex;
        currentPaletteIndex = index;

        this.bgGraphics.clear();
        this.bgGraphics.beginFill(Phaser.Color.hexToRGB(palettes.colors[currentPaletteIndex][10]));
        this.bgGraphics.drawRect(0, 0, game.width, game.height);
        this.bgGraphics.endFill();

        if (swapPalettes) {
            for (var x = 0; x < 32; x++) {
                for (var y = 0; y < 32; y++) {
                    var rgb = this.kixel.getPixelRGB(x, y);
                    var color = Phaser.Color.RGBtoString(rgb.r, rgb.g, rgb.b, 255, "#");

                    for (var z = 0; z < 16; z++) {
                        if (color == palettes.colors[previousPaletteIndex][z]) {
                            color = palettes.colors[currentPaletteIndex][z];
                            this.kixel.rect(x, y, 1, 1, color);
                            break;
                        }
                    }

                    this.canvasKixel.rect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale, color);
                }
            }
        }

        if (typeof compoNumber !== 'undefined') {
            if (index == 2) { // ARQ16, yellow background
                this.compoTitle.addColor('black', 0);
                this.compoTitle.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
                this.compoType.addColor('black', 0);
                this.compoType.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
                this.compoObjective1.addColor('black', 0);
                this.compoObjective1.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
                this.compoObjective2.addColor('black', 0);
                this.compoObjective2.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
                this.compoTimeLeft.addColor('black', 0);
                this.compoTimeLeft.setShadow(2, 2, 'rgba(255, 255, 255, 255)');
            }
            else {
                this.compoTitle.addColor('white', 0);
                this.compoTitle.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                this.compoType.addColor('white', 0);
                this.compoType.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                this.compoObjective1.addColor('white', 0);
                this.compoObjective1.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                this.compoObjective2.addColor('white', 0);
                this.compoObjective2.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
                this.compoTimeLeft.addColor('white', 0);
                this.compoTimeLeft.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
            }
        }

        this.kixel.update();

        this.canvas.y -= 10;
        this.gridGraphics.y -= 10;
        this.paletteNameText.y -= 10;

        this.timeOfLastPaletteSwap = this.frameTimer;
        this.paletteNameText.setText(palettes.titles[currentPaletteIndex] + "\nby " + palettes.creators[currentPaletteIndex]);
    },
    changePaletteOfImage: function(origBmd, newBmd, initPalette, paletteIndex) {
        let size = origBmd.width / 32;
        let newSize = newBmd.width / 32;

        for (var x = 0; x < 32; x++) {
            for (var y = 0; y < 32; y++) {
                var rgb = origBmd.getPixelRGB(x * size, y * size);
                var color = Phaser.Color.RGBtoString(rgb.r, rgb.g, rgb.b, 255, "#");

                for (var z = 0; z < 16; z++) {
                    if (color == palettes.colors[initPalette][z]) {
                        color = palettes.colors[paletteIndex][z];
                        newBmd.rect(x * newSize, y * newSize, newSize, newSize, color);
                        break;
                    }
                }
            }
        }
        newBmd.update();
    },
    offsetKixel: function(direction) {
        if (sfxEnabled)
            game.sfx2.play('offsetDirections');

        this.cutMaskProduct.clear();

        let availableHeight = this.getAvailableHeight();

        switch (direction) {
            case "up":
                this.cutMaskProduct.copy(this.maskProduct, 0, 0, 32, 1);
                this.cutMaskProduct.update();
                this.maskProduct.copy(this.maskProduct, 0, 0, 32, 32, 0, -1);
                this.maskProduct.copy(this.cutMaskProduct, 0, 0, 32, 1, 0, 31);

                this.canvas.y = (availableHeight / 2) - 30;
                break;
            case "down":
                this.cutMaskProduct.copy(this.maskProduct, 0, 31, 32, 1);
                this.cutMaskProduct.update();
                this.maskProduct.copy(this.maskProduct, 0, 0, 32, 32, 0, 1);
                this.maskProduct.copy(this.cutMaskProduct, 0, 31, 32, 1, 0, 0);

                this.canvas.y = (availableHeight / 2) + 30;
                break;
            case "left":
                this.cutMaskProduct.copy(this.maskProduct, 0, 0, 1, 32);
                this.cutMaskProduct.update();
                this.maskProduct.copy(this.maskProduct, 0, 0, 32, 32, -1, 0);
                this.maskProduct.copy(this.cutMaskProduct, 0, 0, 1, 32, 31, 0);

                this.canvas.x = (game.width / 2) - 30;
                break;
            case "right":
                this.cutMaskProduct.copy(this.maskProduct, 31, 0, 1, 32);
                this.cutMaskProduct.update();
                this.maskProduct.copy(this.maskProduct, 0, 0, 32, 32, 1, 0);
                this.maskProduct.copy(this.cutMaskProduct, 31, 0, 1, 32, 0, 0);

                //this.maskProduct.clear();
                //this.maskProduct.copy(this.cutMaskProduct);

                this.canvas.x = (game.width / 2) + 30;
                break;
        }

        this.maskProduct.update();

        this.canvasMaskProduct.clear();
        for (var x = 0; x < 32; x++) {
            for (var y = 0; y < 32; y++) {
                let color = Phaser.Color.updateColor(this.maskProduct.getPixel(x, y)).color.toString(16);
                color = "000000".substr(0, 6 - color.length) + color;

                this.canvasMaskProduct.rect(x * this.canvasScale, y * this.canvasScale, this.canvasScale, this.canvasScale, "#" + color);
            
            }
        }
    },
    startEditor: function(soundMode) {
        if (!editorStarted) {
            switch (soundMode) {
                case 0:
                    this.audioButton1.inputEnabled = false;
                    this.audioButton1.intendedY = (game.height / 2) - 30;
                    this.audioButton2.inputEnabled = false;
                    this.audioButton2.tint = 0x333333;
                    this.audioButton2.intendedY = (game.height / 2) + 30;
                    this.audioButton3.inputEnabled = false;
                    this.audioButton3.tint = 0x333333;
                    this.audioButton3.intendedY = (game.height / 2) + 30;
                    chosenButton = 1;
                    if (radioIsOpen) {
                        musicEnabled = false;
                        audioMode = RADIO_SFX;
                        this.audioButton.icon.frame = 43;
                    }
                    else {
                        musicEnabled = true;
                        audioMode = MUSIC_SFX;
                        this.audioButton.icon.frame = 25;
                    }
                    sfxEnabled = true;
                    break;
                case 1:
                    this.audioButton1.inputEnabled = false;
                    this.audioButton1.tint = 0x333333;
                    this.audioButton1.intendedY = (game.height / 2) + 30;
                    this.audioButton2.inputEnabled = false;
                    this.audioButton2.intendedY = (game.height / 2) - 30;
                    this.audioButton3.inputEnabled = false;
                    this.audioButton3.tint = 0x333333;
                    this.audioButton3.intendedY = (game.height / 2) + 30;
                    this.eventTimer = 0;
                    chosenButton = 2;
                    sfxEnabled = true;
                    audioMode = SFX_ONLY;

                    if (radioIsOpen) {
                        closeRadio();
                        this.resizeScreen();
                    }

                    this.audioButton.icon.frame = 26;
                    break;
                case 2:
                    this.audioButton1.inputEnabled = false;
                    this.audioButton1.tint = 0x333333;
                    this.audioButton1.intendedY = (game.height / 2) + 30;
                    this.audioButton2.inputEnabled = false;
                    this.audioButton2.tint = 0x333333;
                    this.audioButton2.intendedY = (game.height / 2) + 30;
                    this.audioButton3.inputEnabled = false;
                    this.audioButton3.intendedY = (game.height / 2) - 30;
                    audioMode = NO_AUDIO;
                    chosenButton = 3;

                    if (radioIsOpen) {
                        closeRadio();
                        this.resizeScreen();
                    }

                    this.audioButton.icon.frame = 27;
                    break;
            }

            this.eventTimer = 0;
            openingScreenIsOpen = false;
            if (sfxEnabled)
                game.sfx1.play('start');
        }
    },
    openSubmissionMenu: function() {
        currentState = SUBMISSION_MENU;
        this.mainMenuButtons.setAll('exists', false);
        this.cancelButton.exists = true;
        this.submitButton.exists = true;
        this.submitButtonText.exists = false;
        this.titleText.exists = true;
        this.descriptionText.exists = true;

        this.submitButton.width = this.cancelButton.width;
        this.submitButton.height = this.cancelButton.height;

        if (sfxEnabled)
            game.sfx2.play('finish');

        if (musicEnabled)
            game.music.pause();
    },
    clearCanvas: function() {
        this.kixel.rect(0, 0, 32, 32, palettes.colors[currentPaletteIndex][0]);
        this.canvasKixel.rect(0, 0, this.canvas.width, this.canvas.height, palettes.colors[currentPaletteIndex][0]);
    },
    updateClear: function() {
        // For all clear animations, just make sure that all assets are destroyed at the end,
        // and that resizing the screen during the clear won't result in a softlock.
        switch(clearMode) {
            case CLEAR_MARIO:
                let HAMMER_GRAVITY = 5;

                switch (clearStep) {
                    case 0:
                        this.mario = game.add.sprite(game.width + 60, game.height, 'mario');
                        if (radioIsOpen) {
                            if (axis == PORTRAIT)
                                this.mario.y = game.height * 0.9;
                            else if (axis == LANDSCAPE)
                                this.mario.y = game.height - 45;
                        }
                        this.mario.anchor.setTo(0, 1);
                        this.mario.animations.add('neutral', [0]);
                        this.mario.animations.add('walk', [0, 1, 2, 1], 15, true);
                        this.mario.animations.add('fire', [3, 4, 0], 30, false);
                        this.mario.animations.play('walk');
                        while (this.mario.height < this.canvas.height / 4) {
                            this.mario.scale.setTo(++this.mario.scale.y);
                        }
                        
                        this.copyCanvasKixel.copy(this.canvasKixel);
                        this.canvasCopy = game.add.sprite(this.canvas.x, this.canvas.y, this.copyCanvasKixel);
                        this.canvasCopy.anchor.setTo(0.5);
                        this.canvasCopy.scale.setTo(1, -1);
                        this.canvasCopy.exists = false;
                        this.canvasCopy.velocityY = 0;
                        this.marioScore = game.add.sprite(this.canvas.centerX, this.canvas.centerY, 'mario', 9);
                        this.marioScore.anchor.setTo(0.5);
                        this.marioScore.scale.setTo(5);
                        this.marioScore.exists = false;
                        this.marioScore.scale = this.mario.scale;

                        this.marioHammer = game.add.sprite(game.width, game.height / 2, 'mario', 5);
                        this.marioHammer.anchor.setTo(0.5);
                        this.marioHammer.animations.add('neutral', [5, 6, 7, 8], 10, true);
                        this.marioHammer.animations.play('neutral');
                        this.marioHammer.exists = false;
                        this.marioHammer.scale = this.mario.scale;
                        this.marioHammer.velocityY = 0;

                        this.clearGroup.add(this.mario);
                        this.clearGroup.add(this.canvasCopy);
                        this.clearGroup.add(this.marioHammer);
                        this.clearGroup.add(this.marioScore);

                        clearStep++;
                        break;
                    case 1:
                        let areaDifference = game.width - this.canvas.right;

                        if (axis == PORTRAIT) {
                            this.mario.x -= game.time.delta / 3;

                            if (this.mario.x <= game.width - this.mario.width) {
                                clearStep++;
                                this.mario.animations.play('neutral');
                            }
                        }
                        else if (axis == LANDSCAPE) {
                            if (this.mario.x > this.canvas.right)
                                this.mario.x -= game.time.delta / map(this.mario.x, this.canvas.right, game.width, 4, 1, true);
                            else {
                                clearStep++;
                                this.mario.animations.play('neutral');
                            }
                        }
                        break;
                    case 2:
                        if (this.eventTimer >= 2500) {
                            if (sfxEnabled)
                                game.sfx1.play('marioHammer');
                            this.mario.animations.play('fire');
                            this.marioHammer.x = this.mario.centerX - (this.mario.width / 2);
                            this.marioHammer.y = this.mario.centerY - (this.mario.height / 2);
                            this.marioHammer.velocityY = -Math.abs(this.canvas.centerY - (this.mario.centerY - (this.mario.height / 2))) / 3;
                            this.marioHammer.exists = true;
                            this.eventTimer = 0;
                            clearStep++;
                        }
                        break;
                    case 3:
                        this.marioHammer.x -= game.time.delta;
                        this.marioHammer.y += this.marioHammer.velocityY;
                        this.marioHammer.velocityY += HAMMER_GRAVITY;
                        
                        if (this.marioHammer.x <= this.canvas.centerX) {
                            if (sfxEnabled)
                                game.sfx2.play('marioHit');

                            this.clearCanvas();

                            this.canvasCopy.exists = true;
                            this.canvasCopy.velocityY = -50;
                            this.marioScore.exists = true;
                            clearStep++;
                        }
                        
                        break;
                    case 4:
                        if (this.marioHammer.x > -this.marioHammer.width || this.marioHammer.y < game.height + this.marioHammer.height) {
                            this.marioHammer.x -= game.time.delta;
                            this.marioHammer.y += this.marioHammer.velocityY;
                            this.marioHammer.velocityY += HAMMER_GRAVITY;
                        }
                        
                        this.canvasCopy.x -= game.time.delta / 3;
                        this.canvasCopy.y += this.canvasCopy.velocityY;
                        this.canvasCopy.velocityY += HAMMER_GRAVITY;
                        
                        this.marioScore.y -= game.time.delta / 2;
                        if (this.marioScore.y <= this.canvas.centerY - 200) {
                            this.eventTimer = 0;
                            clearStep++;
                        }
                        break;
                    case 5:
                        if (this.marioHammer.x > -this.marioHammer.width || this.marioHammer.y < game.height + this.marioHammer.height) {
                            this.marioHammer.x -= game.time.delta;
                            this.marioHammer.y += this.marioHammer.velocityY;
                            this.marioHammer.velocityY += HAMMER_GRAVITY;
                        }

                        this.canvasCopy.x -= game.time.delta / 3;
                        this.canvasCopy.y += this.canvasCopy.velocityY;
                        this.canvasCopy.velocityY += HAMMER_GRAVITY;

                        if (this.eventTimer > 500) {
                            this.marioScore.exists = false;
                            this.mario.scale.x = -this.mario.scale.x;
                            this.mario.anchor.setTo(1, 1);
                            this.mario.animations.play('walk');
                            clearStep++
                        }
                        break;
                    case 6:
                        if (this.marioHammer.x > -this.marioHammer.width || this.marioHammer.y < game.height + this.marioHammer.height) {
                            this.marioHammer.x -= game.time.delta;
                            this.marioHammer.y += this.marioHammer.velocityY;
                            this.marioHammer.velocityY += HAMMER_GRAVITY;
                        }

                        this.canvasCopy.x -= game.time.delta / 3;
                        this.canvasCopy.y += this.canvasCopy.velocityY;
                        this.canvasCopy.velocityY += HAMMER_GRAVITY;

                        this.mario.x += game.time.delta / map(this.mario.x, this.canvas.right, game.width, 3, 1, true);

                        if (this.mario.x > game.width + Math.abs(this.mario.width)) {
                            this.finishClear();
                        }
                        break;
                }
                
                break;
            case CLEAR_DYNAMITE:
                switch (clearStep) {
                    case 0:
                        this.explodedKixel1Bmd = game.make.bitmapData(this.canvas.width, this.canvas.height); // to get around multiple Bitmapdata issues
                        this.explodedKixel1Bmd.copy(this.canvasKixel);
                        this.explodedKixel1 = game.add.sprite(0, 0, this.explodedKixel1Bmd);
                        this.explodedKixel1.crop(new Phaser.Rectangle(0, 0, this.canvas.width / 2, this.canvas.height / 2));
                        this.explodedKixel1.exists = false;
                        this.explodedKixel1.velocityY = -50;

                        this.explodedKixel2Bmd = game.make.bitmapData(this.canvas.width, this.canvas.height); // just make sure to destroy stuff like this at the end
                        this.explodedKixel2Bmd.copy(this.canvasKixel);
                        this.explodedKixel2 = game.add.sprite(0, 0, this.explodedKixel2Bmd);
                        this.explodedKixel2.crop(new Phaser.Rectangle(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height / 2));
                        this.explodedKixel2.exists = false;
                        this.explodedKixel2.velocityY = -50;

                        this.explodedKixel3Bmd = game.make.bitmapData(this.canvas.width, this.canvas.height);
                        this.explodedKixel3Bmd.copy(this.canvasKixel);
                        this.explodedKixel3 = game.add.sprite(0, 0, this.explodedKixel3Bmd);
                        this.explodedKixel3.crop(new Phaser.Rectangle(0, this.canvas.height / 2, this.canvas.width / 2, this.canvas.height / 2));
                        this.explodedKixel3.exists = false;
                        this.explodedKixel3.velocityY = -50;

                        this.explodedKixel4Bmd = game.make.bitmapData(this.canvas.width, this.canvas.height);
                        this.explodedKixel4Bmd.copy(this.canvasKixel);
                        this.explodedKixel4 = game.add.sprite(0, 0, this.explodedKixel4Bmd);
                        this.explodedKixel4.crop(new Phaser.Rectangle(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, this.canvas.height / 2));
                        this.explodedKixel4.exists = false;
                        this.explodedKixel4.velocityY = -50;

                        this.explosion = game.add.sprite(this.canvas.centerX, this.canvas.centerY, 'explosion');
                        this.explosion.anchor.setTo(0.5);
                        while (this.explosion.height < this.canvas.height) {
                            this.explosion.scale.setTo(++this.explosion.scale.y);
                        }
                        this.explosion.scale.y = this.explosion.scale.x;
                        this.explosion.exists = false;

                        this.plunger = game.add.sprite(this.canvas.centerX, this.canvas.bottom - 200, 'dynamite', 1);
                        this.plunger.anchor.setTo(0.5, 1);
                        while (this.plunger.height > this.canvas.height / 4) {
                            this.plunger.scale.setTo(this.plunger.scale.y - 0.1);
                        }
                        this.dynamite = game.add.sprite(this.canvas.centerX, this.canvas.bottom, 'dynamite', 0);
                        this.dynamite.anchor.setTo(0.5, 1);
                        this.dynamite.scale = this.plunger.scale;

                        this.countdownText = game.add.bitmapText(this.canvas.centerX,  this.canvas.top + (this.canvas.height / 4), 'euxoi_stroke', "3", 100);
                        this.countdownText.anchor.setTo(0.5);

                        this.clearGroup.add(this.explodedKixel1);
                        this.clearGroup.add(this.explodedKixel2);
                        this.clearGroup.add(this.explodedKixel3);
                        this.clearGroup.add(this.explodedKixel4);
                        this.clearGroup.add(this.explosion);
                        this.clearGroup.add(this.plunger);
                        this.clearGroup.add(this.dynamite);
                        this.clearGroup.add(this.countdownText);

                        if (sfxEnabled)
                            game.sfx1.play('dynamite3');

                        clearStep++;
                        break;
                    case 1:
                        this.overlayGraphics.lineStyle(0);
                        this.overlayGraphics.beginFill(0xdddddd, 1.0);
                        this.overlayGraphics.arc(this.canvas.centerX, this.canvas.top + (this.canvas.height / 4), 100, -Math.PI / 2, map(this.eventTimer, 0, 1000, -Math.PI / 2, Math.PI * 3 / 2, true), true);

                        this.plunger.y = map(this.eventTimer, 0, 3000, this.canvas.bottom - (200 * this.plunger.scale.y), this.canvas.bottom - (30 * this.plunger.scale.y), true);

                        if (this.eventTimer >= 1000) {
                            if (sfxEnabled)
                                game.sfx1.play('dynamite2');
                            this.countdownText.setText("2");
                            clearStep++;
                        }
                        break;
                    case 2:
                        this.overlayGraphics.lineStyle(0);
                        this.overlayGraphics.beginFill(0xdddddd, 1.0);
                        this.overlayGraphics.arc(this.canvas.centerX, this.canvas.top + (this.canvas.height / 4), 100, -Math.PI / 2, map(this.eventTimer, 1000, 2000, -Math.PI / 2, Math.PI * 3 / 2, true), true);

                        this.plunger.y = map(this.eventTimer, 0, 3000, this.canvas.bottom - (200 * this.plunger.scale.y), this.canvas.bottom - (30 * this.plunger.scale.y), true);

                        if (this.eventTimer >= 2000) {
                            if (sfxEnabled)
                                game.sfx1.play('dynamite1');
                            this.countdownText.setText("1");
                            clearStep++;
                        }
                        break;
                    case 3:
                        this.overlayGraphics.lineStyle(0);
                        this.overlayGraphics.beginFill(0xdddddd, 1.0);
                        this.overlayGraphics.arc(this.canvas.centerX, this.canvas.top + (this.canvas.height / 4), 100, -Math.PI / 2, map(this.eventTimer, 2000, 3000, -Math.PI / 2, Math.PI * 3 / 2, true), true);

                        this.plunger.y = map(this.eventTimer, 0, 3000, this.canvas.bottom - (200 * this.plunger.scale.y), this.canvas.bottom - (30 * this.plunger.scale.y), true);

                        if (this.eventTimer >= 3000) {
                            if (sfxEnabled)
                                game.sfx1.play('explosion');
                            this.countdownText.setText("");

                            this.clearCanvas();

                            this.explodedKixel1.exists = true;
                            this.explodedKixel1.x = this.canvas.left;
                            this.explodedKixel1.y = this.canvas.top;
                            this.explodedKixel1.velocityY = -80;
                            this.explodedKixel2.exists = true;
                            this.explodedKixel2.x = this.canvas.left + (this.canvas.width / 2);
                            this.explodedKixel2.y = this.canvas.top;
                            this.explodedKixel2.velocityY = -80;
                            this.explodedKixel3.exists = true;
                            this.explodedKixel3.x = this.canvas.left;
                            this.explodedKixel3.y = this.canvas.top + (this.canvas.height / 2);
                            this.explodedKixel3.velocityY = -50;
                            this.explodedKixel4.exists = true;
                            this.explodedKixel4.x = this.canvas.left + (this.canvas.width / 2);
                            this.explodedKixel4.y = this.canvas.top + (this.canvas.height / 2);
                            this.explodedKixel4.velocityY = -50;

                            this.explosion.exists = true;

                            clearStep++;
                        }
                        break;
                    case 4:
                        this.explodedKixel1.x -= 12;
                        this.explodedKixel1.y += this.explodedKixel1.velocityY;
                        this.explodedKixel1.velocityY += 4;
                        this.explodedKixel1.rotation -= 0.03;

                        this.explodedKixel2.x += 18;
                        this.explodedKixel2.y += this.explodedKixel2.velocityY;
                        this.explodedKixel2.velocityY += 4;
                        this.explodedKixel2.rotation += 0.03;

                        this.explodedKixel3.x -= 4;
                        this.explodedKixel3.y += this.explodedKixel3.velocityY;
                        this.explodedKixel3.velocityY += 4;
                        this.explodedKixel3.rotation -= 0.04;

                        this.explodedKixel4.x += 14;
                        this.explodedKixel4.y += this.explodedKixel4.velocityY;
                        this.explodedKixel4.velocityY += 4;
                        this.explodedKixel4.rotation += 0.04;

                        if (this.explodedKixel1.y > game.height * 2 &&
                            this.explodedKixel2.y > game.height * 2 && 
                            this.explodedKixel3.y > game.height * 2 && 
                            this.explodedKixel4.y > game.height * 2) {
                            this.explodedKixel1Bmd.destroy();
                            this.explodedKixel2Bmd.destroy();
                            this.explodedKixel3Bmd.destroy();
                            this.explodedKixel4Bmd.destroy();
                            this.finishClear();
                        }
                        break;
                    case 5:
                }

                break;
            case CLEAR_FIST:
                switch (clearStep) {
                    case 0:
                        this.copyCanvasKixel.copy(this.canvasKixel);
                        this.canvasCopy = game.add.sprite(this.canvas.centerX, this.canvas.top, this.copyCanvasKixel);
                        this.canvasCopy.anchor.setTo(0.5, 0);
                        this.canvasCopy.exists = false;

                        this.fist = game.add.sprite(this.canvas.centerX, -game.height * 2, 'fist');
                        this.fist.anchor.setTo(0.5, 1);
                        if (this.fist.width > this.canvas.width / 2) {
                            while (this.fist.width > this.canvas.width / 2)
                                this.fist.scale.setTo(this.fist.scale.x - 0.1);
                        }
                        else while (this.fist.width < this.canvas.width / 2) {
                            this.fist.scale.setTo(this.fist.scale.x + 0.1);
                        }

                        this.fist.anchor.setTo(0.5, 1);

                        this.clearGroup.add(this.canvasCopy);
                        this.clearGroup.add(this.fist);

                        clearStep++;
                        break;
                    case 1:
                        this.fist.y += game.time.delta * 4;

                        if (this.fist.y >= this.canvas.top) {
                            if (sfxEnabled)
                                game.sfx1.play('fistHit');

                            this.clearCanvas();

                            this.canvasCopy.exists = true;
                            this.canvasCopy.y = this.fist.y - 40;
                            this.canvasCopy.height = this.canvas.width - (this.fist.y - 40 - this.canvas.top);
                            clearStep++;
                        }
                        break;
                    case 2:
                        this.fist.y += game.time.delta * 4;
                        this.canvasCopy.y = this.fist.y - 40;
                        this.canvasCopy.height = this.canvas.width - (this.fist.y - 40 - this.canvas.top);

                        if (this.fist.y >= this.canvas.bottom - 60) {
                            this.eventTimer = 0;
                            clearStep++;
                        }
                        break;
                    case 3:
                        if (this.eventTimer >= 1000) {
                            this.fist.y -= game.time.delta;
                            this.canvasCopy.x = this.canvas.centerX + (Math.sin((this.eventTimer - 1000) / 500) * 200);
                            this.canvasCopy.y += game.time.delta / (20 - (this.eventTimer / 200));
                            this.canvasCopy.rotation = -Math.sin((this.eventTimer - 1000) / 500) * 0.2;

                            if (this.fist.y < 0 && this.canvasCopy.y > game.height + (this.canvasCopy.width / 2))
                                this.finishClear();
                        }
                        break;
                }
                break;
        }
    },
    finishClear: function() {
        controlsDisabled = false;
        currentState = PAINTING;

        this.copyCanvasKixel.clear();

        this.createUndoState();

        this.clearGroup.removeAll(true);

        this.colorSelectors.forEach(function(button) {
            button.inputEnabled = true;
            button.input.useHandCursor = true;
        }, this);
        this.buttons.forEach(function(button) {
            button.inputEnabled = true;
            button.input.useHandCursor = true;
        }, this);

        if (sfxEnabled)
            game.sfx2.play('finishClear');

        if (musicEnabled)
            game.music.play('', 0, songVolume, true);

        if (device === MOBILE || controlType === KEYBOARD) {
            this.virtualCursor.visible = true;
            this.virtualCursor.canvasPosition.x = (this.virtualCursor.grid.x * this.canvasScale) + (this.canvasScale / 2);
            this.virtualCursor.canvasPosition.y = (this.virtualCursor.grid.y * this.canvasScale) + (this.canvasScale / 2);
            this.virtualCursor.x = this.canvas.left + this.virtualCursor.canvasPosition.x;
            this.virtualCursor.y = this.canvas.top + this.virtualCursor.canvasPosition.y;
        }
    },
    saveKixelLocally: function() {
        var kixelString = "";

        for (var x = 0; x < 32; x++) {
            for (var y = 0; y < 32; y++) {
                var color = this.kixel.getPixelRGB(x, y);

                for (var z = 0; z < 16; z++) {
                    if (Phaser.Color.RGBtoString(color.r, color.g, color.b, 255, "#") == palettes.colors[currentPaletteIndex][z]) {
                        switch (z) {
                            case 10: kixelString += "a"; break;
                            case 11: kixelString += "b"; break;
                            case 12: kixelString += "c"; break;
                            case 13: kixelString += "d"; break;
                            case 14: kixelString += "e"; break;
                            case 15: kixelString += "f"; break;
                            default: kixelString += z.toString();
                        }

                        break;
                    }
                }
            }
        }

        localStorage.setItem("temp-kixel", currentPaletteIndex.toString() + hexToBase64(kixelString));
    },
    countColorsUsed: function() {
        colorsUsed = [];

        for (var x = 0; x < 32; x++) {
            for (var y = 0; y < 32; y++) {
                var pixel = this.kixel.getPixelRGB(x, y);
                var color = Phaser.Color.RGBtoString(pixel.r, pixel.g, pixel.b, 255, "#");
                let colorUsed = false;

                for (var z = 0; z < colorsUsed.length; z++) {
                    if (color === colorsUsed[z]) {
                        colorUsed = true;
                    }

                }

                if (!colorUsed)
                    colorsUsed.push(color);
            }
        }

        if (typeof haunted !== 'undefined') {
            this.colorSelectors.forEach(function(selector) {
                selector.ghost.visible = false;
            }, this);

            for (var x = 0; x < colorsUsed.length; x++) {
                for (var z = 0; z < 16; z++) {
                    if (colorsUsed[x] === palettes.colors[currentPaletteIndex][z]) {
                        this.colorSelectors[z].ghost.visible = true;
                        break;
                    }
                }
            }
        }

        numColorsUsed = colorsUsed.length;
    },
    saveKixelToComputer: function(big) { // thanx, noontz on SO
        let url;
        if (big) {
            for (var x = 0; x < 32; x++) {
                for (var y = 0; y < 32; y++) {
                    var color = this.kixel.getPixelRGB(x, y);
                    this.biggerKixel.rect(x * 5, y * 5, 5, 5, Phaser.Color.RGBtoString(color.r, color.g, color.b, 255, "#"));
                }
            }
            url = this.biggerKixel.canvas.toDataURL("image/png");
        }
        else {
            url = this.kixel.canvas.toDataURL("image/png");
        }
        this.downloadLink.setAttribute('href', url);
        this.downloadLink.click();
    },
    validateImportedKixel: function(big) {
        let legitSoFar = false;
        let currentColor = 0;
        let currentPalette = 0;
        let definedPalette = 0;
        let pixelSkip = 1;
        if (big)
            pixelSkip = 5;

        let imageData = this.loadedImageContext.getImageData(0, 0, 1, 1);
        let firstColor = Phaser.Color.RGBtoString(imageData.data[0], imageData.data[1], imageData.data[2], "#");
        
        let moreThanOneColor = false;

        if (typeof forcedPalette === 'undefined') {
            for (currentPalette = 0; currentPalette < 8; currentPalette++) {
                if (legitSoFar)
                    break;

                definedPalette = currentPalette;

                legitSoFar = true;

                for (var x = 0; x < 32; x++) {
                    if (!legitSoFar)
                        break;

                    for (var y = 0; y < 32; y++) {
                        if (!legitSoFar)
                            break;

                        imageData = this.loadedImageContext.getImageData(x * pixelSkip, y * pixelSkip, 1, 1);
                        color = Phaser.Color.RGBtoString(imageData.data[0], imageData.data[1], imageData.data[2], "#");
                        colorFound = false;

                        if (color !== firstColor)
                            moreThanOneColor = true;

                        for (currentColor = 0; currentColor < 16; currentColor++) {
                            if (color === palettes.colors[currentPalette][currentColor]) {
                                colorFound = true;
                                break;
                            }
                        }

                        if (!colorFound)
                            legitSoFar = false;
                    }
                }
            }
        }
        else { // limited palette
            legitSoFar = true;

            for (var x = 0; x < 32; x++) {
                if (!legitSoFar)
                    break;

                for (var y = 0; y < 32; y++) {
                    if (!legitSoFar)
                        break;

                    imageData = this.loadedImageContext.getImageData(x * pixelSkip, y * pixelSkip, 1, 1);
                    color = Phaser.Color.RGBtoString(imageData.data[0], imageData.data[1], imageData.data[2], "#");
                    colorFound = false;

                    if (color !== firstColor)
                        moreThanOneColor = true;

                    for (currentColor = 0; currentColor < 16; currentColor++) {
                        if (color === palettes.colors[currentPaletteIndex][currentColor]) {
                            colorFound = true;
                            break;
                        }
                    }

                    if (!colorFound) {
                        legitSoFar = false;
                        kixelPaletteError = true;
                    }
                }
            }
        }

        if (legitSoFar && moreThanOneColor) {
            if (definedPalette !== currentPaletteIndex && typeof forcedPalette === 'undefined')
                loadedPalette = definedPalette;
            else
                loadedPalette = null;
            return true;
        }

        return false;
    },
    giveMessage: function(message, buttonText = "OK") {
        currentState = MESSAGE;
        controlsDisabled = true;
        musicEnabled = false;
        game.music.pause();

        this.colorSelectors.forEach(function(button) {
            button.inputEnabled = false;
            button.input.useHandCursor = false;
        }, this);
        this.buttons.forEach(function(button) {
            button.inputEnabled = false;
            button.input.useHandCursor = false;
        }, this);

        this.mainMenuButtons.setAll('exists', false);
        this.saveMenuButtons.setAll('exists', false);
        this.messageWindowGroup.setAll('exists', true);
        this.messageWindowText.setText(message);
        this.messageWindowButtonText.setText(buttonText);
    },
    getCountdownTimer: function(time) {
        let days, hours, minutes, seconds, elapsed;

        var date = new Date();
        let currentTime = passedTime + (Math.floor(date.getTime() / 1000) - relativeTime);
        let differenceInSeconds = time - currentTime;
        minutes = Math.floor(differenceInSeconds / 60);
        hours = Math.floor(minutes / 60);
        days = Math.floor(hours / 24);
        seconds = differenceInSeconds;

        minutes %= 60;
        seconds %= 60;
        hours %= 24;

        if (minutes < 10)
            minutes = "0" + minutes;
        if (seconds < 10)
            seconds = "0" + seconds;
        if (hours < 10)
            hours = "0" + hours;

        if (differenceInSeconds < 0)
            elapsed = true;
        else
            elapsed = false;

        return [days, hours, minutes, seconds, elapsed];
    },
    enterLatePhase: function() {
        compoElapsed = true;
        compoEndTime = compoLateEndTime;
        this.compoTimeLeft.setText("OVERTIME!");

        if (this.getCountdownTimer(compoEndTime)[4]) { // battle has already ended
            this.endCompo();
        }
        else {
            this.giveMessage("This battle's main submission phase has ended, and the late entry phase has begun. Submit as soon as possible.");
        }
    },
    endCompo: function() {
        compoLateElapsed = true;
        this.giveMessage("This battle has ended.");
    },
    submitKixel: function() {
        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "submit.php");
        form.style.display = "none";

        var hiddenField1 = document.createElement("input");
        hiddenField1.name = "title";
        hiddenField1.value = title;
        form.appendChild(hiddenField1);

        var hiddenField2 = document.createElement("input");
        hiddenField2.name = "description";
        hiddenField2.value = description;
        form.appendChild(hiddenField2);

        var hiddenField3 = document.createElement("input");
        hiddenField3.name = "kixel-img";
        hiddenField3.value = this.kixel.canvas.toDataURL("image/png");
        form.appendChild(hiddenField3);

        if (typeof compoNumber !== 'undefined') {
            var hiddenField4 = document.createElement("input");
            hiddenField4.name = "compo-number";
            hiddenField4.value = compoNumber;
            form.appendChild(hiddenField4);
        }

        var hiddenField5 = document.createElement("input");
        hiddenField5.name = "submit-work";
        hiddenField5.value = "1";
        form.appendChild(hiddenField5);

        var hiddenField6 = document.createElement("input");
        hiddenField6.name = "upload-medium";
        hiddenField6.value = "kixel";
        form.appendChild(hiddenField6);

        document.body.appendChild(form);
        form.submit();
    },
    launchTrueColors: function() {
        if (typeof username === 'undefined' || typeof trueColorsRecharge !== 'undefined')
            return;

        currentState = TRUE_COLORS_TITLE;
        this.eventTimer = 0;
        this.trueColorsEventStep = 0;
        this.drawerOpen = false;
        this.drawerPosition = 0;

        if (sfxEnabled)
            game.sfx1.play('trueColorsCorrect');

        game.music.stop();
        game.music = this.trueColorsMusic;
        if (musicEnabled)
            game.music.play('title');

        let availableHeight = this.getAvailableHeight();

        this.mainMenuButtons.setAll('exists', false);
        this.saveMenuButtons.setAll('exists', false);
        this.submitButtonText.exists = false;
        this.titleText.exists = false;
        this.descriptionText.exists = false;
        this.trueColorsSelector.exists = false;
        this.trueColorsSelector.label.exists = false;
        this.trueColorsStatus.exists = false;
        this.submitButton.width = this.mainMenu.width - (this.mainMenu.width / 8) - 30;
        this.submitButton.height = (this.mainMenu.height / 4) - 40;
        document.getElementById('kixel-program-title-field').style.left = "0%";
        document.getElementById('kixel-program-title-field').style.top = "-100%";
        document.getElementById('kixel-program-title-field').blur();

        document.getElementById('kixel-program-description-field').style.left = "0%";
        document.getElementById('kixel-program-description-field').style.top = "-100%";
        document.getElementById('kixel-program-description-field').blur();

        this.trueColorsTitleGroup.setAll('exists', true);
        this.trueColorsTextGroup.setAll('exists', true);

        this.trueColorsSelectedIndex = null;

        this.trueColorsTitleBmd.draw('randomKixel', 0, 0, 160, 160, null, true);
        this.trueColorsTitleBmd.update();
        for (this.trueColorsTitleBmd.palette = 0; this.trueColorsTitleBmd.palette < 8; this.trueColorsTitleBmd.palette++) {
            let continueLoop = false;
            for (var x = 0; x < 32; x++) {
                for (var y = 0; y < 32; y++) {
                    let rgb = this.trueColorsTitleBmd.getPixelRGB(x * 5, y * 5);
                    let color = Phaser.Color.RGBtoString(rgb.r, rgb.g, rgb.b, "#");
                    let colorFound = false;

                    for (let currentColor = 0; currentColor < 16; currentColor++) {
                        if (color === palettes.colors[this.trueColorsTitleBmd.palette][currentColor]) {
                            colorFound = true;
                        }
                    }

                    if (!colorFound) {
                        continueLoop = true;
                        break;
                    }
                }
                if (continueLoop) {
                    break;
                }
            }
            if (continueLoop)
                continue;
            
            break;
        }

        this.trueColorsTitleBmd.targetPalette = this.trueColorsTitleBmd.palette;

        this.trueColorsTitleBmd.palette--;
        if (this.trueColorsTitleBmd.palette < 0)
            this.trueColorsTitleBmd.palette = 7;

        this.changePaletteOfImage(this.trueColorsTitleBmd, this.trueColorsTitleBmd, this.trueColorsTitleBmd.targetPalette, this.trueColorsTitleBmd.palette);

        this.trueColorsMenuIcon.alpha = 0.0;

        this.trueColorsLogo.x = game.width / 3;
        this.trueColorsLogo.y = -this.trueColorsLogo.height;
        this.trueColorsTitleKixel.x = game.width + this.trueColorsTitleKixel.width;

        this.trueColorsButton1.exists = false;
        this.trueColorsButton2.exists = false;
        this.trueColorsButton1.anchor.setTo(0.5);
        this.trueColorsButton2.anchor.setTo(0.5);

        this.trueColorsText1.setText("START");
        this.trueColorsText1.fontSize = 50;
        this.trueColorsText1.fontWeight = "bold italic";
        this.trueColorsText1.y = availableHeight * 4 / 6;
        this.trueColorsText1.alpha = 0.0;
        this.trueColorsText2.setText("FLEE");
        this.trueColorsText2.fontSize = 50;
        this.trueColorsText2.fontWeight = "bold italic";
        this.trueColorsText2.y = availableHeight * 5 / 6;
        this.trueColorsText2.alpha = 0.0;
        this.trueColorsOptionBacking1.alpha = 0.0;
        this.trueColorsOptionBacking2.alpha = 0.0;
        this.trueColorsText3.setText("( No pausing once it begins! )\nGame by Gravity Break Media");
        this.trueColorsText3.x = game.width / 2;
        this.trueColorsText3.y = availableHeight - 10;
        this.trueColorsText3.alpha = 0.0;
        if (typeof compoNumber !== 'undefined') {
            this.trueColorsText4.setText("Really? During a battle...?");
        }
        else if (trueColorsRecords[0] !== null) {
            let text4 = "Last score: ★" + trueColorsRecords[0].prevScore + "\n";
            if (trueColorsRecords[0].perfectAchieved)
                text4 += "Perfect games: " + trueColorsRecords[0].perfectGames;
            else
                text4 += "Previous best: ★" + trueColorsRecords[0].bestScore;
            this.trueColorsText4.setText(text4);
        }
        else {
            this.trueColorsText4.setText("Last score: None\nPrevious best: None");
        }
        this.trueColorsText4.align = 'center';
        this.trueColorsText4.x = game.width + (game.width / 2);
        this.trueColorsText4.y = this.trueColorsTitleKixel.bottom + 10;
        this.trueColorsText5.alpha = 0.0;

        this.trueColorsCopySprite.exists = false;
        this.trueColorsCopySprite.x = game.width + (game.width / 2);
        this.trueColorsCopySprite.y = this.trueColorsTitleKixel.bottom + 10;
        this.trueColorsCopySprite.anchor.setTo(1, 0);
    },
    startTrueColors: function() {
        if (musicEnabled)
            game.music.fadeOut(2000);

        if (sfxEnabled)
            game.sfx2.play('startTrueColors');

        this.trueColorsButton1.exists = false;
        this.trueColorsButton2.exists = false;

        trueColorsRecharge = Math.floor(Date.now() / 1000) + 82800;
        this.trueColorsSelector.alpha = 0.5;
        this.trueColorsSelector.inputEnabled = false;

        this.trueColorsStarting = true;
        this.trueColorsEventStep = 3000;
        this.eventTimer = 0;
    },
    closeTrueColors: function() {
        if (sfxEnabled)
            game.sfx2.play('closeTrueColors');

        if (musicEnabled)
            game.music.fadeOut(2000);

        this.trueColorsButton1.exists = false;
        this.trueColorsButton2.exists = false;

        this.trueColorsEventStep = 3000;
        this.eventTimer = 0;
    },
    loadTrueColorsKixels: function(kixelList) {
        this.trueColorsKixels = kixelList;

        for (var x = 0; x < 8; x++) {
            var img = new Image();
            img.src = kixelList[x].base64;
            game.load.image('trueColorsKixel' + x, kixelList[x].base64);
        }

        game.load.start();
        game.load.onLoadComplete.addOnce(function() {
            this.trueColorsEventStep++;
            this.eventTimer = 0;
            this.trueColorsText5.exists = false;
            this.trueColorsCurrentKixelIndex = -1;

            this.trueColorsText1.setText("I'll show you a kixel with a bunch of palettes.");
            this.trueColorsText1.exists = true;
            this.trueColorsText1.anchor.setTo(0.5, 0);
            this.trueColorsText1.intendedX = game.width / 2;
            this.trueColorsText1.intendedY = 20;
            this.trueColorsText1.fontSize = 50;
            this.trueColorsText1.fontWeight = "normal";
            this.trueColorsText1.wordWrapWidth = game.width;
            this.trueColorsText1.x = game.width / 2;
            this.trueColorsText1.y = -this.trueColorsText1.height;

            this.trueColorsText2.setText("Only one palette is real! Scroll to the one you think is correct.");
            this.trueColorsText2.exists = true;
            this.trueColorsText2.anchor.setTo(0.5, 1);
            this.trueColorsText2.intendedX = game.width / 2;
            this.trueColorsText2.intendedY = this.getAvailableHeight() - 20;
            this.trueColorsText2.fontSize = 50;
            this.trueColorsText2.fontWeight = "normal";
            this.trueColorsText2.wordWrapWidth = game.width;
            this.trueColorsText2.x = game.width / 2;
            this.trueColorsText2.y = this.getAvailableHeight() + this.trueColorsText2.height;

            this.trueColorsExample2.x = game.width / 2;
            this.trueColorsExample2.y = this.getAvailableHeight() / 2;
            this.trueColorsExample2.alpha = 0.0;
            this.trueColorsExample2.exists = true;

            this.trueColorsExample1.x = this.trueColorsExample2.left - 30;
            this.trueColorsExample1.y = this.getAvailableHeight() / 2;
            this.trueColorsExample1.alpha = 0.0;
            this.trueColorsExample1.exists = true;
            
            this.trueColorsExample3.x = this.trueColorsExample2.right + 30;
            this.trueColorsExample3.y = this.getAvailableHeight() / 2;
            this.trueColorsExample3.alpha = 0.0;
            this.trueColorsExample3.exists = true;

            if (musicEnabled)
                game.music.play('trueColors');
        }, this);
    },
    getTrueColorsResults: function(kixelList) {
        this.trueColorsResults = kixelList;
        this.trueColorsChoices = this.trueColorsChoices.split(",");

        for (var x = 0; x < 8; x++) {
            this.trueColorsBmds[x].draw('trueColorsKixel' + x);
            this.trueColorsBmds[x].update();
            this.changePaletteOfImage(this.trueColorsBmds[x], this.trueColorsBmds[x], this.trueColorsKixels[x].initPalette, parseInt(this.trueColorsResults[x].palette));
            this.trueColorsKixelSprites.getChildAt(x).anchor.setTo(1, 0.5);
            this.trueColorsKixelSprites.getChildAt(x).exists = true;
            this.trueColorsKixelSprites.getChildAt(x).x = game.width / 2;
            this.trueColorsKixelSprites.getChildAt(x).y = game.height + 170;
        }

        this.trueColorsText3.alpha = 1.0;

        this.trueColorsText5.setText("★0\n0/8");
        this.trueColorsText5.anchor.setTo(1, 1);
        this.trueColorsText5.fontSize = 45;
        this.trueColorsText5.fontWeight = "bold";
        this.trueColorsText5.lineSpacing = -15;
        this.trueColorsText5.align = "right";
        this.trueColorsText5.addColor('black', 0);
        this.trueColorsText5.setShadow();
        this.trueColorsText5.x = game.width - 10;
        this.trueColorsText5.y = game.height + 10;

        if (musicEnabled)
            game.music.play('results');
        
        this.nextTrueColorsResult();
    },
    nextTrueColorsResult: function() {
        this.trueColorsEventStep++;
        let result = this.trueColorsEventStep - 1;

        if (sfxEnabled && this.trueColorsEventStep !== 1)
            game.sfx1.play('nextTrueColorsResult');

        this.eventTimer = 0;
        this.trueColorsCopyBmd.draw('trueColorsKixel' + result);
        this.trueColorsCopyBmd.update();
        this.changePaletteOfImage(this.trueColorsCopyBmd, this.trueColorsCopyBmd, this.trueColorsKixels[result].initPalette, parseInt(this.trueColorsChoices[result]));
        this.trueColorsCopySprite.anchor.setTo(1, 0.5);
        this.trueColorsCopySprite.x = game.width / 2;
        this.trueColorsCopySprite.y = game.height + 170;

        this.trueColorsText1.setText("Your choice");
        this.trueColorsText1.anchor.setTo(0, 0.5);
        this.trueColorsText1.fontSize = 40;
        this.trueColorsText1.fontWeight = "bold";
        this.trueColorsText1.align = "left";
        this.trueColorsText1.addColor('white', 0);
        this.trueColorsText1.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
        this.trueColorsText1.x = this.trueColorsCopySprite.x + 10;
        this.trueColorsText1.y = this.trueColorsCopySprite.y;

        this.trueColorsText2.setText(this.trueColorsResults[result].title);
        this.trueColorsText2.anchor.setTo(0, 1);
        this.trueColorsText2.fontSize = 40;
        this.trueColorsText2.fontWeight = "bold";
        this.trueColorsText2.align = "left";
        this.trueColorsText2.wordWrapWidth = game.width;
        this.trueColorsText2.addColor('white', 0);
        this.trueColorsText2.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
        this.trueColorsText2.x = game.width + 10;
        this.trueColorsText2.y = (this.getAvailableHeight() * 2 / 3) + 10;

        this.trueColorsText3.setText("by " + this.trueColorsResults[result].username);
        this.trueColorsText3.anchor.setTo(0, 0);
        this.trueColorsText3.fontSize = 30;
        this.trueColorsText3.fontWeight = "bold";
        this.trueColorsText3.align = "left";
        this.trueColorsText3.addColor('white', 0);
        this.trueColorsText3.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
        this.trueColorsText3.x = game.width + 10;
        this.trueColorsText3.y = this.trueColorsText2.bottom;

        this.trueColorsText4.exists = true;
        if (this.trueColorsResults[result].correct)
            this.trueColorsText4.setText("NICE!");
        else if (Math.floor(Math.random() * 101) == 0)
            this.trueColorsText4.setText("Fuck.");
        else
            this.trueColorsText4.setText("Dang.");
        this.trueColorsText4.alpha = 0.0;
        this.trueColorsText4.anchor.setTo(0.5);
        this.trueColorsText4.rotation = -0.15;
        this.trueColorsText4.fontWeight = "bold";
        this.trueColorsText4.align = "center";
        this.trueColorsText4.addColor('white', 0);
        this.trueColorsText4.setShadow(2, 2, 'rgba(0, 0, 0, 255)');
        this.trueColorsText4.x = game.width / 2;
        this.trueColorsText4.y = this.getAvailableHeight() / 2;

        this.trueColorsText5.setText("★" + this.trueColorsCorrect + "\n" + this.trueColorsEventStep + "/8");

        if (this.trueColorsResults[result].correct)
            this.trueColorsCorrect++;
    },
    nextTrueColorsStage: function() {
        this.trueColorsCurrentKixelIndex++;
        this.trueColorsText1.setText(this.trueColorsCurrentKixelIndex + 1);
        this.trueColorsSelectedIndex = this.trueColorsKixels[this.trueColorsCurrentKixelIndex].initPalette;

        this.trueColorsText4.setText("not set");
        this.trueColorsText4.fontSize = 90;
        this.trueColorsOptionBacking1.alpha = 1.0;

        this.trueColorsKixelSprites.setAll('exists', true);
        this.trueColorsCopySprite.exists = true;

        let fourLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 4, 8));
        let threeLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 3, 8));
        let twoLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 2, 8));
        let lastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 1, 8));
        let currentSprite = this.trueColorsKixelSprites.getChildAt(this.trueColorsSelectedIndex);
        let nextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 1, 8));
        let twoNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 2, 8));
        let threeNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 3, 8));
        let fourNextSprite = this.trueColorsCopySprite;

        fourLastSprite.intendedX = (game.width / 2) - 720;
        threeLastSprite.intendedX = (game.width / 2) - 540;
        twoLastSprite.intendedX = (game.width / 2) - 360;
        lastSprite.intendedX = (game.width / 2) - 180;
        currentSprite.intendedX = game.width / 2;
        nextSprite.intendedX = (game.width / 2) + 180;
        twoNextSprite.intendedX = (game.width / 2) + 360;
        threeNextSprite.intendedX = (game.width / 2) + 540;
        fourNextSprite.intendedX = (game.width / 2) + 720;

        this.trueColorsBmds[this.trueColorsSelectedIndex].draw('trueColorsKixel' + this.trueColorsCurrentKixelIndex);
        this.trueColorsBmds[this.trueColorsSelectedIndex].update();
        for (var x = 0; x < 8; x++) {
            this.changePaletteOfImage(this.trueColorsBmds[this.trueColorsSelectedIndex], this.trueColorsBmds[x], this.trueColorsSelectedIndex, x);
            this.trueColorsKixelSprites.getChildAt(x).x = this.trueColorsKixelSprites.getChildAt(x).intendedX;
            this.trueColorsKixelSprites.getChildAt(x).y = -this.trueColorsKixelSprites.getChildAt(x).height;
        }
        this.changePaletteOfImage(fourLastSprite.bmd, this.trueColorsCopyBmd, fourLastSprite.index, fourLastSprite.index);
    },
    trueColorsSelectPrev: function() {
        this.trueColorsSelectedIndex = mod(this.trueColorsSelectedIndex - 1, 8);

        if (sfxEnabled)
            game.sfx2.play('trueColorsPaletteSelection' + this.trueColorsSelectedIndex);

        let fourLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 4, 8));
        let threeLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 3, 8));
        let twoLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 2, 8));
        let lastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 1, 8));
        let currentSprite = this.trueColorsKixelSprites.getChildAt(this.trueColorsSelectedIndex);
        let nextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 1, 8));
        let twoNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 2, 8));
        let threeNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 3, 8));
        let fourNextSprite = this.trueColorsCopySprite;

        fourLastSprite.x = (game.width / 2) - 760;
        fourLastSprite.intendedX = (game.width / 2) - 720;
        threeLastSprite.intendedX = (game.width / 2) - 540;
        twoLastSprite.intendedX = (game.width / 2) - 360;
        lastSprite.intendedX = (game.width / 2) - 180;
        currentSprite.intendedX = game.width / 2;
        nextSprite.intendedX = (game.width / 2) + 180;
        twoNextSprite.intendedX = (game.width / 2) + 360;
        threeNextSprite.intendedX = (game.width / 2) + 540;
        fourNextSprite.x = (game.width / 2) + 540;
        fourNextSprite.intendedX = (game.width / 2) + 720;
        this.changePaletteOfImage(fourLastSprite.bmd, this.trueColorsCopyBmd, fourLastSprite.index, fourLastSprite.index);
    },
    trueColorsSelectNext: function() {
        this.trueColorsSelectedIndex = mod(this.trueColorsSelectedIndex + 1, 8);

        if (sfxEnabled)
            game.sfx2.play('trueColorsPaletteSelection' + this.trueColorsSelectedIndex);

        let fourLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 4, 8));
        let threeLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 3, 8));
        let twoLastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 2, 8));
        let lastSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex - 1, 8));
        let currentSprite = this.trueColorsKixelSprites.getChildAt(this.trueColorsSelectedIndex);
        let nextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 1, 8));
        let twoNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 2, 8));
        let threeNextSprite = this.trueColorsKixelSprites.getChildAt(mod(this.trueColorsSelectedIndex + 3, 8));
        let fourNextSprite = this.trueColorsCopySprite;

        fourLastSprite.intendedX = (game.width / 2) - 720;
        threeLastSprite.intendedX = (game.width / 2) - 540;
        twoLastSprite.intendedX = (game.width / 2) - 360;
        lastSprite.intendedX = (game.width / 2) - 180;
        currentSprite.intendedX = game.width / 2;
        nextSprite.intendedX = (game.width / 2) + 180;
        twoNextSprite.intendedX = (game.width / 2) + 360;
        threeNextSprite.x = (game.width / 2) + 720;
        threeNextSprite.intendedX = (game.width / 2) + 540;
        fourNextSprite.intendedX = (game.width / 2) + 720;
        fourNextSprite.x = (game.width / 2) + 760;
        this.changePaletteOfImage(fourLastSprite.bmd, this.trueColorsCopyBmd, fourLastSprite.index, fourLastSprite.index);
    },
    getAvailableHeight: function() {
        if (radioIsOpen) {
            if (axis == LANDSCAPE) {
                return window.innerHeight - 45;
            }
            else if (axis == PORTRAIT) {
                return window.innerHeight * 0.9;
            }
        }
        else {
            return window.innerHeight;
        }
    },
}