import joi from 'joi';

class JoiUtils {
  async validateRegister(payload) {
    const joiSchema = joi.object({
      account: joi.string().min(4).max(12).required().messages({
        'string.base': 'ID를 제대로 입력해주세요.',
        'string.min': `ID의 길이는 최소 {#limit}자 이상입니다.`,
        'string.max': `ID의 길이는 최대 {#limit}자 이하입니다.`,
        'any.required': 'ID를 입력해주세요.',
      }),
      password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required().messages({
        'string.base': '비밀번호를 제대로 입력해주세요.',
        'any.required': '비밀번호를 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(payload);

    return validation;
  }
}

const joiUtils = new JoiUtils();
export default joiUtils;