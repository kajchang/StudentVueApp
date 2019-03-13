import {
    IActionInterface,
    IBellScheduleInterface,
    IEventCalendarInterface,
    IStudentInfoInterface,
} from '../actions';

export interface IStateInterface {
    cookies: string;
    bellSchedule: IBellScheduleInterface;
    eventCalendar: IEventCalendarInterface;
    studentInfo: IStudentInfoInterface;
}

const defaultState: IStateInterface = {
    bellSchedule: {
        loaded: false,
    },
    cookies: '',
    eventCalendar: {
        loaded: false,
    },
    studentInfo: {
        loaded: false,
        name: '',
        studentID: '',
    },
};

export default (state: IStateInterface = defaultState, action: IActionInterface) => {
    switch (action.type) {
    case 'SET_COOKIES':
        return Object.assign({}, state, { cookies: action.data || state.cookies });
    case 'SET_BELL_SCHEDULE':
        return Object.assign({}, state, {
            bellSchedule: Object.assign({
                data: action.data || state.bellSchedule,
            },                          { loaded: true }) });
    case 'SET_EVENT_CALENDAR':
        return Object.assign({}, state, {
            eventCalendar: Object.assign({
                data: action.data || state.eventCalendar,
            },                           { loaded: true }) });
    case 'SET_STUDENT_INFO':
        return Object.assign({}, state, {
            studentInfo: Object.assign(action.data || state.studentInfo, { loaded: true }) });
    case 'CLEAR_STUDENT_INFO':
        return Object.assign({}, state, { studentInfo: defaultState.studentInfo });
    default:
        return state;
    }
};
