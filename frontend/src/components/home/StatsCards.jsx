function StatsCards() {
    const stats = [
        {
            title: "Notes",
            value: 12,
        },
        {
            title: "Playlists",
            value: 4,
        },
        {
            title: "Notifications",
            value: 3,
        },
    ];

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
                <div
                    key={stat.title}
                    className="rounded-xl border p-5"
                >
                    <p className="text-sm text-gray-500">
                        {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {stat.value}
                    </p>
                </div>
            ))}
        </section>
    );
}

export default StatsCards;