import React, { useContext, useEffect, useRef, useReducer } from 'react';

export enum SSEStatus {
    CONNECTING = 'CONNECTING',
    OPEN = 'OPEN',
    CLOSE = 'CLOSE'
}

export type Message = {
    id: string,
    message: string;
}

export type SSEMessage = {
    event: string;
    data: Message
}

export type Store = {
    message: SSEMessage,
    status: string;
    lastSubscribe: string,
    lastUnsubscribe: string,
}

export type Action = 
    | { type: 'UPDATE_STATUS', payload: string }
    | { type: 'UPDATE_MESSAGE', payload: SSEMessage}
    | { type: 'SUBSCRIBE' | 'UNSUBSCRIBE', payload: string}
    | { type: 'CLOSE'}

const initialState: Store = {
    message: null,
    status: SSEStatus.CONNECTING,
    lastSubscribe: '',
    lastUnsubscribe: '',
}

const reducer = (state: Store, action: Action): Store => {
    switch (action.type) {
        case 'UPDATE_STATUS':
            return {...state, status: action.payload}
        case 'UPDATE_MESSAGE':
            return {...state, message: action.payload}
        case 'CLOSE':
            return initialState;
        case 'SUBSCRIBE':
            return {...state, lastSubscribe: action.payload};
        case 'UNSUBSCRIBE':
            return {...state, lastUnsubscribe: action.payload};
        default:
            return state;
    }
}

export const makeSSEStore = (url: string) => {
    const StoreContext = React.createContext<Store>(initialState);
    const DispatchContext = React.createContext<React.Dispatch<Action>>(null);
    const StoreProvider = ({children}) => {
        const sse = useRef(null);
        const listeners = useRef([]);
        const [state, dispatch] = useReducer(reducer, initialState);
        
        useEffect(() => {
            if(state.status === SSEStatus.CLOSE) {
                listeners.current.forEach((listener: any) => {
                    sse.current.removeEventListener(listener.name, listener.listener);
                });
                sse.current.close();
            }
        }, [state.status]);
        useEffect(() => {
            if(state.lastSubscribe) {
                const listener = (message: any) => {
                    if(message.type === state.lastSubscribe) {
                        const updateMsg = JSON.parse(message.data);
                        dispatch({
                            type: 'UPDATE_MESSAGE',
                            payload: {
                                event: message.type,
                                data: updateMsg
                            }
                        });
                   }
                };
                listeners.current.push({
                    name: state.lastSubscribe,
                    listener: listener,
                });
                sse.current.addEventListener(state.lastSubscribe, listener);
            }
        }, [state.lastSubscribe]);
        useEffect(() => {
            if(state.lastUnsubscribe) {
                const listenerIndex = listeners.current.findIndex((listener: any) => listener.name === state.lastUnsubscribe);
                if(listenerIndex !== -1) {
                    sse.current.removeEventListener(state.lastUnsubscribe, listeners.current[listenerIndex].listener);
                    listeners.current.splice(listenerIndex, 1);
                }
            }
        }, [state.lastUnsubscribe]);
        useEffect(() => {
            sse.current = new EventSource(url);
            sse.current.onopen = () => {
                dispatch({
                    type: 'UPDATE_STATUS',
                    payload: SSEStatus.OPEN
                });
            }
            sse.current.onerror = () => {
                console.log("Status ", sse.current.readyState);
                dispatch({
                    type: 'UPDATE_STATUS',
                    payload: sse.current.readyState === 0 ? SSEStatus.CONNECTING : SSEStatus.CLOSE
                });
            }
            sse.current.onmessage = (event: MessageEvent) => {
                const eventMsg = JSON.parse(event.data);
                dispatch({
                    type: 'UPDATE_MESSAGE',
                    payload: eventMsg
                });
            }
            return () => {
                if(sse.current.readyState !== 2) {
                    dispatch({
                        type: 'UPDATE_STATUS',
                        payload: SSEStatus.CLOSE
                       
                    });
                }
            }
        }, [url]);
        return (
            <DispatchContext.Provider value={dispatch}>
                 <StoreContext.Provider value={state}>
                    {children}
                </StoreContext.Provider>
            </DispatchContext.Provider>
        );
    }
    
    function useStore() {
        return useContext(StoreContext);
    }
    
    function useDispatch() {
        return useContext(DispatchContext);
    }

    return [StoreProvider, useStore, useDispatch] as const;
}