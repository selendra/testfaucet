export default function History(val) {
  // Get the existing data
  const existing = localStorage.getItem(`account:${val.receiverAddress}`);

  // if existing data, update value
  if(existing) {
    const data = JSON.parse(existing);
    const lastTime = Number(data.time);
    const lastValue = Number(data.value);
    const newValue = Number(val.amount);

    if (((new Date()).getTime() - lastTime) > 1000 * 60 * 60 * 24) {
      // if > 24h add new value
      const Object = {
        address: val.receiverAddress,
        value: val.amount,
        time: (new Date()).getTime()
      }

      window.localStorage.setItem(`account:${val.receiverAddress}`, JSON.stringify(Object));
    } else {
      // if < 24h modify old value
      const Object = {
        address: val.receiverAddress,
        value: newValue + lastValue,
        time: lastTime
      }

      window.localStorage.setItem(`account:${val.receiverAddress}`, JSON.stringify(Object));
    }
  } else {
    // if !existing data, add new data
    const Object = {
      address: val.receiverAddress,
      value: val.amount,
      time: (new Date()).getTime()
    }
    
    window.localStorage.setItem(`account:${val.receiverAddress}`, JSON.stringify(Object));
  }
}