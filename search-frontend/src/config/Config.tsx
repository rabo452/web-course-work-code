const Config = {
    get MOVIE_HOST(): string {
        return "localhost/movie"
    },
    get AUTH_SERVICE_HOST(): string {
        return "localhost/auth"
    }
}

export { Config }