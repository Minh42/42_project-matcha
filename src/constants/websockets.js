export const messageTypes = [
    'joinRequested',
    'userJoined',
    'userLeft',
    'sendNotification',
    'showNotification',
    'requestMessages',
    'showMessages'
  ].reduce((accum, msg) => {
    accum[msg] = msg;
    return accum;
  }, {})