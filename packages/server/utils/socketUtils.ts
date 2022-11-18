import { Server } from "socket.io"

export const checkIfSocketIsConnected = (io: Server, socketId: string): boolean => {
  return io.sockets.adapter.sids.has(socketId)
}