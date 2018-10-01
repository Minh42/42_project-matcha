export const messageTypes = [
    'joinRequested',
    'userJoined',
    'userLeft',
    'sendNotification',
    'showNotification',
    'requestMessages',
    'sendMessages'
  ].reduce((accum, msg) => {
    accum[msg] = msg;
    return accum;
  }, {})