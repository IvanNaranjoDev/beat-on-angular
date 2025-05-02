export interface Role {
    id: number;
    name: string;
}
  
export interface Avatar {
    id: number;
    path: string;
}
  
export interface User {
    id?: number;
    username: string;
    email: string;
    password?: string;
    enabled: boolean;
    avatar?: Avatar;
    roles: Role[];
}
  