import { TariffsContent } from "../models/Tariffs";
import { BASE_URL, compareTariff } from "../Utils/api-config";
import http from "../Utils/http-service";

export async function getTariffsByAnnualConsumption(consumption:number):Promise<TariffsContent> 
{
    return await http.get(`${BASE_URL}/${compareTariff}/${consumption}`);    
}