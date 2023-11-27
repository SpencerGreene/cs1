export const WORKFLOW_URL = 'https://cookiescout2.bubbleapps.io/version-test/api/1.1/wf';
export const DATA_URL = 'https://cookiescout2.bubbleapps.io/version-test/api/1.1/obj';

export const TBA_KEY = 'QMX6lOKtgvG1vLLPDSt2yvsPCVNV77FOFXreWkcMX3WXv0CSPH8EiBeuD3gjWAvL';
export const TBA_URL = 'https://www.thebluealliance.com/api/v3';

export const LOCALKEYS = {
    APPVAR: 'appVariables',
    COLORDICT: 'colorDict',
    EVENTMATCHES: 'eventMatches',
    USERINFO: 'userInfo',
};

export const PHASES = {
    pregame: {
        forwardLabel: 'Auto',
        back: null,
        backLabel: 'Cancel',
        display: 'Pregame',
        endTime: null,
    },
    auto: {
        forwardLabel: 'Teleop',
        backLabel: 'Pregame',
        display: 'Auto',
        endTime: 135,
    },
    teleop: {
        forwardLabel: 'Endgame',
        backLabel: 'Auto',
        display: 'Teleop',
        endTime: 30,
    },
    endgame: {
        forwardLabel: 'Submit',
        backLabel: 'Teleop',
        display: 'Endgame',
        endTime: -20,
    },
    submit: {
        forward: null,
        forwardLabel: null,
        back: null,
        backLabel: null,
        display: 'Submit',
        endTime: -80,
    },
};

PHASES.pregame.forward = PHASES.auto;
PHASES.auto.back = PHASES.pregame;
PHASES.auto.forward = PHASES.teleop;
PHASES.teleop.back = PHASES.auto;
PHASES.teleop.forward = PHASES.endgame;
PHASES.endgame.forward = PHASES.submit;
PHASES.endgame.back = PHASES.teleop;

