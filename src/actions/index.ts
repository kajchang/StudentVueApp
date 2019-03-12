export interface ActionInterface {
    type: string;
    data?: any;
}

export interface BellScheduleInterface {
    loaded: boolean;
    data?: {
        [scheduleType: string]: {
            [className: string]: string
        };
    };
}

export interface EventCalendarInterface {
    loaded: boolean;
    data?: {
        [month: string]: {
            days: {
                [day: string]: string
            };
            events: string[];
        };
    };
}

export interface StudentInfoInterface {
    name: string,
    studentID: string;
    loaded: boolean;
}

export const setCookies = (cookies: string): ActionInterface => ({
    type: 'SET_COOKIES',
    data: cookies
});

export const setBellSchedule = (bellSchedule: BellScheduleInterface): ActionInterface => ({
    type: 'SET_BELL_SCHEDULE',
    data: bellSchedule
});

export const setEventCalendar = (eventCalendar: EventCalendarInterface): ActionInterface => ({
    type: 'SET_EVENT_CALENDAR',
    data: eventCalendar
});

export const setStudentInfo = (studentInfo: StudentInfoInterface): ActionInterface => ({
    type: 'SET_STUDENT_INFO',
    data: studentInfo
});

export const clearStudentInfo = (): ActionInterface => ({
   type: 'CLEAR_STUDENT_INFO'
});
