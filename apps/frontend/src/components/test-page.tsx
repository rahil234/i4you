// import Link from 'next/link';
// import { Suspense } from 'react';
// import LoadingIndicator from './loading-indicator';
//
// function MenuBar() {
//   return (
//     <div>
//       <Link href="?category=electronics">
//         Electronics <LoadingIndicator />
//       </Link>
//       <Link href="?category=clothing">
//         Clothing <LoadingIndicator />
//       </Link>
//       <Link href="?category=books">
//         Books <LoadingIndicator />
//       </Link>
//     </div>
//   );
// }
//
// async function ProductList({ category }: { category: string }) {
//   const products = await fetchProducts(category);
//
//   return (
//     <ul>
//       {products.map((product) => (
//         <li key={product}>{product}</li>
//       ))}
//     </ul>
//   );
// }
//
// export default async function ProductCategories({
//                                                   searchParams,
//                                                 }: {
//   searchParams: Promise<{
//     category: string
//   }>
// }) {
//   const { category } = await searchParams;
//
//   return (
//     <Suspense fallback={<PageSkeleton />}>
//       <MenuBar />
//       <ProductList category={category} />
//     </Suspense>
//   );
// }
