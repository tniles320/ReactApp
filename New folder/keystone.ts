import "dotenv/config";
import { config, createSchema } from "@keystone-next/keystone/schema";

const databaseURL = process.env.DATABASE_URL || "mongodb://localhost/keystone-great-finds";

const sessionConfig = {
	maxAge: 60 * 60 * 24 * 365, // How long will a user stay signed in
	secret: process.env.COOKIE_SECRET,
};

export default config({
	server: {
		cors: {
			origin: [process.env.FRONTEND_URL],
			credentials: true,
		},
	},
	db: {
		adapter: "mongoose",
		url: databaseURL,
		// TODO add data seeding here
	},
	lists: createSchema({
		// Schema items will go here
	}),
	ui: {
		// TODO change this for roles
		isAccessAllowed: () => true,
	},
	// TODO Add session values
});
