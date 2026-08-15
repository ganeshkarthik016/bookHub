import { useSelector } from 'react-redux';

function Home() {
    const user = useSelector((state) => state.auth.user);
    const notifications = useSelector(
        (state) => state.notifications.notifications
    );

    return (
        <div className="max-w-3xl space-y-8">
            <section>
                <h1 className="text-3xl font-bold">
                    Welcome back, {user?.userFullName || user?.userName}
                </h1>

                <p className="mt-2 text-gray-500">
                    Your study workspace.
                </p>
            </section>

            <section>
                <button
                    type="button"
                    className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                >
                    + Upload Notes
                </button>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-4">
                    Recent Activity
                </h2>

                {notifications.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <p>No activity yet</p>
                    </div>
                ) : (
                    <div className="space-y-2 border rounded-lg overflow-hidden">
                        {notifications.slice(0, 5).map((notification) => (
                            <div
                                key={notification._id}
                                className={`border-b last:border-b-0 p-4 ${
                                    notification.isRead
                                        ? 'bg-white'
                                        : 'bg-blue-50'
                                }`}
                            >
                                <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    {notification.message}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    {
                                        new Date(
                                            notification.createdAt
                                        ).toLocaleDateString()
                                    }
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;
