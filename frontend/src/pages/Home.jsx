import { useSelector } from 'react-redux';

function Home() {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold">
                    Welcome back, {user?.userFullName || user?.userName}
                </h1>

                <p className="mt-2 text-gray-500">
                    Your study workspace.
                </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border p-6">
                    <h2 className="text-xl font-semibold">
                        Upload Notes
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Upload and organize your study material.
                    </p>

                    <button
                        type="button"
                        className="mt-6 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                    >
                        + Upload Notes
                    </button>
                </div>

                <div className="rounded-xl border p-6">
                    <h2 className="text-xl font-semibold">
                        Unread Notifications
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Check activity you haven't seen yet.
                    </p>

                    <button
                        type="button"
                        className="mt-6 rounded-lg border px-4 py-2 hover:bg-gray-100"
                    >
                        View Notifications
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Home;