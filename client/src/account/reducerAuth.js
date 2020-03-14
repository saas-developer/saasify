import _isEmpty from 'lodash/isEmpty';

import {
    AUTH_BUSY,
    AUTH_RETRIEVEUSER_SUCCESS,
    AUTH_RETRIEVEUSER_ERROR
} from './actionsAuth';

export default function auth(state = {}, action) {
    switch(action.type) {
        case AUTH_BUSY: {
            return {
                ...state,
                busy: true
            }
        }

        case AUTH_RETRIEVEUSER_ERROR: {
            return {
                ...state,
                busy: false,
                error: null,
                authenticated: false,
                user: null
            }
        }
        case AUTH_RETRIEVEUSER_SUCCESS: {
            const { payload = {} } = action;
            return {
                ...state,
                busy: false,
                error: null,
                authenticated: !_isEmpty(payload),
                user: payload
            }
        }
        default: return state;
    }
}
