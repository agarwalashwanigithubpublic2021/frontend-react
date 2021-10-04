import { Route, Switch } from 'react-router-dom'
import TariffsPage from './pages/TariffsPage';


const Router = () =>
(
    <Switch>
        <Route path="" component={TariffsPage} />
    </Switch>
)

export default Router;
