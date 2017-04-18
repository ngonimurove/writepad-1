const CONTENT_LOGIN = 'CONTENT_LOGIN';
const INITIAL_STATE = { active: CONTENT_LOGIN }

const contentView = ( state = INITIAL_STATE, action ) => {
    switch (action.type) {
        case 'SET_CONTENT_VIEW':
            return state = { active: action.view };
        default:
            return state;
    }
}

export default contentView;