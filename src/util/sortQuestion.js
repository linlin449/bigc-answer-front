export function sortQuestionByLevelId(level_id) {
  switch (level_id) {
    case 1:
      return "简单";
    case 2:
      return "中等";
    case 3:
      return "苦难";
  }
  return "未知";
}
export function sortQuestionByTypeId(level_id) {
  switch (level_id) {
    case 1:
      return "单选";
    case 2:
      return "多选";
    case 3:
      return "简答";
  }
  return "未知";
}
