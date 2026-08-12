import Navbar from "../components/layout/Navbar";

function Home() {
    return (
        <div>
            <Navbar />

            <main className="p-6">
                <h1 className="text-3xl font-bold">
                    Welcome to BookHub
                </h1>
            </main>
        </div>
    );
}

export default Home;