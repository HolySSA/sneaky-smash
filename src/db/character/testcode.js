import { addCharacter } from "./character.db.js";

(async () => {
    try {
        const newCharacter = await addCharacter({
            userId: 1,
            nickname: 'testCharacter2',
            class: 'Warrior',
            gold: 0,
        });
        console.log('캐릭터가 성공적으로 만들어졌습니다!: ', newCharacter);
    } catch (error) {
        console.error('캐릭터 생성에 실패했습니다.: ', error.message);
    }
})();