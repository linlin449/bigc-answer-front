import service from '../util/service'
import qs from 'qs'
/**
 * 判断某题是否被学生收藏
 * @param {Number} questionId 问题ID
 * @param {String} username 学生username
 */
export const isQuestionFavorite = (questionId, username) => {
    return service.get(`/api/favorite/isfavorite/${questionId}/username/${username}`)
}

/**
 * 添加题目到收藏夹
 * @param {Number} questionId 问题ID
 * @param {String} username 学生username
 * @returns 
 */
export const addFavoriteQuestion = (questionId, username) => {
    return service.get(`/api/favorite/add/${questionId}/username/${username}`)
}

/**
 * 删除收藏夹的题目
 * @param {Number} questionId 问题ID
 * @param {String} username 学生username
 * @returns 
 */
export const deleteFavoriteQuestion = (questionId, username) => {
    return service.get(`/api/favorite/delete/${questionId}/username/${username}`)
}

/**
 * 分页获取收藏题目列表
 * @param {Number} page 页码 
 * @param {String} username 学生username
 * @returns 
 */
export const getFavoriteList = (page, username) => {
    return service.get(`/api/favorite/list/${page}/username/${username}`)
}

/**
 * 根据问题idList获取问题List
 * @param {Number[]} idList 
 */
export const getQuestionListByIds = (idList) => {
    return service.get(`/api/question/ids?${qs.stringify({ questionIds: idList }, { arrayFormat: "comma", encode: false })}`)
}

/**
 * 根据问题ID获取问题详细
 * @param {Number} questionId 问题ID
 */
export const getQuestionById = (questionId) => {
    return service.get(`/api/question/${questionId}`)
}

/**
 * 根据问题ID获取选项详细
 * @param {Number} questionId 问题ID
 */
export const getOptionById = (questionId) => {
    return service.get(`/api/option/question/${questionId}`)
}

/**
 * 检查某学生对某问题的答题情况
 * @param {Number} questionId 问题ID
 * @param {String} username 学生username
 */
export const checkQuestionStatus = (questionId, username) => {
    return service.get(`/api/question/check/${questionId}/username/${username}`)
}

/**
 * 获取题目的正确答案
 * @param {Number} questionId 
 */
export const getRightAnswerById = (questionId) => {
    return service.get(`/api/rightanswer/question/${questionId}`)
}

/**
 * 修改收藏夹题目的笔记
 * @param {Number} questionId 问题ID
 * @param {String} username 学生username
 * @param {String} note 笔记文本
 */
export const updateQuestionNote = (questionId, username, note) => {
    return service.post(`/api/favorite/update/note/question/${questionId}/username/${username}`, { "note": note })
}

/**
 * 学生登陆
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} vercode 验证码
 * @param {String} verkey 验证码key
 */
export const studentLogin = (username, password, vercode, verkey) => {
    return service.post('/api/student/login', { username, password, vercode, verkey });
}

/**
 * 老师登陆
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} vercode 验证码
 * @param {String} verkey 验证码key
 */
export const teacherLogin = (username, password, vercode, verkey) => {
    return service.post('/api/teacher/login', { username, password, vercode, verkey });
}

/**
 * 管理员登陆
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} vercode 验证码
 * @param {String} verkey 验证码key
 */
export const adminLogin = (username, password, vercode, verkey) => {
    return service.post('/api/admin/login', { username, password, vercode, verkey });
}

/**
 * 获取验证码
 */
export const getCaptcha = () => {
    return service.get('/api/captcha/getcaptcha');
}
/**
 * 
 * @returns 
 */
export const getQuestionPageByChapterId = (page,id) => {
    return service.get(`/api/question/list/${page}/chapter/${id}`)
}

export const changePassword=(user,newPass,oldPass,repeatPass)=>{
    return service.post(`/api/${user}/password`,{newPass,oldPass,repeatPass})
}