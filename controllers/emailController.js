
function getPrecent(prev, curr) {
    return Math.round((prev.products[0].priceAfterDiscount - curr.products[0].priceAfterDiscount) / prev.products[0].priceAfterDiscount * 1000) / 10
}

function getTableRows(prev, curr) {
    let rz = "";
    for (let i = 0; i < Math.min(prev.products.length, curr.products.length); i++) {
        const diff = (prev.products[i].priceAfterDiscount - curr.products[i].priceAfterDiscount) * 100
        rz += `
        <tr>
            <td style="padding: 5px;border: 1px solid black; border-collapse: collapse;">${prev.products[i].name}</td>
            <td style="text-align: right;padding: 5px;border: 1px solid black; border-collapse: collapse;">${prev.products[i].priceAfterDiscount}</td>
            <td style="text-align: right;padding: 5px;border: 1px solid black; border-collapse: collapse;">${curr.products[i].priceAfterDiscount}</td>
            <td style="text-align: right;padding: 5px;border: 1px solid black; border-collapse: collapse; color: ${diff < 0 ? "red" : diff === 0 ? "black" : "green"};">${diff}</td>
        </tr > `
    }
    return rz;
}

export function getFormattedText(prev, curr) {
    return `Diesel prices are down ${ getPrecent(prev, curr) } % -> ${ (prev.products[0].priceAfterDiscount - curr.products[0].priceAfterDiscount) * 100 } ct.From ${ prev.products[0].priceAfterDiscount } -> ${ curr.products[0].priceAfterDiscount } `
}
export function getFormattedHTML(prev, curr) {
    return `
        <p>Diesel prices are down <span style="color:green;">${getPrecent(prev, curr)} %</span> -> <span style="color:green;">${(prev.products[0].priceAfterDiscount - curr.products[0].priceAfterDiscount) * 100}</span> ct</p><p>From ${prev.products[0].priceAfterDiscount} -> ${curr.products[0].priceAfterDiscount}</p>
        <table style="border: 1px solid black; border-collapse: collapse;">
            <thead>
                <th style="padding: 5px;border: 1px solid black; border-collapse: collapse;">Product</th>
                <th style="padding: 5px;border: 1px solid black; border-collapse: collapse;">Before</th>
                <th style="padding: 5px;border: 1px solid black; border-collapse: collapse;">Now</th>
                <th style="padding: 5px;border: 1px solid black; border-collapse: collapse;">Diff</th>
            </thead>
            <tbody>
                ${getTableRows(prev, curr)}
            </tbody>
        </table>`
}