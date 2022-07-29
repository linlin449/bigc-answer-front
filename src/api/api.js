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
 * @returns 
 */
export const getRightAnswerById = (questionId) => {
    return service.get(`/api/rightanswer/question/${questionId}`)
}