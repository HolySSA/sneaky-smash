import BaseManager from './base.manager.js';
import logger from '../../utils/logger.js';

class LatencyManager extends BaseManager {
  constructor() {
    super();

    this.intervals = new Map();
  }

  addUser(userId, callback, timestamp) {
    if (this.intervals.has(userId)) {
      logger.error('중복 인터벌 존재.');
    }

    this.intervals.set(userId, setInterval(callback, timestamp));
  }

  removeUser(userId) {
    if (!this.intervals.has(userId)) return;

    clearInterval(this.intervals.get(userId));
  }

  clearAll() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });

    this.intervals.clear();
  }
}

export default LatencyManager;
