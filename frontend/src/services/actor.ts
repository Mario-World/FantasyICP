import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../utils/query.idl.js";

const canisterId =
  process.env.VITE_CANISTER_ID_BACKENDMAIN || "mosid-rqaaa-aaaah-arfzq-cai";

export const createActor = (identity?: any) => {
  const agent = new HttpAgent({
    host: "https://ic0.app",
    identity,
  });

  // Fetch root key for certificate validation during development
  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  // Creates an actor with the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}; 