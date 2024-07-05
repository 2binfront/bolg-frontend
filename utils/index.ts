export const formatTime = (t: string, g: string = 'date'): string => {
  const date = new Date(t);
  let res = '';
  switch (g) {
    case 'date':
      res = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
      break;
    case 's':
      res = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      break;
    default:
      break;
  }
  return res;
};
