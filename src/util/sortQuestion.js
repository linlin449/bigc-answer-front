function Level(level_id) {
  switch (level_id) {
    case 1:
      return "简单";
    case 2:
      return "中等";
    case 3:
      return "困难";
  }
  return "未知";
}
function Type(level_id) {
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
let arr = [];
function sortByTypeID(data, typeid) {
  let question = {
    id: "",
    title: "",
    describe: "",
    score: "",
    level: "",
    type: "",
  };
  data.forEach((e) => {
    if (e.typeId === typeid) {
      question={}
      question.id = e.id;
      question.title = e.question;
      question.describe = e.describe;
      question.score = e.score;
      question.level = Level(e.levelId);
      question.type = Type(e.typeId);
      arr.push(question);
    }
  });
}
export default function sortByType(data) {
  arr=[]
  for(var i=1;i<=3;i++){
    sortByTypeID(data, i)
  }
  return arr;
}
