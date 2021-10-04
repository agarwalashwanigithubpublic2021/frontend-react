import { TariffsContent, TariffsInitialValues } from "../models/Tariffs";
import { getTariffsByAnnualConsumption } from "../services/TariffService";

const tariffs: TariffsContent = TariffsInitialValues;

const TariffStore = {
    data:
    {
        tariffsByAnnualConsumption: tariffs,
        error: ""
    },

    getTariffsByAnnualConsumption: async function (consumption: number) {
        try {
            const response = await getTariffsByAnnualConsumption(consumption);
            const tariffsByAnnualConsumption = response;
            this.data.tariffsByAnnualConsumption = tariffsByAnnualConsumption;
            this.data.error = "";
        }
        catch (error: any) {
            if (error.response && error.response.status === 400) {
                this.data.error = error.response.data;
            }
            else {
                this.data.error = "Tariff comparer API error";
            }
        }
    }
}

export default TariffStore