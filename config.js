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

export const ACTIONS = {
    makeScout: 'makeScout',
    clearMatchTeam: 'clearMatchTeam',
    clearConditions: 'clearConditions',
    reloadMaxed: 'reloadMaxed',
    deleteCounts: 'deleteCounts',
    deleteScout: 'deleteScout',
    submit: 'submit',
    startClock: 'startClock',
}

/* Definitions:
 *   select = selection of game=default, event=default, match=input, team=input
 *   conditions = the multi columns of scouting buttons, ie L0/L1/L2, cube/cone
 *   maxed = conditions that are only allowed once per phase, ie balance
 *     note maxed stores one per phase, all cleared when conditions are cleared
 */

export const PHASES = {
    // arriving here: select clear, no scout
    select: {
        display: 'Select Match & Team',
        forwardLabel: 'Confirm selection',
        forwardActions: [ACTIONS.makeScout, ACTIONS.clearConditions],
        showClock: false,
    },

    // arriving here: select valid, scout valid, no counts, conditions clear
    pregame: {
        display: 'Pregame',
        backLabel: 'Cancel',
        backActions: [ACTIONS.deleteScout, ACTIONS.clearMatchTeam],
        forwardLabel: 'Start Game',
        forwardActions: [ACTIONS.startClock], // clearConditions already done
        endTime: null,
        showClock: false,
    },

    // arriving here: conditions clear (forward) or preserved w max-reload (back)
    auto: {
        display: 'Auto',
        backLabel: 'Pregame',
        backActions: [ACTIONS.deleteCounts, ACTIONS.clearConditions],
        forwardLabel: 'Teleop',
        forwardActions: [ACTIONS.reloadMaxed],
        endTime: 135,
        showClock: true,
    },

    // arriving here: conditions preserved w max-reload (forward or back)
    teleop: {
        display: 'Teleop',
        backLabel: 'Auto',
        backActions: [ACTIONS.reloadMaxed],
        forwardLabel: 'Endgame',
        backActions: [ACTIONS.reloadMaxed],
        endTime: 30,
        showClock: true,
    },

    endgame: {
        display: 'Endgame',
        backLabel: 'Teleop',
        backActions: [ACTIONS.reloadMaxed],
        forwardLabel: 'Submit',
        endTime: -20, // 20 seconds after match, auto jump to submit
        showClock: true,
    },

    submit: {
        display: 'Submit',
        backLabel: 'Cancel',
        backActions: [ACTIONS.reloadMaxed],
        forwardLabel: 'Submit',
        forwardActions: [ACTIONS.submit, ACTIONS.clearConditions],
        endTime: -80, // 60 seconds after submit, auto submit
        showClock: false,
    },
};

PHASES.select.forward = PHASES.pregame;
PHASES.select.back = null;

PHASES.pregame.back = PHASES.select;
PHASES.pregame.forward = PHASES.auto;

PHASES.auto.back = PHASES.pregame;
PHASES.auto.forward = PHASES.teleop;

PHASES.teleop.back = PHASES.auto;
PHASES.teleop.forward = PHASES.endgame;

PHASES.endgame.back = PHASES.teleop;
PHASES.endgame.forward = PHASES.submit;

PHASES.submit.back = PHASES.endgame;
PHASES.submit.forward = PHASES.select;

