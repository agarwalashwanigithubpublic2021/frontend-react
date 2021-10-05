import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Tariffs } from "../models/Tariffs";
import TerrifStore from "../stores/TariffStore";


export interface ITariffsPageProps extends RouteComponentProps {
}

const TariffsPage: React.FC<ITariffsPageProps> = (props: ITariffsPageProps) => {

    const [terrifsData, setTerrifsData] = useState<Tariffs[]>([]);
    const [consumptionValue, setConsumptionValue] = useState<number>();
    const [allTerrifsAPIError, setAllTerrifsAPIError] = useState("");
    const [spinner, setSpinner] = useState(false);

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

    async function fetchAllTerrifs(consumption: number) {
        setSpinner(true);
        await TerrifStore.getTariffsByAnnualConsumption(consumption);
        const { tariffsByAnnualConsumption: terrifs, error } = TerrifStore.data;

        if (error.length > 0) {
            setAllTerrifsAPIError(error);
            setTerrifsData([]);
        }
        else {

            setTerrifsData(terrifs.data);
            setAllTerrifsAPIError("");
        }
        setSpinner(false);
    }

    const handleValidationForConsumption = (e) => {

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
        <>

            <div id="ag-grid" style={{ height: '100%', width: '100%' }} className="ag-theme-alpine parent-container">

                <div className="container">

                    <div className="row parent-container">
                        <div className="col" style={{ marginBottom: '20px', marginTop: '20px' }}>

                            <input value={consumptionValue} className="input-consumptionKwh" type="number" onChange={handleValidationForConsumption} placeholder="Consumption (kWh/year)" />
                            <div style={allTerrifsAPIError === "" ? { visibility: 'hidden' } : { visibility: 'visible', color: 'red' }}>{allTerrifsAPIError}</div>
                        </div>
                        <div className="col" style={{ marginBottom: '20px' }}>
                            <button className="btn btn-success" onClick={fetchTariffComparer}>Load Tariff</button>
                        </div>
                        <div className="col" style={{ marginBottom: '10px' }}>
                            {spinner === true ? <img src="/assets/images/loader.gif" width={150} height={100} alt="loader" /> : null}
                        </div>
                    </div>


                </div>

                <div className="ag-theme-balham" style={{ height: '200px', width: '420px' }}>
                    <AgGridReact
                        gridOptions={gridOptions}
                        columnDefs={columnDefs1}
                        rowData={terrifsData}
                    >
                    </AgGridReact>
                </div>
            </div>
        </>
    );
}

export default withRouter(TariffsPage);
