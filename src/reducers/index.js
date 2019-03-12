const defaultState = {
    cookies: '',
    bellSchedule: {},
    eventCalendar: {},
    studentInfo: {
        name: '',
        studentID: ''
    }
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_COOKIES':
            return Object.assign({}, state, { cookies: action.data || state.cookies } );
        case 'SET_BELL_SCHEDULE':
            return Object.assign({}, state, { bellSchedule: action.data || state.bellSchedule } );
        case 'SET_EVENT_CALENDAR':
            return Object.assign({}, state, { eventCalendar: action.data || state.eventCalendar } );
        case 'SET_STUDENT_INFO':
            return Object.assign({}, state, { studentInfo: action.data || state.studentInfo } );
        default:
            return state
    }
};
