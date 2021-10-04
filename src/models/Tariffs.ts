export type TariffsContent =
    {
        data: Array<Tariffs>;
    }


export type Tariffs =
    {
        TariffName: string,
        AnnualCosts: number
    }

export const TariffsInitialValues =
{
    data: []
}