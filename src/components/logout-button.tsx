import { signOut } from "next-auth/react";

function LogoutButton() {
    const handleLogout = async () => {
        await signOut();
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white border-none rounded cursor-pointer"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
