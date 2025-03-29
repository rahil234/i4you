export class LoginRequestDTO {
    constructor(
        public email: string,
        public password: string
    ) {}

    isValid(): boolean {
        return Boolean(this.email) && Boolean(this.password) && this.email.includes("@");
    }
}

export class LoginResponseDTO {
    constructor(
        public accessToken: string,
        public refreshToken: string,
        public user: {
            id: string;
            name: string;
            email: string;
        }
    ) {}

    toString(): string {
        return `Token: ${this.accessToken}, User: ${this.user.name} (${this.user.email})`;
    }
}
