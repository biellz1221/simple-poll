import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
	baseURL: process.env.VUE_APP_API,
});

export function getToken() {
	return 'Bearer ' + JSON.parse(Cookies.get('pollsloginsession')).token;
}
