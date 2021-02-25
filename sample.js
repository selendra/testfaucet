// Get the existing data
const existing = localStorage.getItem(`account:${val.receiverAddress}`);

// if existing data, update value
if(existing) {
  const data = JSON.parse(existing);
  const lastTime = data.time;

  if (((new Date()).getTime() - lastTime) > 1000 * 60 * 60 * 24) {
    window.localStorage.removeItem(`account:${val.receiverAddress}`);
  }

  const Object = {
    address: val.receiverAddress,
    value: val.amount,
    time: (new Date()).getTime()
  }

  window.localStorage.setItem(`account:${val.receiverAddress}`, JSON.stringify(Object));
} else {
  // if !existing data, add new data
  const Object = {
    address: val.receiverAddress,
    value: val.amount,
    time: (new Date()).getTime()
  }
  
  window.localStorage.setItem(`account:${val.receiverAddress}`, JSON.stringify(Object));
}