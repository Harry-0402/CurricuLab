/* src/router.ts */
import { Subject, Syllabus, Unit, Note, Config, Timetable } from './types';

class Router {
    private cache: Map<string, any> = new Map();

    async fetchData<T>(path: string): Promise<T> {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }
        const response = await fetch(path);
        const data = await response.json();
        this.cache.set(path, data);
        return data;
    }

    getParam(name: string): string | null {
        const hash = window.location.hash;
        const queryIndex = hash.indexOf('?');
        if (queryIndex === -1) return null;

        const search = hash.slice(queryIndex);
        const urlParams = new URLSearchParams(search);
        return urlParams.get(name);
    }

    async getSubjects(): Promise<Subject[]> {
        return await this.fetchData<Subject[]>('/assets/json/subjects.json');
    }

    async getSubject(subjectId: string): Promise<Subject | undefined> {
        const subjects = await this.getSubjects();
        return subjects.find(s => s.subjectId === subjectId);
    }

    async getSyllabus(subjectId: string): Promise<Syllabus> {
        return await this.fetchData<Syllabus>(`/assets/json/${subjectId}/syllabus.json`);
    }

    async getUnits(subjectId: string): Promise<Unit[]> {
        return await this.fetchData<Unit[]>(`/assets/json/${subjectId}/units.json`);
    }

    async getNotes(subjectId: string, unitId: string): Promise<Note[]> {
        return await this.fetchData<Note[]>(`/assets/json/${subjectId}/${unitId}/notes.json`);
    }

    async getMaterials(): Promise<any> {
        return await this.fetchData<any>('/assets/json/materials.json');
    }

    async getUnitDetails(subjectId: string, unitId: string): Promise<any> {
        return await this.fetchData<any>(`/assets/json/${subjectId}/${unitId}/details.json`);
    }

    async getUnitQuestions(subjectId: string, unitId: string): Promise<any> {
        return await this.fetchData<any>(`/assets/json/${subjectId}/${unitId}/questions.json`);
    }

    async getTimetable(): Promise<Timetable> {
        return await this.fetchData<Timetable>('/assets/json/timetable.json');
    }

    async getConfig(): Promise<Config> {
        return await this.fetchData<Config>('/assets/json/config.json');
    }
}

export const router = new Router();
export default router;
