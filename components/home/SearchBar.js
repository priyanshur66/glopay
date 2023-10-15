import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = () => {
  return (
    <div className=" border-gray-200 bg-black px-6 py-4">
      <div className=" flex items-center space-x-3 bg-black">
        <MagnifyingGlassIcon className=" h-5 w-5 bg-black text-[#B48CE6]" />
        <input
          className=" flex-1 bg-black text-gray-600 placeholder-[#B48CE6] outline-none"
          type="text"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default SearchBar;
