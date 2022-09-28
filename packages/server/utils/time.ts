
export const getCurrentTime = () => {
  const time = new Date();

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const milliseconds = time.getMilliseconds().toString().padStart(3, "0");

  const currentTime = `${hours}:${minutes}:${seconds}:${milliseconds}` 
  
  return currentTime;
}
