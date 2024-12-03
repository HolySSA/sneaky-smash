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
  S_LevelUp: 16,
  C_AttackedNexus: 17,
  S_AttackedNexus: 18,
  C_HitPlayer: 19,
  S_HitPlayer: 20,
  C_HitMonster: 21,
  S_HitMonster: 22,
  S_PlayerStatus: 23,
  C_Register: 24,
  S_Register: 25,
  C_Login: 26,
  S_Login: 27,
  C_UseItem: 28,
  S_UseItem: 29,
  C_GetSkill: 30,
  S_GetSkill: 31,
  C_ShootProjectile: 32,
  S_ShootProjectile: 33,
  C_UseSkill: 34,
  S_UseSkill: 35,
  S_MonsterAttack: 36,
  S_MonsterMove: 37,
  S_MonsterKill: 38,
  S_MonsterSpawn: 39,
  C_Party: 41,
  S_Party: 42,
  C_PartyJoin: 43,
  S_PartyJoin: 44,
  C_PartyLeave: 45,
  S_PartyLeave: 46,
  C_MatchStart: 47,
  C_GetNavPath: 99,
  S_GetNavPath: 100,
};

export const createReverseMapping = () => {
  for (const [key, value] of Object.entries(PACKET_ID)) {
    reverseMapping[value] = key; // value를 key로, key를 value로 저장
  }
};
