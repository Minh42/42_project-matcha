export const messageTypes = [
    'joinRequested',
    'userJoined',
    'userLeft',
    'sendNotification',
    'showNotification'
  ].reduce((accum, msg) => {
    accum[msg] = msg;
    return accum;
  }, {})