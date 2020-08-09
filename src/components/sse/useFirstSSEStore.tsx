import { makeSSEStore } from "./makeSSEStore";

const [FirstSSEProvider, useFirstStore, useFirstDispatch] = makeSSEStore('http://localhost:3000/sse');

export {FirstSSEProvider, useFirstStore, useFirstDispatch}