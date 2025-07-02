<<<<<<< HEAD
import ImageComponent from "./image";
=======
>>>>>>> 4d9c586 (Initial commit from new device)
import { Search} from 'lucide-react';

const SearchBar = () => {
    return ( 
        <div className="bg-inputGray py-2 px-4 flex items-center gap-4 rounded-full">
            <Search size={16}/>
            <input 
                type='text' 
                placeholder="Search"
                className="bg-transparent text-white outline-none placeholder:text-textGray"
            />
        </div> );
}
 
export default SearchBar;