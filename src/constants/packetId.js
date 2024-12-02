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
  C_LeaveDungeon: 11,
  S_LeaveDungeon: 12,
  S_UpdatePlayerHp: 13,
  S_UpdateMonsterHp: 14,
  S_UpdateNexusHp: 15,
  C_MonsterAction: 16,
  S_MonsterAction: 17,
  S_LevelUp: 18,
  C_DestroyNexus: 19,
  S_DestroyNexus: 20,
  C_PlayerAttack: 21,
  S_PlayerAttack: 22,
  C_Register: 23,
  S_Register: 25,
  C_Login: 25,
  S_Login: 26,
  C_UseItem: 27,
  S_UseItem: 28,
  C_EquipSkill: 29,
  S_EquipSkill: 30,
  C_UseSkill: 31,
  S_UseSkill: 32,
  C_MonsterAttack: 33,
  S_MonsterAttack: 34,
  C_MonsterMove: 35,
  S_MonsterMove: 36,
  C_MonsterKill: 37,
  S_MonsterKill: 38,
  C_MonsterSpawn: 39,
  S_MonsterSpawn: 40,
  C_Party: 41,
  S_Party: 42,
  C_PartyJoin: 43,
  S_PartyJoin: 44,
  C_PartyLeave: 45,
  S_PartyLeave: 46,
  C_MatchStart: 47,
};

export const createReverseMapping = () => {
  for (const [key, value] of Object.entries(PACKET_ID)) {
    reverseMapping[value] = key; // value를 key로, key를 value로 저장
  }
};
