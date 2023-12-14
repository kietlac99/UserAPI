import { body } from 'express-validator'
import { User } from '../models/User.js'

const schema = [
    body('email')
        .isEmail()
        .withMessage('email must contain a valid email address')
        .custom((value) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-mail address already exists!')
                }
            })
        }),
    body('password').isLength({ min: 7 }).withMessage('password must be at least 7 characters long'),
]

export { schema as registerSchema }