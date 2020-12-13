import { DataStore } from 'notarealdb';

const store = new DataStore('./data');

export const findWhere = (entity, cb) => {
  const registers = entity.list();

  return registers.filter(cb);
};

export default store;
