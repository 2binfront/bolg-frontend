export const formatTime = (t: string, g: string = 'date'): string => {
  const date = new Date(t);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  const pad = (value: number) => String(value).padStart(2, '0');
  let res = '';
  switch (g) {
    case 'date':
      res = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
      break;
    case 's':
      res =
        date.getFullYear() +
        '.' +
        pad(date.getMonth() + 1) +
        '.' +
        pad(date.getDate()) +
        ' ' +
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes()) +
        ':' +
        pad(date.getSeconds());
      break;
    default:
      break;
  }
  return res;
};
