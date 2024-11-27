import { enterQueue } from '../queues.js';

const addEnterJob = async (socket, user) => {
  // job 반환 => finished() 메서드 사용 가능
  return await enterQueue.add(
    { socketId: socket.id, user },
    {
      attempts: 3, // 재시도 횟수
      timeout: 5000, // 타임아웃
    },
  );
};

export { addEnterJob };
