export const parseBool = (value: string) => {
  if (value === undefined) {
    return true;
  }

  const normalized = value.toString().toLowerCase();

  return !['false', '0', 'no'].includes(normalized);
};
