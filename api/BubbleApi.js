import axios from 'axios';
import * as URL from '../config.js';

export default class BubbleApi {
    static apiToken = '';
    static dataUrl = URL.DATA_URL;
    static workflowUrl = URL.WORKFLOW_URL;

    static setApiToken(token) {
        this.apiToken = token;
    }
  
    static async apiLogin(email, password) {
        try {
            const { data } = await axios.post(
                `${URL.WORKFLOW_URL}/login`, 
                { email, password }
            );
            const userInfo = { userID: data?.response?.user_id, token: data?.response?.token };
            this.apiToken = userInfo.token;
    
            return userInfo;
        } catch(err) {
            console.log(`apiLogin fail ${email}`);

        }
    }

    static printContents() {
        console.log(this);
    }

    static async _fetchData(thingType, thingID) {
        try {
            const { data } = await axios.get(
                `${this.dataUrl}/${thingType}/${thingID}`,
                {},
                { headers: { Authorization: `Bearer ${this.apiToken}` } },
            );
            return data.response;
        } catch(err) {
            console.log(`_fetchData fail ${thingType} ${thingID}`);
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
        } catch(err) {
            console.log(`apiLogout fail`);
        }
    }

    static async fetchUser(userID) {
        const rawUser = await this._fetchData('user', userID);
        console.log(rawUser);
        return {
            firstName: rawUser.first_text,
            lastName: rawUser.last_text,
            name: rawUser.first_last_text,
            team: rawUser.teamnumt_text,
        }
    }
  
    async normalizeData(data) {
      // Instance-specific normalization logic
    }
  
    async fetchDataAndNormalize(endpoint) {
      try {
        const rawData = await this.fetchData(endpoint);
        const normalizedData = await this.normalizeData(rawData);
        return normalizedData;
      } catch (error) {
        throw error;
      }
    }
  }
  
 
  