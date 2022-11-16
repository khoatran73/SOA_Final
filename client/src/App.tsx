import _ from 'lodash';
import React from 'react';
import { Provider} from 'react-redux';
import { AppProvider } from '~/providers/AppProvider';
import { AppRoute } from '~/routes';
import './App.scss';
import store from './AppStore';
import SocketProvider from './contexts/Socket/Context';


const App: React.FC = (): JSX.Element => {
    
    return (
        <React.Fragment>
            <SocketProvider>
                <Provider store={store}>
                    <AppProvider>
                        <AppRoute />
                    </AppProvider>
                </Provider>
            </SocketProvider>
        </React.Fragment>
    );
};

export default App;
