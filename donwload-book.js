const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

function range(start, end) {
    return Array.from(Array(end - start + 1), (elem, index) => start + index);
}

function splitBySize(arr, chunkSize) {
    const chunks = arr.length / chunkSize;
    const isEven = (arr.length % chunkSize) === 0;
    const addNumber = isEven ? 0 : 1;
    const chunksAmount = Math.floor(chunks);
    const result = [];

    for (let i = 0; i < chunksAmount + addNumber; i++) {
        result.push(arr.slice(i * chunkSize, i * chunkSize + chunkSize));
    }

    return result;
}

const getFileNumber = (number) => {
    const string = `${number}`;
    const numberOfZeros = 3 - string.length;
    const result = Array.from(Array(numberOfZeros)).map(() => "0");
    result.push(string);

    return result.join("");
};
(async () => {
    const bookName = "rigi";
    const root = "books";
    try {
        await fs.access(path.join(__dirname, root, bookName));
    } catch (e) {
        await fs.mkdir(path.join(__dirname, root, bookName));
    }

    try {
        await Promise.all(range(3, 38).map(async (item) => {
                try {
                    const fileNumber = getFileNumber(item);
                    const fileName = `mathesis_rigi2_${fileNumber}.jpg`;
                    const result = await axios.get(`https://www.mathesis.ru/books/rigi22/${fileName}`, {responseType: "arraybuffer"});
                    const data = result.data;

                    await fs.writeFile(path.join(__dirname, root, bookName, fileName), data)
                    console.log(`${fileName} is loaded!`);
                } catch (e) {
                    console.log("Error while loading", e)
                }
            })
        );
        // for await (const chunk of array) {
        //     await Promise.all(chunk.map(async (item) => {
        //             try {
        //                 const fileNumber = getFileNumber(item);
        //                 const fileName = `mathesis_lorentz2_${fileNumber}.jpg`;
        //                 const result = await axios.get(`https://www.mathesis.ru/books/lorentz21/${fileName}`, {responseType: "arraybuffer"});
        //                 const data = result.data;
        //
        //                 await fs.writeFile(path.join(__dirname, root, bookName, fileName), data)
        //                 console.log(`${fileName} is loaded!`);
        //             } catch (e) {
        //                 console.log("Error while loading", e)
        //             }
        //         })
        //     );
        // }
        console.log("Done");
    } catch (e) {
        console.log(e);
    }
})()