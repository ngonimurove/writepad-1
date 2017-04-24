const INITIAL_STATE = { key: '' }

const activeProject = ( state = INITIAL_STATE, action ) => {
    switch (action.type) {
        case 'SET_ACTIVE_PROJECT':
            return state = { key: action.project };
        default:
            return state;
    }
}

export default activeProject;