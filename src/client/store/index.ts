import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/store";
import { receiverMiddleware } from "./middleware/receiver";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export const store = combineProducers({ ...slices });

store.applyMiddleware(receiverMiddleware());
