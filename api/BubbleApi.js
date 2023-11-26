import axios from 'axios';
import * as URL from '../config.js';

export default class BubbleApi {
    static apiToken = '';
    static header = '';
    static dataUrl = URL.DATA_URL;
    static workflowUrl = URL.WORKFLOW_URL;
    static colorDict = {};

    static setApiToken(token) {
        this.apiToken = token;
        this.header = { headers: { Authorization: `Bearer ${this.apiToken}` } };
    }

    static async apiLogin(email, password) {
        try {
            const { data } = await axios.post(
                `${URL.WORKFLOW_URL}/login`,
                { email, password }
            );

            const userInfo = {
                userID: data?.response?.user_id,
                token: data?.response?.token,
                expireTime: new Date().getTime() + data?.response?.expires * 1000,
            };

            console.log('received token expires: ', Date(userInfo.expireTime).toLocaleString());

            return userInfo;
        } catch (err) {
            console.error(`apiLogin fail ${email}`);
        }
    }

    static async apiLogout() {
        try {
            const { data } = await axios.post(
                `${this.workflowUrl}/logout`,
                {},
                { headers: { Authorization: `Bearer ${this.apiToken}` } },
            );
            return data.response;
        } catch (err) {
            console.error(`apiLogout fail`);
        }
    }

    static async apiGetUser(userID) {
        const rawUser = await this._fetchData('user', userID);
        return {
            firstName: rawUser.first_text,
            lastName: rawUser.last_text,
            name: rawUser.first_last_text,
            teamNumT: rawUser.teamnumt_text,
            fetchedDate: new Date(),
        }
    }

    static async apiGetAppVariables() {
        let rawAppVariables = await this._fetchWorkflow('appVariables');
        const appVariables = {
            defaultColorIDs: {
                active: rawAppVariables.appVariables.default_coloractive_custom_colors,
                flash: rawAppVariables.appVariables.default_colorflash_custom_colors,
                inactive: rawAppVariables.appVariables.default_colorinactive_custom_colors,
                selected: rawAppVariables.appVariables.default_colorselected_custom_colors,
            },
            gameID: rawAppVariables.appVariables.default_game_custom_game,
            eventKey: rawAppVariables.appVariables.default_event_text,
            defaultMatchType: rawAppVariables.appVariables.default_match_type_option_matchtype,
            defaultMatchNum: rawAppVariables.appVariables.default_match_number_number,
            teamNumT: rawAppVariables.appVariables.analyzeteamnumt_text,
        };

        appVariables.game = await this._fetchGame(appVariables.gameID);
        appVariables.fetchedDate = new Date();
        
        return appVariables;
    }

    static async apiGetLastChanged() {
        const rawLastChanged = await this._fetchWorkflow('lastChanged');
        return rawLastChanged;
    }

    static async apiGetColorDict(teamNumT) {
        const rawColors = await this._searchData(
            'colors',
            [{
                key: "deleted", 
                constraint_type: "not equal",
                value: "yes"
            }]
        );
        const rawColorArray = rawColors.results;

        let colorDict = {};
        rawColorArray.forEach((rawColor) => {
            const analyzeTeamNumT = rawColor.analyzeteamnumt_text;
            if (!analyzeTeamNumT || analyzeTeamNumT === undefined || analyzeTeamNumT === teamNumT)
                colorDict[rawColor._id] = {
                    hexColor: rawColor.hexcolor_text,
                    contrastColor: rawColor.contrastcolor_option_textcolor,
                    name: rawColor.name_text,
                    analyzeTeamNumT
                }
            });
        colorDict.fetchedDate = new Date();
        colorDict.teamNumT = teamNumT;

        this.colorDict = colorDict;
        return colorDict;
    }

    // public debug functions
    static printToken() {
        console.log('my token is', this.apiToken);
    }

    // private functions
    static async _fetchData(thingType, thingID) {
        try {
            const { data } = await axios.get(
                `${this.dataUrl}/${thingType}/${thingID}`,
                {},
                this.header,
            );
            return data.response;
        } catch (err) {
            console.error(`_fetchData fail ${thingType} ${thingID}`);
        }
    }

    static async _searchData(thingType, constraints) {
        try {
            const { data } = await axios.get(
                `${this.dataUrl}/${thingType}?constraints=${JSON.stringify(constraints)}`,
                {},
                this.header
            );
            return data.response;
        } catch (err) {
            console.error(`_searchData fail ${thingType} ${constraints}`);
        }
    }

    static async _fetchWorkflow(endpoint) {
        try {
            const { data } = await axios.get(
                `${this.workflowUrl}/${endpoint}`,
                this.header
            );
            return data.response;
        } catch (err) {
            console.error(`_fetchWorkflow fail ${endpoint}`);
        }
    }

    static async _fetchGame(gameID) {
        const rawGame = await this._fetchData('game', gameID);
        let game = {
            season: rawGame.season_text,
            autoTeleSeconds: rawGame.autoteleseconds_number,
            name: rawGame.name_text,
            id: gameID,
        };

        const counterIDs = rawGame.counters_list_custom_counter;
        game.counterDefs = await Promise.all(
            counterIDs.map(id => this._fetchCounterDefinition(id))
        );
        game.fetchedDate = new Date();
        
        return game;
    }

    static async _fetchCounterDefinition(counterID) {
        const rawCounter = await this._fetchData('counterdefinition', counterID);
        let counterDef = {
            name: rawCounter.name_text,
            scoutDisplayName: rawCounter.scoutdisplayname__boolean,
            gamePhases: rawCounter.gamephases_list_option_gamephase,
            sortOrder: rawCounter.sequence_number,
            id: counterID,
        };

        const conditionIDs = rawCounter.conditions_list_custom_gamechoice;
        counterDef.conditions = await Promise.all(
            conditionIDs.map(id => this._fetchCounterCondition(id))
        );

        return counterDef;
    }

    static async _fetchCounterCondition(counterConditionID) {
        const rawCondition = await this._fetchData('countercondition', counterConditionID);
        let counterCondition = {
            sortOrder: rawCondition.typesortorder_number,
            name: rawCondition.display_text,
            type: rawCondition.type_option_condition_type,
            id: counterConditionID,
        };

        const optionIDs = rawCondition.choices_list_custom_counterconditionoption;

        counterCondition.options = await Promise.all(
            optionIDs.map(id => this._fetchCounterConditionOption(id))
        );

        return counterCondition;
    }

    static async _fetchCounterConditionOption(optionID) {
        const rawOption = await this._fetchData('counterconditionoption', optionID);
        let option = {
            colorIDs: {
                active: rawOption.coloractive_custom_colors,
                flash: rawOption.colorflash_custom_colors,
                inactive: rawOption.colorinactive_custom_colors,
                selected: rawOption.colorselected_custom_colors,
            },
            name: rawOption.name_text,
            height: rawOption.height_option_buttonheight,
            display: rawOption.display_text,
            imageURL: rawOption.image_image,
            sortOrder: rawOption.sortorder_number,
            id: optionID,
        }

        return option;
    }


}


