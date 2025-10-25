import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Search, LogOut, Sun, Moon, X, SunMoon } from "lucide-react";
import { RiCloseFill, RiMenuFill } from "@remixicon/react";
import SearchCity from "./SearchCity";

const Header = ({
  user,
  logout,
  theme,
  themeMode,
  toggleTheme,
  setAutoTheme,
  favorites = [],
  onSelectCity,
  onRemoveFavorite,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <header className="px-6 py-4 border-b shadow-xs sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <RiMenuFill />
                </Button>
              </DrawerTrigger>

              <DrawerOverlay />

              <DrawerContent
                data-vaul-drawer-direction="left"
                className="w-3/4 max-w-sm p-6 gap-6 shadow-lg flex flex-col"
              >
                <DrawerTitle>ClimeCast</DrawerTitle>
                <DrawerDescription className="sr-only">
                  Navigation menu with user settings and favorites
                </DrawerDescription>

                <div className="relative flex flex-col">
                  {/* Drawer Close */}
                  <div className="fixed top-6 right-6">
                    <DrawerClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <RiCloseFill size={20} />
                      </Button>
                    </DrawerClose>
                  </div>

                  {/* User Info */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="font-medium text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Theme Controls */}
                  <div className="mb-8">
                    <h3 className="font-medium mb-3">Theme</h3>
                    <div className="space-y-2">
                      <Button
                        variant={theme === "light" ? "default" : "ghost"}
                        size="sm"
                        onClick={toggleTheme}
                        className={`w-full justify-start ${
                          theme === "light"
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : ""
                        }`}
                      >
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "ghost"}
                        size="sm"
                        onClick={toggleTheme}
                        className={`w-full justify-start ${
                          theme === "dark"
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : ""
                        }`}
                      >
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </Button>
                      <Button
                        variant={themeMode === "auto" ? "default" : "ghost"}
                        size="sm"
                        onClick={setAutoTheme}
                        className="w-full justify-start"
                      >
                        <SunMoon className="w-4 h-4 mr-2" />
                        Auto
                      </Button>
                    </div>
                  </div>

                  {/* Favorites */}
                  <div className="mb-8">
                    <h3 className="font-medium mb-3">Favorite Cities</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {favorites?.length > 0 ? (
                        favorites.map((fav) => (
                          <div
                            key={fav._id}
                            className="flex items-center justify-between px-2 py-1 rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
                            onClick={() => onSelectCity(fav.name)}
                          >
                            <span className="text-sm">{fav.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFavorite(fav._id);
                              }}
                              className="text-destructive p-1 h-6 w-6"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No favorite cities yet
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start text-destructive/70 hover:text-destructive/50 hover:bg-destructive/10 duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
            <h1 className="sm:text-2xl font-bold">ClimeCast</h1>
          </div>

          {/* Search Button */}
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={searchOpen}
                className="w-1/2 sm:w-xs justify-between"
              >
                <div className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  <span className="truncate">
                    {searchQuery || "Search city..."}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              <SearchCity
                open={searchOpen}
                onOpenChange={setSearchOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectCity={onSelectCity}
                favorites={favorites}
              />
            </PopoverContent>
          </Popover>
        </div>
      </header>
    </>
  );
};

export default Header;
