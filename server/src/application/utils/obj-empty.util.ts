function isEmpty(obj:any){
  const data = JSON.parse(JSON.stringify(obj));
  const length = Object.keys(data).length;
  return !length ? true : false;
};

export default isEmpty;