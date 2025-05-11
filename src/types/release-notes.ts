export interface ReleaseNote {
    version: string;
    releaseDate: string; // YYYY-MM-DD 形式
    changes: {
        newFeatures?: string[];
        improvements?: string[];
        bugFixes?: string[];
    };
}

export type ReleaseNotes = ReleaseNote[]; 