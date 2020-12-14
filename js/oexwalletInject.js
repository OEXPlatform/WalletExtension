
const OEXINJSECTJS = {
  // connect :() =>{
  //   window.postMessage({type:"connect", msg: transactionData}, 'http://127.0.0.1:8848/oexwebtest');
  // },
  transaction :(transactionData) =>{
    window.postMessage({type: "transaction",msg:transactionData}, '*');
  }
}

