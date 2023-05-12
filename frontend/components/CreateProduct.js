import { useState } from "react"
import useForm from "../lib/useForm";
import Form from "./styles/Form";
import Router from "next/router";
import { gql, useMutation } from "@apollo/client";
import DisplayError from "./ErrorMessage";
import { ALL_PRODUCTS_QUERY } from "./Products";

const CREATE_PRODUCT_MUTATION = gql`
	mutation CREATE_PRODUCT_MUTATION(
		# Which variables are getting passed is and what types are they
		$name: String!
		$description: String!
		$price: Int!
		$image: Upload
	) {
		createProduct(
			data: {
				name: $name
				description: $description
				price: $price
				status: "AVAILABLE"
				photo: {
					create: {
						image: $image,
						altText: $name
					}
				}
			}
		) {
			id
			price
			description
			name
		}
	}
`;

export default function CreateProduct() {
	const { inputs, handleChange, clearForm, resetForm } = useForm({
		image: "",
		name: "Nice Shoes",
		price: 34123,
		description: "These are great shoes!",
	});
	const [createProduct, { loading, error, data }] = useMutation(
		CREATE_PRODUCT_MUTATION,
		{
			variables: inputs,
			refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
		}
	);
	return (
		<Form
			onSubmit={async (e) => {
				e.preventDefault();
				// submit inputFields to backend
				const res = await createProduct();
				clearForm();
				// Go to product's page
				Router.push({
					pathname: `/product/${res.data.createProduct.id}`,
				})
			}}
		>
			<DisplayError error={error}/>
			<fieldset disabled={loading} aria-busy={loading}>
				<label htmlFor="image">
					Image
					<input 
						type="file"
						id="image"
						name="image"
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="name">
					Name
					<input 
						type="text"
						id="name"
						name="name"
						placeholder="Name"
						value={inputs.name}
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="price">
					Price
					<input 
						type="number"
						id="price"
						name="price"
						placeholder="price"
						value={inputs.price}
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="description">
					Description
					<textarea
						id="description"
						name="description"
						placeholder="Description"
						value={inputs.description}
						onChange={handleChange}
					/>
				</label>

				<button type="submit">+ Add Product</button>
			</fieldset>
		</Form>
	)
}