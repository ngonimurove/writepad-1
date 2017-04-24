const INITIAL_STATE = { project: '' }

const activeProject = ( state = INITIAL_STATE, action ) => {
    switch (action.type) {
        case 'SET_ACTIVE_PROJECT':
            return state = { project: action.project };
        default:
            return state;
    }
}

export default activeProject;