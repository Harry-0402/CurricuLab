/* src/types.ts */

export interface Subject {
    subjectId: string;
    title: string;
    code: string;
    teacher: string;
    description: string;
    icon: string;
}

export interface Unit {
    unitId: string;
    title: string;
}

export interface Note {
    noteId: string;
    title: string;
    link: string;
}

export interface Syllabus {
    [unitId: string]: string;
}

export interface TimetableSlot {
    time: string;
    subject: string;
    room: string;
}

export interface TimetableDay {
    day: string;
    slots: TimetableSlot[];
}

export interface Timetable {
    schedule: TimetableDay[];
}

export interface Config {
    appName: string;
    tagline: string;
    semester: string;
    author: string;
    version: string;
}

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
}

export interface Theme {
    global: any;
    cards: any;
    buttons: any;
    badges: any;
    links: any;
    states: any;
    typography: any;
    spacing: any;
}
