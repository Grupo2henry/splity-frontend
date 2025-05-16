import Link from "next/link";

const AdminDashboard = () => {
  return (
    <div className="divDashboard flex flex-col w-full min-h-screen items-center mx-auto pt-4 m-14">
      {/* Botón Usuarios */}
      <Link href={"AdminDashboard/UsersAdmin"} className="card">
      <button className="mx-auto">
        <h2 className="mx-auto my-auto text-gray-100 drop-shadow-md text-2xl font-semibold tracking-wide">Usuarios</h2>
      </button>
      </Link>
      {/* Botón Grupos */}
      <button
        className="card"
      >
        <h2 className="mx-auto my-auto text-white text-2xl font-semibold tracking-wide">Grupos</h2>
      </button>

      {/* Botón Gastos */}
      <button
        className="card"
      >
        <h2 className="mx-auto my-auto text-white text-2xl font-semibold tracking-wide">Gastos</h2>
      </button>
    </div>
  );
};

export default AdminDashboard;