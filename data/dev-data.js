import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../db/db.js';
import { User } from '../models/User.js';

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));

// const users = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));

//seed or import Data into DB
const importData = async() => {
    try {
        await User.create(users);
        console.log('Data seeded successfully....');
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

//delete Data in DB
const deleteData = async() => {
    try {
        await User.deleteMany();
        console.log('Data successfully deleted');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);