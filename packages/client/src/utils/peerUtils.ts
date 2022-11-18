import Peer from 'simple-peer';

export const setPeer = (initiator: boolean, stream: MediaStream, eventHandlers: {
  onSignal?: (signal: Peer.SignalData) => void;
  onStream?: (stream: MediaStream) => void;
  onClose?: () => void;
}) => {
  const peer = new Peer({ initiator, trickle: false, stream });
  eventHandlers.onSignal && peer.on('signal', eventHandlers.onSignal);
  eventHandlers.onStream && peer.on('stream', eventHandlers.onStream);
  eventHandlers.onClose && peer.on('close', eventHandlers.onClose);
  return peer;
}