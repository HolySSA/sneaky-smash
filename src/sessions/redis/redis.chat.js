import { getRedis, getSubscriberRedis } from '../../utils/redis/redisManager.js';
import configs from '../../configs/configs.js';
import { getAllUserUUIDByTown } from '../town.session.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

const TOWN_CHAT_CHANNEL_KEY = 'new_town_chat';

const { PACKET_ID } = configs;
export const subscribeChatChannels = async () => {
  const redis = await getSubscriberRedis();
  await redis.subscribe(TOWN_CHAT_CHANNEL_KEY);

  redis.on('message', (channel, message) => {
    if (channel === TOWN_CHAT_CHANNEL_KEY) {
      console.log(`${TOWN_CHAT_CHANNEL_KEY} => ${message}`);
      const AllUUID = getAllUserUUIDByTown();
      const info = message.split(',');
      createNotificationPacket(
        PACKET_ID.S_Chat,
        { playerId: info[3], nickname: info[1], chatMsg: info[2], serverIndex: info[0] },
        AllUUID,
      );
    }
  });
};

export const pubChat = async (userId, nickname, message) => {
  const redis = await getRedis();
  await redis.publish(
    TOWN_CHAT_CHANNEL_KEY,
    `${configs.ServerIndex},${nickname},${message},${userId}`,
  );
};
