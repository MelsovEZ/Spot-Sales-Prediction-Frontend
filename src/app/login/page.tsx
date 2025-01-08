'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const result = await signIn('credentials', {
            redirect: false,
            username: formData.get('username'),
            password: formData.get('password'),
        });

        if (result?.error) {
            console.error(result.error);
        } else {
            window.location.href = '/';
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="username" type="text" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
}
