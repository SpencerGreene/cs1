import axios from 'axios';
import * as URL from '../config.js';

export default class BubbleApi {
    static apiToken = '';
    static header = '';
    static dataUrl = URL.DATA_URL;
    static workflowUrl = URL.WORKFLOW_URL;

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

            const expireSeconds = data?.response?.expires;

            const userInfo = {
                userID: data?.response?.user_id,
                token: data?.response?.token,
                expireTime: new Date().getTime() + data?.response?.expires * 1000,
            };

            console.log('expires: ', Date(userInfo.expireTime).toLocaleString());

            return userInfo;
        } catch (err) {
            console.log(`apiLogin fail ${email}`);
        }
    }

    static async apiLogout() {
        console.log(this.apiToken);
        try {
            const { data } = await axios.post(
                `${this.workflowUrl}/logout`,
                {},
                { headers: { Authorization: `Bearer ${this.apiToken}` } },
            );
            return data.response;
        } catch (err) {
            console.log(`apiLogout fail`);
        }
    }

    static async fetchUser(userID) {
        const rawUser = await this._fetchData('user', userID);
        return {
            firstName: rawUser.first_text,
            lastName: rawUser.last_text,
            name: rawUser.first_last_text,
            team: rawUser.teamnumt_text,
        }
    }

    static async getAppDefaults() {
        const { appVariables, colorDict } = await this._fetchAppVariables();

        console.log(appVariables);
        return { appVariables, colorDict };
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
            console.log(`_fetchData fail ${thingType} ${thingID}`);
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
            console.log(`_searchData fail ${thingType} ${constraints}`);
        }
    }

    static async _fetchWorkflow(endpoint) {
        console.log('workflow with token', this.apiToken);
        try {
            const { data } = await axios.post(
                `${this.workflowUrl}/${endpoint}`,
                {},
                this.header
            );
            return data.response;
        } catch (err) {
            console.log(`_fetchWorkflow fail ${endpoint}`);
        }
    }

    static async _fetchAppVariables() {
        let res = await this._fetchWorkflow('appVariables');
        const appVariables = {
            defaultColorIDs: {
                active: res.appVariables.default_coloractive_custom_colors,
                flash: res.appVariables.default_colorflash_custom_colors,
                inactive: res.appVariables.default_colorinactive_custom_colors,
                selected: res.appVariables.default_colorselected_custom_colors,
            },
            gameID: res.appVariables.default_game_custom_game,
            eventKey: res.appVariables.default_event_text,
            defaultMatchType: res.appVariables.default_match_type_option_matchtype,
            defaultMatchNum: res.appVariables.default_match_number_number,
        };

        const colorDict = await this._fetchColorDict();
        appVariables.defaultColors = {
            active: colorDict[appVariables.defaultColorIDs.active],
            flash: colorDict[appVariables.defaultColorIDs.flash],
            inactive: colorDict[appVariables.defaultColorIDs.inactive],
            selected: colorDict[appVariables.defaultColorIDs.selected],
        };

        appVariables.game = await this._fetchData('game', appVariables.gameID);

        return { appVariables, colorDict };
    }

    static async _fetchColorDict() {
        const colors = await this._searchData(
            'colors',
            [{
                key: "deleted", 
                constraint_type: "not equal",
                value: "yes"
            }]
        );
        const colorArray = colors.results;

        let colorDict = {};
        colorArray.forEach((color, index) => {
            colorDict[color._id] = {
                hexColor: color.hexcolor_text,
                contrastColor: color.contrastcolor_option_textcolor,
                name: color.name_text,
            }
        });
        return colorDict;
    }

}


