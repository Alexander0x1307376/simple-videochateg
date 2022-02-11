import { getCurrentTime } from "./time"



export const log = (...params: any) => {
  const time = getCurrentTime();
  console.log(`${time}: `, ...params);
}