import { ethers } from 'ethers';


//创建一个新的随机钱包
function createWalletByRandom() {
    return ethers.Wallet.createRandom();
}

//通过keystore建立钱包
function creatWalletByKeyStore(keyStore,passWord) {
    let json = JSON.stringify(keyStore);
    ethers.Wallet.fromEncryptedJson(json, passWord).then(function(wallet) {
        return wallet
        // "Address: 0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290"
    });
}

//助记词生成钱包
function creatWalletByMnemonic() {
    let rand = ethers.utils.randomBytes(16);
    // 生成助记词
    let mnemonic = ethers.utils.HDNode.entropyToMnemonic(rand);
    //console.log(mnemonic);
    let path = "m/44'/550'/0'/0/0";
    // 通过助记词创建钱包
    let wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    //console.log(wallet.address)
    //console.log(wallet.privateKey)
}

//导入助记词生成钱包
function loadWalletByMnemonic(mnemonic){

    // 检查助记词是否有效。
    if (!ethers.utils.HDNode.isValidMnemonic(mnemonic)) {
        return false;
    }
    let path = "m/44'/550'/0'/0/0";
    // 通过助记词创建钱包
    return ethers.Wallet.fromMnemonic(mnemonic, path);
}

//导出keyStore
function saveKeystroe(Wallet, pwd) {
  // console.log(Wallet)
    return Wallet.encrypt(pwd).then(function(json) {
      return json;
    });
}
//导入keyStore
function loadKeystroe(data, pwd, callback) {
  // let json = JSON.stringify(data);
  let password =pwd;

  ethers.Wallet.fromEncryptedJson(data, password).then(function(wallet) {
    // console.log(wallet);
    // "Address: 0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290"
    callback(wallet);

  }).catch(
    function (err) {
       console.log(err)
    }
  );
}

//私钥导入钱包
function createWalletByPrivateKey(privateKey) {
  try {
    return new ethers.Wallet(privateKey);
  }catch (err) {
  }

}
