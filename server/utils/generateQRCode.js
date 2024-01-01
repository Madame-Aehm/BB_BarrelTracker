import QRCode from 'qrcode';

export const generateQRCode = (barrelID) => {
  let result = null;
  QRCode.toString(barrelID, {
    errorCorrectionLevel: 'H',
    type: 'svg'
  }, function(err, data) {
    if (err) {
      console.log(err);
    }
    result = data
  });
  return result
}