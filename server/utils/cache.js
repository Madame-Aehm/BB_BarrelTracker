import NodeCache from 'node-cache';

const customerCache = new NodeCache({ checkperiod: 0 });

export default customerCache;