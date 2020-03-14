export const AUTH_BUSY = 'AUTH_BUSY';
export const AUTH_RETRIEVEUSER_SUCCESS = 'AUTH_RETRIEVEUSER_SUCCESS';
export const AUTH_RETRIEVEUSER_ERROR = 'AUTH_RETRIEVEUSER_ERROR';

export function fetchLoggedInUser() {
    return function(dispatch, getState) {
        dispatch({
          type: AUTH_BUSY
        });
        const url = '/api/logged-in-user';

        fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          method: 'GET'
        }).then((response) => {
          if (!response.ok) {
            return response.json().then(err => { throw err })
          }
          return response.json();
        }).then((results) => {
          console.log('results ', results);
          const user = results.user;

          dispatch({
            type: AUTH_RETRIEVEUSER_SUCCESS,
            payload: user
          });
        }).catch((error) => {
          console.log('error ', error);
          dispatch({
            type: AUTH_RETRIEVEUSER_ERROR,
            payload: null
          });
        })    
    }
}
