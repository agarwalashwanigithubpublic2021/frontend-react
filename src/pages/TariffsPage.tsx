import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Tariffs } from "../models/Tariffs";
import TerrifStore from "../stores/TariffStore";



export interface ITariffsPageProps extends RouteComponentProps {
}

const TariffsPage: React.FC<ITariffsPageProps> = (props: ITariffsPageProps) => {

    const [terrifsData, setTerrifsData] = useState<Tariffs[]>([]);
    const [consumptionValue, setConsumptionValue] = useState<number>();
    const [allTerrifsAPIError, setAllTerrifsAPIError] = useState("");

    const columnDefs1 = [
        { headerName: 'Tariff Name', field: 'tariffName', filter: "agTextColumnFilter", sortable: true },
        { headerName: 'Annual costs (€/year)', field: 'annualCosts', filter: 'agNumberColumnFilter', sortable: true }
    ];

    const gridOptions = {
        defaultColDef: { filter: true },
        columnDefs: columnDefs1,
        suppressMenuHide: true,
        suppressMovableColumns: true,
        enableSorting: true,
        rowSelection: 'single',
        rowDeselection: true,
        pagination: false,
        paginationPageSize: 10,
        rowClass: 'grid-row',
        gridAutoHeight: true,
        headerHeight: 50,
        rowHeight: 50,
        overlayNoRowsTemplate: allTerrifsAPIError.length > 0 ? '<span>No Data</span>' : ''
    };


    //const test = [{ "tarrifName": "Packaged tariff", "annualCosts": 800 }, { "tarrifName": "basic electricity tariff", "annualCosts": 12060 }];

    // const rowData = [
    //     { make: 'Toyota', model: 'Celica', price: 35000 },
    //     { make: 'Ford', model: 'Mondeo', price: 32000 },
    //     { make: 'Porsche', model: 'Boxter', price: 72000 }
    // ];   

    async function fetchAllTerrifs(consumption: number) {
        await TerrifStore.getTariffsByAnnualConsumption(consumption);
        const { tariffsByAnnualConsumption: terrifs, error } = TerrifStore.data;

        //console.log("ERROR-",error);

        if (error.length > 0) {
            //console.log("ERROR-", error);
            setAllTerrifsAPIError(error);
            setTerrifsData([]);
        }
        else {
            // console.log("terrifs--", terrifs);
            // console.log("terrifs--", terrifs.data);
            setTerrifsData(terrifs.data);
            setAllTerrifsAPIError("");
        }
    }

    const handleValidationForConsumption = (e) => {
        //console.log("text-", e.target.value);
        setConsumptionValue(Number(e.target.value));
    }

    async function fetchTariffComparer() {
        console.log("consumptionValue--", consumptionValue);

        if (consumptionValue === undefined) {
            setConsumptionValue(0);
        }

        fetchAllTerrifs(consumptionValue === undefined ? 0 : consumptionValue);
    }

    return (
        <div id="ag-grid" style={{ height: "100%", width: "100%" }} className="ag-theme-alpine-dark">

            <div className="container">
                <div className="row">
                    <div className="col">
                        <input value={consumptionValue} type="number" onChange={handleValidationForConsumption} placeholder="Consumption (kWh/year)" />
                        <div style={allTerrifsAPIError === "" ? { visibility: 'hidden' } : { visibility: 'visible', color: 'red' }}>{allTerrifsAPIError}</div>
                    </div>
                    <div className="col">
                        <button onClick={fetchTariffComparer}>Compare</button>
                    </div>
                </div>

            </div>

            <div className="ag-theme-balham" style={{ height: '500px', width: '1000px' }}>
                <AgGridReact
                    gridOptions={gridOptions}
                    columnDefs={columnDefs1}
                    rowData={terrifsData}
                >
                </AgGridReact>
            </div>
        </div>
    );
}

export default withRouter(TariffsPage);
