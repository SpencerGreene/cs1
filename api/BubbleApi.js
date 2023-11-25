import axios from 'axios';
import * as URL from '../config';


export default class BubbleApi {
    constructor() {
        this.token = '';
        this.workflowURL = URL.WORKFLOW_URL;
        this.dataURL = URL.DATA_URL;
    }

    async _getData(thingType, thingID) {
        try {
            const dataResponse = await axios.get(
                `${this.dataURL}/${thingType}/${user_id}`,
                {},
                { headers: {Authorization: `Bearer ${this.token}`}, },
            );
            return dataResponse?.data?.response;
        } catch(err) {
            console.error(`Error fetching ${thingType} ${thingID}:`, err);
        }
    }

    setLogin(token) {
        this.token = token;
    }

    async apiLogin(email, password) {
        try {
            const loginResponse = await axios.post(
                `${this.workflowUrl}/login`, 
                { email, password }
            ); // should return: {data: {response: {user_id, token}}}
        
            const userID = loginResponse?.data?.response;
            this.token = loginResponse?.data?.token;
            return {user: {userID, token}};
        } catch(err) {
            console.error(`Error login ${email}:`, err);
        }
    }

    async getUser(userID) {
        const rawUser = await _getData('user', userID);
        console.log(rawUser);
        const user = {
            firstName: rawUser.first_text,
            lastName: rawUser.last_text,
            name: rawUser.first_last_text,
            role: rawUser.role_option_role,
            imageUrl: rawUser.picture_image,
            teamNum: rawUser.teamnumt_text,
        };
        console.log(user);
        return user;
    }

}
