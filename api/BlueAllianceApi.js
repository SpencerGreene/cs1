import axios from 'axios';
import * as URL from '../config.js';

export default class BlueAllianceApi {
    static apiToken = URL.TBA_KEY;
    static header = { headers: { "X-TBA-Auth-Key": URL.TBA_KEY } };
    static tbaUrl = URL.TBA_URL;

    static async fetchEvent(eventKey) {
        const matchArray = await this._fetchData(`event/${eventKey}/matches/simple`);

        let matchDict = {};
        matchArray.forEach((match, index) => {
            const { comp_level, match_number } = match;
            if (comp_level === 'qm') {
                matchDict[match_number] = match;
            }
        });

        console.log(matchDict);
        return matchDict;
    }

    // private functions
    static async _fetchData(endpoint) {
        try {
            const { data } = await axios.get(
                `${this.tbaUrl}/${endpoint}`,
                this.header,
            );
            return data;
        } catch (err) {
            console.log(`_fetchData fail ${thingType} ${thingID}`);
        }
    }

}


