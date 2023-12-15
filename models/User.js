import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'A name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'A email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        minLength: 7,
    },
    role: {
        type: String,
        required: [true, 'A role is required'],
    },
    image: {
        type: String,
    },
    tokens: [{
        token: {
            type: String,
        }
    }]
}, {collection: 'user', timestamps: true});

userSchema.pre('save', async function(next){
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const maxAge = 3 * 24 * 60 * 60;
userSchema.methods.generateAuthToken = async function(expiresIn) {
    const user = this
    const token = jwt.sign({_id: user.id}, process.env.JWT_KEY, { expiresIn: expiresIn})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findbyCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    
    if (!user) {
        return user
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch){
        throw new Error()
    }
    return user
}

const User = mongoose.model('User', userSchema);




export { User }