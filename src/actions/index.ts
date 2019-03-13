export interface IActionInterface {
    type: string;
    data?: any;
}

export interface IBellScheduleInterface {
    loaded: boolean;
    data?: {
        [scheduleType: string]: {
            [className: string]: string,
        };
    };
}

export interface IEventCalendarInterface {
    loaded: boolean;
    data?: {
        [month: string]: {
            days: {
                [day: string]: string,
            };
            events: string[];
        };
    };
}

export interface IStudentInfoInterface {
    name: string;
    studentID: string;
    loaded: boolean;
}

export const setCookies = (cookies: string): IActionInterface => ({
    data: cookies,
    type: 'SET_COOKIES',
});

export const setBellSchedule = (bellSchedule: IBellScheduleInterface): IActionInterface => ({
    data: bellSchedule,
    type: 'SET_BELL_SCHEDULE',
});

export const setEventCalendar = (eventCalendar: IEventCalendarInterface): IActionInterface => ({
    data: eventCalendar,
    type: 'SET_EVENT_CALENDAR',
});

export const setStudentInfo = (studentInfo: IStudentInfoInterface): IActionInterface => ({
    data: studentInfo,
    type: 'SET_STUDENT_INFO',
});

export const clearStudentInfo = (): IActionInterface => ({
    type: 'CLEAR_STUDENT_INFO',
});
