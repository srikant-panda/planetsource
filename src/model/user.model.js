import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name: { type: String, minlength: 1, maxlength: 50, required: [true, "name is required"],trim:true },
    email: { type: String, minlength: 1, maxlength: 50, required: [true, "email is required"], unique: true },
    password: { type: String, minlength: 1, maxlength: 100, required: [true, "password is required"], select: false },
    avatar: { type: String, minlength: 1, maxlength: 500,default: null },

}, { timestamps: true })

userSchema.set("toJSON", {
    transform(doc, ret) {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);


export default User;