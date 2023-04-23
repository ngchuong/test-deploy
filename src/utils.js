const addLeadingZeroToNumber = (number) => {
  return ("0" + number).slice(-2);
};

export const convertSecondsToTime = (totalSeconds) => {
  if (!Number(totalSeconds)) return null;

  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${addLeadingZeroToNumber(hours)}:${addLeadingZeroToNumber(
    minutes
  )}:${addLeadingZeroToNumber(seconds)}`;
};

export const convertTimeToSeconds = (hours = 0, minutes = 0, seconds = 0) => {
  return hours * 3600 + minutes * 60 + seconds;
};
