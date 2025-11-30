export class User {
    email: string;
    name: string;
    role: 'admin' | 'client';

    constructor() {
        this.email = '';
        this.name = '';
        this.role = 'client';
    }
}
