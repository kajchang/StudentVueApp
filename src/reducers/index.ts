import { ActionInterface, BellScheduleInterface, EventCalendarInterface, StudentInfoInterface } from '../actions';

export interface StateInterface {
    cookies: string;
    bellSchedule: BellScheduleInterface;
    eventCalendar: EventCalendarInterface;
    studentInfo: StudentInfoInterface;
}

const defaultState: StateInterface = {
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

export default (state: StateInterface = defaultState, action: ActionInterface) => {
    console.log(action.type);
    switch (action.type) {
        case 'SET_COOKIES':
            return Object.assign({}, state, { cookies: action.data || state.cookies } );
        case 'SET_BELL_SCHEDULE':
            return Object.assign({}, state, { bellSchedule: Object.assign({ data: action.data || state.bellSchedule }, { loaded: true} )} );
        case 'SET_EVENT_CALENDAR':
            return Object.assign({}, state, { eventCalendar: Object.assign({ data: action.data || state.eventCalendar }, { loaded: true }) } );
        case 'SET_STUDENT_INFO':
            return Object.assign({}, state, { studentInfo: Object.assign(action.data || state.studentInfo, { loaded: true }) } );
        case 'CLEAR_STUDENT_INFO':
            return Object.assign({}, state, { studentInfo: defaultState.studentInfo } );
        default:
            return state
    }
};
