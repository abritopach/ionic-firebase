export interface UserCredential {
    email: string;
    password: string;
}

export interface UserProfile {
    email: string;
    fullName: string;
    birthDate: string;
    password?: string;
}