import service from '../util/service'

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