const INITIAL_STATE = { details: { firstname: '',
                                   lastname: '',
                                   uid: '' } };

const userProfile = ( state = INITIAL_STATE, action ) => {
    switch (action.type) {
        case 'SET_USER_PROFILE':
            return state = { details: action.details };
        default:
            return state;
    }
}

export default userProfile;