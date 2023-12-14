import { User } from '../models/User.js';

const adminController = {
    /**
     * @swagger
     * components:
     *  securitySchemes:
     *      BearerAuth:
     *          type: apiKey
     *          name: Authorization
     *          in: header          
     *          scheme: bearer
     *  schemas:
     *      User:
     *          type: object
     *          required:
     *              - userName
     *              - password
     *              - email
     *          properties:
     *              userName:
     *                  type: string
     *                  description: User name
     *              password:
     *                  type: string
     *                  description: user password
     *              email:
     *                  type: string
     *                  description: user email
     *          example:
     *              userName: kietlac
     *              password: 12345Lac
     *              email: kietlac@gmail.com
     */

    /**
     * @swagger
     * tags:
     *  name: Admin
     *  description: The products managing API
     */

    /**
     * @swagger
     * /admin/users:
     *  get:
     *      summary: Returns the list of all the users
     *      tags: [Admin]
     *      responses:
     *          200:
     *              description: The list of the users
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items:
     *                              $ref: '#components/schemas/User'
     */

    getUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json({ success: true, totalUser: users.length, users });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    /**
     * @swagger
     * /admin/users/me:
     *  get:
     *      summary: Returns user info
     *      tags: [Admin]
     *      responses:
     *          200:
     *              description: OK
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items:
     *                              $ref: '#components/schemas/User'
     */


    getOneUser: async(req, res) => {
        try{  
            res.send(req.user)
        } catch (error) {
            res.status(401).send({ error: 'Not authorized to access this resource' })
        }    
    },

    /**
     * @swagger
     * /admin/logout:
     *  post:
     *      summary: Admin logout
     *      tags: [Admin]
     *      responses:
     *          201:
     *              description: admin logged out
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#/components/schemas/User'
     *          500:
     *              description: Some server
     */
    adminLogout: async(req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter(token => {
                return token.token != req.token;
            });
            await req.user.save()
            res.json({message: 'Logged out'});
        } catch(error) {
            res.status(500).send(error.message);
        }
    },

    /**
     * @swagger
     * /admin/logoutAll:
     *  post:
     *      summary: Admin logout all the device
     *      tags: [Admin]
     *      responses:
     *          201:
     *              description: admin logged out all the device successfully
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#/components/schemas/User'
     *          500:
     *              description: Some server
     */

    admindLogoutAll: async(req, res) => {
        try {
            req.user.tokens.splice(0, req.user.tokens.length)
            await req.user.save()
            res.json({message: 'Log out all the device successfully'})
        } catch (error) {
            res.status(500).send(error.message)
        }
        
    },

    /**
     * @swagger
     * /admin/add-user:
     *  post:
     *      summary: Create a new user
     *      tags: [Admin]
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: '#/components/schemas/User'
     *      responses:
     *          201:
     *              description: The user was sucessfully created
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#/components/schemas/User'
     *          500:
     *              description: Some server
     */

    addUser: async (req, res) => {
        try{
            
            const user = new User(req.body);
            await user.save();
            res.status(201).json({ success: true, message: 'User added successfully', user, token});
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    Authentication: async(req, res) => {
        try{
            res.status(200).json({message: 'Access approve...'})
        } catch (error) {
            console.log(error.message)
        }
    },

    /**
     * @swagger
     * /admin/login:
     *  post:
     *      summary: Admin login
     *      tags: [Admin]
     *      parameters:
     *          - in: query
     *            name: email
     *            required: true
     *            description: email of the user
     *            schema:
     *              type: string
     *          - in: query
     *            name: password
     *            required: true
     *            description: password of the user
     *            schema:
     *              type: string
     *      responses:
     *          201:
     *              description: Login successfully
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#/components/schemas/User'
     *          400:
     *              description: Error
     */
    adminLogin: async(req, res) => {
        try {
            const email = req.query.email
            const password = req.query.password
            const user = await User.findbyCredentials(email, password)
            if (!user) {
                return res.status(401).send({error: 'Login failed! Check authentication credentials'})
            }
            const token = await user.generateAuthToken('300s')
            res.send({ user, token })
        } catch (error) {
            res.status(400).send(error)
        }
    }
}

export { adminController };