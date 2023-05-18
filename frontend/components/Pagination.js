import Head from "next/head";
import PaginationStyles from "./styles/PaginationStyles";
import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import DisplayError from "./ErrorMessage";
import { perPage } from "../config";

export const PAGINATION_QUERY = gql`
	query PAGINATION_QUERY {
		productsCount
	}
`;

export default function Pagination ({ page }) {
	const { error, loading, data } = useQuery(PAGINATION_QUERY);

	if(loading) return "Loading...";
	if(error) return <DisplayError error={error}/>;
	const count = data.productsCount;
	const pageCount = Math.ceil(count / perPage);
	const titleText = `Great Finds - Page ${page} of ${pageCount}`;

	return (
		<PaginationStyles>
			<Head>
				<title>{titleText}</title>
			</Head>
			<Link href={`/products/${page - 1}`} aria-disabled={page <= 1}>← Prev</Link>
			<p>Page {page} of {pageCount}</p>
			<p>{count} Items Total</p>
			<Link href={`/products/${page + 1}`} aria-disabled={page >= pageCount}>Next →</Link>
		</PaginationStyles>
	);
}