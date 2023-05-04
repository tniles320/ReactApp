import { config } from "@keystone-6/core";
import { lists } from "./schema";
import { withAuth, session } from "./auth";
import { insertSeedData } from "./seed-data";
import "dotenv/config";

const databasuURL = process.env.DATABASE_URL || "postgres://localhost:5432/greatFindsDB";

export default withAuth(
	config({
		server: {
			cors: {
				origin: [process.env.FRONTEND_URL as string],
				credentials: true,
			},
		},
		db: {
			provider: "postgresql",
			url: databasuURL,
			onConnect: async (context) => {
				console.log("Connected to db");
				if (process.argv.includes("--seed-data")) {
					await insertSeedData(context);
				}
			},
		},
		lists,
		session,
		ui: {
			// Show the UI only for specified users
			isAccessAllowed: ({ session }) => {
				return !!session?.data;
			},
		},
	})
);
