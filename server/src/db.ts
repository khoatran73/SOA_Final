import { connect } from 'mongoose';
import log from './logger';

export const connectDatabase = async (dbUrl: string | undefined) => {
    if (!dbUrl) {
        log.error('Connection string was undefined!!');
        return;
    } else {
        await connect(dbUrl)
            .then(() => log.info('Connect to MongoDB successfully'))
            .catch(err => log.error('Connect to MongoDB failed: ', err));
    }
};

module.exports = { connectDatabase };
