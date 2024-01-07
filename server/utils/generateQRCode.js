import QRCode from 'qrcode';

export const generateQRCode = (barrelID) => {
  let result = null;
  QRCode.toString(barrelID, {
    errorCorrectionLevel: 'H',
    type: 'png',
  }, function(err, data) {
    if (err) {
      console.log(err);
    }
    result = data
  });
  console.log(result);
  return result
}