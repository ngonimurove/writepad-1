export const SET_CONTENT_VIEW = 'SET_CONTENT_VIEW'; 
export const SET_USER_PROFILE = 'SET_USER_PROFILE'; 
export const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT'; 

export const setContentView = ( view ) => ({
    type: SET_CONTENT_VIEW,
    view: view
});

export const setUserProfile = ( details ) => ({
    type: SET_USER_PROFILE,
    details: details
});

export const setActiveProject = ( project ) => ({
    type: SET_ACTIVE_PROJECT,
    project: project
});
