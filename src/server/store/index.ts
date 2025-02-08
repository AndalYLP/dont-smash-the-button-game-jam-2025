import { combineProducers, InferState } from "@rbxts/reflex";
import { broadcasterMiddleware } from "server/store/middleware/broadcaster";
import { slices } from "shared/store";

export type RootStore = typeof store;
export type RootState = InferState<typeof store>;

export const store = combineProducers({ ...slices });

store.applyMiddleware(broadcasterMiddleware());
