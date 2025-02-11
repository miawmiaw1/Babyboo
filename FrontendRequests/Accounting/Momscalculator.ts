export type ProductTaxResult = {
    købspris_ex_moms: number;
    salgpris_ex_moms: number;
    indgående_moms: number;
    udgående_moms: number;
};

export function calculateProductTaxes(price: number, profitMargin: number, inklMoms: boolean): ProductTaxResult {
    const momsRate = 0.25;
    let købspris_ex_moms: number;
    let salgpris_ex_moms: number;
    let indgående_moms: number = 0;
    let udgående_moms: number;

    if (inklMoms) {
        købspris_ex_moms = price / (1 + momsRate);
        indgående_moms = price - købspris_ex_moms;
    } else {
        købspris_ex_moms = price;
    }

    salgpris_ex_moms = købspris_ex_moms * (1 + profitMargin / 100);
    udgående_moms = salgpris_ex_moms * momsRate;

    return {
        købspris_ex_moms,
        salgpris_ex_moms,
        indgående_moms,
        udgående_moms,
    };
}

export function AddProfitMargin(price: number, profitmargin: number) {
    return Math.round(price * (1 + profitmargin / 100));
}

console.log(calculateProductTaxes(10, 20, true))
