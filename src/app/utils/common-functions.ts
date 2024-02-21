import { v4 as uuidv4, v4 } from 'uuid';

export const generateUUID = (): string => {
  return v4();
};
