import CryptoJS from "crypto-js";

const encryptData = (data: string) => {
  let mainkey = process.env.NEXT_PUBLIC_REQUEST_TO_RESPONSE_MAINEY;
  var returnData = CryptoJS.AES.encrypt(data, mainkey).toString();
  return returnData;
};

const decryptJSData = (encryptedValue: string) => {
  let mainkey = process.env.NEXT_PUBLIC_REQUEST_TO_RESPONSE_MAINEY;
  const decryptedWordArray = CryptoJS.AES.decrypt(encryptedValue, mainkey);
  const decrypted = decryptedWordArray.toString(CryptoJS.enc.Utf8);
  const decryptData = JSON.parse(decrypted);
  return decryptData;
};

export const encryptForBackend = (data: string) => {
  const FRONTEND_KEY = CryptoJS.enc.Base64.parse(
    process.env.NEXT_PUBLIC_RESPONSE_TO_RESQUEST_MAINEY!
  );
  const encrypted = CryptoJS.AES.encrypt(data, FRONTEND_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return encrypted;
};

export const decryptFromFrontend = (encrypted: string) => {
  const BACKEND_KEY = CryptoJS.enc.Base64.parse(
    process.env.NEXT_PUBLIC_RESPONSE_TO_RESQUEST_MAINEY!
  );
  const decrypted = CryptoJS.AES.decrypt(encrypted, BACKEND_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);

  return JSON.parse(decrypted);
};

const encryptDecryptUtil = {
  encryptData,
  decryptJSData,
  encryptForBackend,
  decryptFromFrontend,
};

export default encryptDecryptUtil;
