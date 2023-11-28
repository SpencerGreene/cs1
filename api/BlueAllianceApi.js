import axios from 'axios';
import { TBA_KEY, TBA_URL } from '../config.js';

export default class BlueAllianceApi {
    static apiToken = TBA_KEY;
    static header = { headers: { "X-TBA-Auth-Key": TBA_KEY } };
    static tbaUrl = TBA_URL;

    static async fetchEventInfo(eventKey) {
        const matchArray = await this._fetchData(`event/${eventKey}/matches/simple`);

        let matchDict = {};
        matchArray.forEach((match, index) => {
            const { comp_level, match_number } = match;
            if (comp_level === 'qm') {
                matchDict[match_number] = match;
            }
        });

        matchDict.fetchedDate = new Date();
        matchDict.eventKey = eventKey;
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
            console.log(`_fetchData fail ${endpoint}`);
        }
    }

}


