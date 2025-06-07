export interface Instrumental {
    id: number
    instName: string;
    bpm: string;
    public: boolean;
    coverUrl: string;
    userId: number;
    steps: {
        soundId: number | null;
        rowIndex: number;
        steps: boolean[];
    }[];
}