export const AppGallerySearch = () => {
  //const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <div class="relative">
      <svg
        class="absolute left-2 top-5 w-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
      <input
        type="search"
        placeholder="Search Example App"
        class="round mt-3 w-full border border-gray-500 px-7 py-3 pl-10 focus:border-accent1-hover"
      />
    </div>
  );
};
