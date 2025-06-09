export interface Like {
    id: number;
    userId: number;
    instrumentalId: number;
}

export interface CreateLike {
    userId: number;
    instrumentalId: number;
}