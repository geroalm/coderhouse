export class UserDto {
    constructor (user){
        (this.fullName =  `${user.first_name} ${user.last_name}`).toLocaleUpperCase();
        this.user_name = user.user_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
    }
}