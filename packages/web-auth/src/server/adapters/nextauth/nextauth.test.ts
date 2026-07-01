import { runAuthGatewayConformance } from "../../../conformance";
import { createNextAuthGateway } from "./gateway";
import type { RawNextAuthSession } from "./mapSession";

const RAW: RawNextAuthSession = {
  user: { id: "u_1", email: "a@b.com", name: "A", image: "https://x/y.png" },
  expires: "2099-01-01T00:00:00.000Z",
};

runAuthGatewayConformance({
  name: "nextauth",
  gatewayFor: (state) =>
    createNextAuthGateway(async () => (state === "authenticated" ? RAW : null)),
  expectedSession: {
    user: { id: "u_1", email: "a@b.com", name: "A", imageUrl: "https://x/y.png" },
    expiresAt: "2099-01-01T00:00:00.000Z",
  },
});
