export const decomposeFullname = (fullname: string) => {
  const [lastName, firstName, middleName] = fullname.split(" ");
  if (!(firstName && middleName && lastName)) throw "Invalid fullname";
  return { firstName, middleName, lastName };
};
