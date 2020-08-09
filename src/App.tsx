import React from 'react';
import './App.css';
import { FirstSSEProvider } from './components/sse/useFirstSSEStore';
import Child from './components/child';
import Child2 from './components/child2';
const App: React.FC = () => {
    return (
        <FirstSSEProvider>
            <div className='container'>
                <h2>Welcome to React Application</h2>
                <Child />
                <Child2 />
            </div>
        </FirstSSEProvider>
    );
};
export default App;
