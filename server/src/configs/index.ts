import { v4 as uuidv4 } from 'uuid';

export const DefaultModelId =
    uuidv4() + '-' + new Date().getTime() + '-' + (Math.random() * 10000000).toString().substring(0, 7);
