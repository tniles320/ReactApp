import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
	return {
		keyArgs: false, // tells apollo we will take care of everything
		read(existing= [], { args, cache }) {
			const { skip, take } = args;

			// read number of items on the page from the cache
			const data = cache.readQuery({ query: PAGINATION_QUERY});
			const count = data?.productsCount;
			const page = skip / take + 1;
			const pages = Math.ceil(count / take);

			// Check if we have existing items
			const items = existing.slice(skip, skip + take).filter((x) => x);

			// If there are items and there are not enough items to satisfy amount requested
			// AND we are on the last page, just send it
			if(items.length && items.length !== take && page === pages) {
				return items;
			}
			if(items.length !== take) {
				// We don't have any items, we must go to the network to fetch them
				return false;
			}

			// If there are items, return them from the cache
			if(items.length) {
				// console.log(`There are ${items.length} items in the cache, gonna send them to apollo`);
				return items;
			}

			return false; // Fallback to network
		},
		merge(existing, incoming, { args }) {
			const { skip, take } = args;
			// This runs when the apollo client comes back from the network with our products
			// console.log(`Merging items from the network ${incoming.length}`);
			const merged = existing ? existing.slice(0) : [];
			for(let i = skip; i < skip + incoming.length; ++i) {
				merged[i] = incoming[i - skip];
			}
			// console.log(merged);
			// Finally return merged items from cache
			return merged;
		},
	}
}