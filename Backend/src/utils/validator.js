const validatorLib = require('validator');

const validator = (data)=>{

    const mandatoryField = ['firstName','emailId','password'];

    const isAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k))

    if(!isAllowed)
        throw new Error('Some Fields Are Missing!')

    if(!validatorLib.isEmail(data.emailId))
        throw new Error('Invalid Email!')

    if(!validatorLib.isStrongPassword(data.password))
        throw new Error('Weak Password!')

}

module.exports = validator;