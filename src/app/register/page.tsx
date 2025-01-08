'use client';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password'),
                }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            // If registration is successful, automatically sign in
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
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="username" type="text" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
            <button type="submit">Register</button>
        </form>
    );
}