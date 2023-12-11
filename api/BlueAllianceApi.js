import axios from 'axios';
import { TBA_KEY, TBA_URL } from '../scoutConfig.js';
import { ERROR } from '../logConfig.js';

export default class BlueAllianceApi {
    static apiToken = TBA_KEY;
    static header = { headers: { "X-TBA-Auth-Key": TBA_KEY } };
    static tbaUrl = TBA_URL;

    static async fetchEventInfo(eventKey) {
        const [event, matchArray] = await Promise.all([ 
            this._fetchData(`event/${eventKey}`),
            this._fetchData(`event/${eventKey}/matches/simple`),
        ]);

        let matches = {};
        matchArray.forEach((match, index) => {
            const { comp_level, match_number } = match;
            if (comp_level === 'qm') {
                matches[match_number] = match;
            }
        });

        const eventInfo = {
            eventKey,
            event,
            matches,
            fetchedDate: new Date(),
        };

        return eventInfo;
        
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
            ERROR(`_fetchData fail ${endpoint}`);
        }
    }

}


