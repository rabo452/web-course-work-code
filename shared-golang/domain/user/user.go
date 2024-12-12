package user

type User struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"-"`
	Role     string `json:"role"`
}
