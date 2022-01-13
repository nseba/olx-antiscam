const axios = require('axios');
const url = "" // "https://olx.colecteaza-bani.com/card/XXXXXX?"; <- fill in the URL they are trying to scam you with (should have some numbers instead of the XXXXX)

function checkLuhn(cardNo) {
    let s = 0;
    let doubleDigit = false;
    for (let i = cardNo.length - 1; i >= 0; i--) {
        let digit = +cardNo[i];
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        s += digit;
        doubleDigit = !doubleDigit;
    }
    return s % 10 === 0;
}

(async () => {

    const promises = [];

    for (let i = 0; i < 10000; ++i) {

        let cardNumber;

        do {
            cardNumber = "";

            for (let cn = 0; cn < 16; ++cn) {
                if (cn > 0 && (cn % 4) === 0) cardNumber += " ";
                cardNumber = cardNumber + Math.round(((Math.random() * 1000) % 9)).toString(10)
            }
        } while (checkLuhn(cardNumber));

        let cardYear = Math.floor((Math.random() * 1000) % 5 + 2028);

        let cardMonth = Math.floor((Math.random() * 1000) % 12) + 1;
        if (cardMonth < 10) cardMonth = "0" + cardMonth;

        let cardCvv = "";

        for (let cn = 0; cn < 3; ++cn) {
            cardCvv = cardCvv + Math.floor(((Math.random() * 1000) % 10)).toString(10)
        }

        let cardBalance = Number.parseInt("" + Math.floor((Math.random() * 1000))) + 423;

        // promises.push(new Promise(resolve => {
        //     console.log({
        //         cardNumber: cardNumber,
        //         cardMonth,
        //         cardYear,
        //         cardCvv,
        //         cardBalance,
        //     })
        // }));

        promises.push(axios.post(url, {
            cardNumber,
            cardMonth,
            cardYear,
            cardCvv,
            cardBalance,
        }).catch(eror => {
            console.error(eror);
        }));


    }
    await Promise.all(promises);
})();