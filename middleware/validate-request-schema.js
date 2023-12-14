
import { validationResult } from 'express-validator';

async function validateRequestSchema( req, res, next) {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {           
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}

export { validateRequestSchema }