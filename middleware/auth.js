import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

var role

const verifyToken = async(req, res, next) => {
    
    try {
        const token = req.header('Authorization')
    
        const data = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({_id: data._id, 'tokens.token': token})
        if(!user) {
            throw new Error()
        } 
        req.user = user
        req.token = token
        role = user.role
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}

const isAdmin = async(req, res, next) => {
    try {
        if(role != 'admin') {
            throw new Error()
        }
        next()
        
    } catch (error) {
        res.status(403).send({message: 'Require Admin Role!'});
    }
}

const auth = {
    verifyToken,
    isAdmin
}

export { auth }