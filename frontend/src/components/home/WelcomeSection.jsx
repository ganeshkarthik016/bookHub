function WelcomeSection({ user }) {
    return (
        <section>
            <h1 className="text-3xl font-bold">
                Welcome back, {user?.userFullName || user?.userName}
            </h1>

            <p className="mt-2 text-gray-500">
                Find your notes, playlists and study material.
            </p>
        </section>
    );
}

export default WelcomeSection;