import { useState, useEffect } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getSearchHistory,
  addToSearchHistory,
  removeFromSearchHistory,
  clearSearchHistory,
} from "@/utils/searchHistory";
import { X, Trash2, Search } from "lucide-react";
import { RiHistoryFill, RiMapPinFill, RiStarFill } from "@remixicon/react";

const SearchCity = ({
  open,
  onOpenChange,
  searchQuery,
  setSearchQuery,
  onSelectCity,
  favorites = [],
}) => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    if (open) {
      loadSearchHistory();
    }
  }, [open]);

  const loadSearchHistory = () => {
    const history = getSearchHistory();
    setSearchHistory(history);
  };

  const handleSelectCity = (city) => {
    if (city && city.trim()) {
      addToSearchHistory(city);
      onSelectCity(city);
      onOpenChange(false);
      setSearchQuery("");
    }
  };

  const handleRemoveHistoryItem = (city, e) => {
    e.stopPropagation();
    removeFromSearchHistory(city);
    loadSearchHistory();
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  return (
    <Command>
      <CommandInput
        placeholder="Search for a city..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No cities found.</CommandEmpty>

        {/* Favorite Cities */}
        {favorites.length > 0 && (
          <>
            <CommandGroup heading="Favorite Cities">
              {favorites.map((fav) => (
                <CommandItem
                  key={fav._id}
                  value={fav.name}
                  onSelect={() => handleSelectCity(fav.name)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center">
                    <RiStarFill className="mr-2 h-4 w-4 text-yellow-400" />
                    <span>{fav.name},</span>
                    {fav.country && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        {fav.country}
                      </span>
                    )}
                  </div>
                  <RiMapPinFill className="w-3 h-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <CommandGroup
            heading={
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Recent Searches
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearHistory}
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              </div>
            }
          >
            {searchHistory.map((city, index) => (
              <CommandItem
                key={`${city}-${index}`}
                value={city}
                onSelect={() => handleSelectCity(city)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center">
                  <RiHistoryFill className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{city}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleRemoveHistoryItem(city, e)}
                  className="h-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </Button>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Direct Search Option */}
        {searchQuery && searchQuery.trim() !== "" && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value={searchQuery}
                onSelect={() => handleSelectCity(searchQuery)}
                className="flex items-center cursor-pointer"
              >
                <Search className="w-4 h-4 mr-2" />
                <span>Search for "{searchQuery}"</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
};

export default SearchCity;
