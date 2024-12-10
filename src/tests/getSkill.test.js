import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
await import('./register.test.js');
await import('./login.test.js');
const { PACKET_ID } = configs;

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();

// 스킬 요청 처리 함수
const requestSkill = async () => {
  return new Promise((resolve, reject) => {
    client.addHandler(PACKET_ID.S_GetSkill, async ({ payload }) => {
      try {
        console.log('Skill Response:', payload);
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });

    // 스킬 요청 메시지 전송
    client.sendMessage(PACKET_ID.C_GetSkill, {
      skillId: 100,
      itemInstanceId: 1,
    });
  });
};

// 실행
try {
  console.log('Requesting skill...');
  const skillResponse = await requestSkill();
  console.log('Skill Response:', skillResponse);
} catch (error) {
  console.error('Error during process:', error);
}
