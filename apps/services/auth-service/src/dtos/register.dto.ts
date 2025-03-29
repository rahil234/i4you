export class RegisterRequestDTO {
    constructor(
        public name: string,
        public email: string,
        public password: string
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        if (!this.isValid()) {

            throw new Error("Invalid register data");
        }
    }

    isValid() {
        return Boolean(this.name) && Boolean(this.email) && Boolean(this.password) && this.email.includes("@");
    }
}
