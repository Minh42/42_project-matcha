export const messageTypes = [
    'joinRequested',
    'userJoined',
    'userLeft',
    'sendNotification',
    'showNotification',
    'requestMessages',
    'sendMessages',
    'joinRoom',
    'sendDirectMessage',
    'showDirectMessage'
  ].reduce((accum, msg) => {
    accum[msg] = msg;
    return accum;
  }, {})