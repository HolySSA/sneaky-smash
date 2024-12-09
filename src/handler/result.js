import { reverseMapping } from '../configs/constants/packetId.js';
/**
 * @param {Object} payload - 결과 데이터를 담고 있는 객체
 * @param {string} packetType - 응답 유형
 * @param {TargetInfo} [targetUUIDs=[]] - 전송하려는 대상 UUID. 미등록시 응답자에게만 보냅니다.
 */
class Result {
  constructor(payload, packetType, targetUUIDs = []) {
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      throw new Error('payload must be an object');
    }

    if (Array.isArray(targetUUIDs) == false) {
      throw new Error(`targetUUIDs muest be an array : ${JSON.stringify(targetUUIDs)}`);
    }

    if (!reverseMapping[packetType]) {
      throw new Error(`responseType is unknown : ${packetType}`);
    }

    this.responseType = packetType;
    this.payload = payload;
  }
}

export default Result;
