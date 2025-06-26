import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"


const userSchema = new mongoose.Schema({
    fullName:{
        type : String,
        required : [true,"Name Required!"],
    },

    email: {
        type: String,
        required: [true, "Email Required!"],
      },
    phone :{
        type : String,
        required : [true,"Phone Number Required"],
    },

    aboutMe: {
        type: String,
        required:[true, "About Me Field is Required"],
    },

    password: {
        type : String,
        required:[true, "Password is required!"],
        minLength: [8, "Password must contain atleast 8 Characters"],
        select : false, //Pura user ko get ker langa but cant get password if value is false
    },

    avatar: {
        public_id:{
            type: String,
            required: true,
        },
        url: {
            type: String,
            required : true,
        },
    },

    resume: {
        public_id:{
            type: String,
            required: true,
        },
        url: {
            type: String,
            required : true,
        },
    },
     
    portfolioURL:{
        type: String,
        required: [true,"Portfolio is required"],

    },

    githubURL: String,
    instagramURL : String,
    linkedInURL: String,

    resetPasswordToken : String,
    resetPasswordExpire: Date

});

//From users , only one user can register i.e. myself
//if registered passsword must be stored in # form

//For hasing pwd
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        //If pwd not updated => remain as it is 
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);   
});

//Actual password 123456 when given by user
// Pwd in db : aslkjdlieurireoijrij => #
//Map # with original for user => 123456

//For Comparinf pwd with Hashed pwd
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//Genereting JsoN web Token
userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

//Generating Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    //Hashing and Adding Reset Password Token To UserSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    //Setting Reset Password Token Expiry Time (till 15 min)
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };
  


export const User = mongoose.model("User", userSchema);
