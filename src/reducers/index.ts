import {
    IActionInterface,
    IBellScheduleInterface,
    IClassInterface,
    IEventCalendarInterface,
    IStudentInfoInterface,
} from '../actions';

export interface IStateInterface {
    bellSchedule: IBellScheduleInterface;
    classes: IClassInterface;
    cookies: string;
    eventCalendar: IEventCalendarInterface;
    studentInfo: IStudentInfoInterface;
}

const defaultState: IStateInterface = {
    bellSchedule: {
        loaded: false,
    },
    classes: {
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
        return {
            ...state,
            cookies: action.data || state.cookies,
        };
    case 'SET_BELL_SCHEDULE':
        return {
            ...state,
            bellSchedule: {
                data: action.data || state.bellSchedule,
                loaded: true,
            },
        };
    case 'SET_EVENT_CALENDAR':
        return {
            ...state,
            eventCalendar: {
                data: action.data || state.eventCalendar,
                loaded: true,
            },
        };
    case 'SET_STUDENT_INFO':
        return {
            ...state,
            studentInfo: {
                ...(action.data || state.studentInfo),
                loaded: true,
            },
        };
    case 'CLEAR_STUDENT_INFO':
        return {
            ...state,
            studentInfo: defaultState.studentInfo,
        };
    case 'SET_CLASSES':
        return {
            ...state,
            classes: {
                data: action.data || state.classes,
                loaded: true,
            },
        };
    default:
        return state;
    }
};
