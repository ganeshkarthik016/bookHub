function UnreadNotifications() {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    Unread Notifications
                </h2>

                <p className="text-sm text-gray-500">
                    Recent activity you haven't seen yet
                </p>
            </div>

            <div className="space-y-3">
                {/* Real notifications will go here */}
            </div>
        </section>
    );
}

export default UnreadNotifications;