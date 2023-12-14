import express from 'express';
const adminRouter = express.Router();
import { adminController } from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { validateRequestSchema } from '../middleware/validate-request-schema.js';
import { registerSchema } from '../schema/register-schema.js';

adminRouter.get('/users', adminController.getUsers);
adminRouter.get('/users/me', auth, adminController.getOneUser);
adminRouter.get('/auth', auth, adminController.Authentication);
adminRouter.post('/add-user',  registerSchema, validateRequestSchema, adminController.addUser);
adminRouter.post('/login', adminController.adminLogin);
adminRouter.post('/logout', auth, adminController.adminLogout);
adminRouter.post('/logoutAll', auth, adminController.admindLogoutAll)

export { adminRouter } 
