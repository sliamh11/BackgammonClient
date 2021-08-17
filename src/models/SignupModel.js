import UserModel from "./UserModel";

class SignupModel extends UserModel{
    constructor(username, password, passwordValidation){
        super(username,password);
        this.passwordValidation = passwordValidation;
    }
}

export default SignupModel;