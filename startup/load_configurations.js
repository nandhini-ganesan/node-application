const config = require('config'); 

module.exports = function () {
    if(!config.get("DigitalSignatureKey")){
        throw new Error("FATAL ERROR - environment varible not set");
    }
}
