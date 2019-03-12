export const setCookies = cookies => ({
    type: 'SET_COOKIES',
    data: cookies
});

export const setBellSchedule = bellSchedule => ({
    type: 'SET_BELL_SCHEDULE',
    data: bellSchedule
});

export const setEventCalendar = eventCalendar => ({
    type: 'SET_EVENT_CALENDAR',
    data: eventCalendar
});

export const setStudentInfo = studentInfo => ({
    type: 'SET_STUDENT_INFO',
    data: studentInfo
});

