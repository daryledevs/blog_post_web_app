
const generateMockData = (changeArg: boolean, list: any[], callback: Function) => {
  return list.flatMap((u, i) => {
    let nextUser = list[i + 1];
    let nextUserId = nextUser ? nextUser.user_id : u.user_id;

    const args = changeArg ? [nextUserId, u.user_id] : [u.user_id, nextUserId];

    return callback(args[0], args[1]);
  });
};

export default generateMockData;