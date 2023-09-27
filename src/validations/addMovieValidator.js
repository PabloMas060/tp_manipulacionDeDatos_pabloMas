const {check, body} = require('express-validator');

module.exports = [
    check('title')
        .notEmpty().withMessage('Éste campo es obligatorio'),
    check('rating')
        .notEmpty().withMessage('Éste campo es obligatorio').bail()
        .isDecimal().withMessage('El rating debe ser un número'),
    check('awards')
        .notEmpty().withMessage('Éste campo es obligatorio').bail()
        .isNumeric().withMessage('Debe ser un número entero'),
    body('release_date')
        .custom((value, {req}) => {
            if(req.body.release_date) {
                return true
            }
            return false
        }).withMessage('Éste campo es obligatorio').bail()
        .isISO8601().withMessage('Formato no válido'),
    check('length')
        .isNumeric().withMessage('Éste campo sólo admite números')
]