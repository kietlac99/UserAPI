import express from 'express';
const adminRouter = express.Router();
import { adminController } from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { validateRequestSchema } from '../middleware/validate-request-schema.js';
import { registerSchema } from '../schema/register-schema.js';
import { upload } from '../middleware/file-upload.js'

adminRouter.get('/users', adminController.getUsers);
adminRouter.get('/users/me', auth.verifyToken, auth.isAdmin, adminController.getOneUser);
adminRouter.get('/auth', auth.verifyToken, adminController.Authentication);
adminRouter.get('/isAdmin', auth.isAdmin, adminController.isAdmin);
adminRouter.post(
    '/add-user',
    upload.single('image'),  
    registerSchema, 
    validateRequestSchema,   
    adminController.addUser
    );
adminRouter.post('/login', adminController.adminLogin);
adminRouter.post('/logout', auth.verifyToken, adminController.adminLogout);
adminRouter.post('/logoutAll', auth.verifyToken, adminController.admindLogoutAll)

export { adminRouter } 
