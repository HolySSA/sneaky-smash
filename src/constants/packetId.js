export const RESPONSE_SUCCESS_CODE = 0;

export const reverseMapping = {};

// 너무 많아서 일단 그냥 쓰기.
export const PACKET_ID = {
  C_Enter: 0,
  S_Enter: 1,
  S_Spawn: 2,
  S_Despawn: 3,
  C_Move: 4,
  S_Move: 5,
  C_Animation: 6,
  S_Animation: 7,
  C_Chat: 8,
  S_Chat: 9,
  S_EnterDungeon: 10,
  C_LeaveDungeon: 12,
  S_LeaveDungeon: 13,
  S_UpdatePlayerHp: 14,
  S_UpdatePlayerMp: 15,
  S_UpdateMonsterHp: 16,
  C_MonsterAction: 17,
  S_MonsterAction: 18,
  C_Register: 19,
  S_Register: 20,
  C_Login: 21,
  S_Login: 22,
  S_Inventory: 25,
  C_Inventory: 26,
  C_UseItem: 27,
  S_UseItem: 28,
  C_DropItem: 36,
  S_DropItem: 37,
  C_UseSkill: 42,
  S_UseSkill: 43,
  C_MonsterAttack: 44,
  S_MonsterAttack: 45,
  C_MonsterMove: 46,
  S_MonsterMove: 47,
  C_MonsterKill: 48,
  S_MonsterKill: 49,
  C_EnterStage: 50,
  S_EnterStage: 51,
  C_BossSpawn: 52,
  S_BossSpawn: 53,
  C_TargetPlayer: 54,
  S_TargetPlayer: 55,
  C_ActionBoss: 58,
  S_ActionBoss: 59,
  S_Phase: 60,
  C_Party: 61,
  S_Party: 62,
  C_PartyJoin: 63,
  S_PartyJoin: 64,
  C_PartyLeave: 65,
  S_PartyLeave: 66,
  C_MatchStart: 67,
};

export const createReverseMapping = () => {
  for (const [key, value] of Object.entries(PACKET_ID)) {
    reverseMapping[value] = key; // value를 key로, key를 value로 저장
  }
};
