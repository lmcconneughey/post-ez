import Link from "next/link";
import PopularTags from "./popular-tags";
import Recommendations from "./recommendations";

import SearchBar from "./search-bar";

const RightBar = () => {
    return ( 
        <div className="pt-4 flex flex-col gap-4 sticky top-0 h-max">
            <SearchBar />
            <PopularTags />
            <Recommendations />
            <div className="text-textGray text-sm flex gap-x-4 flex-wrap">
                <Link href='/'>Terms of Service</Link>
                <Link href='/'>Privacy Policy</Link>
                <Link href='/'>Cookie Policy</Link>
                <Link href='/'>Accessibilty</Link>
                <Link href='/'>Ads Info</Link>
                <span className="">
                    2025 Post-EZ
                </span>
            </div>
        </div>
     );
}
 
export default RightBar;