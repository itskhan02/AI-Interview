import Navbar from '../components/Navbar'

const Dashboard = () => {
  return (
    <div className="relative min-h-screen  text-white">
      <Navbar />
      <div className="relative min-h-screen py-20  text-center ">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>
          Welcome to your dashboard! Here you can manage your profile, view your
          interview history, and access personalized interview preparation
          resources.
        </p>
      </div>
    </div>
  );
}

export default Dashboard
