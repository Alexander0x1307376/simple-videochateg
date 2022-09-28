import { Server } from "socket.io"

export const checkIsSocketIsConnected = (io: Server, socketId: string): boolean => {
  return io.sockets.adapter.sids.has(socketId)
}