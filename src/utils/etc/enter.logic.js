import { addEnterJob } from '../redis/bull/enter/add.enter.queue.js';

// message S_Enter {
//     PlayerInfo player = 1;      // 플레이어 정보 (추후 정의 예정)
// }
// message S_Spawn {
//     repeated PlayerInfo players = 1; // 스폰되는 플레이어 리스트 (추후 정의 예정)
// }

const enterLogic = async (socket, user) => {
  const job = await addEnterJob(socket, user);

  const result = await job.finished();

  if (!result.success) {
    console.error(`유저 ${user.id} 접속 실패.`);
  }
};

export default enterLogic;
