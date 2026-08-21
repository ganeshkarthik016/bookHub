import Logo from "./Logo.jsx";
import SearchBar from "./SearchBar.jsx";
import ProfileDropdown from "./ProfileDropdown.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
            <Logo />
            <SearchBar />
            <ProfileDropdown />
            <NotificationDropdown />
        </header>
    );
}