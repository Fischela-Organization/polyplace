export const shortenName = (name: string) => {
  if (name){
    return `${name.slice(0, 18)}`
  }
  return ''
};
