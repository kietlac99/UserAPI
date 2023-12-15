import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));

// const users = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));


//seed or import Data into DB
const importData = async() => {
    try {
        const builkOperations = users.map(user => ({
            updateOne: {
                filter: { email: user.email },
                update: { $set: user },
                upsert: true
            }
        }))
        await User.bulkWrite(builkOperations);
        console.log('Data seeded successfully....');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


console.log(process.argv);
export { importData }