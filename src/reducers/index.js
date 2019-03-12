const defaultState = {
    cookies: '',
    bellSchedule: {
        loaded: false
    },
    eventCalendar: {
        loaded: false
    },
    studentInfo: {
        name: '',
        studentID: '',
        loaded: false
    }
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_COOKIES':
            return Object.assign({}, state, { cookies: action.data || state.cookies } );
        case 'SET_BELL_SCHEDULE':
            return Object.assign({}, state, { bellSchedule: Object.assign(action.data || state.bellSchedule , { loaded: true} )} );
        case 'SET_EVENT_CALENDAR':
            return Object.assign({}, state, { eventCalendar: Object.assign(action.data || state.eventCalendar, { loaded: true }) } );
        case 'SET_STUDENT_INFO':
            return Object.assign({}, state, { studentInfo: Object.assign(action.data || state.studentInfo, { loaded: true }) } );
        case 'CLEAR_STUDENT_INFO':
            return Object.assign({}, state, { studentInfo: defaultState.studentInfo } );
        default:
            return state
    }
};
