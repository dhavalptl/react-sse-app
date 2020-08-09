import React, { useEffect, useState } from 'react';
import { useFirstStore } from './sse/useFirstSSEStore';

const Child: React.FC = () => {
    const {message, status} = useFirstStore();
    const [message1, setMessage1] = useState(null);
    useEffect(() => {
        if(message?.event === 'listener2') {
            console.log("Message ", message);
            setMessage1(message);
        }
    }, [message]);
    return (
        <div style={{padding: '10px'}}>
            <div>SSE Message : {message1?.data.message}</div>
            <div>Connection Status : {status}</div>
        </div>
    );
};
export default Child;
