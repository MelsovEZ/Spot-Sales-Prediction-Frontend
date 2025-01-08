import { signOut } from "next-auth/react";

function LogoutButton() {
    const handleLogout = async () => {
        await signOut();
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white border-none rounded cursor-pointer
                     transition-all duration-300 ease-in-out
                     hover:bg-red-600 hover:scale-105
                     active:scale-95 active:bg-red-700"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
