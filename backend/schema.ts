import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship, password, timestamp, select, integer } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import "dotenv/config";

// the document field is a more complicated field, so it has it's own package
import { document } from "@keystone-6/fields-document";
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from ".keystone/types";

export const cloudinary = {
	cloudName: process.env.CLOUDINARY_CLOUD_NAME || "fake",
	apiKey: process.env.CLOUDINARY_KEY || "fake",
	apiSecret: process.env.CLOUDINARY_SECRET || "fake",
	folder: "greatfinds",
};

export const lists: Lists = {
	User: list({
		access: allowAll,
		fields: {
			name: text({ validation: { isRequired: true } }),
			email: text({
				validation: { isRequired: true },
				// by adding isIndexed: 'unique', we're saying that no user can have the same
				// email as another user
				isIndexed: "unique",
			}),
			password: password({ validation: { isRequired: true } }),

			// we can use this field to see what Posts this User has authored
			//   more on that in the Post list below
			// posts: relationship({ ref: "Post.author", many: true }),

			createdAt: timestamp({
				defaultValue: { kind: "now" },
			}),
		},
	}),

	Product: list({
		access: allowAll,
		fields: {
			name: text({ validation: { isRequired: true } }),
			description: text({
				ui: {
					displayMode: "textarea",
				},
			}),
			photo: relationship({
				ref: "ProductImage.product",
				ui: {
					displayMode: "cards",
					cardFields: ["image", "altText"],
					inlineCreate: { fields: ["image", "altText"] },
					inlineEdit: { fields: ["image", "altText"] },
				},
			}),
			status: select({
				options: [
					{ label: "Draft", value: "DRAFT" },
					{ label: "available", value: "AVAILABLE" },
					{ label: "unavailable", value: "UNAVAILABLE" },
				],
				defaultValue: "DRAFT",
				ui: {
					displayMode: "segmented-control",
					createView: { fieldMode: "hidden" }, // Hides element when creating new product
				},
			}),
			price: integer(),
		},
	}),

	ProductImage: list({
		access: allowAll,
		fields: {
			image: cloudinaryImage({
				cloudinary,
				label: "Source",
			}),
			altText: text(),
			product: relationship({ ref: "Product.photo" }),
		},
		ui: {
			listView: {
				initialColumns: ["image", "altText", "product"],
			},
		},
	}),

	// Post: list({
	// 	// WARNING
	// 	//   for this starter project, anyone can create, query, update and delete anything
	// 	//   if you want to prevent random people on the internet from accessing your data,
	// 	//   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
	// 	access: allowAll,

	// 	// this is the fields for our Post list
	// 	fields: {
	// 		title: text({ validation: { isRequired: true } }),

	// 		// the document field can be used for making rich editable content
	// 		//   you can find out more at https://keystonejs.com/docs/guides/document-fields
	// 		content: document({
	// 			formatting: true,
	// 			layouts: [
	// 				[1, 1],
	// 				[1, 1, 1],
	// 				[2, 1],
	// 				[1, 2],
	// 				[1, 2, 1],
	// 			],
	// 			links: true,
	// 			dividers: true,
	// 		}),

	// 		// with this field, you can set a User as the author for a Post
	// 		author: relationship({
	// 			// we could have used 'User', but then the relationship would only be 1-way
	// 			ref: "User.posts",

	// 			// this is some customisations for changing how this will look in the AdminUI
	// 			ui: {
	// 				displayMode: "cards",
	// 				cardFields: ["name", "email"],
	// 				inlineEdit: { fields: ["name", "email"] },
	// 				linkToItem: true,
	// 				inlineConnect: true,
	// 			},

	// 			// a Post can only have one author
	// 			//   this is the default, but we show it here for verbosity
	// 			many: false,
	// 		}),

	// 		// with this field, you can add some Tags to Posts
	// 		tags: relationship({
	// 			// we could have used 'Tag', but then the relationship would only be 1-way
	// 			ref: "Tag.posts",

	// 			// a Post can have many Tags, not just one
	// 			many: true,

	// 			// this is some customisations for changing how this will look in the AdminUI
	// 			ui: {
	// 				displayMode: "cards",
	// 				cardFields: ["name"],
	// 				inlineEdit: { fields: ["name"] },
	// 				linkToItem: true,
	// 				inlineConnect: true,
	// 				inlineCreate: { fields: ["name"] },
	// 			},
	// 		}),
	// 	},
	// }),

	// // this last list is our Tag list, it only has a name field for now
	// Tag: list({
	// 	// WARNING
	// 	//   for this starter project, anyone can create, query, update and delete anything
	// 	//   if you want to prevent random people on the internet from accessing your data,
	// 	//   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
	// 	access: allowAll,

	// 	// setting this to isHidden for the user interface prevents this list being visible in the Admin UI
	// 	ui: {
	// 		isHidden: true,
	// 	},

	// 	// this is the fields for our Tag list
	// 	fields: {
	// 		name: text(),
	// 		// this can be helpful to find out all the Posts associated with a Tag
	// 		posts: relationship({ ref: "Post.tags", many: true }),
	// 	},
	// }),
};
