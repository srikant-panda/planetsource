import mongoose, { mongo } from "mongoose";



const userSchema = new mongoose.Schema({
    name: { type: String, minlength: 1, maxlength: 50, required: [true, "name is required"] },
    username: { type: String, minlength: 1, maxlength: 20, required: [true, "username is required"], unique: true, index: true },
    email: { type: String, minlength: 1, maxlength: 50, required: [true, "email is required"], unique: true, index: true },
    password: { type: String, minlength: 1, maxlength: 100, required: [true, "password is required"], select: false },
    avtar: { type: String, minlength: 1, maxlength: 50,default: null },

}, { timestamps: true })

userSchema.set("toJSON", {
    transform(doc, ret) {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model("user", userSchema);


export default User;