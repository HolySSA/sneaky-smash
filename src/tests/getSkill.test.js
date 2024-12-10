import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
import('./register.test.js');
const { PACKET_ID } = configs;

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();

// 로그인 처리 함수
const handleLogin = () => {
  return new Promise((resolve, reject) => {
    client.addHandler(PACKET_ID.S_Login, async ({ payload }) => {
      try {
        if (payload.success === true) {
          client.token = payload.token;
          client.expirationTime = payload.expirationTime;
        } else {
          client.token = undefined;
          client.expirationTime = 0;
        }
        resolve(payload); // 성공적으로 처리되면 resolve 호출
      } catch (error) {
        reject(error); // 에러 발생 시 reject 호출
      }
    });

    // 로그인 요청 메시지 전송
    client.sendMessage(PACKET_ID.C_Login, {
      account: testEnv.userName,
      password: testEnv.password,
    });
  });
};

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
  console.log('Logging in...');
  const loginResponse = await handleLogin();
  console.log('Login Response:', loginResponse);

  console.log('Requesting skill...');
  const skillResponse = await requestSkill();
  console.log('Skill Response:', skillResponse);
} catch (error) {
  console.error('Error during process:', error);
}
