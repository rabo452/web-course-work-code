const UserStorage = {
    get JWT_TOKEN(): string {
        const token = localStorage.getItem("JWT_TOKEN");
        if (!token) {
            return "";
        }
        return token;
    },
    get USERNAME(): string {
        const username = localStorage.getItem("USERNAME");
        if (!username) {
            return "";
        }
        return username;
    },
    set JWT_TOKEN(jwt: string) {
        localStorage.setItem("JWT_TOKEN", jwt);
    },
    set USERNAME(username: string) {
        localStorage.setItem("USERNAME", username);
    },

    clear: () => localStorage.clear(),
}

export default UserStorage
