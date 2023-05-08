export const mapTime = (timestamp: number | undefined) => {
  if (timestamp) {
    const days = new Date(timestamp * 24 * 1000).getDay();
    return days || days + 1;
  }
  return 1;
};
