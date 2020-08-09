import React, { useEffect } from 'react';
import { useFirstDispatch } from './sse/useFirstSSEStore';
import { SSEStatus } from './sse/makeSSEStore';

const Child2: React.FC = () => {
    const dispatch = useFirstDispatch();
    console.log("Render Child2");
    useEffect(() => {
        return() => {
            dispatch({
                type: 'UPDATE_STATUS',
                payload: SSEStatus.CLOSE
               
            });
        }
    }, []);
    return (
        <div style={{padding: '10px'}}>
            <div>
                <button style={{margin: '5px'}} onClick={() => {
                    dispatch({
                        type: 'UPDATE_STATUS',
                payload: SSEStatus.CLOSE
                    });
                }}>Close SSE</button>
                <button style={{margin: '5px'}} onClick={() => {
                    dispatch({
                        type: 'SUBSCRIBE',
                        payload: 'listener1'
                    });
                }}>Listener 1</button>
                 <button style={{margin: '5px'}} onClick={() => {
                    dispatch({
                        type: 'SUBSCRIBE',
                        payload: 'listener2'
                    });
                }}>Listener 2</button>
                <button style={{margin: '5px'}} onClick={() => {
                    dispatch({
                        type: 'UNSUBSCRIBE',
                        payload: 'listener1'
                    });
                }}>Listener 1 UN</button>
                 <button style={{margin: '5px'}} onClick={() => {
                    dispatch({
                        type: 'UNSUBSCRIBE',
                        payload: 'listener2'
                    });
                }}>Listener 2 UN</button>
            </div>
        </div>
    );
};
export default Child2;
