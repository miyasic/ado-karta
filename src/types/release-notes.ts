export interface ChangeItem {
    title: string;
    descriptions?: string[];
}

export interface LocalizedChanges {
    newFeatures?: ChangeItem[];
    improvements?: ChangeItem[];
    bugFixes?: ChangeItem[];
}

export interface ReleaseNote {
    version: string;
    releaseDate: string; // YYYY-MM-DD 形式
    changes: {
        [locale: string]: LocalizedChanges;
    };
}

export type ReleaseNotes = ReleaseNote[]; 